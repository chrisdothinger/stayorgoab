import { SourceLibrary } from '@/components/SourceLibrary';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const { sources, claims, topics } = loadRepositoryContent();

  return (
    <>
      <section className="section sources-hero">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Search the official, court, primary, advocacy, media, and institutional records used by topic dossiers and claim ledgers.</p>
      </section>

      <SourceLibrary sources={sources} claims={claims} topics={topics} />
    </>
  );
}
