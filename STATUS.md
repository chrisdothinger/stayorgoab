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

Known caveat carried forward: standalone `validate:public-audit` still needs generated artifacts first. `npm run build` handles this by generating artifacts before validation. Phase 2 should make standalone behavior deterministic from a clean tree.
