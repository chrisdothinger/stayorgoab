'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ClaimRecord, SourceRecord, TopicMeta } from '@/lib/types';

const allValue = 'all';

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

export function SourceLibrary({ sources, claims, topics }: SourceLibraryProps) {
  const [query, setQuery] = useState('');
  const [sourceType, setSourceType] = useState(allValue);
  const [publisher, setPublisher] = useState(allValue);
  const [reliability, setReliability] = useState(allValue);
  const [stance, setStance] = useState(allValue);
  const [expanded, setExpanded] = useState<string | null>(null);

  const sourceTypes = unique(sources.map((source) => source.source_type));
  const publishers = unique(sources.map((source) => source.publisher));
  const reliabilities = unique(sources.map((source) => source.reliability_category));
  const stances = unique(sources.map((source) => source.stance));
  const topicBySlug = useMemo(() => new Map(topics.map((topic) => [topic.slug, topic])), [topics]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sources.filter((source) => {
      const sourceClaims = claims.filter((claim) => claim.source_ids.includes(source.id));
      const relatedTopics = source.related_topic_slugs?.map((slug) => topicBySlug.get(slug)?.title ?? slug) ?? [];
      const searchText = [
        source.title,
        source.publisher,
        source.summary,
        source.how_used,
        source.source_type,
        source.reliability_category,
        source.stance,
        ...relatedTopics,
        ...sourceClaims.map((claim) => claim.text)
      ].join(' ').toLowerCase();

      return (
        (!normalized || searchText.includes(normalized)) &&
        (sourceType === allValue || source.source_type === sourceType) &&
        (publisher === allValue || source.publisher === publisher) &&
        (reliability === allValue || source.reliability_category === reliability) &&
        (stance === allValue || source.stance === stance)
      );
    });
  }, [claims, publisher, query, reliability, sourceType, sources, stance, topicBySlug]);

  const hasActiveFilters = query.trim() || sourceType !== allValue || publisher !== allValue || reliability !== allValue || stance !== allValue;

  function clearFilters() {
    setQuery('');
    setSourceType(allValue);
    setPublisher(allValue);
    setReliability(allValue);
    setStance(allValue);
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
          <span className="section-label">Stance</span>
          <select value={stance} onChange={(event) => setStance(event.target.value)}>
            <option value={allValue}>All stances</option>
            {stances.map((item) => <option key={item} value={item}>{formatValue(item)}</option>)}
          </select>
        </label>
      </div>

      <div className="index-toolbar mono" aria-live="polite">
        <strong>{filtered.length} source {filtered.length === 1 ? 'record' : 'records'} shown</strong>
        <span>{hasActiveFilters ? 'Filtered source library' : 'All public source records'}</span>
        {hasActiveFilters ? <button type="button" onClick={clearFilters}>Clear source filters</button> : null}
      </div>

      <div className="audit-note mono">
        Internal provenance checks are this project’s automated public-repository checks — not government audits, regulator audits, external audits, or assurance engagements.
      </div>

      <div className="link-list" aria-live="polite">
        {filtered.map((source, index) => {
          const isExpanded = expanded === source.id;
          const sourceClaims = claims.filter((claim) => claim.source_ids.includes(source.id));
          const relatedTopics = source.related_topic_slugs?.map((slug) => topicBySlug.get(slug)).filter((topic): topic is TopicMeta => Boolean(topic)) ?? [];
          return (
            <article className="index-row source-row" key={source.id}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <div>
                <Link href={sourceRoute(source)}>{source.title}</Link>
                <div className="mono row-meta">
                  {source.publisher} · {formatValue(source.source_type)} · {formatValue(source.reliability_category)} · internal provenance check {source.last_checked_at ?? source.accessed_at}
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
                  <strong>How used:</strong> {source.how_used ?? source.summary}
                  <div className="source-trail mono">
                    <span>Accessed {source.accessed_at}</span>
                    <span>Status {source.status ?? 'tracked'}</span>
                    {source.archive_url ? <a href={source.archive_url}>archive copy</a> : null}
                    <a href={source.url}>open original</a>
                    <Link href={sourceRoute(source)}>source detail</Link>
                  </div>
                  <div className="source-trail mono">
                    <strong>Used by topics</strong>
                    {relatedTopics.length ? relatedTopics.map((topic) => <Link key={topic.slug} href={`/questions/${topic.slug}`}>{topic.title}</Link>) : <span>No topic links recorded</span>}
                  </div>
                  <div className="source-trail mono">
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
