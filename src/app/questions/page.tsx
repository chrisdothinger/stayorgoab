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
        <p>Critical questions about Alberta separation. Each dossier has pro and anti arguments, plus a neutral overview that summarizes the two sides.</p>
      </section>
      <TopicSearch topics={topics} />
    </>
  );
}
