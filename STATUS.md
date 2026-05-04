# Status

## Current phase

Production-readiness implementation is in progress against the canonical baseline spec:

`/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`

The spec is the end-state contract. `PRODUCTION_READINESS_PLAN.md` is the current gap map and execution order.

## Repository

Spec target: `https://github.com/stayorgoab/site`

Current implementation fallback: `https://github.com/chrisdothinger/stayorgoab`

The fallback repo remains the active working repository until the `stayorgoab/site` organization/repo path is available or deliberately superseded. Public copy and audit artifacts should label this as a temporary fallback, not a changed end-state target.

## Domains

Spec target primary domain: `stayorgoab.ca`

Spec target secondary domain: `stayorgoab.ai`

Domain mapping and hosting are not executed yet. Current work is local/repository implementation only.

## Current implementation goals

1. Keep all work pointed at the spec end state.
2. Make the topic corpus honest: sparse topics are visibly sparse; full dossiers are not faked.
3. Strengthen validation so unsupported civic content, missing sources, human review gates, and secret leaks fail before publication.
4. Improve public UX and auditability phase by phase.
5. Implement autonomous workflows that use automated checks, not human approval gates.

## Latest local validation snapshot

Last recorded before this work package:

```txt
npm run lint       PASS
npm run typecheck  PASS
npm test           PASS, 7 tests
```

This run will update the progress log with fresh validation evidence.

## Non-negotiables

- No human approval, review, verification, sign-off, or publication gates.
- Automated checks may block publication.
- Never commit secrets, credentials, raw logs, raw agent transcripts, hidden chain-of-thought, private submissions, unnecessary personal data, cookies, or auth headers.
- Public content must distinguish known, disputed, unknown, inference, advocacy framing, and speculation.


## 2026-05-04T03:47:10Z — Work Package 1 validation

Completed in this package:

- Baseline docs updated to keep the spec as the end-state contract and label `chrisdothinger/stayorgoab` as the active fallback repository.
- Launch checklist created at `ops/runbooks/launch-checklist.md`.
- Initial sparse topic coverage expanded in `content/topics/_index.yml` with matching topic overview files.
- Spec section 14.4 seed sources added to `content/sources/sources.yml` with richer metadata.
- Topic pages now show pending report routes for sparse topics instead of linking to missing pro/anti/neutral reports.
- Publication state and source-record TypeScript types widened toward the spec model.

Validation evidence:

```txt
npm run test:content          PASS, 4 tests
npm run generate:search-index PASS
npm run lint                  PASS
npm run typecheck             PASS
npm run validate:secrets      PASS
npm test                      PASS, 7 tests
npm run validate:citations    PASS
npm run validate:public-audit FAIL before generation: missing generated public audit artifacts
npm run generate:audit-manifest PASS
npm run validate:public-audit PASS after generation
npm run build                 PASS, 113 static pages
```

Known caveat from Work Package 1 resolved in Work Package 2: `npm run validate:public-audit` now runs `prevalidate:public-audit`, which regenerates public audit artifacts before validation.

## 2026-05-04T11:07:36Z — Work Package 2 validation hardening

Completed in this package:

- Added content-model validation for unsupported publication states and malformed topic audit/debate dates.
- Strengthened `full_dossier` enforcement so a full dossier must include topic claims, audit history, and redebate history in addition to neutral/pro/anti reports and topic sources.
- Added high-risk claim guardrail: high-risk civic claims cannot be published as `unsupported`.
- Made standalone public-audit validation deterministic by adding `prevalidate:public-audit` to regenerate audit artifacts before `validate:public-audit`.
- Added regression tests proving the new validator failures before implementation.

Validation evidence:

```txt
npm run test:content       PASS, 7 tests
npm run validate:citations PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets   PASS
npm test                   PASS, 10 tests
npm run lint               PASS
npm run typecheck          PASS
```

Next recommended phase: continue Phase 2 by expanding source/claim validation further, then move into Phase 3 public UX completion (`/ops`, richer Facts/Sources/Agents/Audit/Method, mobile/a11y pass).

## 2026-05-04T11:16:54Z — Work Package 3 validation + UX slice

Completed in this package:

- Added source-record validation for duplicate IDs/slugs, malformed slugs, invalid URLs, malformed dates, unsupported source types/stances/statuses, missing reliability/summary/how-used/topic links, and undefined related topics.
- Added regression coverage for malformed/under-modeled source records.
- Added `src/lib/ops.ts` to load schedules, run summaries, releases, incidents, agent registry, permissions, and runbooks as a public ops snapshot.
- Added `/ops` public read-only operational observability route.
- Added `Ops` navigation/footer entry.
- Enriched `/facts`, `/sources`, `/method`, `/agents`, and `/audit` with production-oriented summary/readout sections.

Validation evidence for this package is recorded after the final verification run in the work log / commit output.

## 2026-05-04T12:47:37Z — Sprint 1 Home + Questions UX/UI

Completed in this package:

- Upgraded the homepage first viewport with clearer primary paths, a civic-question search box, current-status source links, latest internal provenance-check date, and a labelled public research inventory strip.
- Improved `/questions` with result counts, clear-filter behavior, dossier-state/provenance-recency filters, a maturity legend, active category controls, and clearer expandable row affordances.
- Tightened public wording by replacing ambiguous audit status language with internal provenance-check and review-trail copy.
- Added Playwright regression coverage for homepage trust/search signals and the upgraded Questions search/filter/disclosure flow.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 22 tests
npm run build                 PASS, 114 static pages
```

## 2026-05-04T12:57:25Z — Sprint 2 Source Library UX/UI

Completed in this package:

- Added a client-side source-library browser with search by title/publisher/topic/claim text plus filters for source type, publisher, reliability label, and stance.
- Added live source-record counts, clear-source-filters behavior, expanded source details, topic trails, claim-reference trails, original/archive links, and empty-state copy.
- Clarified audit/check language across Home, Questions, Sources, Review Log, and source detail pages so users see “internal provenance check” as this project’s automated public-repo provenance process — not a government, regulator, or external audit.
- Added Playwright coverage for source-library search/filter/trails plus the clearer internal provenance-check wording.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 24 tests
npm run build                 PASS, 114 static pages
```

## 2026-05-04T13:54:27Z — Sprint 3 Public Trust Surfaces

Completed in this package:

- Upgraded `/repo/` from a bare GitHub link into a public repository-evidence page with source-map, claim-map, review-manifest, latest-release, and inspection links.
- Upgraded `/changelog/` into a change-history page with summary metrics, file-change counts, repo trace link, and per-entry file chips.
- Cleaned Ops wording so remaining user-facing status copy says internal provenance check / review manifest instead of unaudited or audit manifest.
- Added Playwright coverage for repo, changelog, and Ops trust-surface terminology.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 30 tests
npm run build                 PASS, 114 static pages
```
## 2026-05-04T14:25:04Z — Sprint 4 Home + Questions Flagship Refinement

Completed in this package:

- Refined the homepage hero/router with a dedicated `Find an answer fast` search card so cold visitors can immediately search the civic question index.
- Changed homepage trust-strip wording from `audited page records` to `reviewed page records` to preserve internal-provenance clarity.
- Cleaned `/questions` intro copy to reference public review logs instead of ambiguous audits.
- Added active filter chips, accessible category `aria-pressed` state, explicit open-dossier links, and public review-trail links in the Questions index.
- Strengthened Playwright product-contract coverage for the flagship Home + Questions path.
- Renamed the visible topic category `Source updates and audit changes` to `Source updates and review changes` to avoid implying government, regulator, or external audit activity.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 30 tests
npm run build                 PASS, 114 static pages
```
## 2026-05-04T14:48:47Z — Sprint 5 Facts Public Briefing

Completed in this package:

- Upgraded `/facts` from a compact status list into a public briefing page for cold readers.
- Added a current source status card with `Last checked against tracked official sources` and explicit civic-information / not-legal-advice framing.
- Added briefing inventory metrics for tracked status items, full dossiers, and high-sensitivity topics.
- Added source-backed procedural status rows that link directly to source records.
- Added a `Petition → referendum → negotiations` timeline to prevent readers from conflating separate stages.
- Added `What is confirmed`, `What is disputed`, and `What is unknown` certainty sections with dossier/source links.
- Added Playwright product-contract coverage for the Facts briefing UX and checked for ambiguous audit-pending wording.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 32 tests
npm run build                 PASS, 114 static pages
```
## 2026-05-04T15:13:35Z — Sprint 6 Reusable Page Trust Layer

Completed in this package:

- Added a reusable `PageTrust` component for public-facing source status, review trail, metrics, and evidence links.
- Applied the shared trust layer to `/facts`, `/questions`, `/sources`, `/method`, `/repo`, `/audit`, and topic detail pages.
- Updated topic metadata wording from `Last audited` / `Audit details` to `Internal provenance check` / `Review details`.
- Added responsive CSS so the trust layer collapses cleanly on mobile.
- Added Playwright product-contract coverage for the shared trust layer across representative public routes.
- Fixed the topic detail page to unwrap dynamic `params` asynchronously for current Next route behavior.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 34 tests
npm run build                 PASS, 114 static pages
```
## 2026-05-04T15:40:00Z — Sprint 7 Source Library Refinement

Completed in this package:

- Added URL-hydrated source search/filter/sort state so shared `/sources/?q=...&type=...&sort=...` links open with the expected library view.
- Added source sorting by recency, publisher, title, and claim-reference count.
- Added active source filter chips and retained clear-filter behavior for both desktop and mobile.
- Changed expandable source rows from generic `How used` copy to `Why this source matters` explanations with topic/claim usage counts.
- Reused claim/source maps for faster local filtering and clearer topic/claim trails.
- Polished source detail pages with PageTrust, back-to-library/source evidence links, why-this-source-matters copy, topic rows, claim rows, and async route params for current Next behavior.
- Added Playwright product-contract coverage for source sorting, query-filter hydration, and source detail trust paths.
- Preserved deployment/base-path compatibility when client-side source filters update the shared URL.

Validation evidence:

```txt
npm run test:content          PASS, 8 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm test                      PASS, 11 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 36 tests
npm run build                 PASS, 114 static pages
```

## 2026-05-04T17:42:59Z — Questions Dossier Completion + Report Navigation Fix

Completed in this package:

- Held off on Sprints 8–10 and focused on spec-alignment prerequisites for the Questions/Topics surface.
- Confirmed no `spec.md` or `sped.md` file currently exists in the repository; this package aligns against existing repo rules, agent registry, content validators, and public-audit/static-export posture until the spec file is added.
- Used the repo-defined agent team roles (`source-steward`, `topic-writer`, `claim-citation`, `synthesis-auditor`) to plan source coverage, report structure, and risk checks before filling content.
- Converted all 23 current Questions topics to `full_dossier` state with complete neutral, pro, and anti report files.
- Added missing topic-level `sources.yml`, `claims.yml`, `audit-log.yml`, and `redebate-log.yml` files so each dossier has inspectable evidence, claims, internal provenance-check entries, and redebate-review entries.
- Fixed Next dynamic route params for `/questions/[topicSlug]/neutral`, `/pro`, `/anti`, `/claims`, and `/sources` so static-export report links resolve instead of loading 404/error pages.
- Added content-contract tests requiring every current topic to have neutral/pro/anti reports, source IDs, claims, review logs, redebate logs, and report sections for short answer, current source support, and uncertainty.
- Added Playwright product coverage that opens the equalization dossier and verifies Neutral report, Pro report, and Anti report navigation returns HTTP <400 and lands on report pages.
- Validated the built static export for internal link integrity across 2,370 internal links.
- Ran independent blocker review; fixed the only finding by restoring `next-env.d.ts` to the build-generated `./.next/types/routes.d.ts` import instead of the dev-only route import.

Validation evidence:

```txt
npm run test:content          PASS, 10 tests
npm run validate:citations    PASS
npm run validate:public-audit PASS, regenerates audit artifacts first
npm run validate:secrets      PASS
npm run validate:agents       PASS
npm test                      PASS, 13 tests
npm run lint                  PASS
npm run typecheck             PASS
npm run test:a11y             PASS, 38 tests
npm run build                 PASS, 168 static pages
GITHUB_PAGES=true npm run build PASS, 168 static pages
static internal link check    PASS, 2,370 internal links
```
## 2026-05-04T20:06:21Z — First dossier factory batch

Completed in this package:

- Ran the agent-factory workflow for three high-priority topics: `legal-process`, `cpp-pensions`, and `equalization`.
- Expanded pro and anti reports as steelmanned source-bounded arguments.
- Rebuilt neutral reports as mediator syntheses written after the pro/anti reports, comparing strengths, weak points, evidence quality, and uncertainty rather than acting as a third stance.
- Downgraded the remaining topics from `full_dossier` to `partial_dossier` until their reports pass the same full-dossier contract.
- Added `ReportPage` shell with report role, PageTrust, source/claim/review links, pro/anti/neutral navigation, and section navigation.
- Strengthened content tests so only genuinely full topics can stay `full_dossier`, and full reports must include the full report section contract.
- Added Playwright coverage for the mediator/steelman report shell.

Validation evidence:

```txt
npm run test:content              PASS, 10 tests
npm run validate:citations        PASS
npm run validate:public-audit     PASS
npm run validate:secrets          PASS
npm run validate:agents           PASS
npm test                          PASS, 13 tests
npm run lint                      PASS
npm run typecheck                 PASS
npm run test:a11y                 PASS, 40 tests
npm run build                     PASS, 168 static pages
GITHUB_PAGES=true npm run build   PASS, 168 static pages
static internal link check        PASS, 3,060 internal links
browser QA legal-process neutral  PASS, no horizontal overflow on desktop; mediator shell visible
```
