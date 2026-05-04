import Link from 'next/link';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Ops' };

export default function OpsPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const staleTopics = content.topics.filter((topic) => !topic.last_audited_at).length;
  const fullDossiers = content.topics.filter((topic) => topic.state === 'full_dossier').length;
  const activeSchedules = ops.schedules.filter((schedule) => schedule.human_gate === false).length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Ops</div>
        <h1>Operational observability</h1>
        <p>
          Public read-only status for automated schedules, validation posture, release records, runbooks, and redacted agent runs.
          This page exposes operating evidence without publishing raw logs, private submissions, or hidden reasoning.
        </p>
      </section>

      <section className="section ops-grid" aria-label="Operational summary">
        <div className="metric-card">
          <span className="mono row-meta">Topics</span>
          <strong>{content.topics.length}</strong>
          <p>{fullDossiers} full dossiers · {staleTopics} sparse/unaudited topics</p>
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
          <p>
            Runbooks define autonomous release, rollback, source refresh, urgent correction, and launch checks. Release logs are public summaries only.
          </p>
          <ul>
            {ops.runbooks.map((runbook) => (
              <li key={runbook} className="mono">ops/runbooks/{runbook}</li>
            ))}
          </ul>
          <p className="mono row-meta">Latest release: {ops.releases[0]?.id ?? 'none'} · {ops.releases[0]?.date ?? 'n/a'}</p>
          <p><Link href="/audit">Inspect page-level audit manifest</Link></p>
          <p><Link href="/agents">Inspect public agent permissions</Link></p>
          <p className="mono row-meta">Manifest pages tracked: {manifest.pages.length}</p>
        </div>
      </section>
    </>
  );
}
