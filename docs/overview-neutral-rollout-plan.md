# Overview-Neutral Dossier Standard Rollout Plan

> **For Hermes:** Use this as the execution contract for future dossier-refresh batches. Keep each batch small, validated, PR-reviewed, merged, deployed, and live-checked before starting the next batch.

**Goal:** Make the Q1 overview-neutral model the standard across StayOrGoAB and migrate all remaining dossiers without breaking auditability, source integrity, or reader navigation.

**Architecture:** The overview becomes the main balanced answer and absorbs the old neutral-synthesis job. Pro and anti remain separate optional briefs. Claims and sources remain separate audit surfaces. Existing `/neutral/` routes remain legacy compatibility paths until each topic is migrated and route removal is safe.

**Tech Stack:** Next.js static export, MDX topic content, YAML source/claim/audit artifacts, Vitest, Playwright/a11y, GitHub Actions, GitHub Pages.

---

## Acceptance criteria

A migrated dossier is complete only when:

- `index.mdx` contains the v3.1 overview-neutral sections:
  - `## Short answer`
  - `## What this means for Albertans`
  - `## What each side gets right`
  - `## What would have to be decided`
  - `## What survives both arguments`
  - `## Sources`
- `pro.mdx` and `anti.mdx` are concise debate briefs, not repeated overview explainers.
- Public nav for the migrated topic shows `Overview`, `Pro`, `Anti`, `Claims`, `Sources` and does not show `Neutral`.
- The expanded topic row on `/questions/` uses `Overview` and does not show `Neutral` for migrated topics.
- Any legacy `/neutral/` URL does not duplicate the report; it points readers back to the merged overview.
- Source IDs, inline citations, `sources.yml`, `claims.yml`, `audit-log.yml`, and `redebate-log.yml` remain valid.
- Local validation, PR checks, main/deploy checks, and live spot checks pass.

## Non-goals

- Do not mass-rewrite all 49 remaining dossiers in one PR.
- Do not remove legacy `/neutral/` routes globally until every topic is migrated and live analytics/links risk is acceptable.
- Do not reduce source coverage just to shorten prose.
- Do not rewrite unrelated public pages or categories during dossier batches.

## Canonical standard files

These files define the standard and must stay aligned:

- `docs/dossier-architecture-v3.md`
- `docs/dossier-migration-plan.md`
- `agents/rubrics/reader-first-dossier-writing.md`
- `agents/rubrics/dossier-debate-brief-framework.md`
- `agents/personas/topic-writer.md`
- `agents/prompts/neutral-synthesis.md` — legacy-only notice
- `src/lib/dossier-contract.ts`
- `src/components/DossierNav.tsx`
- `src/components/TopicSearch.tsx`
- `src/app/method/page.tsx`

## Batch plan

Target batch size: **4-6 dossiers per PR**. Use smaller batches for high-sensitivity legal, treaty, pension, healthcare, banking, or Indigenous-rights topics.

### Batch 0 — standard lock-in

Status: current PR scope.

Tasks:

1. Remove Q1 leftover Neutral links from expanded dossier navigation.
2. Update Method / Ops and Questions copy to explain overview-as-neutral.
3. Update agent prompts/rubrics/docs so future agents stop creating separate neutral reports.
4. Add tests for expanded-row neutral-link removal.
5. Validate, PR, merge, deploy, and live-check Q1.

### Batch 1 — household financial security

Candidate topics:

- `cpp-pensions`
- `employment-insurance-benefits`
- `bank-deposits-financial-stability`
- `currency-banking`
- `equalization`

Why first: high reader relevance, high trust cost if unclear, and likely common public questions.

### Batch 2 — healthcare, benefits, and daily services

Candidate topics:

- `healthcare-portability-doctor-licensing`
- `pharmaceutical-drug-approvals-supply`
- `public-health-disease-surveillance`
- `transition-service-interruption-risk`
- `emergency-disaster-aid`

### Batch 3 — borders, trade, and mobility

Candidate topics:

- `landlocked-goods-movement`
- `tariffs-customs-market-access`
- `border-agency-inspections`
- `citizenship-passports-mobility`
- `aviation-safety-air-links`
- `agriculture-food-inspection-market-access`

### Batch 4 — legal process family

Candidate topics:

- `clarity-act`
- `clear-question-clear-majority`
- `referendum-mechanics`
- `petition-vs-referendum-vs-negotiations`
- `quebec-secession-reference`
- `2026-ballot-timing-status`

### Batch 5 — Indigenous rights, land, water

Candidate topics:

- `indigenous-rights-treaties`
- `first-nations-jurisdiction-treaty-consent`
- `parks-crown-public-lands`
- `water-rights-rivers-infrastructure`

### Batch 6 — courts, rights, and public safety

Candidate topics:

- `charter-civil-liberties`
- `courts-criminal-law-prosecutions`
- `policing-rcmp`
- `federal-prisons-corrections-parole`
- `firearms-licensing`
- `reproductive-health-rights`

### Batch 7 — state capacity and international posture

Candidate topics:

- `defence-security-foreign-affairs`
- `international-recognition`
- `state-capacity-public-institutions`
- `tax-collection-revenue-administration`
- `statistics-census-public-data`
- `privacy-data-federal-ids`

### Batch 8 — energy, resources, economy

Candidate topics:

- `resources-environment-constraints`
- `environmental-assessment-pipeline-approvals`
- `major-project-approvals-permitting`
- `us-alignment-partnership`
- `broad-fiscal-economic-position`
- `debt-assets-settlement`
- `labour-standards-public-sector-unions`

### Batch 9 — remaining regulators and edge cases

Candidate topics:

- `daily-life-federal-regulators`
- `students-universities-research-funding`
- `case-studies`
- `bankruptcy-insolvency-creditor-protection`
- `elections-law-political-parties-campaign-finance`

## Per-batch execution checklist

### Task 1: Inventory and lock scope

**Objective:** Select exact topics and avoid accidental broad rewrites.

**Files:**
- Read: `content/dossier-migration-manifest.yml`
- Read: `content/topic-question-registry.yml`
- Read: selected `content/topics/[slug]/*`

**Steps:**

1. Confirm the batch topics and current migration status.
2. Confirm each topic has source, claim, audit, and redebate artifacts.
3. Confirm no dirty worktree or open conflicting PR exists.
4. Create a branch named `content/overview-neutral-batch-[nn]`.

### Task 2: Rewrite selected overviews

**Objective:** Move neutral synthesis into each selected `index.mdx`.

**Files:**
- Modify: `content/topics/[slug]/index.mdx`
- Read/reference: `content/topics/[slug]/neutral.mdx`, `pro.mdx`, `anti.mdx`, `sources.yml`, `claims.yml`

**Steps:**

1. Keep the frontmatter title/state stable unless the topic question is wrong.
2. Write the required v3.1 overview headings.
3. Preserve numbered citations and add a matching `## Sources` section.
4. Cut repeated background that belongs only once.
5. Keep prose mobile-readable.

### Task 3: Tighten pro/anti briefs

**Objective:** Make side briefs focused optional deep dives.

**Files:**
- Modify: `content/topics/[slug]/pro.mdx`
- Modify: `content/topics/[slug]/anti.mdx`

**Steps:**

1. Use `Bottom line`, `The case in 3-5 pillars`, `Main weakness`, `Sources`.
2. Remove duplicated overview synthesis.
3. Keep the strongest fair version of each side.
4. Keep citations close to claims.

### Task 4: Retire topic neutral path

**Objective:** Remove duplicate neutral reader paths after the synthesis is merged.

**Files:**
- Modify: `src/lib/dossier-contract.ts`
- Modify only if needed: `src/app/questions/[topicSlug]/neutral/page.tsx`

**Steps:**

1. Add migrated slugs to `MERGED_NEUTRAL_TOPIC_SLUGS`.
2. Verify `DossierNav` and `TopicSearch` hide Neutral for those slugs.
3. Keep `/neutral/` legacy notice behavior for migrated slugs.

### Task 5: Update audit/redebate artifacts

**Objective:** Preserve public auditability.

**Files:**
- Modify: `content/topics/[slug]/audit-log.yml`
- Modify: `content/topics/[slug]/redebate-log.yml`
- Modify if sources changed: `content/topics/[slug]/sources.yml`, `content/sources.yml`
- Modify if claims changed: `content/topics/[slug]/claims.yml`

**Steps:**

1. Add an audit entry for overview-neutral migration.
2. Add a redebate entry documenting the synthesis merge and pro/anti brief refresh.
3. Keep source IDs stable unless adding new sources is necessary.

### Task 6: Validate locally

Run:

```bash
npm run lint &&
npm run typecheck &&
npm run validate:topics &&
npm run validate:dossier-migration &&
npm run validate:public-audit &&
npm run validate:citations &&
npm run validate:secrets &&
npm test &&
GITHUB_PAGES=true npm run build
```

Then serve the static build and run accessibility tests:

```bash
npx serve@latest out -l tcp://127.0.0.1:3000
npm run test:a11y
```

### Task 7: PR, merge, and live verify

**Objective:** Finish the batch only after deployment is verified.

**Steps:**

1. Commit scoped files only.
2. Open PR with changed topics, validation evidence, and residual risk.
3. Watch PR checks.
4. Squash-merge only after checks are green.
5. Watch main `secret-scan`, `build`, and `deploy` runs.
6. Fetch live URLs for every migrated overview plus one pro/anti page.
7. Confirm live HTML contains v3.1 headings and does not contain Neutral nav for migrated slugs.
8. Update this plan/progress notes if the standard changes.

## Stop conditions

Stop and ask Chris before continuing if:

- a topic needs a new source that changes the public answer materially;
- the pro/anti split itself seems wrong;
- a topic overlaps another topic enough that the question should be merged or renamed;
- validation requires broad contract changes beyond the current batch;
- a public-facing legal/treaty/rights claim cannot be supported cleanly.
