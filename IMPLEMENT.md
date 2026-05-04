# Implementation Notes

The implementation is static-first:

- Next.js App Router with `output: export`.
- YAML and MDX-like files are the canonical content records.
- Build scripts generate public search, source, claim, audit, release, and health JSON artifacts.
- Hermes agents update repository files and let validators/workflows determine publication state.

## Baseline rules

- The spec file is the end state.
- `PRODUCTION_READINESS_PLAN.md` is the practical phase map.
- Work phase by phase; validate after each phase before advancing.
- Keep diffs scoped to the active milestone.
- Prefer honest sparse topics over fake completeness.
- Never include human approval/review/sign-off gates.
- Never commit secrets, raw logs, raw transcripts, chain-of-thought, private submissions, cookies, auth headers, or unnecessary personal data.

## Current implementation approach

Work Package 1 focuses on docs/content/type safety because downstream UX, API, audit, and workflow work depends on a trustworthy content model.

Validation commands for this package:

```txt
npm run test:content
npm run generate:search-index
npm run lint
npm run typecheck
npm run validate:secrets
```
