import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DossierNav } from '@/components/DossierNav';
import { ReportPage } from '@/components/ReportPage';
import { hasMergedNeutralOverview } from '@/lib/dossier-contract';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  const content = loadRepositoryContent();
  return content.topics
    .filter((topic) => content.topicFiles[topic.slug].reports.neutral)
    .map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return {
    title: topic ? `${topic.title} — neutral synthesis` : 'Neutral synthesis',
    description: topic ? `Neutral synthesis status for the StayOrGoAB dossier: ${topic.title}` : 'Neutral synthesis status for a StayOrGoAB dossier.'
  };
}

export default async function NeutralReportPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  const files = topic ? content.topicFiles[topic.slug] : null;
  const report = files?.reports.neutral ?? null;
  if (!topic || !files || !report) notFound();

  if (!hasMergedNeutralOverview(topic.slug)) {
    return <ReportPage topic={topic} report={report} kind="neutral" />;
  }

  return (
    <>
      <section className="section report-hero">
        <div className="section-label mono">/ Merged synthesis</div>
        <h1>{topic.title}</h1>
        <p>The neutral synthesis has been merged into the overview so readers get the balanced answer in one place.</p>
      </section>

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

      <section className="section dossier-overview" aria-label="Merged neutral report notice">
        <article className="report-body overview-body">
          <h2>Neutral now lives in the overview</h2>
          <p>
            This page is kept as a safe legacy path, but the neutral role now belongs on the overview page: what each side gets right,
            what each side overstates, and what survives both arguments.
          </p>
          <p>
            <Link href={`/questions/${topic.slug}`}>Read the merged overview.</Link>
          </p>
        </article>
      </section>
    </>
  );
}
