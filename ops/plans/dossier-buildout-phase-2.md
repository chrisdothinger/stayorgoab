# Phase 2 dossier buildout inventory
Generated/updated: 2026-05-05 by the limit-safe batch runner.

## Target state
- Current public question/topic count: **23**.
- Stop target: **100** total questions.
- Remaining capacity before the scheduled runner stops: **77** questions.
- Phase 2 scope: classify existing public questions and preserve a recovery inventory before Phase 3 expansion.
- Completion rule: do not mark a topic complete unless it has topic metadata/index content, overview-as-neutral synthesis, pro/anti briefs, claims, sources, public audit log, and redebate log coverage that passes repo validators.

## Classification summary
- `complete_full_dossier`: 23

## Inventory
| # | Slug | Title | Category | Sources | Claims | Classification | Notes |
|---:|---|---|---|---:|---:|---|---|
| 1 | `legal-process` | What would legally need to happen for Alberta to become independent? | Legal process | 1 | 6 | `complete_full_dossier` | all required dossier files present |
| 2 | `cpp-pensions` | What would happen to CPP and pensions? | CPP, pensions, and benefits | 1 | 7 | `complete_full_dossier` | all required dossier files present |
| 3 | `indigenous-rights-treaties` | How do Indigenous rights and treaties affect independence? | Indigenous rights, treaties, land, and consultation | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 4 | `economy-fiscal` | Would independence make Alberta richer or poorer? | Economy and fiscal policy | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 5 | `referendum-mechanics` | How does the petition and referendum process work? | Referendum mechanics | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 6 | `borders-currency-citizenship` | What happens to borders, currency, and citizenship? | Borders, trade, currency, and citizenship | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 7 | `petition-vs-referendum-vs-negotiations` | Petition vs referendum vs negotiations | Referendum mechanics | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 8 | `clarity-act` | The Clarity Act | Negotiations and constitutional law | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 9 | `quebec-secession-reference` | Quebec Secession Reference | Legal process | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 10 | `clear-question-majority` | Clear question and clear majority | Negotiations and constitutional law | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 11 | `referendum-ballot-2026` | 2026 referendum ballot | Current status | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 12 | `economy-overall` | Overall economic outlook | Economy and fiscal policy | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 13 | `equalization` | Equalization | Taxes, debt, and public services | 1 | 6 | `complete_full_dossier` | all required dossier files present |
| 14 | `federal-debt-assets` | Federal debt and assets | Taxes, debt, and public services | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 15 | `indigenous-treaties` | Indigenous treaties and consent | Indigenous rights, treaties, land, and consultation | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 16 | `military-security` | Military and security | Borders, trade, currency, and citizenship | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 17 | `currency-banking` | Currency and banking | Borders, trade, currency, and citizenship | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 18 | `borders-trade` | Borders and trade | Borders, trade, currency, and citizenship | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 19 | `public-services` | Public services | Taxes, debt, and public services | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 20 | `energy-environment` | Energy and environment | Economy and fiscal policy | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 21 | `bureaucracy-governance` | Bureaucracy and governance | Legal process | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 22 | `international-recognition` | International recognition | Negotiations and constitutional law | 1 | 4 | `complete_full_dossier` | all required dossier files present |
| 23 | `case-studies` | Case studies | Source updates and review changes | 1 | 4 | `complete_full_dossier` | all required dossier files present |

## Phase 2 result
- All currently indexed topics have required dossier file coverage and are classified as `complete_full_dossier` for Phase 2 recovery planning purposes.
- The authoritative validation evidence remains the latest passing commit/validation entry in `ops/plans/dossier-buildout-progress.md` plus the current run validation gate.
- Next safe unit after this planning commit: create/update Phase 3 next-question planning for only enough distinct questions to reach 100 total topics, with duplicate/similarity screening before any topic is added.
