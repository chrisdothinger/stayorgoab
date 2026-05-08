import { notFound } from 'next/navigation';
import { ReportPage } from '@/components/ReportPage';
import { loadRepositoryContent } from '@/lib/content';
import { topicMetadata } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  const content = loadRepositoryContent();
  return content.topics
    .filter((topic) => content.topicFiles[topic.slug].reports.anti)
    .map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = loadRepositoryContent().topics.find((item) => item.slug === topicSlug);
  return topicMetadata(topic, 'anti');
}

export default async function AntiReportPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === topicSlug);
  const files = topic ? content.topicFiles[topic.slug] : null;
  const report = files?.reports.anti ?? null;
  if (!topic || !files || !report) notFound();
  return <ReportPage topic={topic} report={report} kind="anti" />;
}
