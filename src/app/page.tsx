import Link from 'next/link';

const landingLinks = [
  {
    href: '/questions',
    label: 'Questions',
    text: 'Browse dossiers, neutral syntheses, pro and anti reports, claim ledgers, and source trails.'
  },
  {
    href: '/sources',
    label: 'Sources',
    text: 'Inspect the public source library behind the claims and topic summaries.'
  },
  {
    href: '/method',
    label: 'Method / Ops',
    text: 'See how source handling, autonomous checks, review logs, and publication limits work.'
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero landing-hero">
        <div>
          <div className="section-label mono">/ Source-backed answers on Alberta independence</div>
          <h1>Stay or go?</h1>
          <p>Understand what Alberta independence would actually mean. StayOrGoAB is a source-first, autonomous, non-partisan knowledge base for arguments, claims, sources, and public review trails.</p>
        </div>
        <nav className="landing-nav" aria-label="Main site sections">
          {landingLinks.map((item) => (
            <Link className="landing-link" href={item.href} key={item.href}>
              <span className="mono">{item.label}</span>
              <strong>{item.text}</strong>
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
