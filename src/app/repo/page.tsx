import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'StayOrGoAB repository evidence',
  description: 'Where StayOrGoAB Alberta independence source records, claims, review records, generated manifests, and validators live.',
  pathname: '/repo/',
  keywords: ['Alberta independence repository', 'Alberta referendum source records']
});

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
          Source records, claim links, generated review manifests, validation scripts, release summaries,
          and static site code are inspectable in the public repository. These records support public-repository
          evidence checks; they are not an external audit or assurance engagement.
        </p>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Ledger</div>
          <h2>Evidence map</h2>
        </div>
        <div className="status-readout repo-ledger" aria-label="Repository ledger">
          <article className="data-row trust-row">
            <span className="mono row-meta">Source records</span>
            <strong>{content.sources.length}</strong>
            <span>public source records with provenance metadata and original links</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Claim records</span>
            <strong>{content.claims.length}</strong>
            <span>claim rows tied back to source IDs and topic evidence files</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Review manifest</span>
            <strong>{manifest.pages.length}</strong>
            <span>generated page-level review records from repository content</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Latest release</span>
            <strong>{latestRelease?.date ?? 'n/a'}</strong>
            <span>{latestRelease?.id ?? 'no public release record yet'}</span>
          </article>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Files</div>
          <h2>Where the evidence lives</h2>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row">
            <span className="mono row-meta">Repository</span>
            <strong><a href="https://github.com/chrisdothinger/stayorgoab">chrisdothinger/stayorgoab</a></strong>
            <span>source code, content, validators, public schedules, and release records</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Content</span>
            <strong>content/topics</strong>
            <span>topic dossiers, report files, claims-and-evidence files, topic source maps, and review trail records</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Ops</span>
            <strong>ops/schedules.yml</strong>
            <span>scheduled workflow records, required checks, allowed outputs, and publication gates</span>
          </article>
          <article className="data-row trust-row">
            <span className="mono row-meta">Build gates</span>
            <strong>scripts/validate-*.ts</strong>
            <span>citation, public-audit, secrets, and agent-permission checks</span>
          </article>
        </div>
      </section>
    </>
  );
}
