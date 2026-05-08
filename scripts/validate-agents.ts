import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const required = [
  'agents/AGENTS.md',
  'agents/registry.yml',
  'agents/permissions.yml',
  'agents/personas/orchestrator.md',
  'agents/personas/source-steward.md',
  'agents/personas/claim-citation.md',
  'agents/personas/topic-writer.md',
  'agents/personas/synthesis-auditor.md',
  'agents/personas/release-rollback.md',
  'ops/schedules.yml'
];

type RegistryFile = {
  agents: Array<{
    id: string;
    persona?: string;
    prompts?: string[];
    rubrics?: string[];
  }>;
};
type PermissionsFile = { agents: Record<string, unknown> };
type SchedulesFile = {
  schedules: Array<{
    id: string;
    workflow: string;
    required_checks?: string[];
    public_log_level?: string;
    publish_raw_logs?: boolean;
    human_gate?: boolean;
  }>;
};

function exists(relativePath: string) {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

const findings: string[] = [];
const missing = required.filter((file) => !exists(file));
findings.push(...missing.map((file) => `Missing agent file: ${file}`));

const combined = required
  .filter((file) => exists(file))
  .map((file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8'))
  .join('\n');
if (/human_review_required:\s*(true|yes)|human_reviewed:\s*(true|yes)|requires_human_review:\s*(true|yes)|human_gate:\s*true/i.test(combined)) {
  findings.push('Agent files contain forbidden human-gate language.');
}

const registry = yaml.load(fs.readFileSync('agents/registry.yml', 'utf8')) as RegistryFile;
const permissions = yaml.load(fs.readFileSync('agents/permissions.yml', 'utf8')) as PermissionsFile;
const schedules = yaml.load(fs.readFileSync('ops/schedules.yml', 'utf8')) as SchedulesFile;
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const registryIds = new Set(registry.agents.map((agent) => agent.id));
const permissionIds = new Set(Object.keys(permissions.agents ?? {}));

for (const agent of registry.agents) {
  if (!permissionIds.has(agent.id)) findings.push(`agents/permissions.yml missing permissions for registry agent: ${agent.id}`);
  if (!agent.persona || !exists(agent.persona)) findings.push(`registry agent ${agent.id} references missing persona: ${agent.persona ?? 'unlisted'}`);
  for (const prompt of agent.prompts ?? []) {
    if (!exists(prompt)) findings.push(`registry agent ${agent.id} references missing prompt: ${prompt}`);
  }
  for (const rubric of agent.rubrics ?? []) {
    if (!exists(rubric)) findings.push(`registry agent ${agent.id} references missing rubric: ${rubric}`);
  }
}

for (const agentId of permissionIds) {
  if (!registryIds.has(agentId)) findings.push(`agents/permissions.yml contains unknown agent: ${agentId}`);
}

for (const schedule of schedules.schedules) {
  if (!exists(schedule.workflow)) findings.push(`ops/schedules.yml ${schedule.id} references missing workflow: ${schedule.workflow}`);
  if (schedule.publish_raw_logs !== false) findings.push(`ops/schedules.yml ${schedule.id} must keep publish_raw_logs: false`);
  if (schedule.public_log_level !== 'summarized') findings.push(`ops/schedules.yml ${schedule.id} must keep public_log_level: summarized`);
  if (schedule.human_gate !== false) findings.push(`ops/schedules.yml ${schedule.id} must keep human_gate: false`);
  for (const check of schedule.required_checks ?? []) {
    if (!pkg.scripts?.[check]) findings.push(`ops/schedules.yml ${schedule.id} references missing package script: ${check}`);
  }
}

for (const workflow of fs.readdirSync('.github/workflows').filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'))) {
  const text = fs.readFileSync(path.join('.github/workflows', workflow), 'utf8');
  if (!/^permissions:\n/m.test(text)) findings.push(`.github/workflows/${workflow} missing top-level permissions block`);
}

if (findings.length) {
  console.error(`Agent validation failed:\n${findings.map((finding) => `- ${finding}`).join('\n')}`);
  process.exit(1);
}

console.log('Agent files validated.');
