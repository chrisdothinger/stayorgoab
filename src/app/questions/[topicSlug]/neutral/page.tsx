import { notFound } from 'next/navigation';
import { MarkdownText } from '@/components/MarkdownText';
import { loadRepositoryContent } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() {
  const content = loadRepositoryContent();
  return content.topics
    .filter((topic) => content.topicFiles[topic.slug].reports.neutral)
    .map((topic) => ({ topicSlug: topic.slug }));
}

export default function NeutralReportPage({ params }: { params: { topicSlug: string } }) {
  const content = loadRepositoryContent();
  const topic = content.topics.find((item) => item.slug === params.topicSlug);
  const report = topic ? content.topicFiles[topic.slug].reports.neutral : null;
  if (!topic || !report) notFound();
  return <section className="section"><div className="section-label mono">/ Neutral report</div><h1>{report.title}</h1><MarkdownText body={report.body} /></section>;
}
