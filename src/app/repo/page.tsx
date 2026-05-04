import Link from 'next/link';
import { PageTrust } from '@/components/PageTrust';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Repository' };

export default function RepoPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const latestRelease = ops.releases[0];

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Repository</div>
        <h1>Public repository evidence</h1>
        <p>
          The project is designed to be inspectable: source records, claim links, generated review manifests,
          validation scripts, release summaries, and the public site code live in one repository.
          These records support public inspection and internal provenance checks; they are not an external audit.
        </p>
      </section>

      <PageTrust
        sourceStatus={`${content.sources.length} public source records and ${content.claims.length} claim records are inspectable.`}
        reviewStatus={`${manifest.pages.length} generated page-level review records; latest release ${latestRelease?.date ?? 'n/a'}.`}
        metrics={[
          { label: 'Source map', value: content.sources.length },
          { label: 'Review records', value: manifest.pages.length }
        ]}
        sourceLabel="Inspect sources"
        reviewLabel="Open review log"
        links={[{ href: '/ops', label: 'Operating posture' }]}
      />

      <section className="section ops-grid" aria-label="Repository evidence summary">
        <div className="metric-card">
          <span className="mono row-meta">Source map</span>
          <strong>{content.sources.length}</strong>
          <p>public source records with provenance metadata</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Claim map</span>
          <strong>{content.claims.length}</strong>
          <p>claims linked back to source IDs</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Review manifest</span>
          <strong>{manifest.pages.length}</strong>
          <p>page-level generated review records</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Latest release</span>
          <strong>{latestRelease?.date ?? 'n/a'}</strong>
          <p>{latestRelease?.id ?? 'no public release record yet'}</p>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Inspect</div>
          <h2>Where to verify the work</h2>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row">
            <span className="mono row-meta">GitHub</span>
            <strong><a href="https://github.com/chrisdothinger/stayorgoab">chrisdothinger/stayorgoab</a></strong>
            <span>source code and content repository</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Manifest</span>
            <strong><Link href="/audit">Review log</Link></strong>
            <span>page-level public review trail and internal provenance-check records</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Sources</span>
            <strong><Link href="/sources">Source library</Link></strong>
            <span>source map, filters, claim trails, and original links</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Ops</span>
            <strong><Link href="/ops">Operating posture</Link></strong>
            <span>runbooks, schedule summaries, validation posture, and redacted agent runs</span>
          </article>
        </div>
      </section>
    </>
  );
}
