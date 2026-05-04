export type PublicationState =
  | 'stub'
  | 'seed_overview'
  | 'source_collection'
  | 'partial_dossier'
  | 'full_dossier'
  | 'needs_audit'
  | 'needs_redebate'
  | 'withheld_pending_support'
  | 'withhold_pending_support'
  | 'archived';
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
  slug?: string;
  title: string;
  publisher: string;
  author?: string | null;
  url: string;
  published_at?: string | null;
  source_type: 'official' | 'court' | 'advocacy' | 'academic' | 'media' | 'other';
  accessed_at: string;
  stance?: string | null;
  reliability_category?: string | null;
  summary: string;
  how_used?: string | null;
  related_topic_slugs?: string[];
  archive_url?: string | null;
  content_hash?: string | null;
  last_checked_at?: string | null;
  status?: string | null;
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
