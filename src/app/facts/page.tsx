import Link from 'next/link';
import { PageTrust } from '@/components/PageTrust';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Facts' };

type StatusItem = {
  id?: string;
  label?: string;
  state?: string;
  summary?: string;
  source_ids?: string[];
};

const timeline = [
  {
    step: '01',
    label: 'Petition',
    title: 'A citizen initiative petition can start a formal process.',
    detail: 'Elections Alberta lists the independence petition, signature threshold, and collection period. This is process evidence, not proof of a final outcome.',
    href: '/questions/petition-vs-referendum-vs-negotiations',
    linkLabel: 'Open petition vs referendum question'
  },
  {
    step: '02',
    label: 'Referendum',
    title: 'A referendum is a democratic event, not independence by itself.',
    detail: 'Elections Alberta says a referendum has been set for October 19, 2026. Ballot wording and legal/political effects still need source-backed treatment.',
    href: '/questions/referendum-mechanics',
    linkLabel: 'Open referendum mechanics question'
  },
  {
    step: '03',
    label: 'Negotiations',
    title: 'A clear question and clear majority could trigger constitutional and political negotiations.',
    detail: 'The Supreme Court and Clarity Act baseline point to negotiation duties and clarity questions; final terms are not settled in advance.',
    href: '/questions/legal-process',
    linkLabel: 'Open legal process question'
  }
];

const certaintyGroups = [
  {
    label: 'What is confirmed',
    eyebrow: 'Confirmed',
    title: 'There is a petition/referendum process, and a referendum alone would not automatically create independence.',
    detail: 'Official election sources describe the petition and referendum machinery. Canadian legal sources describe the constitutional baseline: unilateral provincial secession is not treated as automatic legal independence.',
    links: [
      { href: '/sources/elections-ab-current-petitions', label: 'Elections Alberta source' },
      { href: '/sources/scc-secession-reference', label: 'Supreme Court source' }
    ]
  },
  {
    label: 'What is disputed',
    eyebrow: 'Disputed / model-dependent',
    title: 'Pensions, fiscal effects, debt/assets, borders, currency, and public-service outcomes depend on assumptions.',
    detail: 'Many claims in these areas are projections or advocacy frames. They need source trails and assumptions, not simple yes/no certainty.',
    links: [
      { href: '/questions/cpp-pensions', label: 'CPP and pensions dossier' },
      { href: '/questions/economy-fiscal', label: 'Fiscal dossier' }
    ]
  },
  {
    label: 'What is unknown',
    eyebrow: 'Unknown / not settled',
    title: 'The final terms of any separation settlement are not known today.',
    detail: 'Negotiated terms would involve Canada, Alberta, constitutional actors, Indigenous rights and treaties, markets, institutions, and future policy choices. Sparse pages remain visibly sparse until supported.',
    links: [
      { href: '/questions/indigenous-rights-treaties', label: 'Indigenous rights dossier' },
      { href: '/questions/borders-currency-citizenship', label: 'Borders/currency overview' }
    ]
  }
];

function sourceCount(item: StatusItem): number {
  return Array.isArray(item.source_ids) ? item.source_ids.length : 0;
}

export default function FactsPage() {
  const content = loadRepositoryContent();
  const statusItems = Array.isArray(content.status.items) ? content.status.items as StatusItem[] : [];
  const lastOfficialSourceCheck = typeof content.status.last_official_source_check === 'string'
    ? content.status.last_official_source_check
    : 'unknown';
  const fullDossiers = content.topics.filter((topic) => topic.state === 'full_dossier').length;
  const highSensitivityTopics = content.topics.filter((topic) => topic.time_sensitivity === 'high').length;

  return (
    <>
      <section className="section facts-hero">
        <div>
          <div className="section-label mono">/ Facts</div>
          <h1>Public briefing: where things stand</h1>
          <p>
            A plain-language snapshot of the Alberta independence petition, the 2026 referendum context, and what current sources can — and cannot — support.
          </p>
          <div className="primary-actions">
            <Link className="primary-link" href="/questions/referendum-mechanics">Read referendum mechanics</Link>
            <Link href="/audit">Trace the public review log</Link>
            <Link href="/sources">Check source library</Link>
          </div>
        </div>
        <aside className="briefing-card" aria-label="Briefing status">
          <span className="mono row-meta">Current source status</span>
          <strong>Last checked against tracked official sources: {lastOfficialSourceCheck}</strong>
          <p>
            This page is civic information, not legal advice. It separates confirmed procedure from disputed claims and unknown negotiated outcomes.
          </p>
        </aside>
      </section>

      <PageTrust
        sourceStatus={`Last checked against tracked official sources: ${lastOfficialSourceCheck}`}
        reviewStatus="Public review log links every page to generated review records."
        metrics={[
          { label: 'Status rows', value: statusItems.length },
          { label: 'Full dossiers', value: fullDossiers },
          { label: 'High sensitivity', value: highSensitivityTopics }
        ]}
        sourceLabel="Inspect sources"
        reviewLabel="Open review log"
        links={[{ href: '/repo', label: 'Repository evidence' }]}
      />

      <section className="section facts-metrics" aria-label="Briefing inventory">
        <article className="metric-card">
          <span className="mono row-meta">Tracked status items</span>
          <strong>{statusItems.length}</strong>
          <p>Current procedural facts pulled from the repository status snapshot.</p>
        </article>
        <article className="metric-card">
          <span className="mono row-meta">Full dossiers</span>
          <strong>{fullDossiers}</strong>
          <p>Topics with fuller pro/anti/neutral evidence, claims, and review history.</p>
        </article>
        <article className="metric-card">
          <span className="mono row-meta">High sensitivity topics</span>
          <strong>{highSensitivityTopics}</strong>
          <p>Pages that should be rechecked carefully because facts or public context can move quickly.</p>
        </article>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Current procedural snapshot</div>
          <h2>What the repository status snapshot says</h2>
          <p className="section-copy">Each row links back to source records so readers can inspect the evidence trail instead of trusting this page by vibe. Vibes are not evidence. Annoying, but true.</p>
        </div>
        <div className="status-readout facts-status-list">
          {statusItems.map((item) => (
            <article className="data-row trust-row" key={String(item.id)}>
              <span className="mono row-meta">{String(item.state ?? 'unknown')}</span>
              <strong>{String(item.label ?? 'Status item')}</strong>
              <span className="mono row-meta">{sourceCount(item)} {sourceCount(item) === 1 ? 'source' : 'sources'}</span>
              <p className="row-description">{String(item.summary ?? '')}</p>
              {Array.isArray(item.source_ids) && item.source_ids.length > 0 ? (
                <div className="source-trail">
                  {item.source_ids.map((sourceId) => {
                    const source = content.sources.find((candidate) => candidate.id === sourceId);
                    return source ? <Link key={sourceId} href={`/sources/${source.slug}`}>{source.title}</Link> : <span key={sourceId}>{sourceId}</span>;
                  })}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Process map</div>
          <h2>Petition → referendum → negotiations</h2>
          <p className="section-copy">The key civic mistake is treating these as one event. They are separate stages with different evidence standards.</p>
        </div>
        <ol className="timeline-list" aria-label="Petition referendum negotiations timeline">
          {timeline.map((item) => (
            <li key={item.step}>
              <span className="mono row-meta">{item.step} / {item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <Link href={item.href}>{item.linkLabel}</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Certainty labels</div>
          <h2>Confirmed, disputed, unknown</h2>
          <p className="section-copy">Use this as the quick briefing before drilling into the dossiers. It is intentionally cautious: certainty has to be earned by sources.</p>
        </div>
        <div className="certainty-grid" aria-label="Confirmed disputed unknown briefing sections">
          {certaintyGroups.map((group) => (
            <article className="briefing-card" key={group.label}>
              <span className="mono row-meta">{group.eyebrow}</span>
              <h3>{group.label}</h3>
              <strong>{group.title}</strong>
              <p>{group.detail}</p>
              <div className="source-trail">
                {group.links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ What changed since last review</div>
          <h2>Latest review context</h2>
        </div>
        <div className="briefing-card">
          <strong>Recent UX work clarified the public review trail and internal provenance-check wording.</strong>
          <p>
            The site now avoids wording that could imply a government, regulator, or external assurance audit. Public evidence remains inspectable through source records, topic dossiers, changelog entries, and the review log.
          </p>
          <div className="primary-actions">
            <Link className="primary-link" href="/changelog">Read changelog</Link>
            <Link href="/repo">Inspect repository evidence</Link>
          </div>
        </div>
      </section>
    </>
  );
}
