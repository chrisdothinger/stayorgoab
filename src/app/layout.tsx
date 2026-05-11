import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';
import { CORE_KEYWORDS, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'StayOrGoAB — Alberta referendum, independence, and separation answers',
    template: '%s | StayOrGoAB'
  },
  description: 'Source-backed answers on Alberta independence, Alberta separation, the referendum process, and the strongest arguments on both sides.',
  applicationName: 'StayOrGoAB',
  keywords: CORE_KEYWORDS,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'StayOrGoAB — Alberta referendum, independence, and separation answers',
    description: 'Source-backed, non-partisan research on Alberta independence, Alberta separation, referendum mechanics, claims, evidence, and sources.',
    url: '/',
    siteName: 'StayOrGoAB',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayOrGoAB',
    description: 'Source-backed answers on Alberta independence, separation, and referendum questions.',
    images: [DEFAULT_OG_IMAGE]
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true
  }
};

const navItems = [
  ['Questions', '/questions'],
  ['Sources', '/sources'],
  ['How this works', '/method']
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <header className="site-header mono">
            <Link className="brand" href="/">StayOrGoAB</Link>
            <nav aria-label="Primary navigation">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </nav>
            <div className="right">
              <Link href="/repo">GitHub</Link>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="footer mono">
            <span>Independent non-partisan research project. Not legal or financial advice.</span>
            <span>
              <Link href="/disclaimer">Disclaimer</Link> · <Link href="/audit">Review trail</Link> · <Link href="/agents">Agents</Link>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
