import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { ClaimRecord, MarkdownFile, RepositoryContent, SourceRecord, TopicFiles, TopicMeta } from './types';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');

function contentRelative(relativePath: string): string {
  return relativePath.replace(/^content[\\/]/, '');
}

function readYaml<T>(relativePath: string): T {
  const absolutePath = path.join(CONTENT_DIR, contentRelative(relativePath));
  return yaml.load(fs.readFileSync(absolutePath, 'utf8')) as T;
}

function maybeMarkdown(relativePath: string): MarkdownFile | null {
  const absolutePath = path.join(CONTENT_DIR, contentRelative(relativePath));
  if (!fs.existsSync(absolutePath)) return null;
  const parsed = matter(fs.readFileSync(absolutePath, 'utf8'));
  return {
    title: typeof parsed.data.title === 'string' ? parsed.data.title : path.basename(relativePath),
    frontmatter: parsed.data,
    body: parsed.content.trim(),
    path: relativePath.replaceAll('\\', '/')
  };
}

function readTopicClaims(slug: string): ClaimRecord[] {
  const relativePath = `content/topics/${slug}/claims.yml`;
  const absolutePath = path.join(CONTENT_DIR, contentRelative(relativePath));
  if (!fs.existsSync(absolutePath)) return [];
  const parsed = readYaml<{ claims?: Array<Partial<ClaimRecord>> }>(relativePath);
  return (parsed.claims ?? [])
    .filter((claim): claim is ClaimRecord => Boolean(claim.text && claim.status && claim.source_ids))
    .map((claim) => ({
      id: claim.id ?? '',
      topic_slug: claim.topic_slug ?? slug,
      text: claim.text ?? '',
      status: claim.status as ClaimRecord['status'],
      source_ids: claim.source_ids ?? [],
      risk: (claim.risk as ClaimRecord['risk']) ?? 'medium'
    }));
}

function readTopicFiles(slug: string): TopicFiles {
  const sourceFile = `content/topics/${slug}/sources.yml`;
  const sourcePath = path.join(CONTENT_DIR, contentRelative(sourceFile));
  const sourceIds = fs.existsSync(sourcePath) ? (readYaml<{ source_ids?: string[] }>(sourceFile).source_ids ?? []) : [];
  const auditFile = `content/topics/${slug}/audit-log.yml`;
  const redebateFile = `content/topics/${slug}/redebate-log.yml`;
  const auditEntries = fs.existsSync(path.join(CONTENT_DIR, contentRelative(auditFile))) ? (readYaml<{ entries?: Record<string, unknown>[] }>(auditFile).entries ?? []) : [];
  const redebateEntries = fs.existsSync(path.join(CONTENT_DIR, contentRelative(redebateFile))) ? (readYaml<{ entries?: Record<string, unknown>[] }>(redebateFile).entries ?? []) : [];

  return {
    index: maybeMarkdown(`content/topics/${slug}/index.mdx`),
    reports: {
      neutral: maybeMarkdown(`content/topics/${slug}/neutral.mdx`),
      pro: maybeMarkdown(`content/topics/${slug}/pro.mdx`),
      anti: maybeMarkdown(`content/topics/${slug}/anti.mdx`)
    },
    sourceIds,
    claims: readTopicClaims(slug),
    auditEntries,
    redebateEntries
  };
}

function collectRawRecords(value: unknown, records: unknown[] = []): unknown[] {
  records.push(value);
  if (Array.isArray(value)) {
    value.forEach((item) => collectRawRecords(item, records));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectRawRecords(item, records));
  }
  return records;
}

export function loadRepositoryContent(): RepositoryContent {
  const topicIndex = readYaml<{ topics: TopicMeta[] }>('content/topics/_index.yml');
  const sourcesFile = readYaml<{ sources: SourceRecord[] }>('content/sources/sources.yml');
  const claimsFile = readYaml<{ claims: ClaimRecord[] }>('content/claims/claim-ledger.yml');
  const glossaryFile = readYaml<{ terms: Array<{ term: string; definition: string }> }>('content/glossary.yml');
  const changelogFile = readYaml<{ entries: Array<Record<string, unknown>> }>('content/changelog.yml');
  const status = readYaml<Record<string, unknown>>('content/status/status-snapshot.yml');

  const topicFiles = Object.fromEntries(topicIndex.topics.map((topic) => [topic.slug, readTopicFiles(topic.slug)]));
  const topicClaims = Object.values(topicFiles).flatMap((files) => files.claims);
  const topics = topicIndex.topics.map((topic) => {
    const files = topicFiles[topic.slug];
    return {
      ...topic,
      source_count: files?.sourceIds.length ?? 0,
      claim_count: files?.claims.length ?? 0
    };
  });

  return {
    topics,
    sources: sourcesFile.sources,
    claims: [...claimsFile.claims, ...topicClaims],
    glossary: glossaryFile.terms,
    changelog: changelogFile.entries,
    status,
    topicFiles,
    rawRecords: collectRawRecords({
      topicIndex,
      sourcesFile,
      claimsFile,
      glossaryFile,
      changelogFile,
      status,
      topicFiles
    })
  };
}

export function contentRoot(): string {
  return CONTENT_DIR;
}
