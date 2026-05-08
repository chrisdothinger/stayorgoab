import { notFound } from 'next/navigation';
import { DossierHeader } from '@/components/DossierHeader';
import { DossierNav } from '@/components/DossierNav';
import { MarkdownText } from '@/components/MarkdownText';
import { loadRepositoryContent } from '@/lib/content';
import { absoluteUrl, topicKeywords, topicMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return topicMetadata(topic, 'overview');
}

export default async function TopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  if (!files.index) notFound();

  const isFullDossier = topic.state === 'full_dossier';
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.summary,
    url: absoluteUrl(`/questions/${topic.slug}/`),
    inLanguage: 'en-CA',
    keywords: topicKeywords(topic).join(', '),
    isPartOf: {
      '@type': 'WebSite',
      name: 'StayOrGoAB',
      url: absoluteUrl('/')
    },
    about: ['Alberta referendum', 'Alberta independence', 'Alberta separation']
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <DossierHeader topic={topic} sourceFile={`content/topics/${topic.slug}/index.mdx`} />
      {!isFullDossier ? (
        <section className="section">
          <p className="notice">This topic is intentionally sparse. It is listed so readers can see the research queue, but it is not a completed dossier yet.</p>
        </section>
      ) : null}

      {isFullDossier ? (
        <section className="section dossier-tab-strip">
          <DossierNav
            active="dossier"
            topic={topic}
            reports={{
              neutral: Boolean(files.reports.neutral),
              pro: Boolean(files.reports.pro),
              anti: Boolean(files.reports.anti)
            }}
          />
        </section>
      ) : null}

      <section className="section dossier-overview" aria-label="Dossier overview">
        <article className="report-body overview-body">
          <MarkdownText body={files.index.body} />
        </article>
      </section>
    </>
  );
}
