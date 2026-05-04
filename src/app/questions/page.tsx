import { PageTrust } from '@/components/PageTrust';
import { TopicSearch } from '@/components/TopicSearch';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Questions' };

export default function QuestionsPage() {
  const { topics } = loadRepositoryContent();
  const fullDossiers = topics.filter((topic) => topic.state === 'full_dossier').length;
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Questions</div>
        <h1>The questions that matter</h1>
        <p>Each topic is a living research dossier with pro-independence arguments, anti-independence / pro-federation arguments, neutral synthesis, claims, sources, public review logs, and redebate history.</p>
      </section>
      <PageTrust
        sourceStatus={`${topics.length} tracked topics; ${fullDossiers} full dossiers currently source-backed.`}
        reviewStatus="Question rows link to the public review trail and internal provenance-check records."
        metrics={[
          { label: 'Topics', value: topics.length },
          { label: 'Full dossiers', value: fullDossiers }
        ]}
        sourceLabel="Inspect sources"
        reviewLabel="Open review log"
      />
      <TopicSearch topics={topics} />
    </>
  );
}
