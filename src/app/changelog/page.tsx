import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Changelog' };

export default function ChangelogPage() {
  const { changelog } = loadRepositoryContent();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Changelog</div>
        <h1>Changelog</h1>
      </section>
      <section className="link-list">
        {changelog.map((entry, index) => (
          <article className="data-row" key={String(entry.id)}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{String(entry.date)}</strong>
            <span>{String(entry.summary)}</span>
          </article>
        ))}
      </section>
    </>
  );
}
