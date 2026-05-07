# Dossier Q1 Baseline Audit

Date: 2026-05-07  
Repo HEAD audited: `df21ff8`  
Baseline dossier: Question 1, `content/topics/legal-process/index.mdx`

## Executive summary

Question 1 is the editorial and formatting baseline going forward.

The current dossier library is structurally complete, but uneven. The main issue is not file coverage; it is public-reader quality. Many dossiers have useful source and claim artifacts, but their public `index.mdx` overview still uses the older scaffold or debate-map format instead of the new Question 1 overview-as-neutral format.

Snapshot:

- Total dossiers audited: **50**
- Dossiers matching the full Q1 overview heading contract: **6 / 50**
- Dossiers with Neutral already merged and hidden from public nav: **6 / 50**
- Dossiers with zero numbered citations in public overview: **21 / 50**
- Dossiers marked `legacy_refresh_needed` in the migration manifest: **19 / 50**
- Dossiers needing source refresh per manifest: **19 / 50**

## Standard confirmed

The baseline public overview structure is:

1. `## Short answer`
2. `## What this means for Albertans`
3. `## What each side gets right`
4. `## What would have to be decided`
5. `## What survives both arguments`
6. `## Sources`

Editorial standard:

- Overview is the primary balanced answer.
- Pro and Anti are shorter optional debate briefs.
- Claims and Sources are the audit layer.
- Neutral is not a separate public report after its synthesis is merged into Overview.
- Keep legacy `/neutral/` URLs working as compatibility notices.
- Use short paragraphs, direct plain language, and no legal/academic sludge.
- Avoid certainty where the source record only supports uncertainty.
- Use numbered inline citations tied to a checked source list.

## Grades

- **A** — matches or nearly matches Q1 standard; only light polish/source-count sync needed.
- **B** — good source base and writing, but public overview needs Q1 structural migration.
- **C** — usable seed or partial migration; needs writing cleanup and/or targeted source expansion.
- **D** — scaffold/placeholder level; needs full rebuild and deeper source pack before neutral retirement.

## Full audit matrix

| # | Slug | Grade | Source IDs | Overview citations | Q1 headings? | Neutral merged? | Recommended action |
|---:|---|:---:|---:|---:|:---:|:---:|---|
| 1 | `legal-process` | A | 12 | 8 | yes | yes | Keep as baseline/control. |
| 2 | `cpp-pensions` | A | 12 | 12 | yes | yes | Light polish only; citation punctuation/source-count sync. |
| 3 | `indigenous-rights-treaties` | B | 12 | 12 | no | no | Migrate strong existing content to Q1 headings; treat as sensitive, smaller PR. |
| 4 | `economy-fiscal` | D | 3 | 0 | no | no | Full rebuild with deeper fiscal source pack. |
| 5 | `referendum-mechanics` | B | 9 | 9 | no | no | Migrate to Q1 headings; source base is adequate. |
| 6 | `borders-currency-citizenship` | C | 9 | 8 | no | no | Add Sources section, migrate; consider scope/naming because topic mixes routes, currency, citizenship. |
| 7 | `petition-vs-referendum-vs-negotiations` | B | 10 | 10 | no | no | Migrate to Q1 headings. |
| 8 | `clarity-act` | B | 11 | 4 | no | no | Migrate and surface more checked sources if claim burden expands. |
| 9 | `quebec-secession-reference` | B | 10 | 3 | no | no | Migrate; add more reader framing. |
| 10 | `clear-question-majority` | B | 7 | 5 | no | no | Migrate to Q1 headings. |
| 11 | `referendum-ballot-2026` | B | 8 | 8 | no | no | Migrate; keep on frequent refresh due time sensitivity. |
| 12 | `economy-overall` | D | 3 | 0 | no | no | Full rebuild or retitle/split; current scope is too broad for source pack. |
| 13 | `equalization` | B | 5 | 5 | yes | yes | Structurally ready; optional fiscal-source top-up. |
| 14 | `federal-debt-assets` | D | 3 | 0 | no | no | Full rebuild with public accounts/assets/debt/succession analysis. |
| 15 | `indigenous-treaties` | B | 12 | 10 | no | no | Migrate; rationalize overlap with #3. Sensitive, smaller PR. |
| 16 | `military-security` | D | 3 | 0 | no | no | Full rebuild with CAF/NORAD/NATO/security/institutional sources. |
| 17 | `currency-banking` | A | 7 | 7 | yes | yes | Keep; optional source top-up for central-bank/payments mechanics. |
| 18 | `borders-trade` | B | 7 | 0 | no | no | Migrate neutral/index to Q1 headings; add numbered overview citations and Sources. |
| 19 | `public-services` | C | 3 | 0 | no | no | Rebuild with service-specific source pack. |
| 20 | `energy-environment` | B | 15 | 15 | no | no | Strong source base; migrate to Q1 headings and sync registry count. |
| 21 | `bureaucracy-governance` | C | 3 | 0 | no | no | Source expansion first, then rewrite overview. |
| 22 | `international-recognition` | D | 2 | 0 | no | no | Priority rebuild with international-law/recognition/state-succession sources. |
| 23 | `case-studies` | D | 2 | 0 | no | no | Rebuild from comparator source pack: Quebec, Brexit, Scotland, others. |
| 24 | `tax-collection-revenue-agency` | C | 3 | 0 | no | no | Expand CRA/payroll/benefits/admin sources, then Q1 rewrite. |
| 25 | `immigration-passports-mobility` | B | 8 | 8 | no | no | Migrate; add Sources section and operational citizenship/passport/mobility depth. |
| 26 | `courts-criminal-law` | B | 6 | 6 | no | no | Migrate; add selected justice-system sources. |
| 27 | `student-loans-universities-research` | C | 3 | 0 | no | no | Source expansion and reader-first rewrite. |
| 28 | `postal-telecom-broadcasting` | C | 3 | 0 | no | no | Expand Canada Post/CRTC/spectrum/telecom/alerts sources, then rewrite. |
| 29 | `agriculture-food-inspection-market-access` | B | 9 | 3 | no | no | Migrate; add Sources section and market-access/export certification depth. |
| 30 | `employment-insurance-federal-benefits` | A | 14 | 14 | yes | yes | Largely ready; light polish/source-count sync. |
| 31 | `national-parks-public-lands` | B | 14 | 0 | no | no | Migrate neutral into Q1 overview; add citations/Sources; sync registry. |
| 32 | `air-transport-aviation-safety` | B | 8 | 8 | no | no | Migrate; add Sources section and modest aviation/security depth. |
| 33 | `water-rights-rivers` | B | 13 | 13 | no | no | Strong source base; migrate to Q1 headings and sync registry. |
| 34 | `emergency-management-disaster-aid` | B- | 7 | 7 | no | no | Migrate; deepen disaster-finance evidence. |
| 35 | `statistics-census-public-data` | D | 3 | 0 | no | no | Full Q1 rewrite plus source expansion. |
| 36 | `rcmp-provincial-policing` | C | 5 | 5 | no | no | Q1 migration plus policing-cost/contract/records source additions. |
| 37 | `charter-rights-continuity` | C | 5 | 5 | no | no | Q1 migration plus legal source deepening. |
| 38 | `abortion-reproductive-health-rights` | D | 3 | 0 | no | no | Full rewrite and expanded high-sensitivity healthcare/legal source pack. |
| 39 | `firearms-laws-licensing` | C | 4 | 4 | no | no | Q1 migration plus operational/border/enforcement sources. |
| 40 | `healthcare-portability-doctor-licensing` | B | 12 | 3 | no | no | Format migration; verify portability/reciprocal billing/labour mobility sources. |
| 41 | `border-enforcement-customs` | C | 5 | 5 | no | no | Q1 migration plus customs systems/ports/trade-documentation sources. |
| 42 | `bank-deposits-financial-stability` | A | 13 | 13 | yes | yes | Polish only; source-count/citation-style sync. |
| 43 | `pharmaceutical-drug-approvals-supply` | D | 4 | 0 | no | no | Full rewrite; expand drug approval/shortage/procurement/recall/supply sources. |
| 44 | `privacy-data-federal-ids` | D | 4 | 0 | no | no | Full rewrite; expand CRA/Service Canada/FOIP/privacy/identity systems sources. |
| 45 | `environmental-assessment-pipeline-approvals` | B | 15 | 15 | no | no | Strong source base; restructure to Q1 headings. |
| 46 | `labour-standards-public-sector-unions` | D | 4 | 0 | no | no | Full rewrite; expand labour/union/successor-rights/essential-services sources. |
| 47 | `federal-prisons-corrections-parole` | C | 6 | 6 | no | no | Q1 migration plus corrections/parole/victim-services/inmate-transfer sources. |
| 48 | `public-health-disease-surveillance` | D | 4 | 0 | no | no | Full rewrite; expand PHAC/Alberta/lab/data-sharing/outbreak sources. |
| 49 | `bankruptcy-insolvency-creditor-protection` | D | 4 | 0 | no | no | Full rewrite; expand OSB/LIT/courts/active-files/cross-border sources. |
| 50 | `elections-law-political-parties-campaign-finance` | D | 4 | 0 | no | no | Full rewrite; expand elections/boundaries/enforcement/party-finance sources. |

## Recommended execution order

Do not proceed strictly by easiest wins only. Start at the beginning, but group work by risk and effort so each PR is coherent and reviewable.

### PR 1 — first-front-door legal/process alignment

Target: #3, #5, #7, #8, #9, #10, #11

Why: These are early in the user journey, already mostly sourced, and need the Q1 public overview shape. This makes the first legal-process category feel consistent after Q1.

Notes:

- Consider leaving #15 for a dedicated Indigenous/treaty PR because it overlaps with #3 and has higher sensitivity.
- After each topic overview absorbs neutral, add slug to `MERGED_NEUTRAL_TOPIC_SLUGS` and verify legacy `/neutral/` notice.

### PR 2 — scope/source exposure fixes

Target: #6, #18, #25, #26, #29, #32, #34

Why: These have useful content but need Sources sections, Q1 formatting, and targeted source exposure/depth.

### PR 3 — strong-source format migrations

Target: #20, #31, #33, #40, #45

Why: These have strong source depth but public overview format lags Q1.

### PR 4 — fiscal/institutional rebuilds from the beginning

Target: #4, #12, #14, #16, #19, #21, #24

Why: These are early and important, but too scaffold-like or under-sourced for direct neutral retirement.

### PR 5 — sensitive/specialist rebuilds

Target: #3/#15 overlap review, #22, #23, #27, #28, #35, #38

Why: Indigenous/treaty overlap and recognition/comparator/rights topics need more careful specialist handling.

### PR 6+ — remaining scaffold rebuilds

Target: #36, #37, #39, #41, #43, #44, #46, #47, #48, #49, #50

Why: These need a mix of Q1 migration and source-depth rebuild. Split into small domain batches: justice, health/public services, regulators/data, work/finance.

## Operating rules for fixes

For each topic migration:

1. Confirm source IDs and source titles against `content/sources/sources.yml`.
2. Rewrite `index.mdx` into Q1 heading contract.
3. Merge neutral synthesis into overview; do not merely rename headings.
4. Keep Pro/Anti shorter and non-duplicative.
5. Update `MERGED_NEUTRAL_TOPIC_SLUGS` only after the overview actually contains the neutral synthesis.
6. Preserve legacy `/neutral/` compatibility behavior.
7. Run validation gates:
   - `npm run validate:topics`
   - `npm run validate:dossier-migration`
   - `npm run test:content`
   - `npm run validate:citations`
   - `npm run validate:public-audit`
   - `npm run validate:secrets`
   - `npm test`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:a11y`
   - `GITHUB_PAGES=true npm run build`
8. Live/static verify migrated overview routes and legacy `/neutral/` routes after merge/deploy.

## Immediate next move

Start with **PR 1**:

- `indigenous-rights-treaties`
- `referendum-mechanics`
- `petition-vs-referendum-vs-negotiations`
- `clarity-act`
- `quebec-secession-reference`
- `clear-question-majority`
- `referendum-ballot-2026`

However, because `indigenous-rights-treaties` is sensitive and overlaps with `indigenous-treaties`, the safer first implementation batch is:

- `referendum-mechanics`
- `petition-vs-referendum-vs-negotiations`
- `clarity-act`
- `quebec-secession-reference`
- `clear-question-majority`
- `referendum-ballot-2026`

Then handle Indigenous/treaty topics in a smaller dedicated PR with extra review.
