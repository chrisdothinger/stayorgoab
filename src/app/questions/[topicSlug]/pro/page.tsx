import { notFound } from 'next/navigation';
import { ReportPage } from '@/components/ReportPage';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  const content = loadRepositoryContent();
  return content.topics
    .filter((topic) => content.topicFiles[topic.slug].reports.pro)
    .map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return {
    title: topic ? `${topic.title} — pro brief` : 'Pro brief',
    description: topic ? `The strongest fair pro-independence argument for: ${topic.title}` : 'A source-backed pro-independence debate brief.'
  };
}

export default async function ProReportPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  const files = topic ? content.topicFiles[topic.slug] : null;
  const report = files?.reports.pro ?? null;
  if (!topic || !files || !report) notFound();
  return <ReportPage topic={topic} report={report} kind="pro" />;
}
