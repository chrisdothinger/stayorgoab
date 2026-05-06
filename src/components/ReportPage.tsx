import { AuditMeta } from '@/components/AuditMeta';
import { DossierNav } from '@/components/DossierNav';
import { MarkdownText } from '@/components/MarkdownText';
import type { ReportKind } from '@/lib/dossier-contract';
import type { MarkdownFile, TopicMeta } from '@/lib/types';

const REPORT_COPY: Record<ReportKind, { label: string; eyebrow: string; explainer: string }> = {
  neutral: {
    label: 'Neutral mediator synthesis',
    eyebrow: '/ Mediated synthesis',
    explainer:
      'This report is written after the pro and anti reports. It identifies what each side gets right, what survives both arguments, and where the practical test still turns.'
  },
  pro: {
    label: 'Pro-independence debate brief',
    eyebrow: '/ Pro-independence case',
    explainer:
      'This report presents the strongest fair pro-independence argument current checked-in sources can support, with evidence and limits kept close to each argument.'
  },
  anti: {
    label: 'Anti-independence / pro-federation debate brief',
    eyebrow: '/ Anti-independence case',
    explainer:
      'This report presents the strongest fair anti-independence or pro-federation argument current checked-in sources can support, with evidence and limits kept close to each argument.'
  }
};

type HeadingLink = { id: string; label: string; level: 2 | 3 };

function slugifyHeading(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function reportHeadingLinks(body: string): HeadingLink[] {
  const links: HeadingLink[] = [];
  const seen = new Set<string>();
  for (const line of body.split('\n')) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const label = match[2].trim();
    const id = slugifyHeading(label);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    links.push({ id, label, level: match[1].length as 2 | 3 });
  }
  return links;
}

export function ReportPage({ topic, report, kind }: { topic: TopicMeta; report: MarkdownFile; kind: ReportKind }) {
  const copy = REPORT_COPY[kind];
  const sectionLinks = reportHeadingLinks(report.body);
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
          {sectionLinks.length > 0 ? (
            <details className="report-section-disclosure" aria-label="Report section jumps">
              <summary className="mono">Jump to section</summary>
              <nav className="report-section-nav mono" aria-label="Report sections">
                {sectionLinks.map((section) => (
                  <a className={section.level === 3 ? 'subsection-link' : undefined} key={section.id} href={`#${section.id}`}>{section.label}</a>
                ))}
              </nav>
            </details>
          ) : null}
          <div className="notice small-note">
            V3 dossiers keep the public reader layer lean: overview first, pro and anti debate briefs next, then a neutral mediator synthesis. Dense citation clusters render as expandable evidence chips; claim maps, source maps, and review logs remain the audit layer.
          </div>
        </aside>
        <article className="report-body">
          <MarkdownText body={report.body} />
        </article>
      </section>
    </>
  );
}
