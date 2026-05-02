import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export default function HomePage() {
  const content = loadRepositoryContent();
  const statusItems = Array.isArray(content.status.items) ? content.status.items as Array<Record<string, string>> : [];
  const popular = content.topics.slice(0, 5);

  return (
    <>
      <section className="hero">
        <div>
          <h1>Stay or go?</h1>
          <p>Understand what Alberta independence would actually mean. StayOrGoAB is a source-first, autonomous, non-partisan knowledge base for facts, arguments, claims, sources, and public audit trails.</p>
          <div className="source-trail mono">
            <Link href="/facts">Start with the facts</Link>
            <Link href="/questions">Search the questions</Link>
            <Link href="/sources">Source library</Link>
            <Link href="/method">How the agents work</Link>
          </div>
        </div>
        <aside className="status-readout" aria-label="Current status">
          <div className="section-label mono">/ Current status</div>
          {statusItems.map((item) => (
            <div className="data-row" key={item.id}>
              <span className="mono row-meta">{item.state}</span>
              <strong>{item.label}</strong>
              <span className="mono row-meta">source</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Questions</div>
          <h2>The questions that matter</h2>
        </div>
        <div className="link-list">
          {popular.map((topic, index) => (
            <div className="index-row" key={topic.slug}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <Link href={`/questions/${topic.slug}`}>{topic.title}</Link>
              <span className="mono row-meta state">{topic.category}</span>
              <span className="mono">+</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
