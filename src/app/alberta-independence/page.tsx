import { KeywordEntryPage } from '@/components/KeywordEntryPage';
import { getKeywordEntryPage } from '@/lib/keyword-entry-pages';
import { pageMetadata } from '@/lib/seo';

const page = getKeywordEntryPage('alberta-independence');

export const metadata = pageMetadata({
  title: page?.title ?? 'StayOrGoAB Alberta guide',
  description: page?.description ?? 'Source-backed Alberta referendum, independence, and separation guide.',
  pathname: '/alberta-independence/',
  keywords: page?.keywords ?? []
});

export default function Page() {
  if (!page) return null;
  return <KeywordEntryPage page={page} />;
}
