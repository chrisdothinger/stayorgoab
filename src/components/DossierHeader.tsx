import { AuditMeta } from '@/components/AuditMeta';
import type { TopicMeta } from '@/lib/types';

export function DossierHeader({
  topic,
  sourceFile,
  className = ''
}: {
  topic: TopicMeta;
  sourceFile: string;
  className?: string;
}) {
  return (
    <section className={`section dossier-hero${className ? ` ${className}` : ''}`}>
      <div className="section-label mono">/ {topic.category}</div>
      <h1>{topic.title}</h1>
      <p>{topic.summary}</p>
      <AuditMeta
        sourceCount={topic.source_count}
        claimCount={topic.claim_count}
        audited={topic.last_audited_at}
        debated={topic.last_debated_at}
        sourceFile={sourceFile}
      />
    </section>
  );
}
