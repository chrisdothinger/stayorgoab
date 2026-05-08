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
  return topicMetadata(topic, 'claims');
}

function formatStatus(status: string) {
  return status.replaceAll('_', ' ');
}

export default async function ClaimsPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  const claims = content.claims.filter((claim) => claim.topic_slug === topic.slug);
  const sourceById = new Map(content.sources.map((source) => [source.id, source]));

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Claims and evidence</div>
        <h1>{topic.title}</h1>
        <p>Key claims used in this dossier, paired with the sources that support them. Claim status and risk labels come from the public claim ledger for this topic.</p>
      </section>
      <section className="section dossier-tab-strip">
        <DossierNav
          active="claims"
          topic={topic}
          reports={{
            neutral: Boolean(files.reports.neutral),
            pro: Boolean(files.reports.pro),
            anti: Boolean(files.reports.anti)
          }}
        />
      </section>
      <section className="claim-ledger" aria-label="Dossier claims">
        {claims.map((claim, index) => (
          <article className="claim-row" key={claim.id}>
            <div className="mono row-meta claim-number">{String(index + 1).padStart(3, '0')}</div>
            <div className="claim-main">
              <div className="claim-title-row">
                <strong>{claim.text}</strong>
                <span className="claim-status">{formatStatus(claim.status)}</span>
                <span className="claim-status">{formatStatus(claim.risk)} risk</span>
              </div>
              <div className="claim-sources" aria-label={`Sources for claim ${index + 1}`}>
                <span>Sources:</span>
                {claim.source_ids.length ? (
                  <ul>
                    {claim.source_ids.map((sourceId) => {
                      const source = sourceById.get(sourceId);
                      return (
                        <li key={sourceId}>
                          {source?.slug ? (
                            <Link href={`/sources/${source.slug}`}>{source.title}</Link>
                          ) : (
                            <span>{source?.title ?? sourceId}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <span>None listed</span>
                )}
              </div>
            </div>
          </article>
        ))}
        {claims.length === 0 ? (
          <article className="claim-row">
            <div className="mono row-meta claim-number">000</div>
            <div className="claim-main">
              <div className="claim-title-row"><strong>No public claim records are listed for this dossier.</strong></div>
              <p>Check the topic claim ledger before treating this dossier as complete.</p>
            </div>
          </article>
        ) : null}
      </section>
    </>
  );
}
