import { TopicSearch } from '@/components/TopicSearch';
import { loadRepositoryContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Alberta independence questions',
  description: 'Browse source-backed questions about Alberta referendum mechanics, Alberta independence, separation, public services, economy, borders, rights, and treaty issues.',
  pathname: '/questions/',
  keywords: ['Alberta independence questions', 'Alberta separation questions', 'Alberta referendum questions']
});

export default function QuestionsPage() {
  const { topics } = loadRepositoryContent();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Questions</div>
        <h1>The questions that matter</h1>
        <p>Critical questions about Alberta separation. Each dossier opens with a neutral overview, then lets readers inspect the pro and anti briefs, claim map, and source map.</p>
      </section>
      <TopicSearch topics={topics} />
    </>
  );
}
