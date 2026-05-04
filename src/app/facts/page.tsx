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
              <p className="row-description">{String(item.summary)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ What is confirmed</div>
          <h2>Known, disputed, unknown</h2>
        </div>
        <div className="status-readout">
          <article className="data-row">
            <span className="mono row-meta">Known</span>
            <strong>A petition and referendum process exists.</strong>
            <span className="mono row-meta">official sources</span>
            <p className="row-description">Elections Alberta and Alberta statutes describe procedural steps. A petition or referendum result is not the same thing as independence.</p>
          </article>
          <article className="data-row">
            <span className="mono row-meta">Disputed</span>
            <strong>Economic, pension, debt, treaty, and border outcomes.</strong>
            <span className="mono row-meta">model-dependent</span>
            <p className="row-description">Those outcomes depend on negotiations, assumptions, federal response, Indigenous rights, market reaction, and future policy choices.</p>
          </article>
          <article className="data-row">
            <span className="mono row-meta">Unknown</span>
            <strong>Final terms of any constitutional settlement.</strong>
            <span className="mono row-meta">not settled</span>
            <p className="row-description">No current source can honestly state final negotiated terms. Sparse topics remain labelled as sparse until supported.</p>
          </article>
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
