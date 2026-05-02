import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const { sources, claims } = loadRepositoryContent();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Official, court, primary, advocacy, media, and institutional records used by topic dossiers and claim ledgers.</p>
      </section>
      <section className="link-list">
        {sources.map((source, index) => (
          <article className="index-row" key={source.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <div>
              <Link href={`/sources/${source.id}`}>{source.title}</Link>
              <div className="mono row-meta">{source.publisher} · {source.source_type} · {source.accessed_at}</div>
            </div>
            <span className="mono row-meta state">{claims.filter((claim) => claim.source_ids.includes(source.id)).length} claims</span>
            <span className="mono">+</span>
          </article>
        ))}
      </section>
    </>
  );
}
