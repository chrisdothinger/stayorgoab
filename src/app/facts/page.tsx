import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Facts' };

export default function FactsPage() {
  const content = loadRepositoryContent();
  const statusItems = Array.isArray(content.status.items) ? content.status.items as Array<Record<string, string | string[]>> : [];

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Facts</div>
        <h1>The facts: where things stand</h1>
        <p>A live procedural snapshot of the Alberta independence petition, the 2026 referendum context, and the legal steps that would follow any vote.</p>
      </section>
      <section className="section">
        <div className="status-readout">
          {statusItems.map((item) => (
            <div className="data-row" key={String(item.id)}>
              <span className="mono row-meta">{String(item.state)}</span>
              <strong>{String(item.label)}</strong>
              <span className="mono row-meta">{Array.isArray(item.source_ids) ? item.source_ids.length : 0} sources</span>
              <p style={{ gridColumn: '2 / -1', margin: 0, color: 'var(--secondary)' }}>{String(item.summary)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Process</div>
          <h2>Petition, referendum, negotiations</h2>
        </div>
        <div className="markdown">
          <p>A petition is a procedural step. A referendum is a democratic event. Independence would require negotiations and constitutional change.</p>
          <p><Link href="/questions/referendum-mechanics">Read referendum mechanics</Link></p>
        </div>
      </section>
    </>
  );
}
