import { loadRepositoryContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Alberta independence glossary',
  description: 'Plain-language glossary for Alberta referendum, independence, separation, secession, constitutional, and public-policy terms.',
  pathname: '/glossary/',
  keywords: ['Alberta independence glossary', 'Alberta referendum terms', 'secession terms']
});

export default function GlossaryPage() {
  const { glossary } = loadRepositoryContent();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Glossary</div>
        <h1>Glossary</h1>
      </section>
      <section className="link-list">
        {glossary.map((term, index) => (
          <article className="data-row" key={term.term}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{term.term}</strong>
            <span>{term.definition}</span>
          </article>
        ))}
      </section>
    </>
  );
}
