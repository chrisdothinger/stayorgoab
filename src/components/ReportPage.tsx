import { AuditMeta } from '@/components/AuditMeta';
import { DossierNav } from '@/components/DossierNav';
import { MarkdownText } from '@/components/MarkdownText';
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

      <section className="section grid-two report-layout">
        <aside className="report-aside">
          <DossierNav active={kind} topic={topic} />
          {visibleSectionLinks.length > 0 ? (
            <details className="report-section-disclosure" aria-label="Report section jumps">
              <summary className="mono">Jump to section</summary>
              <nav className="report-section-nav mono" aria-label="Report sections">
                {visibleSectionLinks.map((section) => (
                  <a key={section} href={`#${section}`}>{section.replace(/-/g, ' ')}</a>
                ))}
              </nav>
            </details>
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
