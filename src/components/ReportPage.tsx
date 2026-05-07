import { DossierHeader } from '@/components/DossierHeader';
import { DossierNav } from '@/components/DossierNav';
import { MarkdownText } from '@/components/MarkdownText';
import type { ReportKind } from '@/lib/dossier-contract';
import type { MarkdownFile, TopicMeta } from '@/lib/types';

const REPORT_LABEL: Record<ReportKind, string> = {
  neutral: 'Neutral mediator synthesis',
  pro: 'Pro-independence debate brief',
  anti: 'Anti-independence / pro-federation debate brief'
};

export function ReportPage({ topic, report, kind }: { topic: TopicMeta; report: MarkdownFile; kind: ReportKind }) {
  return (
    <>
      <DossierHeader className="report-hero" topic={topic} sourceFile={report.path} />

      <section className="section dossier-tab-strip">
        <DossierNav active={kind} topic={topic} />
      </section>

      <section className="section report-layout">
        <div className="report-context mono">{REPORT_LABEL[kind]}</div>
        <article className="report-body">
          <MarkdownText body={report.body} />
        </article>
      </section>
    </>
  );
}
