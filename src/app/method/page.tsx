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
        <div><h2>Autonomous, but cautious</h2></div>
        <div className="markdown">
          <p>Hermes agents can later update repository content and trigger validators. Automated checks can publish, downgrade, withhold, or roll back content.</p>
          <p>High-risk topics require stronger source support and clearer uncertainty language.</p>
        </div>
      </section>
    </>
  );
}
