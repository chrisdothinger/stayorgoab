export type ReportKind = 'neutral' | 'pro' | 'anti';

export const DOSSIER_CONTRACT_VERSION = 'v3-lean' as const;

export const DOSSIER_OVERVIEW_SECTIONS = [
  '## Short answer',
  '## The debate in plain English',
  '## Where the debate turns',
  '## Read the briefs'
] as const;

export const DOSSIER_PRO_ANTI_SECTIONS = [
  '## Bottom line',
  '## The case in 4 pillars',
  '## Best objections / replies',
  '## What would change this assessment',
  '## Sources'
] as const;

export const DOSSIER_NEUTRAL_SECTIONS = [
  '## Bottom line',
  '## What each side gets right',
  '## What survives both arguments',
  '## The practical test',
  '## What would change this assessment',
  '## Sources'
] as const;

export const LEGACY_DOSSIER_REPORT_SECTIONS = [
  '## Short answer',
  '## What current sources support',
  '## Core argument',
  '## What is known',
  '## What is disputed',
  '## Assumptions',
  '## Strongest evidence',
  '## Weak points',
  '## Counterarguments',
  '## Sources',
  '## What would change this assessment',
  '## Open questions',
  '## Main uncertainty',
  '## Reader checklist'
] as const;

export const DELETED_V3_PUBLIC_SECTIONS = [
  '## What current sources support',
  '## What is known',
  '## What is disputed',
  '## Assumptions',
  '## Strongest evidence',
  '## Weak points',
  '## Counterarguments',
  '## Open questions',
  '## Main uncertainty',
  '## Reader checklist'
] as const;

function lowerSections(sections: readonly string[]) {
  return sections.map((section) => section.toLowerCase());
}

export function hasLegacyReportContract(body: string) {
  const lowerBody = body.toLowerCase();
  return lowerSections(LEGACY_DOSSIER_REPORT_SECTIONS).every((section) => lowerBody.includes(section));
}

export function hasLeanReportContract(body: string, kind: ReportKind) {
  const lowerBody = body.toLowerCase();
  const required = kind === 'neutral'
    ? DOSSIER_NEUTRAL_SECTIONS
    : DOSSIER_PRO_ANTI_SECTIONS.filter((section) => section !== '## The case in 4 pillars');
  const hasRequiredSections = lowerSections(required).every((section) => lowerBody.includes(section));
  const hasRoleShape = kind === 'neutral' ? true : /## the case in [3-5] pillars/.test(lowerBody);
  return hasRequiredSections && hasRoleShape;
}

export function hasDeletedV3Section(body: string) {
  const lowerBody = body.toLowerCase();
  return lowerSections(DELETED_V3_PUBLIC_SECTIONS).some((section) => lowerBody.includes(section));
}
