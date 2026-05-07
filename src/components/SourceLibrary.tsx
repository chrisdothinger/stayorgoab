'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ClaimRecord, SourceRecord, TopicMeta } from '@/lib/types';

const allValue = 'all';
const sortOptions = ['recency', 'publisher', 'title', 'claims'] as const;
type SortOption = typeof sortOptions[number];

type SourceLibraryProps = {
  sources: SourceRecord[];
  claims: ClaimRecord[];
  topics: TopicMeta[];
};

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();
}

function formatValue(value?: string | null) {
  return value ? value.replaceAll('_', ' ') : 'unlabelled';
}

function sourceRoute(source: SourceRecord) {
  return `/sources/${source.slug ?? source.id}`;
}

function initialParam(name: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) ?? fallback;
}

function initialAllParam(name: string) {
  return initialParam(name, allValue);
}

function initialSortParam(): SortOption {
  const value = initialParam('sort', 'recency');
  return sortOptions.includes(value as SortOption) ? value as SortOption : 'recency';
}

function compareText(a: string | null | undefined, b: string | null | undefined) {
  return (a ?? '').localeCompare(b ?? '', 'en', { sensitivity: 'base' });
}

function checkDate(source: SourceRecord) {
  return source.last_checked_at ?? source.accessed_at ?? '';
}

function whySourceMatters(source: SourceRecord, topicCount: number, claimCount: number) {
  const usage = source.how_used ?? source.summary;
  return `${usage} It currently supports ${topicCount} ${topicCount === 1 ? 'topic' : 'topics'} and ${claimCount} ${claimCount === 1 ? 'claim' : 'claims'} in the public repository.`;
}

export function SourceLibrary({ sources, claims, topics }: SourceLibraryProps) {
  const [query, setQuery] = useState('');
  const [sourceType, setSourceType] = useState(allValue);
  const [publisher, setPublisher] = useState(allValue);
  const [reliability, setReliability] = useState(allValue);
  const [sortBy, setSortBy] = useState<SortOption>('recency');
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const sourceTypes = unique(sources.map((source) => source.source_type));
  const publishers = unique(sources.map((source) => source.publisher));
  const reliabilities = unique(sources.map((source) => source.reliability_category));
  const topicBySlug = useMemo(() => new Map(topics.map((topic) => [topic.slug, topic])), [topics]);
  const claimsBySourceId = useMemo(() => {
    const map = new Map<string, ClaimRecord[]>();
    for (const claim of claims) {
      for (const sourceId of claim.source_ids) {
        map.set(sourceId, [...(map.get(sourceId) ?? []), claim]);
      }
    }
    return map;
  }, [claims]);

  useEffect(() => {
    setQuery(initialParam('q'));
    setSourceType(initialAllParam('type'));
    setPublisher(initialAllParam('publisher'));
    setReliability(initialAllParam('reliability'));
    setSortBy(initialSortParam());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (sourceType !== allValue) params.set('type', sourceType);
    if (publisher !== allValue) params.set('publisher', publisher);
    if (reliability !== allValue) params.set('reliability', reliability);
    if (sortBy !== 'recency') params.set('sort', sortBy);
    const base = window.location.pathname;
    const next = params.toString() ? `${base}?${params.toString()}` : base;
    window.history.replaceState(null, '', next);
  }, [hydrated, publisher, query, reliability, sortBy, sourceType]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = sources.filter((source) => {
      const sourceClaims = claimsBySourceId.get(source.id) ?? [];
      const relatedTopics = source.related_topic_slugs?.map((slug) => topicBySlug.get(slug)?.title ?? slug) ?? [];
      const searchText = [
        source.title,
        source.publisher,
        source.summary,
        source.how_used,
        source.source_type,
        source.reliability_category,
        ...relatedTopics,
        ...sourceClaims.map((claim) => claim.text)
      ].join(' ').toLowerCase();

      return (
        (!normalized || searchText.includes(normalized)) &&
        (sourceType === allValue || source.source_type === sourceType) &&
        (publisher === allValue || source.publisher === publisher) &&
        (reliability === allValue || source.reliability_category === reliability)
      );
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'publisher') return compareText(a.publisher, b.publisher) || compareText(a.title, b.title);
      if (sortBy === 'title') return compareText(a.title, b.title);
      if (sortBy === 'claims') return (claimsBySourceId.get(b.id)?.length ?? 0) - (claimsBySourceId.get(a.id)?.length ?? 0) || compareText(a.title, b.title);
      return checkDate(b).localeCompare(checkDate(a)) || compareText(a.title, b.title);
    });
  }, [claimsBySourceId, publisher, query, reliability, sortBy, sourceType, sources, topicBySlug]);

  const activeFilters = [
    query.trim() ? `Search: ${query.trim()}` : null,
    sourceType !== allValue ? `Type: ${formatValue(sourceType)}` : null,
    publisher !== allValue ? `Publisher: ${publisher}` : null,
    reliability !== allValue ? `Reliability: ${formatValue(reliability)}` : null,
    sortBy !== 'recency' ? `Sort: ${formatValue(sortBy)}` : null
  ].filter((label): label is string => Boolean(label));

  const hasActiveFilters = activeFilters.length > 0;

  function clearFilters() {
    setQuery('');
    setSourceType(allValue);
    setPublisher(allValue);
    setReliability(allValue);
    setSortBy('recency');
    setExpanded(null);
  }

  return (
    <section aria-label="Source library browser">
      <div className="filter-panel filter-panel-wide source-filter-panel">
        <label className="mono">
          <span className="section-label">Search sources</span>
          <input aria-label="Search sources" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Publisher, title, topic, claim..." />
        </label>
        <label className="mono">
          <span className="section-label">Source type</span>
          <select aria-label="Source type" value={sourceType} onChange={(event) => setSourceType(event.target.value)}>
            <option value={allValue}>All types</option>
            {sourceTypes.map((item) => <option key={item} value={item}>{formatValue(item)}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Publisher</span>
          <select value={publisher} onChange={(event) => setPublisher(event.target.value)}>
            <option value={allValue}>All publishers</option>
            {publishers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Reliability</span>
          <select value={reliability} onChange={(event) => setReliability(event.target.value)}>
            <option value={allValue}>All labels</option>
            {reliabilities.map((item) => <option key={item} value={item}>{formatValue(item)}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Sort sources</span>
          <select aria-label="Sort sources" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <option value="recency">Most recently checked</option>
            <option value="publisher">Publisher A-Z</option>
            <option value="title">Title A-Z</option>
            <option value="claims">Highest claim count</option>
          </select>
        </label>
      </div>

      <div className="index-toolbar mono" aria-live="polite">
        <strong>{filtered.length} source {filtered.length === 1 ? 'record' : 'records'} shown</strong>
        <span>{hasActiveFilters ? 'Filtered source library' : 'All public source records'}</span>
        {hasActiveFilters ? <button type="button" onClick={clearFilters}>Clear source filters</button> : null}
      </div>

      {activeFilters.length ? (
        <div className="active-filter-list mono" aria-label="Active source filters">
          <strong>Active source filters</strong>
          {activeFilters.map((label) => <span className="active-filter" key={label}>{label}</span>)}
        </div>
      ) : null}

      <div className="link-list" aria-live="polite">
        {filtered.map((source, index) => {
          const isExpanded = expanded === source.id;
          const sourceClaims = claimsBySourceId.get(source.id) ?? [];
          const relatedTopics = source.related_topic_slugs?.map((slug) => topicBySlug.get(slug)).filter((topic): topic is TopicMeta => Boolean(topic)) ?? [];
          return (
            <article className="index-row source-row" key={source.id}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <div>
                <Link href={sourceRoute(source)}>{source.title}</Link>
                <div className="mono row-meta">
                  {source.publisher} · {formatValue(source.source_type)} · {formatValue(source.reliability_category)} · last evidence check {source.last_checked_at ?? source.accessed_at}
                </div>
                <p className="row-description">{source.summary}</p>
              </div>
              <span className="mono row-meta state">{sourceClaims.length} claims</span>
              <button
                className="disclosure-button"
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} source details for ${source.title}`}
                onClick={() => setExpanded(isExpanded ? null : source.id)}
              >
                {isExpanded ? '-' : '+'}
              </button>
              {isExpanded ? (
                <div className="expanded-row">
                  <strong>Why this source matters:</strong> {whySourceMatters(source, relatedTopics.length, sourceClaims.length)}
                  <div className="source-trail source-meta-trail mono">
                    <span>Accessed {source.accessed_at}</span>
                    <span>Status {source.status ?? 'tracked'}</span>
                    {source.archive_url ? <a href={source.archive_url}>archive copy</a> : null}
                    <a href={source.url}>open original</a>
                    <Link href={sourceRoute(source)}>source detail</Link>
                  </div>
                  <div className="source-trail source-link-trail">
                    <strong>Used by topics</strong>
                    {relatedTopics.length ? relatedTopics.map((topic) => <Link key={topic.slug} href={`/questions/${topic.slug}`}>{topic.title}</Link>) : <span>No topic links recorded</span>}
                  </div>
                  <div className="source-trail source-link-trail">
                    <strong>Referenced claims</strong>
                    {sourceClaims.length ? sourceClaims.slice(0, 4).map((claim) => <Link key={claim.id} href={`/questions/${claim.topic_slug}/claims`}>{claim.id}</Link>) : <span>No claim links recorded</span>}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No source records match those filters.</strong>
            <p>Try a publisher, topic name, source type, or clear the filters.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
