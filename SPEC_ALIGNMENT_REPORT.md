# StayOrGoAB Spec Alignment Report

**Spec source:** `/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`
**Repo checked:** `/home/ching/work/stayorgoab`
**Repo HEAD checked:** `d958529`
**Report date:** 2026-05-04

## Executive summary

The Desktop baseline spec was found and reviewed. The site is materially aligned on the basics: Next.js static site, all major public routes exist, validation scripts exist, public manifests exist, workflows exist, and the Questions report 404 issue fixed in commit `d958529` remains valid.

However, the repo is **not yet fully spec-aligned**. The biggest issue is that the recent dossier-completion pass made every current topic a `full_dossier`, but the Desktop spec sets a much higher bar for that state than “files exist.” The current reports are useful seed/briefing reports, but many are still too templated/thin to truthfully satisfy the full-dossier/report requirements in spec sections 7.2, 11.5, and 16.3.

Recommendation: before Sprint 8–10, run a spec-alignment correction package focused on truthful topic states, stronger full-report structure, canonical audit/repo scaffolding, and autonomous workflow depth.

## What is aligned

- Desktop spec exists and was read from Chris's OneDrive Desktop.
- Required validation scripts exist:
  - `lint`
  - `typecheck`
  - `test`
  - `test:content`
  - `test:a11y`
  - `build`
  - `generate:audit-manifest`
  - `generate:search-index`
  - `validate:public-audit`
  - `validate:secrets`
  - `validate:agents`
- Major required public routes exist:
  - `/`
  - `/facts`
  - `/questions`
  - `/questions/[topicSlug]`
  - `/questions/[topicSlug]/neutral`
  - `/questions/[topicSlug]/pro`
  - `/questions/[topicSlug]/anti`
  - `/questions/[topicSlug]/claims`
  - `/questions/[topicSlug]/sources`
  - `/sources`
  - `/sources/[sourceSlug]`
  - `/method`
  - `/agents`
  - `/audit`
  - `/glossary`
  - `/changelog`
  - `/disclaimer`
  - `/repo`
  - `/ops`
- Required workflow filenames exist under `.github/workflows/`.
- All 23 current topics have the required topic file set:
  - `index.mdx`
  - `neutral.mdx`
  - `pro.mdx`
  - `anti.mdx`
  - `claims.yml`
  - `sources.yml`
  - `audit-log.yml`
  - `redebate-log.yml`
- Recent navigation fix is valid: pro/anti/neutral report routes now build and return `200` for tested routes.
- Static build generates 168 pages and internal static link check passed over 2,370 internal links.

## Blocker / high-priority gaps

### 1. `full_dossier` is currently overclaimed

**Evidence:** `content/topics/_index.yml` marks all 23 topics as `full_dossier`.

**Spec conflict:** Spec sections 7.2, 11.5, and 16.3 require full dossiers to include substantive neutral/pro/anti reports, claim ledger, sources, audit history, redebate history, changelog references, GitHub source links, sufficient source support, and clear distinction between fact/inference/speculation.

**Current state:** The current report files exist and are useful, but many are still seed-level templated briefings. They do not yet meet the full report structure required by the Desktop spec.

**Recommended correction:** Downgrade most topics to `seed_overview` or `partial_dossier`, or expand every report to the full required structure before retaining `full_dossier`.

### 2. Report routes render Markdown but lack required full-report shell

**Files:**

- `src/app/questions/[topicSlug]/neutral/page.tsx`
- `src/app/questions/[topicSlug]/pro/page.tsx`
- `src/app/questions/[topicSlug]/anti/page.tsx`

**Spec requirement:** Each full report must include:

- thesis or bottom line
- core argument
- what is known
- what is disputed
- assumptions
- strongest evidence
- weak points
- counterarguments
- source notes
- what would change the assessment
- open questions
- claims and sources links

**Recommended correction:** Add a reusable `ReportPage` component and validation that fails `full_dossier` reports missing these headings/sections.

### 3. Claim/source support validation is structurally passing but substantively weak

**Evidence:** Current validators confirm source IDs exist, but not whether sources actually support each claim.

**Spec conflict:** Section 16.3 requires every material factual paragraph to have real source support or explicit inference labeling.

**Recommended correction:** Add claim-level support notes or support excerpts, stronger `claim_status`/`claim_type`/`stance` fields, and a citation-support validator for high-risk claims.

### 4. Audit manifest coverage is incomplete and repo target differs from spec

**Files:**

- `src/lib/audit.ts`
- `public/audit-manifest.json`
- `src/components/AuditMeta.tsx`
- `src/app/repo/page.tsx`

**Spec target:** `github.com/stayorgoab/site`.

**Current target:** Several files use `github.com/chrisdothinger/stayorgoab`.

**Also missing:** Audit manifest does not cover all top-level pages or all neutral/pro/anti report routes.

**Recommended correction:** Decide canonical repo target, make it config-driven, and expand public audit manifest coverage to every public route.

### 5. Questions search does not use the generated static search index

**File:** `src/components/TopicSearch.tsx`

**Spec requirement:** Search should cover title, question, category, keywords, synonyms, source titles, and claim text using `public/search-index.json` as MVP search infrastructure.

**Current state:** Questions search filters topic metadata only.

**Recommended correction:** Wire `/questions` search to generated search index or enrich TopicSearch with linked claims/source titles.

### 6. `/questions` list is not grouped by category

**File:** `src/components/TopicSearch.tsx`

**Spec requirement:** Category navigation and grouped dense topic rows are first-class UX requirements.

**Current state:** Category filters exist, but the rendered topic list is flat.

**Recommended correction:** Group rows by category when no search query is active; preserve category context in search results.

### 7. Autonomous workflows are visible but mostly stubbed

**Files:** `.github/workflows/*.yml`

**Spec requirement:** Autonomous agents should discover sources, audit, publish, withhold, update, and rollback via public workflows.

**Current state:** Required workflow filenames exist, but many are `echo`/read-only scaffolds.

**Recommended correction:** Implement one real workflow path at a time: source refresh, citation audit, topic redebate, release, rollback.

### 8. Missing required public repo scaffolding

**Missing files:**

- `LICENSE`
- `CONTENT_LICENSE`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `content/sources/archives.yml`
- `.codex/config.example.toml`
- `.codex/prompts/kickoff.md`
- `.codex/prompts/phase-runbook.md`
- `.agents/skills/content-validation/SKILL.md`
- `.agents/skills/public-audit-manifest/SKILL.md`
- `.agents/skills/citation-integrity/SKILL.md`

### 9. Agent registry schema is too thin

**File:** `agents/registry.yml`

**Spec expects:** phase, status, persona file, permission level, allowed paths, denied paths, and public summary requirement.

**Recommended correction:** Expand schema and validator.

### 10. Correction/source-suggestion mechanism is missing

**Spec requirement:** Every page should expose compact “Report an issue” or “Suggest a source” input.

**Current state:** No visible correction/source suggestion route/form/API/issue template found.

**Recommended correction:** Add GitHub issue templates first, then a no-personal-data `/api/user-input` path later if dynamic hosting is selected.

## Recommended next package before Sprint 8–10

### Spec Alignment Package A — Truthful dossier states + report contract

Goal: stop overclaiming, preserve public trust, and make the site honest against the Desktop spec.

1. Add a stricter full-dossier validator:
   - required report headings
   - required claims/sources/audit/redebate files
   - required changelog reference or update ID
   - required links to claims/sources from report pages
2. Downgrade topics that do not meet full report depth to `seed_overview` or `partial_dossier`.
3. Keep the newly fixed report routes, but label incomplete reports honestly.
4. Add `ReportPage` shell with source/claim/audit links and required section navigation.
5. Update `/questions` to show truthful state counts and avoid implying all reports are complete if they are not.

### Spec Alignment Package B — Public audit/repo scaffolding

1. Add missing repo docs/license/security/contributing files.
2. Add missing source archive and Codex/agent skill scaffolding.
3. Expand audit manifest to every public route.
4. Fix or config-drive canonical GitHub repo target.
5. Improve `/agents` and `/audit` to expose the required public artifacts.

### Spec Alignment Package C — Search and category UX

1. Use generated search index for `/questions`.
2. Add source-title and claim-text search tests.
3. Group topic rows by category.
4. Make mobile category disclosure compact by default.

## Notes

- The previous report-navigation fix should stay. It solved a real broken-route problem.
- The content generated in commit `d958529` should not be thrown away. It is a useful seed layer, but the state labels should be truthful until reports are deeper.
- No push/deploy was performed during this review.
