import { SourceLibrary } from '@/components/SourceLibrary';
import { loadRepositoryContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Alberta independence source library',
  description: 'Search official, court, academic, media, advocacy, and institutional sources used by StayOrGoAB Alberta referendum, independence, and separation dossiers.',
  pathname: '/sources/',
  keywords: ['Alberta independence sources', 'Alberta separation evidence', 'Alberta referendum sources']
});

export default function SourcesPage() {
  const { sources, claims, topics } = loadRepositoryContent();

  return (
    <>
      <section className="section sources-hero">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Search the official, court, primary, advocacy, media, and institutional records used by topic dossiers. Each source record links back to the public topics and claims that rely on it.</p>
      </section>

      <SourceLibrary sources={sources} claims={claims} topics={topics} />
    </>
  );
}
