import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageTrust } from '@/components/PageTrust';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  return loadRepositoryContent().sources.map((source) => ({ sourceSlug: source.slug ?? source.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ sourceSlug: string }> }) {
  const { sourceSlug } = await params;
  const source = loadRepositoryContent().sources.find((item) => (item.slug ?? item.id) === sourceSlug || item.id === sourceSlug);
  return {
    title: source ? `${source.title} — source record` : 'Source record',
    description: source?.summary ?? 'A StayOrGoAB source record.'
  };
}

function formatValue(value: string) {
  return value.replaceAll('_', ' ');
}

function sourceCheckDate(source: { last_checked_at?: string | null; accessed_at: string }) {
  return source.last_checked_at ?? source.accessed_at;
}

export default async function SourceDetailPage({ params }: { params: Promise<{ sourceSlug: string }> }) {
  const { sourceSlug } = await params;
  const content = loadRepositoryContent();
  const source = content.sources.find((item) => (item.slug ?? item.id) === sourceSlug || item.id === sourceSlug);
  if (!source) notFound();

  const claims = content.claims.filter((claim) => claim.source_ids.includes(source.id));
  const topics = source.related_topic_slugs
    ?.map((slug) => content.topics.find((topic) => topic.slug === slug))
    .filter((topic): topic is (typeof content.topics)[number] => Boolean(topic)) ?? [];
  const checkDate = sourceCheckDate(source);
  const whyItMatters = `${source.how_used ?? source.summary} This record currently supports ${topics.length} ${topics.length === 1 ? 'topic' : 'topics'} and ${claims.length} ${claims.length === 1 ? 'claim' : 'claims'} in the public repository.`;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Source</div>
        <h1>{source.title}</h1>
        <p>{source.summary}</p>
        <p className="audit-note mono">Last evidence check means this project’s automated public-repository check; it is not a government audit, regulator audit, external audit, or assurance engagement.</p>
        <div className="source-trail mono">
          <span>{source.publisher}</span>
          <span>{formatValue(source.source_type)}</span>
          <span>Last evidence check {checkDate}</span>
          <span>Accessed {source.accessed_at}</span>
          <a href={source.url}>Open original</a>
          {source.archive_url ? <a href={source.archive_url}>Open archive copy</a> : null}
          <Link href="/sources/">Back to source library</Link>
        </div>
      </section>

      <PageTrust
        sourceStatus={`${source.publisher} source record checked ${checkDate}`}
        reviewStatus="Source usage is tied to public topics and claim records in the repository."
        metrics={[
          { label: 'Source type', value: formatValue(source.source_type) },
          { label: 'Topics using source', value: topics.length },
          { label: 'Claims referenced', value: claims.length }
        ]}
        sourceHref="/sources/"
        sourceLabel="Source library evidence"
        reviewHref="/audit/"
        reviewLabel="Open review trail"
        links={[{ href: '/repo/', label: 'Repository evidence' }]}
      />

      <section className="section source-detail-grid" aria-label="Source usage details">
        <article className="briefing-card">
          <div className="section-label mono">Why this source matters</div>
          <p>{whyItMatters}</p>
        </article>
        <article className="briefing-card">
          <div className="section-label mono">Evidence details</div>
          <p>This source row records the publisher, source type, reliability label, access date, original URL, and any archive copy available to this project.</p>
        </article>
      </section>

      <section className="section" aria-label="Used by topics">
        <div className="section-label mono">Used by topics</div>
        <div className="link-list">
          {topics.length ? topics.map((topic, index) => (
            <article className="data-row source-detail-row" key={topic.slug}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <Link href={`/questions/${topic.slug}/`}>{topic.title}</Link>
              <span>{topic.summary}</span>
            </article>
          )) : <p>No topic links recorded.</p>}
        </div>
      </section>

      <section className="section" aria-label="Referenced claims">
        <div className="section-label mono">Referenced claims</div>
        <div className="link-list">
          {claims.length ? claims.map((claim, index) => (
            <article className="data-row" key={claim.id}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <strong>{claim.topic_slug}</strong>
              <span>{claim.text}</span>
            </article>
          )) : <p>No claim links recorded.</p>}
        </div>
      </section>
    </>
  );
}
