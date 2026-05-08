export type ReportKind = 'neutral' | 'pro' | 'anti';

export const DOSSIER_CONTRACT_VERSION = 'v3.1-overview-neutral' as const;

export const MERGED_NEUTRAL_TOPIC_SLUGS = [
  'legal-process',
  'cpp-pensions',
  'employment-insurance-federal-benefits',
  'bank-deposits-financial-stability',
  'currency-banking',
  'equalization',
  'referendum-mechanics',
  'petition-vs-referendum-vs-negotiations',
  'clarity-act',
  'quebec-secession-reference',
  'clear-question-majority',
  'referendum-ballot-2026',
  'indigenous-rights-treaties',
  'economy-fiscal',
  'federal-debt-assets',
  'tax-collection-revenue-agency',
  'bankruptcy-insolvency-creditor-protection',
  'bureaucracy-governance',
  'international-recognition',
  'military-security',
  'privacy-data-federal-ids',
  'public-services',
  'student-loans-universities-research',
  'pharmaceutical-drug-approvals-supply',
  'public-health-disease-surveillance',
  'elections-law-political-parties-campaign-finance',
  'postal-telecom-broadcasting',
  'statistics-census-public-data'
] as const;

export function hasMergedNeutralOverview(topicSlug: string) {
  return (MERGED_NEUTRAL_TOPIC_SLUGS as readonly string[]).includes(topicSlug);
}

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

export const COMPACT_DOSSIER_OVERVIEW_SECTIONS = [
  '## Short answer',
  '## What this means for Albertans',
  '## What each side gets right',
  '## What would have to be decided',
  '## What survives both arguments',
  '## Sources'
] as const;

export const COMPACT_DOSSIER_PRO_ANTI_SECTIONS = [
  '## Bottom line',
  '## Main weakness',
  '## Sources'
] as const;

export const COMPACT_DOSSIER_NEUTRAL_SECTIONS = [
  '## Bottom line',
  '## What each side gets right',
  '## What survives both arguments',
  '## What would change the answer',
  '## Sources'
] as const;

export const DOSSIER_CITATION_DISPLAY_STANDARD = [
  '1–2 citations render as compact inline source links',
  '3+ adjacent citations render as an expandable Evidence chip',
  'Expanded evidence chips link to exact numbered Sources entries'
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
  const legacyRequired = kind === 'neutral'
    ? DOSSIER_NEUTRAL_SECTIONS
    : DOSSIER_PRO_ANTI_SECTIONS.filter((section) => section !== '## The case in 4 pillars');
  const compactRequired = kind === 'neutral'
    ? COMPACT_DOSSIER_NEUTRAL_SECTIONS
    : COMPACT_DOSSIER_PRO_ANTI_SECTIONS;
  const hasLegacySections = lowerSections(legacyRequired).every((section) => lowerBody.includes(section));
  const hasCompactSections = lowerSections(compactRequired).every((section) => lowerBody.includes(section));
  const hasRoleShape = kind === 'neutral' ? true : /## the case in [3-5] pillars/.test(lowerBody);
  return (hasLegacySections || hasCompactSections) && hasRoleShape;
}

export function hasDeletedV3Section(body: string) {
  const lowerBody = body.toLowerCase();
  return lowerSections(DELETED_V3_PUBLIC_SECTIONS).some((section) => lowerBody.includes(section));
}
