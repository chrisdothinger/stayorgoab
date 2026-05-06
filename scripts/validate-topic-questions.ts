import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, 'content/topics/_index.yml');
const TOPIC_DIR = path.join(ROOT, 'content/topics');
const REGISTRY_PATH = path.join(ROOT, 'content/topic-question-registry.yml');

const ALLOWED_DECISIONS = new Set(['keep', 'reframe', 'merge_candidate', 'split_candidate']);
const ALLOWED_PRIORITIES = new Set(['flagship', 'keep', 'reframe', 'merge']);
const REQUIRED_RESEARCH_LANES = ['base-packet', 'pro-source', 'anti-source', 'mediator-dedup'];

interface TopicIndexRecord {
  slug: string;
  title: string;
  plain_question: string;
}

interface TopicQuestionRecord {
  slug: string;
  current_public_question: string;
  current_legacy_title?: string;
  decision: string;
  priority: string;
  question_family: string;
  category: string;
  merge_with?: string | null;
  scores: Record<string, number>;
  reader_intent: string[];
  research_lanes: string[];
  overlap_notes: string;
}

interface TopicQuestionRegistry {
  version: string;
  topics: TopicQuestionRecord[];
}

function loadYaml<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
}

function readFrontmatterTitle(slug: string): string | null {
  const filePath = path.join(TOPIC_DIR, slug, 'index.mdx');
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const frontmatter = yaml.load(match[1]) as { title?: unknown } | null;
  return typeof frontmatter?.title === 'string' ? frontmatter.title : null;
}

function isQuestion(value: string): boolean {
  return /\?$/.test(value.trim()) && /^(what|which|why|how|who|when|where|would|could|can|does|do|did|is|are|will|should)\b/i.test(value.trim());
}

export function validateTopicQuestionRegistry() {
  const errors: string[] = [];
  const index = loadYaml<{ topics: TopicIndexRecord[] }>(INDEX_PATH).topics;
  const registry = loadYaml<TopicQuestionRegistry>(REGISTRY_PATH);
  const indexSlugs = index.map((topic) => topic.slug);
  const registrySlugs = registry.topics.map((topic) => topic.slug);
  const indexSet = new Set(indexSlugs);
  const registrySet = new Set(registrySlugs);

  if (!registry.version) errors.push('Topic question registry is missing version.');

  for (const slug of indexSlugs) {
    if (!registrySet.has(slug)) errors.push(`Topic ${slug} is missing from topic-question registry.`);
  }
  for (const slug of registrySlugs) {
    if (!indexSet.has(slug)) errors.push(`Topic-question registry references unknown topic ${slug}.`);
  }
  if (new Set(registrySlugs).size !== registrySlugs.length) errors.push('Topic-question registry has duplicate slugs.');

  const registryBySlug = new Map(registry.topics.map((topic) => [topic.slug, topic]));
  for (const topic of index) {
    if (!isQuestion(topic.title)) errors.push(`Topic ${topic.slug} title is not a public question: ${topic.title}`);
    if (!isQuestion(topic.plain_question)) errors.push(`Topic ${topic.slug} plain_question is not a question: ${topic.plain_question}`);
    const frontmatterTitle = readFrontmatterTitle(topic.slug);
    if (frontmatterTitle && frontmatterTitle !== topic.title) {
      errors.push(`Topic ${topic.slug} index.mdx title does not match public question.`);
    }

    const registered = registryBySlug.get(topic.slug);
    if (!registered) continue;
    if (registered.current_public_question !== topic.title) {
      errors.push(`Topic ${topic.slug} registry question does not match public title.`);
    }
  }

  for (const topic of registry.topics) {
    if (!isQuestion(topic.current_public_question)) {
      errors.push(`Topic ${topic.slug} registry question is not question-shaped.`);
    }
    if (!ALLOWED_DECISIONS.has(topic.decision)) errors.push(`Topic ${topic.slug} has unsupported decision ${topic.decision}.`);
    if (!ALLOWED_PRIORITIES.has(topic.priority)) errors.push(`Topic ${topic.slug} has unsupported priority ${topic.priority}.`);
    if (!topic.question_family) errors.push(`Topic ${topic.slug} is missing question_family.`);
    if (!topic.category) errors.push(`Topic ${topic.slug} is missing category.`);
    if (!topic.reader_intent?.length) errors.push(`Topic ${topic.slug} is missing reader_intent.`);
    for (const lane of REQUIRED_RESEARCH_LANES) {
      if (!topic.research_lanes?.includes(lane)) errors.push(`Topic ${topic.slug} is missing research lane ${lane}.`);
    }
    if (!topic.overlap_notes) errors.push(`Topic ${topic.slug} is missing overlap_notes.`);

    const scoreKeys = ['public_importance', 'sensitivity', 'uniqueness', 'answerability', 'reader_value'];
    let total = 0;
    for (const key of scoreKeys) {
      const value = topic.scores?.[key];
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        errors.push(`Topic ${topic.slug} has invalid ${key} score ${value}.`);
      } else {
        total += value;
      }
    }
    if (topic.scores?.total !== total) errors.push(`Topic ${topic.slug} score total is ${topic.scores?.total}, expected ${total}.`);
    if (total < 16 && topic.decision !== 'merge_candidate') errors.push(`Topic ${topic.slug} scores below acceptance gate without merge_candidate decision.`);
    if (topic.decision === 'merge_candidate' && !topic.merge_with) errors.push(`Topic ${topic.slug} is merge_candidate without merge_with.`);
    if (topic.merge_with && !indexSet.has(topic.merge_with)) errors.push(`Topic ${topic.slug} merge_with references unknown topic ${topic.merge_with}.`);
  }

  return { ok: errors.length === 0, errors };
}

const isDirectRun = process.argv[1]?.endsWith('validate-topic-questions.ts') ?? false;

if (isDirectRun) {
  const result = validateTopicQuestionRegistry();
  if (!result.ok) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`Topic-question registry OK (${loadYaml<TopicQuestionRegistry>(REGISTRY_PATH).topics.length} topics).`);
}
