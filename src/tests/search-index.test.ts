import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from '@/lib/search';
import { loadRepositoryContent } from '@/lib/content';

describe('search index', () => {
  it('indexes topics by title, category, keywords, and source metadata', () => {
    const entries = buildSearchIndex(loadRepositoryContent());

    expect(entries.some((entry) => entry.slug === 'cpp-pensions')).toBe(true);
    const cpp = entries.find((entry) => entry.slug === 'cpp-pensions');
    expect(cpp?.keywords).toContain('CPP');
    expect(cpp?.category).toBe('Pensions, benefits, and household income');

    const source = entries.find((entry) => entry.id === 'source-elections-ab-referendum');
    expect(source?.type).toBe('source');
    expect(source?.title).toContain('Referendum');
  });
});
