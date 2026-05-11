import Link from 'next/link';
import { keywordEntryPageJsonLd, type KeywordEntryPage } from '@/lib/keyword-entry-pages';

const questionLabels: Record<string, string> = {
  'legal-process': 'Legal process',
  'referendum-mechanics': 'Referendum mechanics',
  'referendum-ballot-2026': 'Ballot wording',
  'petition-vs-referendum-vs-negotiations': 'Petition vs. referendum vs. negotiations',
  'indigenous-rights-treaties': 'Indigenous and treaty rights',
  'cpp-pensions': 'CPP and pensions',
  'federal-debt-assets': 'Federal debt and assets',
  'currency-banking': 'Currency and banking',
  'borders-currency-citizenship': 'Borders, currency, and citizenship'
};

function questionHref(slug: string) {
  return `/questions/${slug}`;
}

export function KeywordEntryPage({ page }: { page: KeywordEntryPage }) {
  const jsonLd = keywordEntryPageJsonLd(page);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="section keyword-entry-hero">
        <div>
          <div className="section-label mono">/ {page.kicker}</div>
          <h1>{page.h1}</h1>
          <p>{page.intro}</p>
        </div>
        <aside className="keyword-entry-panel" aria-label="Start here">
          <span className="mono panel-kicker">Start here</span>
          <Link href="/" className="panel-primary-link">StayOrGoAB homepage</Link>
          <p>The homepage is the front door. These keyword pages exist so readers searching common terms can land on the right source-backed path instead of a slogan page.</p>
          <Link href="/questions" className="button-link mono">Browse all questions →</Link>
        </aside>
      </section>

      <section className="section grid-two keyword-entry-section">
        <div>
          <div className="section-label mono">/ Main dossier</div>
          <h2>Best first read</h2>
          <p>For this search, start with the core dossier below, then branch into the supporting questions.</p>
        </div>
        <div className="link-list keyword-link-list">
          <Link className="index-row compact-index-row" href={questionHref(page.primaryQuestionSlug)}>
            <span className="mono">01</span>
            <span>{questionLabels[page.primaryQuestionSlug] ?? page.primaryQuestionSlug}</span>
            <span className="row-meta mono">Open</span>
            <span aria-hidden="true">→</span>
          </Link>
          {page.relatedQuestionSlugs.map((slug, index) => (
            <Link className="index-row compact-index-row" href={questionHref(slug)} key={slug}>
              <span className="mono">{String(index + 2).padStart(2, '0')}</span>
              <span>{questionLabels[slug] ?? slug}</span>
              <span className="row-meta mono">Related</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section grid-two keyword-entry-section">
        <div>
          <div className="section-label mono">/ Quick answers</div>
          <h2>Common search questions</h2>
          <p>Short answers for orientation. The linked dossiers carry the source trail and caveats.</p>
        </div>
        <div className="faq-list">
          {page.faq.map((item) => (
            <details key={item.question} open>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
