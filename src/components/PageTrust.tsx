import Link from 'next/link';

type TrustMetric = {
  label: string;
  value: string | number;
  detail?: string;
};

type TrustLink = {
  href: string;
  label: string;
};

export function PageTrust({
  sourceStatus,
  reviewStatus,
  metrics = [],
  sourceHref = '/sources',
  reviewHref = '/audit',
  sourceLabel = 'Inspect sources',
  reviewLabel = 'Open review trail',
  links = []
}: {
  sourceStatus: string;
  reviewStatus: string;
  metrics?: TrustMetric[];
  sourceHref?: string;
  reviewHref?: string;
  sourceLabel?: string;
  reviewLabel?: string;
  links?: TrustLink[];
}) {
  return (
    <section className="page-trust" aria-label="Page trust">
      <div>
        <span className="mono row-meta">Source status</span>
        <strong>{sourceStatus}</strong>
      </div>
      <div>
        <span className="mono row-meta">Review trail</span>
        <strong>{reviewStatus}</strong>
      </div>
      {metrics.map((metric) => (
        <div key={metric.label}>
          <span className="mono row-meta">{metric.label}</span>
          <strong>{metric.value}</strong>
          {metric.detail ? <p>{metric.detail}</p> : null}
        </div>
      ))}
      <nav className="page-trust-links mono" aria-label="Page trust links">
        <Link href={sourceHref}>{sourceLabel}</Link>
        <Link href={reviewHref}>{reviewLabel}</Link>
        {links.map((link) => <Link key={`${link.href}-${link.label}`} href={link.href}>{link.label}</Link>)}
      </nav>
    </section>
  );
}
