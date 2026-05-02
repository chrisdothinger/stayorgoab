import type { RepositoryContent } from './types';

export interface SearchEntry {
  id: string;
  slug: string;
  type: 'topic' | 'source' | 'claim' | 'glossary';
  url: string;
  title: string;
  plain_question: string;
  category: string;
  summary: string;
  keywords: string[];
  state: string;
  last_audited_at: string | null;
  source_count: number;
  claim_count: number;
}

export function buildSearchIndex(content: RepositoryContent): SearchEntry[] {
  const topicEntries = content.topics.map((topic) => ({
    id: `topic-${topic.slug}`,
    slug: topic.slug,
    type: 'topic' as const,
    url: `/questions/${topic.slug}`,
    title: topic.title,
    plain_question: topic.plain_question,
    category: topic.category,
    summary: topic.summary,
    keywords: topic.keywords,
    state: topic.state,
    last_audited_at: topic.last_audited_at,
    source_count: topic.source_count,
    claim_count: topic.claim_count
  }));

  const sourceEntries = content.sources.map((source) => ({
    id: `source-${source.id}`,
    slug: source.id,
    type: 'source' as const,
    url: `/sources/${source.id}`,
    title: source.title,
    plain_question: source.summary,
    category: source.publisher,
    summary: source.summary,
    keywords: [source.publisher, source.source_type],
    state: source.source_type,
    last_audited_at: source.accessed_at,
    source_count: 1,
    claim_count: content.claims.filter((claim) => claim.source_ids.includes(source.id)).length
  }));

  const claimEntries = content.claims.map((claim) => ({
    id: claim.id,
    slug: claim.id,
    type: 'claim' as const,
    url: `/questions/${claim.topic_slug}/claims`,
    title: claim.text,
    plain_question: claim.text,
    category: claim.topic_slug,
    summary: claim.text,
    keywords: claim.source_ids,
    state: claim.status,
    last_audited_at: null,
    source_count: claim.source_ids.length,
    claim_count: 1
  }));

  const glossaryEntries = content.glossary.map((term) => ({
    id: `glossary-${term.term.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
    slug: term.term.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'),
    type: 'glossary' as const,
    url: '/glossary',
    title: term.term,
    plain_question: term.term,
    category: 'Glossary',
    summary: term.definition,
    keywords: [term.term],
    state: 'definition',
    last_audited_at: null,
    source_count: 0,
    claim_count: 0
  }));

  return [...topicEntries, ...sourceEntries, ...claimEntries, ...glossaryEntries];
}
