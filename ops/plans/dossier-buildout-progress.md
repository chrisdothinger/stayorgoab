# Dossier buildout progress

## 2026-05-05 — Current dirty Phase 2 dossier batch

Status: validation passed locally; commit hash: `PENDING_COMMIT_HASH`.

Scope completed:

- Validated and finished the in-progress post-`13e9fb6` dirty dossier-content batch.
- Promoted all 23 existing question topics in `content/topics/_index.yml` to `full_dossier` after confirming each has neutral, pro, anti, claims, sources, public audit log, and redebate log coverage.
- Expanded the remaining current topic report files under `content/topics/*/{pro,anti,neutral}.mdx` to the full-dossier section contract.
- Fixed in-scope quality issues found during validation:
  - Report self-description now matches the `full_dossier` index state instead of stale `partial_dossier` wording.
  - Neutral reports now explicitly identify the pro-independence and anti-independence/pro-federation mediation roles required by the content contract.
  - Public/ops tests were updated for the completed-all-current-topics state while keeping private assistant-name checks meaningful.
  - The phase execution plan copy was adjusted to avoid public/private assistant-name leakage while preserving the required lock path.

Validation gate results:

- `npm run test:content` — passed, 11/11 tests.
- `npm run validate:citations` — passed.
- `npm run validate:public-audit` — passed.
- `npm run validate:secrets` — passed.
- `npm run validate:agents` — passed.
- `npm test` — passed, 14/14 tests.
- `npm run lint` — passed.
- `rm -rf .next && npm run typecheck` — passed.
- `npm run test:a11y` — passed, 36/36 Playwright accessibility/product-contract tests.
- `rm -rf .next && GITHUB_PAGES=true npm run build` — passed, 166 static pages generated.
- Static internal link checker against `out` — passed, 4,180 internal links checked, 0 errors.

Continuation note:

- Phase 2 current-existing-topic batch is complete once committed/pushed and live Pages verification is green.
- Do not start Phase 3 / next-50 buildout until this commit is deployed and representative live URLs verify.
