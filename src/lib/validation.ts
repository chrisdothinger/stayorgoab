import type { PublicationState, RepositoryContent, ValidationResult } from './types';

const FORBIDDEN_FIELDS = ['human_review_required', 'human_reviewed', 'human_review', 'requires_human_review'];
const PUBLICATION_STATES = new Set<PublicationState>([
  'stub',
  'seed_overview',
  'source_collection',
  'partial_dossier',
  'full_dossier',
  'needs_audit',
  'needs_redebate',
  'withheld_pending_support',
  'withhold_pending_support',
  'archived'
]);
const FULL_DOSSIER_STATES = new Set<PublicationState>(['full_dossier']);
const SOURCE_TYPES = new Set(['official', 'court', 'advocacy', 'academic', 'media', 'other']);
const SOURCE_STANCES = new Set(['neutral', 'pro_independence', 'anti_independence', 'anti_independence_or_rights_concern', 'mixed', 'other']);
const SOURCE_STATUSES = new Set(['active', 'archived', 'superseded', 'broken', 'needs_recheck']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function extractSourceAccessDates(body: string): Array<{ sourceId: string; accessedAt: string }> {
  const sourceSection = body.split(/\n## Sources\b/i)[1] ?? '';
  const entries: Array<{ sourceId: string; accessedAt: string }> = [];
  const sourceLinePattern = /^(?=.*\baccessed\s+(\d{4}-\d{2}-\d{2}))(?=.*Source ID:\s*`([^`]+)`).*$/gim;
  for (const match of Array.from(sourceSection.matchAll(sourceLinePattern))) {
    entries.push({ sourceId: match[2], accessedAt: match[1] });
  }
  return entries;
}

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
  const sourcesById = new Map(content.sources.map((source) => [source.id, source]));
  const seenSourceIds = new Set<string>();
  const seenSourceSlugs = new Set<string>();
  const claimIds = new Set<string>();

  for (const forbidden of Array.from(findForbiddenFields(content.rawRecords))) {
    errors.push(`Forbidden human review field found: ${forbidden}.`);
  }

  for (const topic of content.topics) {
    if (topicSlugs.has(topic.slug)) errors.push(`Duplicate topic slug: ${topic.slug}.`);
    topicSlugs.add(topic.slug);
    if (!topic.title || !topic.plain_question || !topic.category || !topic.summary) {
      errors.push(`Topic ${topic.slug} is missing required search metadata.`);
    }

    if (!PUBLICATION_STATES.has(topic.state)) {
      errors.push(`Topic ${topic.slug} has unsupported state ${topic.state}.`);
    }
    for (const field of ['last_audited_at', 'last_debated_at'] as const) {
      const value = topic[field];
      if (value !== null && !ISO_DATE.test(value)) {
        errors.push(`Topic ${topic.slug} has malformed ${field} date ${value}.`);
      }
    }

    const files = content.topicFiles[topic.slug];
    if (!files?.index) errors.push(`Topic ${topic.slug} is missing index.mdx.`);
    if (FULL_DOSSIER_STATES.has(topic.state)) {
      if (!files?.reports.neutral) errors.push(`Full dossier ${topic.slug} is missing neutral report.`);
      if (!files?.reports.pro) errors.push(`Full dossier ${topic.slug} is missing pro report.`);
      if (!files?.reports.anti) errors.push(`Full dossier ${topic.slug} is missing anti report.`);
      if (!files?.sourceIds.length) errors.push(`Full dossier ${topic.slug} is missing topic source list.`);
      if (!files?.claims.length) errors.push(`Full dossier ${topic.slug} is missing topic claim ledger.`);
      if (!files?.auditEntries.length) errors.push(`Full dossier ${topic.slug} is missing audit history.`);
      if (!files?.redebateEntries.length) errors.push(`Full dossier ${topic.slug} is missing redebate history.`);
    }

    for (const sourceId of files?.sourceIds ?? []) {
      if (!sourceIds.has(sourceId)) errors.push(`Topic ${topic.slug} references undefined source ${sourceId}.`);
    }
    for (const [kind, report] of Object.entries(files?.reports ?? {})) {
      if (!report) continue;
      for (const entry of extractSourceAccessDates(report.body)) {
        const source = sourcesById.get(entry.sourceId);
        if (source?.accessed_at && source.accessed_at !== entry.accessedAt) {
          errors.push(
            `Topic ${topic.slug} ${kind} report lists source ${entry.sourceId} accessed ${entry.accessedAt}, but canonical source accessed_at is ${source.accessed_at}.`
          );
        }
      }
    }
  }

  for (const source of content.sources) {
    const sourceLabel = source.id || source.slug || source.title || 'unknown-source';
    if (seenSourceIds.has(source.id)) errors.push(`Duplicate source id: ${source.id}.`);
    seenSourceIds.add(source.id);
    if (!source.id || !SLUG.test(source.id)) errors.push(`Source ${sourceLabel} has malformed id ${source.id}.`);
    if (source.slug) {
      if (seenSourceSlugs.has(source.slug)) errors.push(`Duplicate source slug: ${source.slug}.`);
      seenSourceSlugs.add(source.slug);
      if (!SLUG.test(source.slug)) errors.push(`Source ${sourceLabel} has malformed slug ${source.slug}.`);
    }
    try {
      new URL(source.url);
    } catch {
      errors.push(`Source ${sourceLabel} has invalid URL ${source.url}.`);
    }
    for (const field of ['published_at', 'accessed_at', 'last_checked_at'] as const) {
      const value = source[field];
      if (value !== null && value !== undefined && !ISO_DATE.test(value)) {
        errors.push(`Source ${sourceLabel} has malformed ${field} date ${value}.`);
      }
    }
    if (!SOURCE_TYPES.has(source.source_type)) errors.push(`Source ${sourceLabel} has unsupported source_type ${source.source_type}.`);
    if (source.stance && !SOURCE_STANCES.has(source.stance)) errors.push(`Source ${sourceLabel} has unsupported stance ${source.stance}.`);
    if (!source.reliability_category) errors.push(`Source ${sourceLabel} is missing reliability_category.`);
    if (!source.summary) errors.push(`Source ${sourceLabel} is missing summary.`);
    if (!source.how_used) errors.push(`Source ${sourceLabel} is missing how_used.`);
    if (!source.related_topic_slugs?.length) errors.push(`Source ${sourceLabel} is missing related_topic_slugs.`);
    for (const topicSlug of source.related_topic_slugs ?? []) {
      if (!topicSlugs.has(topicSlug)) errors.push(`Source ${sourceLabel} references undefined topic ${topicSlug}.`);
    }
    if (source.status && !SOURCE_STATUSES.has(source.status)) errors.push(`Source ${sourceLabel} has unsupported status ${source.status}.`);
  }

  for (const claim of content.claims) {
    if (claimIds.has(claim.id)) errors.push(`Duplicate claim id: ${claim.id}.`);
    claimIds.add(claim.id);
    if (!topicSlugs.has(claim.topic_slug)) errors.push(`Claim ${claim.id} references undefined topic ${claim.topic_slug}.`);
    if (claim.status === 'source_supported' && claim.source_ids.length === 0) {
      errors.push(`Source-supported claim ${claim.id} has no sources.`);
    }
    if (claim.risk === 'high' && claim.status === 'unsupported') {
      errors.push(`High-risk claim ${claim.id} cannot be marked unsupported for publication.`);
    }
    for (const sourceId of claim.source_ids) {
      if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} references undefined source ${sourceId}.`);
    }
  }

  return { ok: errors.length === 0, errors };
}
