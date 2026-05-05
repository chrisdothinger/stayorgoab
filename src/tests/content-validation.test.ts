import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { loadRepositoryContent } from '@/lib/content';
import { validateContentModel } from '@/lib/validation';

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

  it('requires every full dossier report to have the full report contract and uncertainty labels', () => {
    const content = loadRepositoryContent();
    const requiredSections = [
      '## short answer',
      '## what current sources support',
      '## core argument',
      '## what is known',
      '## what is disputed',
      '## assumptions',
      '## strongest evidence',
      '## weak points',
      '## counterarguments',
      '## sources',
      '## what would change this assessment',
      '## open questions',
      '## main uncertainty',
      '## reader checklist'
    ];
    const incomplete = content.topics.filter((topic) => topic.state === 'full_dossier').flatMap((topic) => {
      const files = content.topicFiles[topic.slug];
      const reports = [files.reports.neutral, files.reports.pro, files.reports.anti];
      return reports.flatMap((report, index) => {
        const stance = ['neutral', 'pro', 'anti'][index];
        if (!report) return [`${topic.slug}:${stance}:missing`];
        const body = report.body.toLowerCase();
        const checks = requiredSections.map((section) => body.includes(section) ? null : `${topic.slug}:${stance}:${section.replace('## ', '').replace(/ /g, '-')}`);
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
