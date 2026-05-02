import type { RepositoryContent, ValidationResult } from './types';

const FORBIDDEN_FIELDS = ['human_review_required', 'human_reviewed', 'human_review', 'requires_human_review'];
const FULL_DOSSIER_STATES = new Set(['full_dossier']);

function findForbiddenFields(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    value.forEach((item) => findForbiddenFields(item, found));
  } else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (FORBIDDEN_FIELDS.includes(key)) found.add(key);
      findForbiddenFields(nested, found);
    }
  }
  return found;
}

export function validateContentModel(content: RepositoryContent): ValidationResult {
  const errors: string[] = [];
  const topicSlugs = new Set<string>();
  const sourceIds = new Set(content.sources.map((source) => source.id));
  const claimIds = new Set<string>();

  for (const forbidden of findForbiddenFields(content.rawRecords)) {
    errors.push(`Forbidden human review field found: ${forbidden}.`);
  }

  for (const topic of content.topics) {
    if (topicSlugs.has(topic.slug)) errors.push(`Duplicate topic slug: ${topic.slug}.`);
    topicSlugs.add(topic.slug);
    if (!topic.title || !topic.plain_question || !topic.category || !topic.summary) {
      errors.push(`Topic ${topic.slug} is missing required search metadata.`);
    }

    const files = content.topicFiles[topic.slug];
    if (!files?.index) errors.push(`Topic ${topic.slug} is missing index.mdx.`);
    if (FULL_DOSSIER_STATES.has(topic.state)) {
      if (!files?.reports.neutral) errors.push(`Full dossier ${topic.slug} is missing neutral report.`);
      if (!files?.reports.pro) errors.push(`Full dossier ${topic.slug} is missing pro report.`);
      if (!files?.reports.anti) errors.push(`Full dossier ${topic.slug} is missing anti report.`);
      if (!files?.sourceIds.length) errors.push(`Full dossier ${topic.slug} is missing topic source list.`);
    }

    for (const sourceId of files?.sourceIds ?? []) {
      if (!sourceIds.has(sourceId)) errors.push(`Topic ${topic.slug} references undefined source ${sourceId}.`);
    }
  }

  for (const claim of content.claims) {
    if (claimIds.has(claim.id)) errors.push(`Duplicate claim id: ${claim.id}.`);
    claimIds.add(claim.id);
    if (!topicSlugs.has(claim.topic_slug)) errors.push(`Claim ${claim.id} references undefined topic ${claim.topic_slug}.`);
    if (claim.status === 'source_supported' && claim.source_ids.length === 0) {
      errors.push(`Source-supported claim ${claim.id} has no sources.`);
    }
    for (const sourceId of claim.source_ids) {
      if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} references undefined source ${sourceId}.`);
    }
  }

  return { ok: errors.length === 0, errors };
}
