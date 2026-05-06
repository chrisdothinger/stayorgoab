import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, 'content/topics/_index.yml');
const TOPIC_DIR = path.join(ROOT, 'content/topics');
const REGISTRY_PATH = path.join(ROOT, 'content/topic-question-registry.yml');

const ALLOWED_DECISIONS = new Set(['keep', 'reframe', 'merge_candidate', 'split_candidate', 'cancel_duplicate']);
const ALLOWED_PRIORITIES = new Set(['flagship', 'keep', 'reframe', 'merge', 'cancel']);
const ALLOWED_OVERLAP_STATUSES = new Set(['distinct', 'overlaps', 'duplicate', 'split_needed', 'needs_review']);
const ALLOWED_OVERLAP_RESOLUTIONS = new Set(['keep', 'merge_into', 'cancel', 'split', 'reframe']);
const REQUIRED_RESEARCH_LANES = ['base-packet', 'pro-source', 'anti-source', 'mediator-dedup'];
const GENERIC_OVERLAP_NOTES = new Set([
  'Distinct enough for a public dossier if source depth remains strong.',
  'Possible overlap; do not refresh dossier until merged/reframed against canonical topic.',
  'Broad bundle; split or sharpen before next major dossier refresh.'
]);

const REQUIRED_OVERLAP_PAIRS: Array<[string, string]> = [
  ['borders-currency-citizenship', 'currency-banking'],
  ['borders-currency-citizenship', 'borders-trade'],
  ['borders-currency-citizenship', 'border-enforcement-customs'],
  ['borders-currency-citizenship', 'immigration-passports-mobility'],
  ['borders-currency-citizenship', 'energy-environment'],
  ['borders-currency-citizenship', 'environmental-assessment-pipeline-approvals'],
  ['border-enforcement-customs', 'borders-trade'],
  ['border-enforcement-customs', 'immigration-passports-mobility'],
  ['currency-banking', 'bank-deposits-financial-stability'],
  ['courts-criminal-law', 'federal-prisons-corrections-parole'],
  ['courts-criminal-law', 'rcmp-provincial-policing'],
  ['federal-prisons-corrections-parole', 'rcmp-provincial-policing'],
  ['economy-overall', 'military-security'],
  ['economy-overall', 'international-recognition'],
  ['economy-fiscal', 'equalization'],
  ['economy-fiscal', 'federal-debt-assets'],
  ['equalization', 'tax-collection-revenue-agency'],
  ['energy-environment', 'environmental-assessment-pipeline-approvals'],
  ['energy-environment', 'indigenous-rights-treaties']
];

const TRUNCATED_BOUNDARY_ENDINGS = /\b(and|or|the|a|an|to|for|with|without|from|about|be|not|only|w|pro|improv|distinct)\.?$/i;

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
  overlap_review?: {
    status?: string;
    checked_against?: Array<{
      slug?: string;
      relationship?: string;
      boundary?: string;
    }>;
    canonical_slug?: string | null;
    resolution?: string;
    reviewer_notes?: string;
  };
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

function normalizedQuestion(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !['what', 'which', 'why', 'how', 'who', 'when', 'where', 'would', 'could', 'can', 'does', 'do', 'did', 'is', 'are', 'will', 'should', 'the', 'a', 'an', 'and', 'or', 'of', 'to', 'for', 'in', 'after', 'before', 'with'].includes(word))
    .map((word) => (word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word))
    .join(' ');
}

function tokenSet(...values: Array<string | undefined>): Set<string> {
  return new Set(values.flatMap((value) => normalizedQuestion(value ?? '').split(/\s+/).filter(Boolean)));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const aTokens = Array.from(a);
  const bTokens = Array.from(b);
  const intersection = aTokens.filter((token) => b.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
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
  const normalizedByQuestion = new Map<string, string>();
  const topicTokens = new Map(
    registry.topics.map((topic) => [topic.slug, tokenSet(topic.current_public_question, topic.question_family)])
  );

  for (const topic of registry.topics) {
    const normalized = normalizedQuestion(topic.current_public_question);
    const duplicateOf = normalizedByQuestion.get(normalized);
    if (duplicateOf) errors.push(`Topic ${topic.slug} duplicates normalized question of ${duplicateOf}.`);
    normalizedByQuestion.set(normalized, topic.slug);
  }

  const hasReciprocalReview = (firstSlug: string, secondSlug: string) => {
    const first = registryBySlug.get(firstSlug);
    const second = registryBySlug.get(secondSlug);
    const firstReviewed = first?.overlap_review?.checked_against?.some((item) => item.slug === secondSlug) ?? false;
    const secondReviewed = second?.overlap_review?.checked_against?.some((item) => item.slug === firstSlug) ?? false;
    return firstReviewed && secondReviewed;
  };

  for (const [firstSlug, secondSlug] of REQUIRED_OVERLAP_PAIRS) {
    if (registrySet.has(firstSlug) && registrySet.has(secondSlug) && !hasReciprocalReview(firstSlug, secondSlug)) {
      errors.push(`Required overlap pair ${firstSlug} / ${secondSlug} is missing reciprocal overlap_review.`);
    }
  }

  for (let firstIndex = 0; firstIndex < registry.topics.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < registry.topics.length; secondIndex += 1) {
      const first = registry.topics[firstIndex];
      const second = registry.topics[secondIndex];
      const similarity = jaccard(topicTokens.get(first.slug) ?? new Set(), topicTokens.get(second.slug) ?? new Set());
      const sameFamily = first.question_family === second.question_family;
      const firstReviewed = first.overlap_review?.checked_against?.some((item) => item.slug === second.slug) ?? false;
      const secondReviewed = second.overlap_review?.checked_against?.some((item) => item.slug === first.slug) ?? false;
      if ((sameFamily && similarity >= 0.25) || similarity >= 0.45) {
        if (!firstReviewed || !secondReviewed) {
          errors.push(`Topics ${first.slug} and ${second.slug} look adjacent (${similarity.toFixed(2)}) without reciprocal overlap_review.`);
        }
      }
      if (similarity >= 0.6 && first.decision === 'keep' && second.decision === 'keep' && (!firstReviewed || !secondReviewed)) {
        errors.push(`Topics ${first.slug} and ${second.slug} look too similar (${similarity.toFixed(2)}) without merge/cancel/reframe evidence.`);
      }
    }
  }

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
    if (topic.overlap_notes && GENERIC_OVERLAP_NOTES.has(topic.overlap_notes)) {
      errors.push(`Topic ${topic.slug} uses generic overlap_notes instead of a specific boundary.`);
    }
    const overlapReview = topic.overlap_review;
    if (!overlapReview) {
      errors.push(`Topic ${topic.slug} is missing structured overlap_review.`);
    } else {
      if (!overlapReview.status || !ALLOWED_OVERLAP_STATUSES.has(overlapReview.status)) {
        errors.push(`Topic ${topic.slug} has unsupported overlap_review.status ${overlapReview.status}.`);
      }
      if (!overlapReview.resolution || !ALLOWED_OVERLAP_RESOLUTIONS.has(overlapReview.resolution)) {
        errors.push(`Topic ${topic.slug} has unsupported overlap_review.resolution ${overlapReview.resolution}.`);
      }
      if (!overlapReview.reviewer_notes || overlapReview.reviewer_notes.length < 40) {
        errors.push(`Topic ${topic.slug} overlap_review.reviewer_notes is too thin.`);
      }
      if (overlapReview.canonical_slug && !indexSet.has(overlapReview.canonical_slug)) {
        errors.push(`Topic ${topic.slug} overlap_review.canonical_slug references unknown topic ${overlapReview.canonical_slug}.`);
      }
      const sameFamilyPeers = registry.topics.filter((other) => other.slug !== topic.slug && other.question_family === topic.question_family);
      const checkedAgainst = overlapReview.checked_against ?? [];
      if (sameFamilyPeers.length > 0 && checkedAgainst.length === 0) {
        errors.push(`Topic ${topic.slug} shares question_family ${topic.question_family} but has no overlap_review.checked_against entries.`);
      }
      for (const checked of checkedAgainst) {
        if (!checked.slug || !indexSet.has(checked.slug)) errors.push(`Topic ${topic.slug} overlap_review references unknown topic ${checked.slug}.`);
        if (checked.slug === topic.slug) errors.push(`Topic ${topic.slug} overlap_review references itself.`);
        if (checked.slug && indexSet.has(checked.slug) && !hasReciprocalReview(topic.slug, checked.slug)) {
          errors.push(`Topic ${topic.slug} overlap_review for ${checked.slug} is not reciprocal.`);
        }
        if (!checked.boundary || checked.boundary.length < 80) errors.push(`Topic ${topic.slug} has a thin overlap boundary for ${checked.slug}.`);
        if (checked.boundary && TRUNCATED_BOUNDARY_ENDINGS.test(checked.boundary.trim())) {
          errors.push(`Topic ${topic.slug} has a suspiciously truncated overlap boundary for ${checked.slug}.`);
        }
        if (checked.boundary && !/\b(this|dossier|question|topic|covers|asks|focuses|distinct|boundary|separate|other)\b/i.test(checked.boundary)) {
          errors.push(`Topic ${topic.slug} overlap boundary for ${checked.slug} does not state a clear scope boundary.`);
        }
      }
      if (topic.decision === 'keep' && overlapReview.resolution !== 'keep') {
        errors.push(`Topic ${topic.slug} decision keep conflicts with overlap_review.resolution ${overlapReview.resolution}.`);
      }
      if (topic.decision === 'merge_candidate' && overlapReview.resolution !== 'merge_into') {
        errors.push(`Topic ${topic.slug} merge_candidate must use overlap_review.resolution merge_into.`);
      }
      if (topic.decision === 'cancel_duplicate' && overlapReview.resolution !== 'cancel') {
        errors.push(`Topic ${topic.slug} cancel_duplicate must use overlap_review.resolution cancel.`);
      }
    }

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
