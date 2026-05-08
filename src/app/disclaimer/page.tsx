import { MarkdownText } from '@/components/MarkdownText';
import { loadRepositoryContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'StayOrGoAB disclaimer',
  description: 'Disclaimer for StayOrGoAB: independent, non-partisan Alberta referendum and independence research; not legal, financial, tax, voting, or professional advice.',
  pathname: '/disclaimer/',
  keywords: ['Alberta referendum disclaimer', 'Alberta independence research disclaimer']
});

export default function DisclaimerPage() {
  loadRepositoryContent();
  return (
    <section className="section">
      <div className="section-label mono">/ Disclaimer</div>
      <h1>Disclaimer</h1>
      <MarkdownText body={`StayOrGoAB is an independent, non-partisan civic research project. It is not affiliated with Elections Alberta, the Government of Alberta, the Government of Canada, any campaign, party, advocacy group, or referendum committee.

The site provides source-backed research and analysis for public understanding. It is not legal, financial, investment, tax, voting, or professional advice. For official voting, petition, referendum, and eligibility information, consult the relevant official sources directly.`} />
    </section>
  );
}
