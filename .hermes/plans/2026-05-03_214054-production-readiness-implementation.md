# StayOrGoAB Production Readiness Implementation Plan

> **For Hermes:** Use subagent-driven-development style: phase-by-phase goals, spec compliance checks, code quality checks, validation before advancing.

**Goal:** Bring `/home/ching/work/stayorgoab` to the end state defined by `/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`.

**Architecture:** Static-first Next.js App Router site backed by GitHub-native YAML/MDX content, generated public JSON artifacts, validators, and GitHub Actions. The spec file remains the end-state contract; `PRODUCTION_READINESS_PLAN.md` is the working gap map.

**Tech Stack:** Next.js 16, React 19, TypeScript, YAML/MDX content, Vitest, Playwright a11y smoke tests, generated public audit/search artifacts.

---

## Contract

Objective:
- Start implementing production readiness immediately, with a durable plan and progress log.
- Complete Work Package 1 in this run: baseline docs/alignment + honest sparse topic coverage + seed sources + validation support.

Acceptance checks for Work Package 1:
- `STATUS.md`, `DECISIONS.md`, `PLAN.md`, `IMPLEMENT.md`, and launch checklist clearly point at the spec end state.
- Missing initial sparse topics from `PRODUCTION_READINESS_PLAN.md` Phase 1 exist in `content/topics/_index.yml` and have honest `index.mdx` placeholders.
- Seed source records from spec section 14.4 are present in `content/sources/sources.yml` without removing existing records.
- Sparse topics are not represented as complete report routes.
- Publication state union includes all spec states needed for validators/content.
- Validation passes: `npm run test:content`, `npm run generate:search-index`, `npm run lint`, `npm run typecheck`, `npm run validate:secrets`.

Non-goals for Work Package 1:
- Do not deploy or alter DNS.
- Do not add secrets or external service credentials.
- Do not fake full dossiers for sparse topics.
- Do not implement every API/workflow in this first package.

Constraints:
- No human approval/review/verification gates in repo workflows/content.
- No secrets, raw logs, raw transcripts, chain-of-thought, private submissions, or personal data.
- Keep diffs scoped and inspectable.

Risk level: Low/medium. Content/docs/code updates only; no deployment or credential actions.
Rollback path: `git diff` identifies changed files; revert Work Package 1 paths if needed.

---

## End-state roadmap

### Phase A — Baseline and honest content foundation
1. Align status/decision docs and launch checklist with spec target.
2. Add missing sparse topics and seed sources.
3. Normalize publication state types and sparse route behavior.
4. Validate content/search/build baseline.

### Phase B — Schema and validation hardening
1. Expand source model to spec fields (`slug`, author, dates, stance, reliability, related topics, archive/content hash/status).
2. Enforce valid publication states and full dossier requirements including audits, redebates, changelog refs, source links.
3. Harden claim validation and secret scanning.
4. Make `validate:public-audit` deterministic from a clean tree.

### Phase C — Public UX completion
1. Deepen Home/Facts/Questions/Sources/Method/Agents/Audit pages.
2. Add `/ops` read-only observability page.
3. Make `/repo` canonical and obvious.
4. Complete mobile/a11y polish.

### Phase D — Auditability layer
1. Generate complete public manifests and source/claim maps.
2. Add latest public agent run summaries, release and rollback logs.
3. Add compact page-level audit metadata everywhere without clutter.

### Phase E — APIs and human-input-as-signal
1. Add public read-only APIs for search/status/audit/source/claim/agent runs.
2. Add sanitized `/api/user-input` and compact “Report an issue / Suggest a source” UI.
3. Add authenticated machine endpoint shells for autonomous agent operations.

### Phase F — Autonomous workflows
1. Replace echo-like GitHub workflows with script-backed operations.
2. Add schedules, path-scoped permissions, public summaries, and automated blockers.
3. Verify no raw logs/secrets/private data leak.

### Phase G — Launch polish
1. Hosting/domain decision execution.
2. SEO/canonicals/sitemap/robots/metadata.
3. Lighthouse/a11y/mobile/performance pass.
4. Final launch checklist completion.

---

## Work Package 1 detailed tasks

### Task 1 — Progress plan/log
- Create `.hermes/plans/2026-05-03_214054-production-readiness-implementation.md`.
- Create `docs/progress/2026-05-03-production-readiness-log.md`.
- Acceptance: repo has durable plan and running log.

### Task 2 — Baseline docs
- Modify `STATUS.md`, `DECISIONS.md`, `PLAN.md`, `IMPLEMENT.md`.
- Create `ops/runbooks/launch-checklist.md`.
- Acceptance: no reader has to guess current fallback vs spec target.

### Task 3 — Sparse topic coverage
- Modify `content/topics/_index.yml`.
- Create `content/topics/<slug>/index.mdx` for missing sparse topics.
- Acceptance: `/questions` includes initial sparse set and all topic overview pages can statically render.

### Task 4 — Seed sources
- Modify `content/sources/sources.yml` with spec section 14.4 records.
- Acceptance: seed official/legal/media/advocacy records are inspectable.

### Task 5 — Type and sparse route behavior
- Modify `src/lib/types.ts` to include all spec publication states.
- Modify `src/app/questions/[topicSlug]/page.tsx` so sparse topics do not link to missing pro/anti/neutral reports as complete routes.
- Acceptance: sparse topics are honest and not fake dossiers.

### Task 6 — Validation
Run:
```txt
npm run test:content
npm run generate:search-index
npm run lint
npm run typecheck
npm run validate:secrets
```
Fix failures before closing the package.
