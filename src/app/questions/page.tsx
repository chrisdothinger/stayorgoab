import { TopicSearch } from '@/components/TopicSearch';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Questions' };

export default function QuestionsPage() {
  const { topics } = loadRepositoryContent();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Questions</div>
        <h1>The questions that matter</h1>
        <p>Each topic is a living research dossier with pro-independence arguments, anti-independence / pro-federation arguments, neutral synthesis, claims, sources, audits, and redebate history.</p>
      </section>
      <TopicSearch topics={topics} />
    </>
  );
}
