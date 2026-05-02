import { describe, expect, it } from 'vitest';
import { buildAuditManifest } from '@/lib/audit';
import { loadRepositoryContent } from '@/lib/content';
import { validatePublicAuditArtifact } from '@/lib/public-audit';

describe('public audit artifacts', () => {
  it('generates public page records without raw logs or private fields', () => {
    const manifest = buildAuditManifest(loadRepositoryContent());
    const result = validatePublicAuditArtifact(manifest);

    expect(result.ok).toBe(true);
    expect(manifest.pages.length).toBeGreaterThan(5);
    expect(manifest.pages.some((page) => page.path === '/questions/cpp-pensions')).toBe(true);
  });

  it('rejects raw transcript and secret-like audit content', () => {
    const result = validatePublicAuditArtifact({
      site_name: 'StayOrGoAB',
      generated_at: '2026-05-02T00:00:00Z',
      repository: 'chrisdothinger/stayorgoab',
      commit_sha: 'local',
      raw_transcript: 'do not publish'
    });

    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain('raw_transcript');
  });
});
