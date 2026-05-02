import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoreDirs = new Set(['.git', 'node_modules', '.next', 'out', '.superpowers', 'coverage', 'test-results', 'playwright-report']);
const patterns = [
  /gho_[A-Za-z0-9_]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /Authorization:\s*Bearer\s+[A-Za-z0-9._-]+/i
];

const offenders: string[] = [];

function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (rel === 'package-lock.json') continue;
    const text = fs.readFileSync(full, 'utf8');
    if (patterns.some((pattern) => pattern.test(text))) offenders.push(rel);
  }
}

walk(root);

if (offenders.length) {
  console.error(`Potential secrets found:\n${offenders.join('\n')}`);
  process.exit(1);
}

console.log('Secret scan passed.');
