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
        <p>Each topic is a living research dossier with a balanced overview, pro-independence and anti-independence / pro-federation briefs, claims, sources, public review logs, and redebate history. Refreshed dossiers merge the neutral synthesis into the overview instead of sending readers to a separate neutral report.</p>
      </section>
      <TopicSearch topics={topics} />
    </>
  );
}
