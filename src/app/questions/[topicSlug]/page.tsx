import { notFound } from 'next/navigation';
import { AuditMeta } from '@/components/AuditMeta';
import { DossierNav } from '@/components/DossierNav';
import { MarkdownText } from '@/components/MarkdownText';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return { title: topic?.title ?? 'Topic' };
}

export default async function TopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  if (!files.index) notFound();

  const isFullDossier = topic.state === 'full_dossier';

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ {topic.category}</div>
        <h1>{topic.title}</h1>
        <p>{topic.summary}</p>
        {!isFullDossier ? (
          <p className="notice">This topic is intentionally sparse. It is listed so readers can see the research queue, but it is not a completed dossier yet.</p>
        ) : null}
        <AuditMeta
          sourceCount={topic.source_count}
          claimCount={topic.claim_count}
          audited={topic.last_audited_at}
          debated={topic.last_debated_at}
          sourceFile={`content/topics/${topic.slug}/index.mdx`}
        />
      </section>
      <section className="section grid-two">
        <DossierNav
          active="dossier"
          topic={topic}
          reports={{
            neutral: Boolean(files.reports.neutral),
            pro: Boolean(files.reports.pro),
            anti: Boolean(files.reports.anti)
          }}
        />
        <MarkdownText body={files.index.body} />
      </section>
    </>
  );
}
