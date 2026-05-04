import Link from 'next/link';

export function AuditMeta({
  sourceCount,
  claimCount,
  audited,
  debated,
  sourceFile
}: {
  sourceCount: number;
  claimCount: number;
  audited: string | null;
  debated: string | null;
  sourceFile: string;
}) {
  const repoPath = `https://github.com/chrisdothinger/stayorgoab/blob/main/${sourceFile}`;
  return (
    <div className="source-trail mono" aria-label="Review metadata">
      <span>Internal provenance check: {audited ?? 'not yet'}</span>
      <span>Last redebate pass: {debated ?? 'not yet'}</span>
      <span>Sources: {sourceCount}</span>
      <span>Claims: {claimCount}</span>
      <Link href="/audit">Review details</Link>
      <a href={repoPath}>GitHub source</a>
    </div>
  );
}
