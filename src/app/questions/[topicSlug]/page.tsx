import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuditMeta } from '@/components/AuditMeta';
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
  const reportLinks = [
    files.reports.neutral ? { href: `/questions/${topic.slug}/neutral`, label: 'Neutral synthesis', detail: 'Best balanced read after the overview.' } : null,
    files.reports.pro ? { href: `/questions/${topic.slug}/pro`, label: 'Pro brief', detail: 'Strongest fair independence-side argument.' } : null,
    files.reports.anti ? { href: `/questions/${topic.slug}/anti`, label: 'Anti brief', detail: 'Strongest fair pro-federation argument.' } : null,
    { href: `/questions/${topic.slug}/claims`, label: 'Claims', detail: 'Check the claim map.' },
    { href: `/questions/${topic.slug}/sources`, label: 'Sources', detail: 'Open the source list.' }
  ].filter((link): link is { href: string; label: string; detail: string } => Boolean(link));

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

      <section className="section dossier-overview" aria-label="Dossier overview">
        <article className="report-body overview-body">
          <MarkdownText body={files.index.body} />
        </article>

        {isFullDossier ? (
          <aside className="deep-dive-panel" aria-label="Optional deeper reports">
            <div>
              <div className="section-label mono">Optional deep dive</div>
              <h2>Want to test the argument?</h2>
              <p>The overview is the main answer. These pages are for readers who want the side-by-side briefs or evidence trail.</p>
            </div>
            <nav className="deep-dive-links mono" aria-label="Dossier deep-dive links">
              {reportLinks.map((link) => (
                <Link href={link.href} key={link.href}>
                  <strong>{link.label}</strong>
                  <span>{link.detail}</span>
                </Link>
              ))}
            </nav>
          </aside>
        ) : null}
      </section>
    </>
  );
}
