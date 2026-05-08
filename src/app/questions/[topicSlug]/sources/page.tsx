import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DossierNav } from '@/components/DossierNav';
import { loadRepositoryContent } from '@/lib/content';
import { topicMetadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return topicMetadata(topic, 'sources');
}

export default async function TopicSourcesPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  const sourceIds = files.sourceIds;
  const sources = content.sources.filter((source) => sourceIds.includes(source.id));
  const topicClaims = content.claims.filter((claim) => claim.topic_slug === topic.slug);
  const claimsBySourceId = new Map<string, number>();
  for (const claim of topicClaims) {
    for (const sourceId of claim.source_ids) {
      claimsBySourceId.set(sourceId, (claimsBySourceId.get(sourceId) ?? 0) + 1);
    }
  }
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Topic sources</div>
        <h1>{topic.title}</h1>
        <p>Source records used by this dossier, kept beside the report and claim tabs for the same question. Each row shows source type, reliability, evidence-check date, and claim use.</p>
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
              <Link href={`/sources/${source.slug ?? source.id}`}>{source.title}</Link>
              <div className="mono row-meta">
                {source.publisher} · {source.source_type.replaceAll('_', ' ')} · {(source.reliability_category ?? 'unrated').replaceAll('_', ' ')} · last evidence check {source.last_checked_at ?? source.accessed_at}
              </div>
              <p className="row-description">{source.summary}</p>
            </div>
            <span className="mono row-meta state">{claimsBySourceId.get(source.id) ?? 0} claims</span>
            <span className="mono">+</span>
          </article>
        ))}
        {sources.length === 0 ? (
          <article className="index-row">
            <span className="mono row-meta">000</span>
            <div>
              <strong>No source records listed</strong>
              <p className="row-description">Check the topic source map before treating this dossier as complete.</p>
            </div>
            <span className="mono">!</span>
          </article>
        ) : null}
      </section>
    </>
  );
}
