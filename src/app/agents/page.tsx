import { loadOpsSnapshot } from '@/lib/ops';

export const metadata = { title: 'Agents' };

export default function AgentsPage() {
  const ops = loadOpsSnapshot();
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Agents</div>
        <h1>Public agent team</h1>
        <p>Automated workflow identities operate through GitHub-native content and workflow changes. Public summaries are redacted; raw logs and private submissions are not published.</p>
      </section>

      <section className="section grid-two">
        <div>
          <div className="section-label mono">/ Permission model</div>
          <h2>Automated gates, not approval gates</h2>
        </div>
        <div className="status-readout">
          {Object.entries(ops.permissionLevels).map(([level, description]) => (
            <article className="data-row" key={level}>
              <span className="mono row-meta">{level}</span>
              <strong>{description}</strong>
              <span className="mono row-meta">scope</span>
            </article>
          ))}
        </div>
      </section>

      <section className="link-list">
        {ops.agents.map((agent, index) => {
          const permissions = ops.permissions[agent.id]?.allowed_paths ?? [];
          return (
            <article className="index-row" key={agent.id}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <strong>{agent.name}</strong>
              <span className="mono row-meta state">{agent.level}</span>
              <span className="mono">+</span>
              <div className="expanded-row">
                <p>{agent.purpose}</p>
                <p className="mono row-meta">Persona: {agent.persona ?? 'unlisted'}</p>
                <p className="mono row-meta">Prompts: {(agent.prompts ?? []).join(' · ') || 'unlisted'}</p>
                <p className="mono row-meta">Rubrics: {(agent.rubrics ?? []).join(' · ') || 'unlisted'}</p>
                <p className="mono row-meta">Allowed paths: {permissions.join(' · ')}</p>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
