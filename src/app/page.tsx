import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export default function HomePage() {
  const { topics } = loadRepositoryContent();

  return (
    <>
      <section className="hero landing-hero">
        <div>
          <div className="section-label mono">/ Source-backed answers on Alberta independence</div>
          <h1>Stay or go?</h1>
          <p>Understand what Alberta independence would actually mean. StayOrGoAB is a source-first, autonomous, non-partisan knowledge base for arguments, claims, sources, and public review trails.</p>
        </div>
        <Link className="question-entry-portal" href="/questions">
          <span className="question-entry-kicker mono">001 / Questions</span>
          <strong>Choose the question before choosing a side.</strong>
          <span className="question-entry-copy">Browse {topics.length} source-backed questions about Alberta separation and independence. Each question links to the evidence, claims, pro case, anti case, and neutral synthesis where available.</span>
          <span className="question-entry-action mono">Browse the questions →</span>
        </Link>
      </section>
    </>
  );
}
