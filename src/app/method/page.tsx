import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Method / Ops' };

function compactList(items?: string[]) {
  return items?.length ? items.join(' · ') : 'pending / not yet recorded';
}

export default function MethodPage() {
  const content = loadRepositoryContent();
  const manifest = buildAuditManifest(content);
  const ops = loadOpsSnapshot();
  const staleTopics = content.topics.filter((topic) => !topic.last_audited_at).length;
  const fullDossiers = content.topics.filter((topic) => topic.state === 'full_dossier').length;

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Method / Ops</div>
        <h1>Method / Ops</h1>
        <p>The site separates known facts, disputed claims, uncertainty, arguments, sources, and public review records. It does not tell readers how to vote. This page is the operating memo for the research method and scheduled source checks.</p>
        <div className="metadata-ledger mono" aria-label="Method and ops metadata">
          <div><span>Topics</span><strong>{content.topics.length}</strong></div>
          <div><span>Full dossiers</span><strong>{fullDossiers}</strong></div>
          <div><span>Sources</span><strong>{content.sources.length}</strong></div>
          <div><span>Claims</span><strong>{content.claims.length}</strong></div>
          <div><span>Review records</span><strong>{manifest.pages.length}</strong></div>
          <div><span>Incidents</span><strong>{ops.incidentCount}</strong></div>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Method</div>
          <h2>How dossiers are built</h2>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row"><span className="mono row-meta">Source first</span><strong>Claims trace to sources</strong><span>Every public claim should resolve to source records, topic claim ledgers, and visible publication state.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Reader layer</span><strong>Short, sourced briefs</strong><span>Topic pages keep the public explanation readable while preserving source maps, claim maps, and review logs for anyone who wants to inspect the evidence.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Uncertainty</span><strong>Sparse is allowed</strong><span>Pages can stay partial; fake completeness is not. Unsettled legal, fiscal, Indigenous-rights, and service-continuity claims require clear uncertainty labels close to the affected argument.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Balance</span><strong>Neutral follows pro and anti</strong><span>Pro and anti reports steelman the strongest fair arguments current sources support. Neutral reports mediate those reports rather than inventing a third stance.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Provenance</span><strong>Internal check</strong><span>Internal provenance check means automated public-repository validation, not government review or external assurance.</span></article>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Automated workflows</div>
          <h2>Automated workflows</h2>
          <p className="section-copy">Workflow records are backed by <span className="mono">ops/schedules.yml</span>. Latest successful run is shown only where a public record exists; otherwise it stays pending.</p>
        </div>
        <div className="workflow-ledger" aria-label="Automated workflow ledger">
          <div className="workflow-ledger-header mono">
            <span>Workflow</span><span>Runtime</span><span>Latest successful run</span><span>Purpose / gates</span>
          </div>
          {ops.schedules.map((schedule) => (
            <article className="workflow-row" key={schedule.id}>
              <strong className="mono">{schedule.id}</strong>
              <span className="mono">{schedule.cron}<br />{schedule.timezone}</span>
              <span className="mono">{schedule.latest_successful_run ?? 'pending / not yet recorded'}</span>
              <span>{schedule.purpose}<br /><span className="mono row-meta">Checks: {compactList(schedule.required_checks)}</span><br /><span className="mono row-meta">Outputs: {compactList(schedule.allowed_outputs)} · human gate: {String(schedule.human_gate)}</span></span>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Public run summaries</div>
          <h2>Latest recorded runs</h2>
        </div>
        <div className="status-readout">
          {ops.latestRuns.map((run) => (
            <article className="data-row trust-row" key={run.run_id}>
              <span className="mono row-meta">{run.trigger}</span>
              <strong>{run.agent_name}</strong>
              <span>{run.run_id} · {run.output_summary}</span>
            </article>
          ))}
          {ops.latestRuns.length === 0 ? <p className="mono row-meta">pending / not yet recorded</p> : null}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Runbooks + releases</div>
          <h2>Operating files</h2>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row"><span className="mono row-meta">Runbooks</span><strong>{ops.runbooks.length}</strong><span>{ops.runbooks.map((runbook) => `ops/runbooks/${runbook}`).join(' · ')}</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Latest release</span><strong>{ops.releases[0]?.id ?? 'none'}</strong><span>{ops.releases[0]?.date ?? 'n/a'} · {ops.releases[0]?.summary ?? 'pending / not yet recorded'}</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Stale topics</span><strong>{staleTopics}</strong><span>topics without a recorded internal provenance-check date</span></article>
        </div>
      </section>
    </>
  );
}
