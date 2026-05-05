import { SourceLibrary } from '@/components/SourceLibrary';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const { sources, claims, topics } = loadRepositoryContent();
  const sourceTypes = Array.from(new Set(sources.map((source) => source.source_type))).sort();
  const linkedClaims = claims.filter((claim) => claim.source_ids.length > 0).length;

  return (
    <>
      <section className="section sources-hero">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Search the official, court, primary, advocacy, media, and institutional records used by topic dossiers and claim ledgers.</p>
        <div className="metadata-ledger mono" aria-label="Source library metadata">
          <div><span>Records</span><strong>{sources.length}</strong></div>
          <div><span>Types</span><strong>{sourceTypes.length}</strong></div>
          <div><span>Linked claims</span><strong>{linkedClaims}</strong></div>
        </div>
      </section>

      <SourceLibrary sources={sources} claims={claims} topics={topics} />
    </>
  );
}
