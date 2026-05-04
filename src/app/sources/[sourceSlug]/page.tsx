import { notFound } from 'next/navigation';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().sources.map((source) => ({ sourceSlug: source.id }));
}

export function generateMetadata({ params }: { params: { sourceSlug: string } }) {
  const source = loadRepositoryContent().sources.find((item) => item.id === params.sourceSlug);
  return { title: source?.title ?? 'Source' };
}

export default function SourceDetailPage({ params }: { params: { sourceSlug: string } }) {
  const content = loadRepositoryContent();
  const source = content.sources.find((item) => item.id === params.sourceSlug);
  if (!source) notFound();
  const claims = content.claims.filter((claim) => claim.source_ids.includes(source.id));
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Source</div>
        <h1>{source.title}</h1>
        <p>{source.summary}</p>
        <p className="audit-note mono">Agentic repository check means this project’s automated/public-repo provenance check; it is not a government audit, regulator audit, external audit, or assurance engagement.</p>
        <div className="source-trail mono">
          <span>{source.publisher}</span>
          <span>{source.source_type}</span>
          <span>Agentic repository check {source.last_checked_at ?? source.accessed_at}</span>
          <span>Accessed {source.accessed_at}</span>
          <a href={source.url}>Open original</a>
        </div>
      </section>
      <section className="link-list">
        {claims.map((claim, index) => (
          <article className="data-row" key={claim.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{claim.topic_slug}</strong>
            <span>{claim.text}</span>
          </article>
        ))}
      </section>
    </>
  );
}
