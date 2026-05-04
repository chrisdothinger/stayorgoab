import { notFound } from 'next/navigation';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export default async function ClaimsPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const claims = content.claims.filter((claim) => claim.topic_slug === topic.slug);
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Claim ledger</div>
        <h1>{topic.title}</h1>
      </section>
      <section className="link-list">
        {claims.map((claim, index) => (
          <article className="index-row" key={claim.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{claim.text}</strong>
            <span className="mono row-meta state">{claim.status}</span>
            <span className="mono">+</span>
            <p className="expanded-row mono">Sources: {claim.source_ids.join(', ') || 'none'} · Risk: {claim.risk}</p>
          </article>
        ))}
      </section>
    </>
  );
}
