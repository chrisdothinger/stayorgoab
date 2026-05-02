import fs from 'node:fs';
import path from 'node:path';
import { validatePublicAuditArtifact } from '../src/lib/public-audit';

const files = [
  'audit-manifest.json',
  'source-map.json',
  'claim-map.json',
  'latest-agent-runs.json',
  'latest-release.json',
  'repository-health.json'
];

const errors: string[] = [];
for (const file of files) {
  const filePath = path.join(process.cwd(), 'public', file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing public audit artifact: ${file}`);
    continue;
  }
  const result = validatePublicAuditArtifact(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  errors.push(...result.errors.map((error) => `${file}: ${error}`));
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Public audit artifacts validated.');
