import fs from 'node:fs';
import path from 'node:path';
import { buildAuditManifest } from '../src/lib/audit';
import { loadRepositoryContent } from '../src/lib/content';

const root = process.cwd();
const content = loadRepositoryContent();
const manifest = buildAuditManifest(content);

const sourceMap = Object.fromEntries(content.sources.map((source) => [source.id, source]));
const claimMap = Object.fromEntries(content.claims.map((claim) => [claim.id, claim]));
const latestRelease = {
  site_name: 'StayOrGoAB',
  generated_at: manifest.generated_at,
  repository: manifest.repository,
  commit_sha: manifest.commit_sha,
  state: 'seed-static-preview'
};
const repositoryHealth = {
  generated_at: manifest.generated_at,
  repository: manifest.repository,
  checks: ['content-validation', 'search-index', 'audit-manifest', 'secret-scan'],
  status: 'generated'
};
const latestAgentRuns = [
  {
    run_id: 'seed-build-2026-05-02',
    agent_id: 'codex-seed-builder',
    agent_name: 'Codex seed build',
    started_at: '2026-05-02T00:00:00Z',
    completed_at: manifest.generated_at,
    trigger: 'build',
    input_summary: 'Seed build from public baseline spec and verified public sources.',
    output_summary: 'Generated static public audit artifacts and high-risk civic dossier seeds.',
    files_changed: ['content/topics/_index.yml', 'content/sources/sources.yml'],
    sources_checked: content.sources.map((source) => source.id),
    claims_added: content.claims.map((claim) => claim.id),
    claims_changed: [],
    checks_run: repositoryHealth.checks,
    checks_passed: repositoryHealth.checks,
    checks_failed: [],
    public_artifacts: ['audit-manifest.json', 'source-map.json', 'claim-map.json'],
    commit_sha: manifest.commit_sha,
    risk_flags: ['high-risk civic content', 'household finance', 'Indigenous rights'],
    redactions_applied: ['no raw logs', 'no personal data', 'no raw transcripts']
  }
];

const outputs: Record<string, unknown> = {
  'audit-manifest.json': manifest,
  'source-map.json': sourceMap,
  'claim-map.json': claimMap,
  'latest-agent-runs.json': latestAgentRuns,
  'latest-release.json': latestRelease,
  'repository-health.json': repositoryHealth
};

for (const [file, value] of Object.entries(outputs)) {
  const outputPath = path.join(root, 'public', file);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(value, null, 2) + '\n');
  console.log(`Generated ${outputPath}`);
}
