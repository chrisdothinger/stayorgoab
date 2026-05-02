import fs from 'node:fs';
import path from 'node:path';

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

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error(`Missing agent files:\n${missing.join('\n')}`);
  process.exit(1);
}

const combined = required.map((file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')).join('\n');
if (/human_review_required:\s*(true|yes)|human_reviewed:\s*(true|yes)|requires_human_review:\s*(true|yes)|human_gate:\s*true/i.test(combined)) {
  console.error('Agent files contain forbidden human-gate language.');
  process.exit(1);
}

console.log('Agent files validated.');
