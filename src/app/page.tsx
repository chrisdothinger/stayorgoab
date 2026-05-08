import Link from 'next/link';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'StayOrGoAB — Alberta referendum, independence, and separation answers',
  description: 'Source-backed, non-partisan answers on Alberta independence, Alberta separation, referendum mechanics, legal process, economic questions, claims, and evidence.',
  pathname: '/',
  keywords: ['Alberta referendum 2026', 'Alberta independence referendum', 'Alberta separation referendum']
});

export default function HomePage() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'StayOrGoAB',
    url: absoluteUrl('/'),
    description: 'Source-backed, non-partisan answers on Alberta referendum, independence, and separation questions.',
    inLanguage: 'en-CA',
    about: [
      'Alberta referendum',
      'Alberta independence',
      'Alberta separation',
      'Canadian secession law'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="hero landing-hero">
        <div>
          <div className="section-label mono">/ Source-backed answers on Alberta independence</div>
          <h1>Stay or go?</h1>
          <p>Understand what Alberta independence would actually mean. StayOrGoAB is a source-first, autonomous, non-partisan knowledge base for arguments, claims, sources, and public review trails.</p>
        </div>
        <Link className="question-entry-portal" href="/questions">
          <span className="question-entry-kicker mono">Questions</span>
          <strong>Choose the question before choosing a side.</strong>
          <span className="question-entry-copy">Browse source-backed questions about Alberta separation and independence. Each question starts with a balanced overview, then links to the evidence, claims, pro case, and anti case.</span>
          <span className="question-entry-action mono">Browse the questions →</span>
        </Link>
      </section>
    </>
  );
}
