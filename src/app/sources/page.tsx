import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const { sources, claims, topics } = loadRepositoryContent();
  const sourceTypes = Array.from(new Set(sources.map((source) => source.source_type))).sort();
  const reliability = Array.from(new Set(sources.map((source) => source.reliability_category).filter(Boolean))).sort();

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Official, court, primary, advocacy, media, and institutional records used by topic dossiers and claim ledgers.</p>
      </section>

      <section className="section ops-grid" aria-label="Source summary">
        <div className="metric-card">
          <span className="mono row-meta">Records</span>
          <strong>{sources.length}</strong>
          <p>checked source records in the public source map</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Types</span>
          <strong>{sourceTypes.length}</strong>
          <p>{sourceTypes.join(' · ')}</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Reliability labels</span>
          <strong>{reliability.length}</strong>
          <p>primary/legal/news/stakeholder categories retained for filtering</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Topics</span>
          <strong>{topics.length}</strong>
          <p>topic links validated against source records</p>
        </div>
      </section>

      <section className="link-list">
        {sources.map((source, index) => (
          <article className="index-row" key={source.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <div>
              <Link href={`/sources/${source.slug ?? source.id}`}>{source.title}</Link>
              <div className="mono row-meta">{source.publisher} · {source.source_type} · {source.reliability_category} · checked {source.last_checked_at ?? source.accessed_at}</div>
              <p className="expanded-row">{source.summary}</p>
            </div>
            <span className="mono row-meta state">{claims.filter((claim) => claim.source_ids.includes(source.id)).length} claims</span>
            <span className="mono">+</span>
          </article>
        ))}
      </section>
    </>
  );
}
