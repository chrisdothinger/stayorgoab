import { notFound } from 'next/navigation';
import { MarkdownText } from '@/components/MarkdownText';
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
  const report = topic ? content.topicFiles[topic.slug].reports.anti : null;
  if (!topic || !report) notFound();
  return <section className="section"><div className="section-label mono">/ Anti-independence case</div><h1>{report.title}</h1><MarkdownText body={report.body} /></section>;
}
