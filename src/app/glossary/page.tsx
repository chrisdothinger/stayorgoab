import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Glossary' };

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
