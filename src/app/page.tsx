import Link from 'next/link';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';

function latestAuditDate(generatedAt: string) {
  return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(generatedAt));
}

export default function HomePage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const statusItems = Array.isArray(content.status.items) ? content.status.items as Array<Record<string, string>> : [];
  const popular = content.topics.slice(0, 5);
  const fullDossiers = content.topics.filter((topic) => topic.state === 'full_dossier').length;

  return (
    <>
      <section className="hero hero-focused">
        <div>
          <div className="section-label mono">/ Source-backed answers on Alberta independence</div>
          <h1>Stay or go?</h1>
          <p>Understand what Alberta independence would actually mean. StayOrGoAB is a source-first, autonomous, non-partisan knowledge base for facts, arguments, claims, sources, and public audit trails.</p>
          <div className="primary-actions mono" aria-label="Primary paths">
            <Link className="primary-link" href="/facts">Start with current facts</Link>
            <Link href="/questions">Search questions</Link>
            <Link href="/sources">Inspect sources</Link>
            <Link href="/method">How the agents work</Link>
          </div>
          <form className="home-search" action="/questions/" method="get" role="search" aria-label="Search civic questions">
            <label className="mono" htmlFor="home-question-search">Search civic questions</label>
            <div>
              <input id="home-question-search" name="q" type="search" placeholder="Try CPP, treaty, referendum, currency..." />
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
        <aside className="status-readout status-panel" aria-label="Current status">
          <div className="section-label mono">/ Current status</div>
          {statusItems.map((item) => (
            <div className="data-row" key={item.id}>
              <span className="mono row-meta">{item.state}</span>
              <strong>{item.label}</strong>
              <Link className="mono row-meta" href="/sources">View source</Link>
            </div>
          ))}
          <div className="mono status-footnote">Latest public audit: {latestAuditDate(manifest.generated_at)}</div>
        </aside>
      </section>

      <section className="trust-strip mono" aria-label="Public trust signals">
        <div className="trust-strip-label">Public research inventory</div>
        <Link href="/questions"><strong>{content.topics.length}</strong> topics indexed</Link>
        <Link href="/sources"><strong>{content.sources.length}</strong> sources tracked</Link>
        <Link href="/questions"><strong>{fullDossiers}</strong> full dossiers</Link>
        <Link href="/audit"><strong>{manifest.pages.length}</strong> audited page records</Link>
      </section>

      <section className="section grid-two questions-preview">
        <div>
          <div className="section-label mono">/ Questions</div>
          <h2>The questions that matter</h2>
          <p>Start with the most developed dossiers, then scan the sparse research queue without mistaking it for finished work.</p>
        </div>
        <div className="link-list">
          {popular.map((topic, index) => (
            <div className="index-row" key={topic.slug}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
              <span className="mono row-meta state">{topic.state.replaceAll('_', ' ')}</span>
              <span className="mono">→</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
