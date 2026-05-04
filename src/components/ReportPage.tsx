import Link from 'next/link';
import { AuditMeta } from '@/components/AuditMeta';
import { MarkdownText } from '@/components/MarkdownText';
import { PageTrust } from '@/components/PageTrust';
import type { MarkdownFile, TopicMeta } from '@/lib/types';

type ReportKind = 'neutral' | 'pro' | 'anti';

const REPORT_COPY: Record<ReportKind, { label: string; eyebrow: string; explainer: string }> = {
  neutral: {
    label: 'Neutral mediator synthesis',
    eyebrow: '/ Mediated synthesis',
    explainer:
      'This report is written after the pro and anti reports. It compares their strongest points, weak points, evidence quality, and remaining uncertainty rather than acting as a third partisan position.'
  },
  pro: {
    label: 'Pro-independence steelman',
    eyebrow: '/ Pro-independence case',
    explainer:
      'This report presents the strongest fair pro-independence argument that current checked-in sources can support, while labelling assumptions and limits.'
  },
  anti: {
    label: 'Anti-independence / pro-federation steelman',
    eyebrow: '/ Anti-independence case',
    explainer:
      'This report presents the strongest fair anti-independence or pro-federation argument that current checked-in sources can support, while labelling assumptions and limits.'
  }
};

const SECTION_LINKS = [
  'short-answer',
  'what-current-sources-support',
  'core-argument',
  'what-is-known',
  'what-is-disputed',
  'assumptions',
  'strongest-evidence',
  'weak-points',
  'counterarguments',
  'source-notes',
  'what-would-change-this-assessment',
  'open-questions',
  'main-uncertainty',
  'reader-checklist'
];

function reportHeadingIds(body: string) {
  const headings = new Set<string>();
  for (const line of body.split('\n')) {
    const match = line.match(/^#{2,3}\s+(.+)$/);
    if (!match) continue;
    const id = match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.add(id);
  }
  return headings;
}

function stanceHref(topic: TopicMeta, kind: ReportKind) {
  return `/questions/${topic.slug}/${kind}`;
}

export function ReportPage({ topic, report, kind }: { topic: TopicMeta; report: MarkdownFile; kind: ReportKind }) {
  const copy = REPORT_COPY[kind];
  const headings = reportHeadingIds(report.body);
  const visibleSectionLinks = SECTION_LINKS.filter((section) => headings.has(section));
  return (
    <>
      <section className="section report-hero">
        <div className="section-label mono">{copy.eyebrow}</div>
        <h1>{report.title}</h1>
        <p>{copy.explainer}</p>
        <AuditMeta
          sourceCount={topic.source_count}
          claimCount={topic.claim_count}
          audited={topic.last_audited_at}
          debated={topic.last_debated_at}
          sourceFile={report.path}
        />
      </section>

      <PageTrust
        sourceStatus={`${topic.source_count} topic sources and ${topic.claim_count} claims are attached to this report.`}
        reviewStatus={`Internal provenance check: ${topic.last_audited_at ?? 'pending'}; redebate pass: ${topic.last_debated_at ?? 'pending'}.`}
        metrics={[
          { label: 'Report role', value: copy.label },
          { label: 'Topic state', value: topic.state }
        ]}
        sourceHref={`/questions/${topic.slug}/sources`}
        sourceLabel="Inspect topic sources"
        reviewHref="/audit"
        reviewLabel="Review details"
        links={[
          { href: `/questions/${topic.slug}/claims`, label: 'Claims ledger' },
          { href: `/questions/${topic.slug}`, label: 'Topic overview' }
        ]}
      />

      <section className="section grid-two report-layout">
        <aside className="report-aside">
          <nav className="category-nav mono" aria-label="Report views">
            <Link aria-current={kind === 'neutral' ? 'page' : undefined} href={stanceHref(topic, 'neutral')}>Neutral mediator</Link>
            <Link aria-current={kind === 'pro' ? 'page' : undefined} href={stanceHref(topic, 'pro')}>Pro steelman</Link>
            <Link aria-current={kind === 'anti' ? 'page' : undefined} href={stanceHref(topic, 'anti')}>Anti steelman</Link>
            <Link href={`/questions/${topic.slug}/claims`}>Claims</Link>
            <Link href={`/questions/${topic.slug}/sources`}>Sources</Link>
          </nav>
          {visibleSectionLinks.length > 0 ? (
            <nav className="report-section-nav mono" aria-label="Report sections">
              {visibleSectionLinks.map((section) => (
                <a key={section} href={`#${section}`}>{section.replace(/-/g, ' ')}</a>
              ))}
            </nav>
          ) : null}
          <div className="notice small-note">
            Neutral reports are mediator summaries. Pro and anti reports are written first, then the neutral report weighs both.
          </div>
        </aside>
        <article className="report-body">
          <MarkdownText body={report.body} />
        </article>
      </section>
    </>
  );
}
