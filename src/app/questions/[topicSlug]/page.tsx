import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuditMeta } from '@/components/AuditMeta';
import { MarkdownText } from '@/components/MarkdownText';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return loadRepositoryContent().topics.map((topic) => ({ topicSlug: topic.slug }));
}

export function generateMetadata({ params }: { params: { topicSlug: string } }) {
  const topic = loadRepositoryContent().topics.find((item) => item.slug === params.topicSlug);
  return { title: topic?.title ?? 'Topic' };
}

export default function TopicPage({ params }: { params: { topicSlug: string } }) {
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === params.topicSlug);
  if (!topic) notFound();
  const files = content.topicFiles[topic.slug];
  if (!files.index) notFound();

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ {topic.category}</div>
        <h1>{topic.title}</h1>
        <p>{topic.summary}</p>
        <AuditMeta
          sourceCount={topic.source_count}
          claimCount={topic.claim_count}
          audited={topic.last_audited_at}
          debated={topic.last_debated_at}
          sourceFile={`content/topics/${topic.slug}/index.mdx`}
        />
      </section>
      <section className="section grid-two">
        <nav className="category-nav mono" aria-label="Topic sections">
          <Link href={`/questions/${topic.slug}/neutral`}>Neutral</Link>
          <Link href={`/questions/${topic.slug}/pro`}>Pro</Link>
          <Link href={`/questions/${topic.slug}/anti`}>Anti</Link>
          <Link href={`/questions/${topic.slug}/claims`}>Claims</Link>
          <Link href={`/questions/${topic.slug}/sources`}>Sources</Link>
        </nav>
        <MarkdownText body={files.index.body} />
      </section>
    </>
  );
}
