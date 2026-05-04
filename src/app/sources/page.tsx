import { SourceLibrary } from '@/components/SourceLibrary';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const { sources, claims, topics } = loadRepositoryContent();
  const sourceTypes = Array.from(new Set(sources.map((source) => source.source_type))).sort();
  const reliability = Array.from(new Set(sources.map((source) => source.reliability_category).filter(Boolean))).sort();
  const linkedClaims = claims.filter((claim) => claim.source_ids.length > 0).length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Sources</div>
        <h1>Source library</h1>
        <p>Search the official, court, primary, advocacy, media, and institutional records used by topic dossiers and claim ledgers.</p>
      </section>

      <section className="section ops-grid" aria-label="Source summary">
        <div className="metric-card">
          <span className="mono row-meta">Records</span>
          <strong>{sources.length}</strong>
          <p>source records with internal provenance checks</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Types</span>
          <strong>{sourceTypes.length}</strong>
          <p>{sourceTypes.join(' · ')}</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Claim links</span>
          <strong>{linkedClaims}</strong>
          <p>claims with explicit source references</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Reliability labels</span>
          <strong>{reliability.length}</strong>
          <p>primary/legal/news/stakeholder labels retained for filtering</p>
        </div>
      </section>

      <SourceLibrary sources={sources} claims={claims} topics={topics} />
    </>
  );
}
