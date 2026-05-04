import { PageTrust } from '@/components/PageTrust';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Review log' };

export default function AuditPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const stalePages = manifest.pages.filter((page) => !page.last_audited_at).length;
  const sparsePages = manifest.pages.filter((page) => page.publication_state === 'stub' || page.publication_state === 'seed_overview').length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Review log</div>
        <h1>Public review trail</h1>
        <p>Compact public records show what changed, which sources support it, which automated checks ran, and where source files live. These are internal agentic/public-repository provenance checks, not government audits, regulator audits, external audits, or assurance engagements.</p>
      </section>

      <PageTrust
        sourceStatus={`${content.sources.length} sources and ${content.claims.length} claims feed the generated review manifest.`}
        reviewStatus={`${manifest.pages.length} page records; ${stalePages} awaiting a check date.`}
        metrics={[
          { label: 'Sparse states', value: sparsePages },
          { label: 'Run summaries', value: ops.latestRuns.length }
        ]}
        sourceLabel="Inspect sources"
        reviewLabel="Open review log"
        links={[{ href: '/repo', label: 'Repository evidence' }]}
      />

      <section className="section ops-grid" aria-label="Review summary">
        <div className="metric-card">
          <span className="mono row-meta">Pages tracked</span>
          <strong>{manifest.pages.length}</strong>
          <p>page records in the generated public review manifest</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Sparse states</span>
          <strong>{sparsePages}</strong>
          <p>stub or seed overview pages clearly labelled as incomplete</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">No check date</span>
          <strong>{stalePages}</strong>
          <p>pages queued for future source refresh or internal provenance check</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Runs</span>
          <strong>{ops.latestRuns.length}</strong>
          <p>redacted public agent-run summaries published</p>
        </div>
      </section>

      <section className="link-list">
        {manifest.pages.slice(0, 30).map((page, index) => (
          <article className="index-row" key={page.path}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{page.path}</strong>
            <span className="mono row-meta state">{page.publication_state}</span>
            <span className="mono">+</span>
            <p className="expanded-row mono">
              {page.source_file} · {page.source_count} sources · {page.claim_count} claims · internal provenance check {page.last_audited_at ?? 'pending'} · run {page.latest_agent_run_id}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
