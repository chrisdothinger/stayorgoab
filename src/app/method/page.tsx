import Link from 'next/link';
import { PageTrust } from '@/components/PageTrust';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Method / Ops' };

export default function MethodPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const staleTopics = content.topics.filter((topic) => !topic.last_audited_at).length;
  const fullDossiers = content.topics.filter((topic) => topic.state === 'full_dossier').length;
  const activeSchedules = ops.schedules.filter((schedule) => schedule.human_gate === false).length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Method / Ops</div>
        <h1>Method / Ops</h1>
        <p>The site separates known facts, disputed claims, uncertainty, arguments, sources, and public review records. It does not tell readers how to vote. This page explains both the research method and the operating evidence behind the autonomous workflow.</p>
      </section>

      <PageTrust
        sourceStatus="Claims should trace to source records, topic ledgers, and visible publication states."
        reviewStatus="Internal provenance checks and public review records are inspectable repository evidence, not government or external audit."
        metrics={[
          { label: 'Publication gate', value: 'automated' },
          { label: 'Private data', value: 'excluded' }
        ]}
        sourceLabel="Inspect sources"
        reviewLabel="Open review log"
        links={[{ href: '/repo', label: 'Repository evidence' }]}
      />

      <section className="section grid-two">
        <div><h2>Source-backed before persuasive</h2></div>
        <div className="markdown">
          <p>Every claim is expected to trace to a source record, a topic claim ledger, and a visible publication state. Sparse pages are allowed; fake completeness is not.</p>
          <p>Source records track publisher, author where available, dates, source type, reliability category, summary, how the source is used, related topics, and checking status.</p>
        </div>
      </section>

      <section className="section grid-two">
        <div><h2>Autonomous, but cautious</h2></div>
        <div className="markdown">
          <p>Hermes agents can update repository content and trigger validators. Automated checks can publish, downgrade, withhold, or roll back content.</p>
          <p>High-risk legal, financial, election, Indigenous-rights, and public-service topics require stronger source support and clearer uncertainty language.</p>
          <p>No publication workflow requires human approval, human review, human verification, or human sign-off. Human input is signal; automated evidence gates decide publication state.</p>
        </div>
      </section>

      <section className="section ops-grid" aria-label="Operational summary">
        <div className="metric-card">
          <span className="mono row-meta">Topics</span>
          <strong>{content.topics.length}</strong>
          <p>{fullDossiers} full dossiers · {staleTopics} topics awaiting internal provenance check</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Sources</span>
          <strong>{content.sources.length}</strong>
          <p>{content.claims.length} claim records mapped to public source IDs</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Automation</span>
          <strong>{activeSchedules}</strong>
          <p>scheduled workflows with automated gates, not human approval gates</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Incidents</span>
          <strong>{ops.incidentCount}</strong>
          <p>public incident records currently logged</p>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Schedules</div>
          <h2>Automated checks</h2>
        </div>
        <div className="status-readout">
          {ops.schedules.map((schedule) => (
            <article className="data-row" key={schedule.id}>
              <span className="mono row-meta">{schedule.cron}</span>
              <strong>{schedule.id}</strong>
              <span className="mono row-meta">{schedule.timezone}</span>
              <p className="row-description">{schedule.purpose}</p>
              <p className="row-description mono">
                {schedule.workflow} · raw logs published: {String(schedule.publish_raw_logs)} · human gate: {String(schedule.human_gate)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Public run summaries</div>
          <h2>Latest agent runs</h2>
        </div>
        <div className="status-readout">
          {ops.latestRuns.map((run) => (
            <article className="data-row" key={run.run_id}>
              <span className="mono row-meta">{run.trigger}</span>
              <strong>{run.agent_name}</strong>
              <span className="mono row-meta">{run.run_id}</span>
              <p className="row-description">{run.output_summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Runbooks + releases</div>
          <h2>Operating documents</h2>
        </div>
        <div className="markdown">
          <p>Secrets, credentials, raw provider logs, raw agent transcripts, hidden chain-of-thought, private submissions, cookies, auth headers, and unnecessary personal data are excluded by rule and scanner.</p>
          <p>Runbooks define autonomous release, rollback, source refresh, urgent correction, and launch checks. Release logs are public summaries only.</p>
          <ul>
            {ops.runbooks.map((runbook) => (
              <li key={runbook} className="mono">ops/runbooks/{runbook}</li>
            ))}
          </ul>
          <p className="mono row-meta">Latest release: {ops.releases[0]?.id ?? 'none'} · {ops.releases[0]?.date ?? 'n/a'}</p>
          <p><Link href="/audit">Inspect page-level review manifest</Link></p>
          <p><Link href="/agents">Inspect public agent permissions</Link></p>
          <p className="mono row-meta">Manifest pages tracked: {manifest.pages.length}</p>
        </div>
      </section>
    </>
  );
}
