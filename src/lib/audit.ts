import type { RepositoryContent } from './types';

export interface AuditPageRecord {
  path: string;
  source_file: string;
  last_audited_at: string | null;
  last_debated_at: string | null;
  latest_agent_run_id: string;
  source_count: number;
  claim_count: number;
  publication_state: string;
}

export interface AuditManifest {
  site_name: 'StayOrGoAB';
  generated_at: string;
  repository: string;
  commit_sha: string;
  pages: AuditPageRecord[];
}

export function buildAuditManifest(content: RepositoryContent): AuditManifest {
  const topicPages = content.topics.flatMap((topic) => {
    const base = {
      last_audited_at: topic.last_audited_at,
      last_debated_at: topic.last_debated_at,
      latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
      source_count: topic.source_count,
      claim_count: topic.claim_count,
      publication_state: topic.state
    };
    return [
      { path: `/questions/${topic.slug}`, source_file: `content/topics/${topic.slug}/index.mdx`, ...base },
      { path: `/questions/${topic.slug}/claims`, source_file: `content/topics/${topic.slug}/claims.yml`, ...base },
      { path: `/questions/${topic.slug}/sources`, source_file: `content/topics/${topic.slug}/sources.yml`, ...base }
    ];
  });

  return {
    site_name: 'StayOrGoAB',
    generated_at: new Date().toISOString(),
    repository: 'github.com/chrisdothinger/stayorgoab',
    commit_sha: process.env.GITHUB_SHA ?? 'local',
    pages: [
      {
        path: '/',
        source_file: 'src/app/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: content.sources.length,
        claim_count: content.claims.length,
        publication_state: 'seed'
      },
      {
        path: '/questions',
        source_file: 'src/app/questions/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: content.sources.length,
        claim_count: content.claims.length,
        publication_state: 'public_index'
      },
      {
        path: '/sources',
        source_file: 'src/app/sources/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: content.sources.length,
        claim_count: content.claims.length,
        publication_state: 'public_index'
      },
      {
        path: '/method',
        source_file: 'src/app/method/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: content.sources.length,
        claim_count: content.claims.length,
        publication_state: 'method'
      },
      {
        path: '/agents',
        source_file: 'src/app/agents/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: 0,
        claim_count: 0,
        publication_state: 'ops'
      },
      {
        path: '/audit',
        source_file: 'src/app/audit/page.tsx',
        last_audited_at: '2026-05-08',
        last_debated_at: null,
        latest_agent_run_id: 'pr-76-agentic-workflow-refresh-2026-05-08',
        source_count: content.sources.length,
        claim_count: content.claims.length,
        publication_state: 'review_trail'
      },
      ...topicPages
    ]
  };
}
