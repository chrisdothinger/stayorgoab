import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DossierNav } from '@/components/DossierNav';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return {
    title: topic ? `${topic.title} — sources` : 'Topic sources',
    description: topic ? `Source records used in the StayOrGoAB dossier for: ${topic.title}` : 'Source records used in a StayOrGoAB dossier.'
  };
}

export default async function TopicSourcesPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  const sourceIds = files.sourceIds;
  const sources = content.sources.filter((source) => sourceIds.includes(source.id));
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Topic sources</div>
        <h1>{topic.title}</h1>
        <p>Source records used by this dossier, kept beside the report and claim tabs for the same question.</p>
      </section>
      <section className="section dossier-tab-strip">
        <DossierNav
          active="sources"
          topic={topic}
          reports={{
            neutral: Boolean(files.reports.neutral),
            pro: Boolean(files.reports.pro),
            anti: Boolean(files.reports.anti)
          }}
        />
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
