# Overnight UX/Dossier Sprint

Started: 2026-05-04 cron run
Branch: main
Base HEAD: 9eb509e

## Guardrails
- Preserve civic-terminal/editorial aesthetic.
- Avoid public private-agent naming; use automated workflows / scheduled source checks.
- No secrets/raw logs/transcripts.
- Push to main only after validation gates.

## Phase 0 Preflight
- [x] git status clean on main
- [x] pulled origin/main (already up to date)
- [x] read AGENTS.md
- [x] created progress file

## Phase 1 UX/Ops sprint
- [x] Add/update regression tests first; confirmed failing red state in Playwright before implementation.
- [x] Implement category grouping on Questions.
- [x] Normalize DossierNav context/persistence across dossier/report/claims/sources.
- [x] Remove inline review trail links from expanded summaries/dossier areas, keep footer.
- [x] Clean Sources page to fast search controls + metadata ledger only.
- [x] Redesign Repository Evidence page as ledger.
- [x] Redesign Method/Ops as operating memo backed by ops schedules/public data.
- [x] Update Desktop baseline spec and repo schedule/public run model.
- [x] Public wording cleanup for Hermes/private assistant name in rendered public surfaces.
- [x] Validation, mobile overflow QA, static internal links passed locally.
- [ ] Commit/push, CI/live verification.

## Phase 2 Dossier factory
- Pending Phase 1 green deploy.

## Phase 3 Next 50
- Pending Phase 2 or pragmatic continuation point.

## Validation log
- RED: targeted Playwright tests failed for category grouping, dossier claims/sources nav, source/repo/method cleanup.
- GREEN: targeted Playwright suite passed (10 tests).
- npm run test:content: pass (11 tests after no-private-name regression added).
- npm run validate:citations: pass.
- npm run validate:public-audit: pass.
- npm run validate:secrets: pass.
- npm run validate:agents: pass.
- npm test: pass.
- npm run lint: pass.
- rm -rf .next && npm run typecheck: pass.
- npm run test:a11y: pass (36 tests).
- rm -rf .next && GITHUB_PAGES=true npm run build: pass.
- Static internal link checker against out: pass.
- Mobile overflow check (390px) for Questions, Sources, Repo, Method, representative report, Claims, Sources tab: pass.

## Commits
- Pending.

## Blockers / Risks
- Phase 2/3 not started yet; Phase 1 must be pushed/deployed green first.
