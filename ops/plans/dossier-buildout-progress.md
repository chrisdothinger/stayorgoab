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
- Clean Next cache typecheck run — passed.
- `npm run test:a11y` — passed, 36/36 Playwright accessibility/product-contract tests.
- Clean GitHub Pages build run — passed, 166 static pages generated.
- Static internal link checker against `out` — passed, 4,180 internal links checked, 0 errors.

Continuation note:

- Phase 2 current-existing-topic batch is complete once committed/pushed and live Pages verification is green.
- Do not start Phase 3 / next-50 buildout until this commit is deployed and representative live URLs verify.
## 2026-05-05 — Phase 2/3 manual batch from 41 to 44 topics

Status: validation passed locally; PR pending at batch branch creation time.

Scope completed:

- Added exactly 3 new high-salience full dossiers, moving topic count from 41 to 44.
- New topics: `bank-deposits-financial-stability`, `pharmaceutical-drug-approvals-supply`, `privacy-data-federal-ids`.
- Added neutral, pro-independence, anti-independence / pro-federation reports; claims; topic source lists; audit logs; redebate logs; index records; and 12 global source records.
- Updated a11y/product count expectations from 41 to 44 topics and from 65 to 77 source records.

Duplicate/similarity guard:

- Screened candidate slugs/questions/summaries against the 41 existing topics before adding.
- Highest normalized token-overlap/Jaccard scores were below the reject threshold: `bank-deposits-financial-stability` 0.196, `pharmaceutical-drug-approvals-supply` 0.209, `privacy-data-federal-ids` 0.209.
- Avoided recent additions and existing military/security coverage.

Validation gate results:

- `npm run validate:pr-safety` — passed, 28 changed files.
- `npm run validate:secrets` — passed.
- `npm run test:content` — passed, 11/11 tests.
- `npm run validate:citations` — passed.
- `npm run validate:public-audit` — passed.
- `npm test` — passed, 14/14 tests.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run test:a11y` — passed, 36/36 Playwright tests after deliberate count-expectation updates.
- `GITHUB_PAGES=true npm run build` — passed, 353 static pages generated.

Risk note:

- Dossiers are source-bounded baselines, not final transition plans. Banking backstops, drug-regulatory continuity, and identity/privacy data sharing remain high-uncertainty topics requiring future official agreements or regulator/legal updates.

## 2026-05-05 — Phase 2 recovery inventory and batch queue

Status: validation passed locally; commit hash: this commit.

Scope completed:

- Added `ops/plans/dossier-buildout-phase-2.md` with the current 23-topic inventory, classification summary, and 100-question target state.
- Added `ops/plans/dossier-buildout-batches.yml` as the recovery batch queue for the completed current-topic Phase 2 work.
- No public topic content was changed and no new questions were added in this safe unit.

Duplicate/similarity guard:

- Not applicable to content additions in this run: the batch only inventories existing topics.
- Current existing slug/title/plain-question inventory remains the source to screen before Phase 3 candidates are added.

Validation gate results:

- `npm run test:content` — passed, 11/11 tests.
- `npm run validate:citations` — passed.
- `npm run validate:public-audit` — passed.
- `npm run validate:secrets` — passed.
- `npm run validate:agents` — passed.
- `npm test` — passed, 14/14 tests.
- `npm run lint` — passed.
- Clean Next cache typecheck run — passed.
- `npm run test:a11y` — passed, 36/36 Playwright accessibility/product-contract tests.
- Clean GitHub Pages build run — passed, 166 static pages generated.
- Static internal link checker — not present as a repo script/file; no additional checker was run.
