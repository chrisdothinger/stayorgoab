'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { TopicMeta } from '@/lib/types';

const allValue = 'all';
const recencyOptions = [
  { value: allValue, label: 'Any check state' },
  { value: 'audited', label: 'Checked' },
  { value: 'pending', label: 'Pending check' }
];

function formatState(state: string) {
  return state.replaceAll('_', ' ');
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function TopicSearch({ topics }: { topics: TopicMeta[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(allValue);
  const [state, setState] = useState(allValue);
  const [sensitivity, setSensitivity] = useState(allValue);
  const [auditRecency, setAuditRecency] = useState(allValue);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) setQuery(initialQuery);
  }, []);

  const categories = Array.from(new Set(topics.map((topic) => topic.category)));
  const states = Array.from(new Set(topics.map((topic) => topic.state)));
  const sensitivities = Array.from(new Set(topics.map((topic) => topic.time_sensitivity)));
  const stateCounts = states.map((item) => ({ state: item, count: topics.filter((topic) => topic.state === item).length }));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topics.filter((topic) => {
      const text = [topic.title, topic.plain_question, topic.category, topic.summary, ...topic.keywords].join(' ').toLowerCase();
      const auditMatches =
        auditRecency === allValue ||
        (auditRecency === 'audited' && Boolean(topic.last_audited_at)) ||
        (auditRecency === 'pending' && !topic.last_audited_at);
      return (
        (!normalized || text.includes(normalized)) &&
        (category === allValue || topic.category === category) &&
        (state === allValue || topic.state === state) &&
        (sensitivity === allValue || topic.time_sensitivity === sensitivity) &&
        auditMatches
      );
    });
  }, [auditRecency, category, query, sensitivity, state, topics]);

  const hasActiveFilters = query.trim() || category !== allValue || state !== allValue || sensitivity !== allValue || auditRecency !== allValue;
  const activeFilterLabels = [
    query.trim() ? `Search: ${query.trim()}` : null,
    category !== allValue ? `Category: ${category}` : null,
    state !== allValue ? `State: ${formatState(state)}` : null,
    sensitivity !== allValue ? `Sensitivity: ${sensitivity}` : null,
    auditRecency !== allValue ? `Check: ${recencyOptions.find((option) => option.value === auditRecency)?.label ?? auditRecency}` : null
  ].filter((label): label is string => Boolean(label));

  function clearFilters() {
    setQuery('');
    setCategory(allValue);
    setState(allValue);
    setSensitivity(allValue);
    setAuditRecency(allValue);
    setExpanded(null);
  }

  return (
    <section aria-label="Topic search">
      <div className="filter-panel filter-panel-wide">
        <label className="mono">
          <span className="section-label">Search topics</span>
          <input aria-label="Search topics" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="CPP, treaty, referendum..." />
        </label>
        <label className="mono">
          <span className="section-label">Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value={allValue}>All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Dossier state</span>
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value={allValue}>All states</option>
            {states.map((item) => <option key={item}>{formatState(item)}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Time sensitivity</span>
          <select value={sensitivity} onChange={(event) => setSensitivity(event.target.value)}>
            <option value={allValue}>Any</option>
            {sensitivities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Provenance check</span>
          <select value={auditRecency} onChange={(event) => setAuditRecency(event.target.value)}>
            {recencyOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="index-toolbar mono" aria-live="polite">
        <strong>{pluralize(filtered.length, 'question')} shown</strong>
        <span>{hasActiveFilters ? 'Filtered view' : 'All topics'}</span>
        <span>Internal provenance check = this project’s automated public-repo check, not government or external audit.</span>
        <Link href="/audit">Public review trail</Link>
        {hasActiveFilters ? <button type="button" onClick={clearFilters}>Clear filters</button> : null}
      </div>

      {hasActiveFilters ? (
        <div className="active-filter-summary mono" aria-label="Active filters">
          <strong>Active filters</strong>
          {activeFilterLabels.map((label) => <span key={label}>{label}</span>)}
        </div>
      ) : null}

      <div className="maturity-legend" aria-label="Maturity legend">
        <span className="section-label mono">Maturity legend</span>
        {stateCounts.map((item) => (
          <span className="legend-item mono" key={item.state}>
            <strong>{formatState(item.state)}</strong> · {item.count}
          </span>
        ))}
      </div>

      <details className="category-disclosure" open>
        <summary className="mono">Browse categories</summary>
        <nav className="category-nav mono" aria-label="Question categories">
          <button
            aria-pressed={category === allValue}
            className={category === allValue ? 'active-filter' : undefined}
            type="button"
            onClick={() => setCategory(allValue)}
          >
            All {topics.length} questions
          </button>
          {categories.map((item) => (
            <button
              aria-pressed={category === item}
              className={category === item ? 'active-filter' : undefined}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item} ({topics.filter((topic) => topic.category === item).length})
            </button>
          ))}
        </nav>
      </details>

      <div className="link-list" aria-live="polite">
        {filtered.map((topic, index) => {
          const isExpanded = expanded === topic.slug;
          return (
            <article className="index-row" key={topic.slug}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <div>
                <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
                <div className="mono row-meta">{topic.category} · {topic.source_count} sources · {topic.claim_count} claims · {topic.last_audited_at ? `internal provenance check ${topic.last_audited_at}` : 'internal provenance check pending'}</div>
                <div className="question-row-actions mono">
                  <Link aria-label={`Open dossier: ${topic.title}`} href={`/questions/${topic.slug}`}>Open dossier</Link>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} summary for ${topic.title}`}
                    onClick={() => setExpanded(isExpanded ? null : topic.slug)}
                  >
                    {isExpanded ? 'Collapse summary' : 'Expand summary'}
                  </button>
                </div>
              </div>
              <span className="mono row-meta state">{formatState(topic.state)}</span>
              <button
                className="disclosure-button"
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Toggle'} visual summary for ${topic.title}`}
                onClick={() => setExpanded(isExpanded ? null : topic.slug)}
              >
                {isExpanded ? '-' : '+'}
              </button>
              {isExpanded ? (
                <div className="expanded-row">
                  <strong>Short answer:</strong> {topic.summary}
                  <div className="source-trail mono">
                    <span>State: {formatState(topic.state)}</span>
                    <span>Internal check: {topic.last_audited_at ?? 'pending provenance check'}</span>
                    <Link href="/audit">Public review trail</Link>
                    <span>{topic.source_count} sources</span>
                    <span>{topic.claim_count} claims</span>
                  </div>
                  <div className="source-trail mono">
                    <Link href={`/questions/${topic.slug}`}>open dossier</Link>
                    <Link href={`/questions/${topic.slug}/neutral`}>neutral report</Link>
                    <Link href={`/questions/${topic.slug}/pro`}>pro argument</Link>
                    <Link href={`/questions/${topic.slug}/anti`}>anti argument</Link>
                    <Link href={`/questions/${topic.slug}/claims`}>claim ledger</Link>
                    <Link href={`/questions/${topic.slug}/sources`}>sources</Link>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No questions match those filters.</strong>
            <p>Try CPP, referendum, treaty, currency, border, equalization, or clear majority.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
