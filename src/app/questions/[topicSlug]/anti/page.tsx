import { notFound } from 'next/navigation';
import { ReportPage } from '@/components/ReportPage';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  const content = loadRepositoryContent();
  return content.topics
    .filter((topic) => content.topicFiles[topic.slug].reports.anti)
    .map((topic) => ({ topicSlug: topic.slug }));
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
