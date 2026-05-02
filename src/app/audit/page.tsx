import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Audit' };

export default function AuditPage() {
  const manifest = buildAuditManifest(loadRepositoryContent());
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Audit</div>
        <h1>Public audit trail</h1>
        <p>Compact public records show what changed, which sources support it, which checks ran, and where source files live.</p>
      </section>
      <section className="link-list">
        {manifest.pages.slice(0, 20).map((page, index) => (
          <article className="index-row" key={page.path}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{page.path}</strong>
            <span className="mono row-meta state">{page.publication_state}</span>
            <span className="mono">+</span>
            <p className="expanded-row mono">{page.source_file} · {page.source_count} sources · {page.claim_count} claims</p>
          </article>
        ))}
      </section>
    </>
  );
}
