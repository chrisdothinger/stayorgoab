export type PublicationState = 'stub' | 'seed_overview' | 'full_dossier' | 'withhold_pending_support';
export type ClaimStatus = 'source_supported' | 'inference' | 'unsupported' | 'disputed';

export interface TopicMeta {
  slug: string;
  title: string;
  plain_question: string;
  category: string;
  state: PublicationState;
  time_sensitivity: 'low' | 'medium' | 'high';
  keywords: string[];
  summary: string;
  last_audited_at: string | null;
  last_debated_at: string | null;
  source_count: number;
  claim_count: number;
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url: string;
  source_type: 'official' | 'court' | 'advocacy' | 'academic' | 'media' | 'other';
  accessed_at: string;
  summary: string;
}

export interface ClaimRecord {
  id: string;
  topic_slug: string;
  text: string;
  status: ClaimStatus;
  source_ids: string[];
  risk: 'low' | 'medium' | 'high';
}

export interface MarkdownFile {
  title: string;
  frontmatter: Record<string, unknown>;
  body: string;
  path: string;
}

export interface TopicFiles {
  index: MarkdownFile | null;
  reports: {
    neutral: MarkdownFile | null;
    pro: MarkdownFile | null;
    anti: MarkdownFile | null;
  };
  sourceIds: string[];
  claims: ClaimRecord[];
  auditEntries: Record<string, unknown>[];
  redebateEntries: Record<string, unknown>[];
}

export interface RepositoryContent {
  topics: TopicMeta[];
  sources: SourceRecord[];
  claims: ClaimRecord[];
  glossary: Array<{ term: string; definition: string }>;
  changelog: Array<Record<string, unknown>>;
  status: Record<string, unknown>;
  topicFiles: Record<string, TopicFiles>;
  rawRecords: unknown[];
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}
