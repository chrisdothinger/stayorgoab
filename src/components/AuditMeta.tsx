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
    <div className="source-trail mono" aria-label="Evidence metadata">
      <span>Last evidence check: {audited ?? 'not yet'}</span>
      <span>Last argument review: {debated ?? 'not yet'}</span>
      <span>Sources: {sourceCount}</span>
      <span>Claims: {claimCount}</span>
      <Link href="/audit">Review trail</Link>
      <a href={repoPath}>Source file</a>
    </div>
  );
}
