import Link from 'next/link';

export const metadata = { title: 'Method' };

export default function MethodPage() {
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Method</div>
        <h1>How StayOrGoAB works</h1>
        <p>The site separates known facts, disputed claims, uncertainty, arguments, sources, and public audit records. It does not tell readers how to vote.</p>
      </section>

      <section className="section grid-two">
        <div><h2>Source-backed before persuasive</h2></div>
        <div className="markdown">
          <p>Every claim is expected to trace to a source record, a topic claim ledger, and a visible publication state. Sparse pages are allowed; fake completeness is not.</p>
          <p>Source records track publisher, author where available, dates, source type, reliability category, summary, how the source is used, related topics, and checking status.</p>
        </div>
      </section>

      <section className="section grid-two">
        <div><h2>Autonomous, but cautious</h2></div>
        <div className="markdown">
          <p>Hermes agents can update repository content and trigger validators. Automated checks can publish, downgrade, withhold, or roll back content.</p>
          <p>High-risk legal, financial, election, Indigenous-rights, and public-service topics require stronger source support and clearer uncertainty language.</p>
          <p>No publication workflow requires human approval, human review, human verification, or human sign-off. Human input is signal; automated evidence gates decide publication state.</p>
        </div>
      </section>

      <section className="section grid-two">
        <div><h2>What is never published</h2></div>
        <div className="markdown">
          <p>Secrets, credentials, raw provider logs, raw agent transcripts, hidden chain-of-thought, private submissions, cookies, auth headers, and unnecessary personal data are excluded by rule and scanner.</p>
          <p>Public audit artifacts are redacted summaries: enough to inspect what changed and why, not enough to leak private or unsafe material.</p>
          <p><Link href="/ops">View operational observability</Link> · <Link href="/audit">View audit trail</Link></p>
        </div>
      </section>
    </>
  );
}
