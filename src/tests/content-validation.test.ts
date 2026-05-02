import { describe, expect, it } from 'vitest';
import { loadRepositoryContent } from '@/lib/content';
import { validateContentModel } from '@/lib/validation';

describe('content validation', () => {
  it('accepts the checked-in content model', () => {
    const content = loadRepositoryContent();
    const result = validateContentModel(content);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
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
});
