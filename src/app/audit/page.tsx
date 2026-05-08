import Link from 'next/link';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'StayOrGoAB review trail',
  description: 'Public review records for StayOrGoAB Alberta independence source, claim, dossier, and audit checks.',
  pathname: '/audit/',
  keywords: ['Alberta independence audit trail', 'Alberta separation sources']
});

export default function AuditPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const stalePages = manifest.pages.filter((page) => !page.last_audited_at).length;
  const sparsePages = manifest.pages.filter((page) => page.publication_state === 'stub' || page.publication_state === 'seed_overview').length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Review trail</div>
        <h1>Review trail</h1>
        <p>Compact public records show what changed, which sources support it, which automated checks ran, and where source files live. These are StayOrGoAB public-repository evidence checks, not government audits, regulator audits, external audits, or assurance engagements.</p>
      </section>

      <section className="section" aria-label="Review coverage">
        <div className="section-label mono">/ Coverage</div>
        <h2>What this trail covers</h2>
        <p className="section-copy">The review trail is generated from repository records. Source and claim counts come from each dossier's current source map and claims-and-evidence file, so refreshed dossiers do not depend on manually edited counts.</p>
        <div className="metadata-ledger mono">
          <div><span>Pages tracked</span><strong>{manifest.pages.length}</strong></div>
          <div><span>Sources</span><strong>{content.sources.length}</strong></div>
          <div><span>Claims</span><strong>{content.claims.length}</strong></div>
          <div><span>Sparse states</span><strong>{sparsePages}</strong></div>
          <div><span>No check date</span><strong>{stalePages}</strong></div>
          <div><span>Run summaries</span><strong>{ops.latestRuns.length}</strong></div>
        </div>
        <p className="section-copy"><Link href="/sources">Inspect sources</Link> · <Link href="/repo">Repository evidence</Link></p>
      </section>

      <section className="link-list">
        {manifest.pages.map((page, index) => (
          <article className="index-row" key={page.path}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{page.path}</strong>
            <span className="mono row-meta state">{page.publication_state}</span>
            <span className="mono">+</span>
            <p className="expanded-row mono">
              {page.source_file} · {page.source_count} sources · {page.claim_count} claims · last evidence check {page.last_audited_at ?? 'pending'} · run {page.latest_agent_run_id}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
