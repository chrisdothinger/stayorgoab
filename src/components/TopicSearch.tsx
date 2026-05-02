'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { TopicMeta } from '@/lib/types';

const allValue = 'all';

export function TopicSearch({ topics }: { topics: TopicMeta[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(allValue);
  const [state, setState] = useState(allValue);
  const [sensitivity, setSensitivity] = useState(allValue);
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = Array.from(new Set(topics.map((topic) => topic.category)));
  const states = Array.from(new Set(topics.map((topic) => topic.state)));
  const sensitivities = Array.from(new Set(topics.map((topic) => topic.time_sensitivity)));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topics.filter((topic) => {
      const text = [topic.title, topic.plain_question, topic.category, topic.summary, ...topic.keywords].join(' ').toLowerCase();
      return (
        (!normalized || text.includes(normalized)) &&
        (category === allValue || topic.category === category) &&
        (state === allValue || topic.state === state) &&
        (sensitivity === allValue || topic.time_sensitivity === sensitivity)
      );
    });
  }, [category, query, sensitivity, state, topics]);

  return (
    <section aria-label="Topic search">
      <div className="filter-panel">
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
          <span className="section-label">State</span>
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value={allValue}>All states</option>
            {states.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mono">
          <span className="section-label">Time sensitivity</span>
          <select value={sensitivity} onChange={(event) => setSensitivity(event.target.value)}>
            <option value={allValue}>Any</option>
            {sensitivities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <nav className="category-nav mono" aria-label="Question categories">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)}>
            {item} ({topics.filter((topic) => topic.category === item).length})
          </button>
        ))}
        <button type="button" onClick={() => setCategory(allValue)}>All ({topics.length})</button>
      </nav>

      <div className="link-list" aria-live="polite">
        {filtered.map((topic, index) => {
          const isExpanded = expanded === topic.slug;
          return (
            <article className="index-row" key={topic.slug}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <div>
                <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
                <div className="mono row-meta">{topic.category} · {topic.source_count} sources · {topic.claim_count} claims</div>
              </div>
              <span className="mono row-meta state">{topic.state.replaceAll('_', ' ')}</span>
              <button
                className="disclosure-button"
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${topic.category}: ${topic.title}`}
                onClick={() => setExpanded(isExpanded ? null : topic.slug)}
              >
                {isExpanded ? '-' : '+'}
              </button>
              {isExpanded ? (
                <div className="expanded-row">
                  <strong>Short answer:</strong> {topic.summary}
                  <div className="source-trail mono">
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
      </div>
    </section>
  );
}
