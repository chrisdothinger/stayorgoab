import { loadRepositoryContent } from '@/lib/content';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

export const metadata = { title: 'Agents' };

export default function AgentsPage() {
  loadRepositoryContent();
  const registry = yaml.load(fs.readFileSync(path.join(process.cwd(), 'agents/registry.yml'), 'utf8')) as { agents: Array<Record<string, string>> };
  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Agents</div>
        <h1>Public agent team</h1>
        <p>Hermes agents are expected to operate through GitHub-native content and workflow changes. Public summaries are redacted.</p>
      </section>
      <section className="link-list">
        {registry.agents.map((agent, index) => (
          <article className="index-row" key={agent.id}>
            <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
            <strong>{agent.name}</strong>
            <span className="mono row-meta state">{agent.level}</span>
            <span className="mono">+</span>
            <p className="expanded-row">{agent.purpose}</p>
          </article>
        ))}
      </section>
    </>
  );
}
