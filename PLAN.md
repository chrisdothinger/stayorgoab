# StayOrGoAB Build Plan

Goal: Build StayOrGoAB as a beautiful, mobile-first, public-GitHub-native, fully autonomous, non-partisan civic research website about Alberta independence and the referendum process.

Source of truth: `/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`.

Working gap map: `PRODUCTION_READINESS_PLAN.md`.

Active implementation fallback repo: `chrisdothinger/stayorgoab`.

Spec target repo/domain: `github.com/stayorgoab/site`, `stayorgoab.ca`, secondary `stayorgoab.ai`.

## Production-readiness phases

1. **Baseline alignment and production decision record** — docs, fallback/canonical clarity, launch checklist.
2. **Honest content state and initial topic coverage** — sparse topic set, seed sources, no fake full dossiers.
3. **Schema and validation hardening** — source/claim/topic/public-audit/secret validators catch bad states.
4. **Public UX completion** — Home/Facts/Questions/Sources/Method/Agents/Audit/Ops feel production-grade.
5. **Public auditability layer** — manifests, source maps, claim maps, release/rollback/public run summaries.
6. **API and correction/source suggestion flow** — public read APIs, sanitized user input, protected machine endpoint shells.
7. **Autonomous workflow implementation** — script-backed scheduled jobs, least-privilege Actions, public summaries.
8. **Deployment, domains, SEO, and launch polish** — hosting, DNS, metadata, a11y/mobile/performance final pass.

## Current work package

Work Package 1 implements phases 1–2 enough to create a credible foundation:

- update status/decisions/launch checklist;
- add missing sparse topics;
- add seed sources;
- fix sparse-topic route honesty;
- run validation and log evidence.
