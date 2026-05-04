import Link from 'next/link';
import { loadRepositoryContent } from '@/lib/content';

export const metadata = { title: 'Changelog' };

function fileCount(entry: Record<string, unknown>) {
  const files = entry.files_changed;
  return Array.isArray(files) ? files.length : 0;
}

function typeLabel(entry: Record<string, unknown>) {
  return String(entry.type ?? 'change').replaceAll('_', ' ');
}

export default function ChangelogPage() {
  const { changelog } = loadRepositoryContent();
  const latest = changelog[0];
  const totalFiles = changelog.reduce((sum, entry) => sum + fileCount(entry), 0);

  return (
    <>
      <section className="section">
        <div className="section-label mono">/ Changelog</div>
        <h1>Change history</h1>
        <p>
          Public release notes for site, content, source-library, validation, and review-log changes.
          Each entry names the changed files so readers can trace visible claims back to repository edits.
        </p>
      </section>

      <section className="section ops-grid" aria-label="Changelog summary">
        <div className="metric-card">
          <span className="mono row-meta">Entries</span>
          <strong>{changelog.length}</strong>
          <p>public change records</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Latest</span>
          <strong>{String(latest?.date ?? 'n/a')}</strong>
          <p>{String(latest?.summary ?? 'No public changes recorded')}</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Files changed</span>
          <strong>{totalFiles}</strong>
          <p>repository paths named across public entries</p>
        </div>
        <div className="metric-card">
          <span className="mono row-meta">Trace</span>
          <strong><Link href="/repo">Repo</Link></strong>
          <p>inspect source maps, review manifests, and public code</p>
        </div>
      </section>

      <section className="link-list" aria-label="Change entries">
        {changelog.map((entry, index) => {
          const files = Array.isArray(entry.files_changed) ? entry.files_changed.map(String) : [];
          return (
            <article className="index-row changelog-row" key={String(entry.id)}>
              <span className="mono row-meta">{String(index + 1).padStart(3, '0')}</span>
              <div>
                <strong>{String(entry.summary)}</strong>
                <div className="mono row-meta">{String(entry.date)} · {typeLabel(entry)} · {files.length} files changed</div>
              </div>
              <span className="mono row-meta state">{typeLabel(entry)}</span>
              <span className="mono" aria-hidden="true">+</span>
              <div className="expanded-row mono">
                {files.length ? files.slice(0, 8).map((file, fileIndex) => <span key={`${file}-${fileIndex}`}>{file}</span>) : <span>No file list recorded</span>}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
