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

export function ReportPage({ topic, report, kind }: { topic: TopicMeta; report: MarkdownFile; kind: ReportKind }) {
  const copy = REPORT_COPY[kind];
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

      <section className="section dossier-tab-strip">
        <DossierNav active={kind} topic={topic} />
      </section>

      <section className="section report-layout">
        <article className="report-body">
          <MarkdownText body={report.body} />
        </article>
      </section>
    </>
  );
}
