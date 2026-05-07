import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { loadRepositoryContent } from '@/lib/content';
import { hasDeletedV3Section, hasLegacyReportContract, hasLeanReportContract } from '@/lib/dossier-contract';
import type { ReportKind } from '@/lib/dossier-contract';
import { validateContentModel } from '@/lib/validation';
import { validateDossierMigrationManifest } from '../../scripts/validate-dossier-migration';
import { validateTopicQuestionRegistry } from '../../scripts/validate-topic-questions';

describe('content validation', () => {
  it('keeps public-facing site and ops copy free of private assistant names', () => {
    const roots = ['src/app', 'src/components', 'content', 'ops', 'agents'];
    const offenders: string[] = [];
    const ignored = new Set(['node_modules', '.next', 'out']);

    function walk(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ignored.has(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(tsx?|mdx?|ya?ml|json)$/.test(entry.name)) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (/\bHermes\b/.test(text)) offenders.push(full);
      }
    }

    for (const root of roots) walk(path.join(process.cwd(), root));
    expect(offenders).toEqual([]);
  });

  it('accepts the checked-in content model', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel(content);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('keeps question categories consolidated enough to be useful as filters', () => {
    const content = loadRepositoryContent();
    const categories = [...new Set(content.topics.map((topic) => topic.category))].sort();
    const expectedCategories = [
      'Economy, taxes, and finance',
      'Energy, resources, and environment',
      'Foreign affairs, defence, and recognition',
      'Government institutions and regulators',
      'Indigenous rights, treaties, and land',
      'Justice, rights, and public safety',
      'Legal process and referendum',
      'Public services, health, and benefits',
      'Trade, borders, and mobility',
      'Work, education, and everyday life'
    ];

    expect(categories).toEqual(expectedCategories);
    expect(categories.length).toBeLessThanOrEqual(12);
    expect(categories.length).toBeGreaterThanOrEqual(8);

    const categoryCounts = categories.map((category) => ({
      category,
      count: content.topics.filter((topic) => topic.category === category).length
    }));

    expect(categoryCounts.every((entry) => entry.count >= 2)).toBe(true);
  });

  it('derives topic source and claim counts from dossier files instead of stale index metadata', () => {
    const content = loadRepositoryContent();
    const mismatches = content.topics.flatMap((topic) => {
      const files = content.topicFiles[topic.slug];
      const expectedSourceCount = files.sourceIds.length;
      const expectedClaimCount = files.claims.length;
      return [
        topic.source_count === expectedSourceCount ? null : `${topic.slug}:sources:${topic.source_count}:${expectedSourceCount}`,
        topic.claim_count === expectedClaimCount ? null : `${topic.slug}:claims:${topic.claim_count}:${expectedClaimCount}`
      ].filter((item): item is string => Boolean(item));
    });

    expect(mismatches).toEqual([]);
  });

  it('validates the topic-question registry and public question format', () => {
    const result = validateTopicQuestionRegistry();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('validates the dossier migration manifest before bulk v3 rewrites', () => {
    const result = validateDossierMigrationManifest();
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('requires every current question topic to have public neutral, pro, and anti report content without overclaiming full status', () => {
    const content = loadRepositoryContent();
    const missing = content.topics.flatMap((topic) => {
      const files = content.topicFiles[topic.slug];
      return [
        files.reports.neutral ? null : `${topic.slug}:neutral`,
        files.reports.pro ? null : `${topic.slug}:pro`,
        files.reports.anti ? null : `${topic.slug}:anti`,
        files.sourceIds.length > 0 ? null : `${topic.slug}:sources`,
        files.claims.length > 0 ? null : `${topic.slug}:claims`,
        files.auditEntries.length > 0 ? null : `${topic.slug}:review-log`,
        files.redebateEntries.length > 0 ? null : `${topic.slug}:redebate-log`
      ].filter((item): item is string => Boolean(item));
    });

    expect(missing).toEqual([]);
    expect(content.topics.filter((topic) => topic.state === 'full_dossier').map((topic) => topic.slug).sort()).toEqual(
      content.topics.map((topic) => topic.slug).sort()
    );
  });

  it('requires every full dossier report to have a validated public dossier contract', () => {
    const content = loadRepositoryContent();
    const incomplete = content.topics.filter((topic) => topic.state === 'full_dossier').flatMap((topic) => {
      const files = content.topicFiles[topic.slug];
      const reports = [files.reports.neutral, files.reports.pro, files.reports.anti] as const;
      return reports.flatMap((report, index) => {
        const stance = ['neutral', 'pro', 'anti'][index] as ReportKind;
        if (!report) return [`${topic.slug}:${stance}:missing`];
        const body = report.body.toLowerCase();
        const hasLegacyContract = hasLegacyReportContract(body);
        const hasLeanContract = hasLeanReportContract(body, stance);
        const checks: Array<string | null> = hasLegacyContract || hasLeanContract ? [] : [
          `${topic.slug}:${stance}:report-contract`
        ];
        checks.push(hasLeanContract && hasDeletedV3Section(body) ? `${topic.slug}:${stance}:retired-v3-section` : null);
        checks.push(body.length > 5000 ? null : `${topic.slug}:${stance}:too-short`);
        const sourceSection = report.body.split(/## sources/i)[1]?.split(/\n## /)[0] ?? '';
        checks.push(/\[[a-z][a-z0-9_-]*(?:\s*,\s*[a-z0-9_-]+)*\]/i.test(report.body.split(/## sources/i)[0] ?? '') ? `${topic.slug}:${stance}:raw-source-id-citation` : null);
        files.sourceIds.forEach((sourceId, sourceIndex) => {
          const sourceNumber = sourceIndex + 1;
          checks.push(sourceSection.includes(`${sourceNumber}.`) && sourceSection.includes(`\`${sourceId}\``) ? null : `${topic.slug}:${stance}:source-${sourceNumber}`);
        });
        if (stance === 'neutral') {
          checks.push(body.includes('pro report') || body.includes('pro-independence') ? null : `${topic.slug}:neutral:pro-mediation`);
          checks.push(body.includes('anti report') || body.includes('pro-federation') ? null : `${topic.slug}:neutral:anti-mediation`);
          checks.push(body.includes('mediator') || body.includes('synthesis') ? null : `${topic.slug}:neutral:mediator-role`);
        }
        return checks.filter((item): item is string => Boolean(item));
      });
    });

    expect(incomplete).toEqual([]);
  });

  it('accepts three-to-five-pillar v3 pro/anti contracts and rejects retired v3 sections', () => {
    const v3Base = `## Bottom line

Clear answer.

## The case in 3 pillars

### 1. First pillar
Argument.

### 2. Second pillar
Argument.

### 3. Third pillar
Argument.

## Best objections / replies

Objection and reply.

## What would change this assessment

New source.

## Sources

1. Source`;

    expect(hasLeanReportContract(v3Base, 'pro')).toBe(true);
    expect(hasDeletedV3Section(`${v3Base}\n\n## Reader checklist\n\nLegacy container.`)).toBe(true);
    expect(hasLeanReportContract(v3Base.replace('3 pillars', '5 pillars'), 'anti')).toBe(true);
  });

  it('rejects a full dossier without neutral, pro, and anti reports', () => {
    const content = loadRepositoryContent();
    const cpp = content.topics.find((topic) => topic.slug === 'cpp-pensions');
    expect(cpp).toBeDefined();
    if (!cpp) return;

    const result = validateContentModel({
      ...content,
      topicFiles: {
        ...content.topicFiles,
        [cpp.slug]: {
          ...content.topicFiles[cpp.slug],
          reports: {
            neutral: null,
            pro: content.topicFiles[cpp.slug].reports.pro,
            anti: content.topicFiles[cpp.slug].reports.anti
          }
        }
      }
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Full dossier cpp-pensions is missing neutral report.');
  });

  it('rejects source-supported claims with no source ids', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel({
      ...content,
      claims: [
        ...content.claims,
        {
          id: 'claim-bad-empty-sources',
          topic_slug: 'legal-process',
          text: 'Bad claim',
          status: 'source_supported',
          source_ids: [],
          risk: 'high'
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Source-supported claim claim-bad-empty-sources has no sources.');
  });

  it('rejects forbidden human review fields anywhere in parsed content', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel({
      ...content,
      rawRecords: [...content.rawRecords, { human_review_required: true }]
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Forbidden human review field found: human_review_required.');
  });

  it('rejects unsupported topic states and malformed audit dates', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel({
      ...content,
      topics: content.topics.map((topic) =>
        topic.slug === 'legal-process'
          ? { ...topic, state: 'human_review_required' as never, last_audited_at: 'yesterday' }
          : topic
      )
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Topic legal-process has unsupported state human_review_required.');
    expect(result.errors).toContain('Topic legal-process has malformed last_audited_at date yesterday.');
  });

  it('rejects full dossiers without claims, audit history, or redebate history', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel({
      ...content,
      topicFiles: {
        ...content.topicFiles,
        'legal-process': {
          ...content.topicFiles['legal-process'],
          claims: [],
          auditEntries: [],
          redebateEntries: []
        }
      }
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Full dossier legal-process is missing topic claim ledger.');
    expect(result.errors).toContain('Full dossier legal-process is missing audit history.');
    expect(result.errors).toContain('Full dossier legal-process is missing redebate history.');
  });

  it('rejects high-risk unsupported claims and high-risk claims with undefined sources', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel({
      ...content,
      claims: [
        ...content.claims,
        {
          id: 'claim-bad-high-risk-unsupported',
          topic_slug: 'legal-process',
          text: 'Bad unsupported high-risk civic claim',
          status: 'unsupported',
          source_ids: [],
          risk: 'high'
        },
        {
          id: 'claim-bad-high-risk-bogus-source',
          topic_slug: 'legal-process',
          text: 'Bad sourced high-risk civic claim',
          status: 'source_supported',
          source_ids: ['not-a-source'],
          risk: 'high'
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('High-risk claim claim-bad-high-risk-unsupported cannot be marked unsupported for publication.');
    expect(result.errors).toContain('Claim claim-bad-high-risk-bogus-source references undefined source not-a-source.');
  });

  it('rejects malformed or under-modeled source records', () => {
    const content = loadRepositoryContent();
    const [firstSource] = content.sources;
    const result = validateContentModel({
      ...content,
      sources: [
        ...content.sources,
        {
          ...firstSource,
          id: firstSource.id,
          slug: 'bad slug',
          url: 'not-a-url',
          accessed_at: 'May 2',
          last_checked_at: 'recently',
          source_type: 'blog' as never,
          stance: 'maybe' as never,
          reliability_category: '',
          summary: '',
          how_used: '',
          related_topic_slugs: ['not-a-topic'],
          status: 'pending human review'
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(`Duplicate source id: ${firstSource.id}.`);
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 has malformed slug bad slug.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 has invalid URL not-a-url.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 has malformed accessed_at date May 2.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 has unsupported source_type blog.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 references undefined topic not-a-topic.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 is missing summary.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 is missing how_used.');
    expect(result.errors).toContain('Source elections-ab-new-citizen-initiative-2026-01-02 has unsupported status pending human review.');
  });
});
