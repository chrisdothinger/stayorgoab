import Link from 'next/link';
import type { TopicMeta } from '@/lib/types';

type ReportAvailability = {
  neutral?: boolean;
  pro?: boolean;
  anti?: boolean;
};

function NavItem({ href, label, active, available = true }: { href: string; label: string; active?: boolean; available?: boolean }) {
  if (!available) return <span aria-disabled="true">{label} pending</span>;
  return <Link aria-current={active ? 'page' : undefined} href={href}>{label}</Link>;
}

export function DossierNav({
  topic,
  active,
  reports = { neutral: true, pro: true, anti: true }
}: {
  topic: TopicMeta;
  active?: 'dossier' | 'neutral' | 'pro' | 'anti' | 'claims' | 'sources';
  reports?: ReportAvailability;
}) {
  return (
    <nav className="category-nav mono dossier-nav" aria-label="Dossier navigation">
      <NavItem active={active === 'dossier'} href={`/questions/${topic.slug}`} label="Overview" />
      <NavItem active={active === 'neutral'} available={reports.neutral} href={`/questions/${topic.slug}/neutral`} label="Neutral" />
      <NavItem active={active === 'pro'} available={reports.pro} href={`/questions/${topic.slug}/pro`} label="Pro" />
      <NavItem active={active === 'anti'} available={reports.anti} href={`/questions/${topic.slug}/anti`} label="Anti" />
      <NavItem active={active === 'claims'} href={`/questions/${topic.slug}/claims`} label="Claims" />
      <NavItem active={active === 'sources'} href={`/questions/${topic.slug}/sources`} label="Sources" />
    </nav>
  );
}
