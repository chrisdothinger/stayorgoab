'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { TopicMeta } from '@/lib/types';

const allValue = 'all';

function formatState(state: string) {
  return state.replaceAll('_', ' ');
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function groupedByCategory(topics: TopicMeta[]) {
  const groups = new Map<string, TopicMeta[]>();
  for (const topic of topics) {
    groups.set(topic.category, [...(groups.get(topic.category) ?? []), topic]);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({ category, items }));
}

export function TopicSearch({ topics }: { topics: TopicMeta[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(allValue);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) setQuery(initialQuery);
  }, []);

  const categories = Array.from(new Set(topics.map((topic) => topic.category)));
  const states = Array.from(new Set(topics.map((topic) => topic.state)));
  const stateCounts = states.map((item) => ({ state: item, count: topics.filter((topic) => topic.state === item).length }));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topics.filter((topic) => {
      const text = [topic.title, topic.plain_question, topic.category, topic.summary, ...topic.keywords].join(' ').toLowerCase();
      return (!normalized || text.includes(normalized)) && (category === allValue || topic.category === category);
    });
  }, [category, query, topics]);

  const hasActiveFilters = query.trim() || category !== allValue;
  const categoryGroups = groupedByCategory(filtered);
  const activeFilterLabels = [
    query.trim() ? `Search: ${query.trim()}` : null,
    category !== allValue ? `Category: ${category}` : null
  ].filter((label): label is string => Boolean(label));

  function clearFilters() {
    setQuery('');
    setCategory(allValue);
    setExpanded(null);
  }

  return (
    <section aria-label="Topic search">
      <div className="filter-panel questions-filter-panel">
        <label className="mono">
          <span className="section-label">Search topics</span>
          <input aria-label="Search topics" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="CPP, treaty, referendum..." />
        </label>
        <label className="mono">
          <span className="section-label">Category</span>
          <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value={allValue}>All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="index-toolbar mono" aria-live="polite">
        <strong>{pluralize(filtered.length, 'question')} shown</strong>
        <span>{hasActiveFilters ? 'Filtered view' : 'All topics'}</span>
        {hasActiveFilters ? <button type="button" onClick={clearFilters}>Clear filters</button> : null}
      </div>

      {hasActiveFilters ? (
        <div className="active-filter-summary mono" aria-label="Active filters">
          <strong>Active filters</strong>
          {activeFilterLabels.map((label) => <span key={label}>{label}</span>)}
        </div>
      ) : null}

      <div className="link-list questions-category-list" aria-live="polite">
        {categoryGroups.map((group) => (
          <section className="question-category-section" key={group.category} aria-labelledby={`category-${group.category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}>
            <div className="question-category-heading">
              <h2 id={`category-${group.category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`} className="mono">{group.category}</h2>
              <span className="mono row-meta">{pluralize(group.items.length, 'question')}</span>
            </div>
            {group.items.map((topic) => {
              const isExpanded = expanded === topic.slug;
              const topicNumber = filtered.indexOf(topic) + 1;
              return (
                <article className="index-row" key={topic.slug}>
                  <span className="mono row-meta">{String(topicNumber).padStart(3, '0')}</span>
                  <div>
                    <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
                    <div className="mono row-meta">{topic.source_count} sources · {topic.claim_count} claims</div>
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
                        <span>{topic.source_count} sources</span>
                        <span>{topic.claim_count} claims</span>
                      </div>
                      <div className="source-trail mono dossier-nav compact-dossier-links" aria-label={`Dossier tabs for ${topic.title}`}>
                        <Link href={`/questions/${topic.slug}`}>Dossier</Link>
                        <Link href={`/questions/${topic.slug}/neutral`}>Neutral</Link>
                        <Link href={`/questions/${topic.slug}/pro`}>Pro</Link>
                        <Link href={`/questions/${topic.slug}/anti`}>Anti</Link>
                        <Link href={`/questions/${topic.slug}/claims`}>Claims</Link>
                        <Link href={`/questions/${topic.slug}/sources`}>Sources</Link>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        ))}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No questions match those filters.</strong>
            <p>Try CPP, referendum, treaty, currency, border, equalization, or clear majority.</p>
          </div>
        ) : null}
      </div>

      <footer className="questions-trust-meta mono" aria-label="Questions trust metadata">
        <div>
          <strong>{topics.length}</strong> topics · {stateCounts.map((item) => `${formatState(item.state)}: ${item.count}`).join(' · ')}
        </div>
        <div>Internal provenance check = this project’s automated public-repo check, not government or external audit.</div>
        <Link href="/audit">Public review trail</Link>
      </footer>
    </section>
  );
}
