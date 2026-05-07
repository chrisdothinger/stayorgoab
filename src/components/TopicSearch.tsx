'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { TopicMeta } from '@/lib/types';

const allValue = 'all';

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
                <article className="index-row question-index-row" key={topic.slug}>
                  <span className="mono row-meta">{String(topicNumber).padStart(3, '0')}</span>
                  <div className="question-index-main">
                    <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
                    <div className="mono row-meta">{topic.source_count} sources · {topic.claim_count} claims</div>
                    <div className="question-row-actions mono">
                      <Link className="open-dossier-link" aria-label={`Open dossier: ${topic.title}`} href={`/questions/${topic.slug}`}>Open dossier</Link>
                      <button
                        className="summary-toggle"
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} short answer for ${topic.title}`}
                        onClick={() => setExpanded(isExpanded ? null : topic.slug)}
                      >
                        {isExpanded ? 'Hide short answer' : 'Show short answer'}
                      </button>
                    </div>
                  </div>
                  {isExpanded ? (
                    <div className="expanded-row question-summary-row">
                      <strong>Short answer:</strong> {topic.summary}
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
          <strong>{topics.length}</strong> source-backed questions maintained in the public repository.
        </div>
        <div>Last evidence check = this project’s automated public-repo check, not government or external audit.</div>
        <Link href="/audit">Review trail</Link>
      </footer>
    </section>
  );
}
