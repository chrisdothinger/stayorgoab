import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export default function TopicSourcesPage({ params }: { params: { topicSlug: string } }) {
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === params.topicSlug);
  if (!topic) notFound();
  const sourceIds = content.topicFiles[topic.slug].sourceIds;
  const sources = content.sources.filter((source) => sourceIds.includes(source.id));
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Topic sources</div>
        <h1>{topic.title}</h1>
      </section>
      <section className="link-list">
        {sources.map((source, index) => (
          <article className="index-row" key={source.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <div>
              <Link href={`/sources/${source.id}`}>{source.title}</Link>
              <div className="mono row-meta">{source.publisher} · {source.source_type}</div>
            </div>
            <span className="mono row-meta state">{source.accessed_at}</span>
            <span className="mono">+</span>
          </article>
        ))}
      </section>
    </>
  );
}
