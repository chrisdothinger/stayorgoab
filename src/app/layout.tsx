import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'StayOrGoAB',
    template: '%s | StayOrGoAB'
  },
  description: 'Source-backed answers on Alberta independence, the referendum process, and the strongest arguments on both sides.'
};

const navItems = [
  ['Facts', '/facts'],
  ['Questions', '/questions'],
  ['Sources', '/sources'],
  ['Method', '/method'],
  ['Ops', '/ops']
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
              <Link href="/disclaimer">Disclaimer</Link> · <Link href="/audit">Review log</Link> · <Link href="/agents">Agents</Link> · <Link href="/ops">Ops</Link>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
