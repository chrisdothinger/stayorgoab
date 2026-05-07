import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import {
  COMPACT_DOSSIER_OVERVIEW_SECTIONS,
  DOSSIER_OVERVIEW_SECTIONS,
  hasDeletedV3Section,
  hasLeanReportContract
} from '../src/lib/dossier-contract';
import type { ReportKind } from '../src/lib/dossier-contract';

const ROOT = process.cwd();
const TOPIC_DIR = path.join(ROOT, 'content/topics');
const INDEX_PATH = path.join(ROOT, 'content/topics/_index.yml');
const REGISTRY_PATH = path.join(ROOT, 'content/topic-question-registry.yml');
const MANIFEST_PATH = path.join(ROOT, 'content/dossier-migration-manifest.yml');

const ALLOWED_STATUSES = new Set(['legacy_refresh_needed', 'in_refresh', 'v3_complete', 'needs_review', 'blocked']);
const REQUIRED_TOPIC_FILES = ['index.mdx', 'pro.mdx', 'anti.mdx', 'neutral.mdx', 'sources.yml', 'claims.yml', 'audit-log.yml', 'redebate-log.yml'];
const REQUIRED_LANES = ['base-packet', 'pro-source', 'anti-source', 'neutral-mediator', 'citation-audit'];
const MAX_BATCH_SIZE = 7;

type MigrationStatus = 'legacy_refresh_needed' | 'in_refresh' | 'v3_complete' | 'needs_review' | 'blocked';

interface TopicIndexRecord {
  slug: string;
  title: string;
}

interface TopicQuestionRecord {
  slug: string;
  current_public_question: string;
  decision: string;
  priority: string;
  category: string;
  score_total?: number;
  scores?: { total?: number };
}

interface TopicQuestionRegistry {
  topics: TopicQuestionRecord[];
}

interface DossierMigrationRecord {
  slug: string;
  public_question: string;
  category: string;
  question_decision: string;
  migration_status: MigrationStatus;
  migration_batch: string;
  migration_priority: string;
  score_total: number;
  source_refresh_required: boolean;
  required_lanes: string[];
  acceptance: string[];
}

interface DossierMigrationManifest {
  version: string;
  standard: string;
  source_registry: string;
  batch_size_target: string;
  statuses: string[];
  gates: string[];
  topics: DossierMigrationRecord[];
}

function loadYaml<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
}

function readMdxBody(filePath: string): string {
  const text = fs.readFileSync(filePath, 'utf8');
  return text.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

function topicFile(slug: string, fileName: string) {
  return path.join(TOPIC_DIR, slug, fileName);
}

function readIndexFrontmatterTitle(slug: string): string | null {
  const text = fs.readFileSync(topicFile(slug, 'index.mdx'), 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const frontmatter = yaml.load(match[1]) as { title?: unknown } | null;
  return typeof frontmatter?.title === 'string' ? frontmatter.title : null;
}

function hasOverviewV3Contract(body: string) {
  const lowerBody = body.toLowerCase();
  const hasLegacyOverview = DOSSIER_OVERVIEW_SECTIONS.every((section) => lowerBody.includes(section.toLowerCase()));
  const hasCompactOverview = COMPACT_DOSSIER_OVERVIEW_SECTIONS.every((section) => lowerBody.includes(section.toLowerCase()));
  return hasLegacyOverview || hasCompactOverview;
}

function usedCitationNumbers(body: string): number[] {
  const withoutSources = body.split(/\n## Sources\b/i)[0] ?? body;
  return Array.from(withoutSources.matchAll(/\[(\d+)\]/g)).map((match) => Number(match[1]));
}

function sourceListNumbers(body: string): number[] {
  const sourceSection = body.split(/\n## Sources\b/i)[1] ?? '';
  return Array.from(sourceSection.matchAll(/^\s*(\d+)\./gm)).map((match) => Number(match[1]));
}

function validateStrictV3Topic(slug: string): string[] {
  const errors: string[] = [];
  const overviewBody = readMdxBody(topicFile(slug, 'index.mdx'));
  if (!hasOverviewV3Contract(overviewBody)) errors.push(`${slug}:overview:v3-contract`);

  const reportKinds: ReportKind[] = ['pro', 'anti', 'neutral'];
  for (const kind of reportKinds) {
    const body = readMdxBody(topicFile(slug, `${kind}.mdx`));
    const lowerBody = body.toLowerCase();
    if (!hasLeanReportContract(lowerBody, kind)) errors.push(`${slug}:${kind}:v3-contract`);
    if (hasDeletedV3Section(lowerBody)) errors.push(`${slug}:${kind}:retired-v3-section`);

    const used = new Set(usedCitationNumbers(body));
    const listed = new Set(sourceListNumbers(body));
    if (used.size === 0) errors.push(`${slug}:${kind}:no-numbered-citations`);
    if (listed.size === 0) errors.push(`${slug}:${kind}:missing-numbered-sources`);
    for (const citation of Array.from(used)) {
      if (!listed.has(citation)) errors.push(`${slug}:${kind}:citation-${citation}-missing-source-entry`);
    }
    if (kind === 'neutral') {
      if (!/pro report|pro-independence/i.test(body)) errors.push(`${slug}:neutral:pro-mediation`);
      if (!/anti report|pro-federation|anti-independence/i.test(body)) errors.push(`${slug}:neutral:anti-mediation`);
      if (!/mediator|synthesis/i.test(body)) errors.push(`${slug}:neutral:mediator-role`);
    }
  }

  const auditText = fs.readFileSync(topicFile(slug, 'audit-log.yml'), 'utf8').toLowerCase();
  const redebateText = fs.readFileSync(topicFile(slug, 'redebate-log.yml'), 'utf8').toLowerCase();
  if (!auditText.includes('v3')) errors.push(`${slug}:audit-log:v3-entry-missing`);
  if (!redebateText.includes('v3')) errors.push(`${slug}:redebate-log:v3-entry-missing`);
  return errors;
}

export function validateDossierMigrationManifest() {
  const errors: string[] = [];
  const index = loadYaml<{ topics: TopicIndexRecord[] }>(INDEX_PATH).topics;
  const registry = loadYaml<TopicQuestionRegistry>(REGISTRY_PATH).topics;
  const manifest = loadYaml<DossierMigrationManifest>(MANIFEST_PATH);

  if (!manifest.version) errors.push('Dossier migration manifest is missing version.');
  if (manifest.standard !== 'v3-lean-with-evidence-chip-citations') {
    errors.push(`Dossier migration manifest has unsupported standard ${manifest.standard}.`);
  }
  if (manifest.source_registry !== 'content/topic-question-registry.yml') {
    errors.push('Dossier migration manifest must reference content/topic-question-registry.yml.');
  }
  for (const status of manifest.statuses ?? []) {
    if (!ALLOWED_STATUSES.has(status)) errors.push(`Dossier migration manifest declares unsupported status ${status}.`);
  }

  const indexBySlug = new Map(index.map((topic) => [topic.slug, topic]));
  const registryBySlug = new Map(registry.map((topic) => [topic.slug, topic]));
  const manifestSlugs = manifest.topics.map((topic) => topic.slug);
  const manifestBySlug = new Map(manifest.topics.map((topic) => [topic.slug, topic]));

  if (new Set(manifestSlugs).size !== manifestSlugs.length) errors.push('Dossier migration manifest has duplicate topic slugs.');
  for (const slug of Array.from(indexBySlug.keys())) {
    if (!manifestBySlug.has(slug)) errors.push(`Topic ${slug} is missing from dossier migration manifest.`);
  }
  for (const slug of manifestSlugs) {
    if (!indexBySlug.has(slug)) errors.push(`Dossier migration manifest references unknown topic ${slug}.`);
    if (!registryBySlug.has(slug)) errors.push(`Dossier migration manifest references topic ${slug} missing from question registry.`);
  }

  const batchCounts = new Map<string, number>();
  let completeCount = 0;
  for (const topic of manifest.topics) {
    const indexTopic = indexBySlug.get(topic.slug);
    const registryTopic = registryBySlug.get(topic.slug);
    if (!ALLOWED_STATUSES.has(topic.migration_status)) errors.push(`Topic ${topic.slug} has unsupported migration_status ${topic.migration_status}.`);
    if (topic.public_question !== indexTopic?.title) errors.push(`Topic ${topic.slug} manifest question does not match _index.yml.`);
    const frontmatterTitle = fs.existsSync(topicFile(topic.slug, 'index.mdx')) ? readIndexFrontmatterTitle(topic.slug) : null;
    if (frontmatterTitle !== topic.public_question) errors.push(`Topic ${topic.slug} manifest question does not match index.mdx frontmatter title.`);
    if (topic.public_question !== registryTopic?.current_public_question) errors.push(`Topic ${topic.slug} manifest question does not match topic-question registry.`);
    if (topic.category !== registryTopic?.category) errors.push(`Topic ${topic.slug} manifest category does not match topic-question registry.`);
    if (topic.question_decision !== registryTopic?.decision) errors.push(`Topic ${topic.slug} manifest decision does not match topic-question registry.`);
    if (topic.question_decision !== 'keep' && topic.migration_status === 'v3_complete') {
      errors.push(`Topic ${topic.slug} cannot be v3_complete while question decision is ${topic.question_decision}.`);
    }
    const registryScore = registryTopic?.score_total ?? registryTopic?.scores?.total;
    if (topic.score_total !== registryScore) errors.push(`Topic ${topic.slug} manifest score does not match topic-question registry.`);
    if (!topic.migration_batch) errors.push(`Topic ${topic.slug} is missing migration_batch.`);
    if (topic.migration_batch && topic.migration_batch !== 'batch-00-complete-pilot') {
      batchCounts.set(topic.migration_batch, (batchCounts.get(topic.migration_batch) ?? 0) + 1);
    }
    for (const lane of REQUIRED_LANES) {
      if (!topic.required_lanes?.includes(lane)) errors.push(`Topic ${topic.slug} migration manifest is missing lane ${lane}.`);
    }
    if ((topic.migration_status === 'legacy_refresh_needed' || topic.migration_status === 'in_refresh') && !topic.source_refresh_required) {
      errors.push(`Topic ${topic.slug} needs source_refresh_required=true before migration.`);
    }
    if (topic.migration_status === 'v3_complete' && topic.source_refresh_required) {
      errors.push(`Topic ${topic.slug} is v3_complete but still marked source_refresh_required.`);
    }
    for (const fileName of REQUIRED_TOPIC_FILES) {
      if (!fs.existsSync(topicFile(topic.slug, fileName))) errors.push(`Topic ${topic.slug} missing ${fileName}.`);
    }
    if (topic.migration_status === 'v3_complete') {
      completeCount += 1;
      errors.push(...validateStrictV3Topic(topic.slug));
    }
  }

  for (const [batch, count] of Array.from(batchCounts.entries())) {
    if (count > MAX_BATCH_SIZE) errors.push(`Migration batch ${batch} has ${count} topics; max is ${MAX_BATCH_SIZE}.`);
  }
  if (completeCount < 1) errors.push('At least one v3_complete pilot dossier is required before bulk migration.');

  return { ok: errors.length === 0, errors };
}

const isDirectRun = process.argv[1]?.endsWith('validate-dossier-migration.ts') ?? false;

if (isDirectRun) {
  const result = validateDossierMigrationManifest();
  if (!result.ok) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log('Dossier migration manifest OK.');
}
