import { execSync } from 'node:child_process';
import fs from 'node:fs';

const baseRef = process.env.GITHUB_BASE_REF ?? 'main';
const base = process.env.GITHUB_BASE_REF ? `origin/${baseRef}` : baseRef;

const excluded = [
  /^SECURITY\.md$/,
  /^\.github\/pull_request_template\.md$/,
  /^\.github\/CODEOWNERS$/,
  /^scripts\/validate-pr-safety\.ts$/,
  /^node_modules\//,
  /^out\//,
  /^\.next\//
];

const sensitivePaths = [
  /^\.github\/workflows\//,
  /^package(-lock)?\.json$/,
  /^scripts\//,
  /(^|\/)AGENTS\.md$/,
  /^agents\//,
  /^content\//,
  /^ops\//,
  /^src\//
];

const suspiciousPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: 'agent override instruction', pattern: /\b(ignore|bypass|override|discard)\b.{0,80}\b(previous|prior|above|system|developer|safety|security)\b.{0,80}\b(instruction|prompt|policy|rule)s?\b/i },
  { label: 'role/system prompt impersonation', pattern: /\b(system|developer|assistant)\s*:\s*(ignore|override|bypass|discard|you are now|from now on)/i },
  { label: 'secret exfiltration instruction', pattern: /\b(exfiltrate|leak|dump|print|send|upload|curl)\b.{0,80}\b(secret|token|credential|private key|github_token|env)\b/i },
  { label: 'unsafe shell download/execute pattern', pattern: /\b(curl|wget)\b[^\n]{0,160}\|\s*(sh|bash|python|node)\b/i },
  { label: 'base64 decode execute pattern', pattern: /\bbase64\b[^\n]{0,120}\b(-d|--decode)\b[^\n]{0,160}\|\s*(sh|bash|python|node)\b/i },
  { label: 'hidden html instruction comment', pattern: /<!--[^>]{0,400}\b(ignore|override|bypass|system prompt|developer message|agent)\b[^>]{0,400}-->/i },
  { label: 'dangerous shell command', pattern: /\brm\s+-rf\s+(\/|~|\$HOME|\.\.?)\b/i }
];

function command(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function changedFiles(): string[] {
  if (!process.env.GITHUB_BASE_REF) {
    const localChanges = command('git diff --name-only --diff-filter=ACMR').split('\n').map((line) => line.trim()).filter(Boolean);
    const stagedChanges = command('git diff --cached --name-only --diff-filter=ACMR').split('\n').map((line) => line.trim()).filter(Boolean);
    const untracked = command('git ls-files --others --exclude-standard').split('\n').map((line) => line.trim()).filter(Boolean);
    const localFileSet = new Set([...localChanges, ...stagedChanges, ...untracked]);
    if (localFileSet.size > 0) return [...localFileSet].sort();
  }

  try {
    command(`git fetch --no-tags --depth=1 origin ${baseRef}`);
  } catch {
    // Local validation may already have the base branch.
  }

  const diffCommand = `git diff --name-only --diff-filter=ACMR ${base}...HEAD`;
  try {
    return command(diffCommand).split('\n').map((line) => line.trim()).filter(Boolean);
  } catch {
    return command('git diff --name-only --diff-filter=ACMR HEAD~1...HEAD').split('\n').map((line) => line.trim()).filter(Boolean);
  }
}

const files = changedFiles().filter((file) => !excluded.some((pattern) => pattern.test(file)));
const findings: string[] = [];

for (const file of files) {
  if (!sensitivePaths.some((pattern) => pattern.test(file))) continue;
  if (!fs.existsSync(file)) continue;

  const stat = fs.statSync(file);
  if (stat.size > 1_000_000) {
    findings.push(`${file}: unusually large changed file (${stat.size} bytes) requires human review.`);
    continue;
  }

  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) {
    findings.push(`${file}: binary/null-byte content in sensitive path requires human review.`);
    continue;
  }

  const text = buffer.toString('utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const { label, pattern } of suspiciousPatterns) {
      if (pattern.test(line)) {
        findings.push(`${file}:${index + 1}: ${label}`);
      }
    }

    if (/\p{C}/u.test(line.replace(/\t/g, ''))) {
      findings.push(`${file}:${index + 1}: control/invisible Unicode character in sensitive file`);
    }
  });
}

if (findings.length > 0) {
  console.error('PR safety validation failed. These findings require human security review before merge:\n');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`PR safety validation passed for ${files.length} changed file(s).`);
