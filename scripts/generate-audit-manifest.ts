import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import { buildAuditManifest } from '../src/lib/audit';
import { loadRepositoryContent } from '../src/lib/content';

const root = process.cwd();
const content = loadRepositoryContent();
const manifest = buildAuditManifest(content);

const sourceMap = Object.fromEntries(content.sources.map((source) => [source.id, source]));
const claimMap = Object.fromEntries(content.claims.map((claim) => [claim.id, claim]));
const releaseLogPath = path.join(root, 'ops', 'releases', 'release-log.yml');
const releaseLog = yaml.load(fs.readFileSync(releaseLogPath, 'utf8')) as {
  releases?: Array<{ id: string; date: string; summary: string }>;
};
const latestReleaseRecord = releaseLog.releases?.[0];
const gitCommit = process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const gitSubject = execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim();
const latestRelease = {
  site_name: 'StayOrGoAB',
  generated_at: manifest.generated_at,
  repository: manifest.repository,
  commit_sha: manifest.commit_sha,
  release_id: latestReleaseRecord?.id ?? 'unrecorded-release',
  release_date: latestReleaseRecord?.date ?? null,
  release_summary: latestReleaseRecord?.summary ?? gitSubject,
  state: latestReleaseRecord?.id ?? gitSubject,
  source_commit_sha: gitCommit
};
const repositoryHealth = {
  generated_at: manifest.generated_at,
  repository: manifest.repository,
  checks: ['content-validation', 'search-index', 'audit-manifest', 'ops-artifacts', 'agent-validation', 'secret-scan'],
  status: 'generated'
};
const latestRunsPath = path.join(root, 'ops', 'agent-runs', 'latest.public.json');
const latestAgentRuns = JSON.parse(fs.readFileSync(latestRunsPath, 'utf8')) as unknown[];

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
