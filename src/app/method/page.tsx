import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = {
  title: 'How this works',
  description: 'How StayOrGoAB builds, checks, and publishes source-backed Alberta independence dossiers.'
};

const GITHUB_REPO_URL = 'https://github.com/chrisdothinger/stayorgoab';

function formatRunTime(recordedAt?: string) {
  if (!recordedAt) return 'time not recorded';
  const date = new Date(recordedAt);
  if (Number.isNaN(date.getTime())) return recordedAt;
  return date.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
}

export default function MethodPage() {
  const ops = loadOpsSnapshot();

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ How this works</div>
        <h1>How this works</h1>
        <p>The site separates known facts, disputed claims, uncertainty, arguments, sources, and public review records. It does not tell readers how to vote. This page explains the research method and operating model in plain language.</p>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Method</div>
          <h2>How dossiers are built</h2>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row"><span className="mono row-meta">1 / assign</span><strong>An orchestrator agent sets the work plan</strong><span>A central reviewing agent reads the public question, the repository rules, and the role definitions stored in GitHub. It assigns bounded tasks to specialist agents instead of letting one system write everything at once.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">2 / research</span><strong>Specialist agents work in defined lanes</strong><span>Different agents can handle source collection, pro-side arguments, anti-side arguments, overview synthesis, citation checks, and release review. The neutral synthesis is folded into the overview so readers get the balanced answer before choosing whether to open side briefs.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">3 / report back</span><strong>Drafts come back with evidence</strong><span>Agents do not simply declare an answer. They return proposed text, source records, claim links, and a short summary of what changed so the work can be checked against the public files.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">4 / validate</span><strong>The orchestrator checks before publication</strong><span>The orchestrator compares the work against the site rules: sources must exist, claims must cite sources, public pages must build, secret scans must pass, and summaries must not expose private prompts or raw logs.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">5 / publish</span><strong>Green work is published through GitHub</strong><span>Accepted changes go through the public repository and deployment checks before appearing on the site. That trail is intentional: readers can inspect what changed, when it changed, and what evidence supported it.</span></article>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Dossier shape</div>
          <h2>The overview is the neutral synthesis</h2>
          <p className="section-copy">The refreshed standard treats the overview as the main balanced report, not a teaser. It should answer the question, explain what each side gets right, name the decisions that remain unresolved, and cite the evidence trail.</p>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row"><span className="mono row-meta">Overview</span><strong>Main balanced answer</strong><span>Readers should be able to stop on the overview and understand the practical answer. The former neutral-report job lives here.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Briefs</span><strong>Pro and anti are optional deep dives</strong><span>The side briefs test the strongest fair pro-independence and anti-independence / pro-federation cases without repeating the overview.</span></article>
          <article className="data-row trust-row"><span className="mono row-meta">Audit</span><strong>Claims and sources remain separate</strong><span>The evidence trail stays public through numbered citations, source lists, claim maps, audit logs, and GitHub history.</span></article>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Public auditability</div>
          <h2>Why GitHub is part of the method</h2>
          <p className="section-copy">The goal is a completely auditable civic knowledge base: source-first, non-partisan, and transparent enough that readers can test whether the process is biased, incomplete, unsupported, or drifting away from its autonomous operating model.</p>
        </div>
        <div className="status-readout">
          <article className="data-row trust-row"><span className="mono row-meta">Repository</span><strong>Inspect the public GitHub repo</strong><span>Source files, claims, topic dossiers, review records, and site changes are kept in public version control. People who want the operational detail can inspect the repository directly.</span><a href={GITHUB_REPO_URL}>Open the StayOrGoAB GitHub repository</a></article>
          <article className="data-row trust-row"><span className="mono row-meta">Intent</span><strong>Auditable, not black-box</strong><span>The site is designed so readers can check the evidence trail instead of trusting a campaign, a slogan, or an unexplained AI answer.</span></article>
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Public run summaries</div>
          <h2>Latest recorded runs</h2>
          <p className="section-copy">Run summaries are short public records of completed site work. They describe the trigger, recorded time, and outcome without exposing private prompts, raw logs, or internal tool traces.</p>
        </div>
        <div className="status-readout">
          {ops.latestRuns.map((run) => (
            <article className="data-row trust-row" key={run.run_id}>
              <span className="mono row-meta">{run.trigger}</span>
              <strong>{run.agent_name}</strong>
              <span><span className="mono">{run.run_id}</span><br />Recorded: {formatRunTime(run.recorded_at)}<br />Description: {run.output_summary}</span>
            </article>
          ))}
          {ops.latestRuns.length === 0 ? <p className="mono row-meta">pending / not yet recorded</p> : null}
        </div>
      </section>
    </>
  );
}
