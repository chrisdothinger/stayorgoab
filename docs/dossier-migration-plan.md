# Dossier Migration Plan — v3 Lean Standard

## Goal

Build out all 50 StayOrGoAB questions as high-value, source-first public dossiers using the current standards:

- hardened public question map from `content/topic-question-registry.yml`;
- lean v3 public dossier contract;
- evidence-chip citation rendering while preserving numbered source IDs;
- public audit trail through sources, claims, audit logs, redebate logs, validators, and PR history.

## Non-goals

- Do not rewrite the question architecture again unless a concrete overlap or low-value question is found.
- Do not bulk-rewrite all remaining dossiers in a single PR.
- Do not migrate any future `merge_candidate`, `split_candidate`, or `cancel_duplicate` topic until the question is resolved in the registry.
- Do not trade auditability for a cleaner-looking public page.

## Current state

- 50 public questions exist.
- 50 topics have the required content artifacts: `index.mdx`, `pro.mdx`, `anti.mdx`, `neutral.mdx`, `sources.yml`, `claims.yml`, `audit-log.yml`, and `redebate-log.yml`.
- `legal-process` is the completed v3 pilot.
- The other 49 topics are tracked as `legacy_refresh_needed` in `content/dossier-migration-manifest.yml`.

## Control files

- `content/dossier-migration-manifest.yml` — canonical migration cockpit.
- `scripts/validate-dossier-migration.ts` — validates manifest parity, batch size, migration status, source-refresh requirements, and strict v3 completeness for completed dossiers.
- `content/topic-question-registry.yml` — canonical public-question and overlap-review source.
- `docs/topic-question-standard.md` — topic/question acceptance standard.
- `docs/dossier-architecture-v3.md` — dossier content architecture.

## Batch order

Target batch size: **5–7 dossiers per PR**, smaller for high-sensitivity batches.

1. `batch-01-household-financial-security`
   - CPP/pensions
   - EI/federal benefits
   - healthcare portability/doctor licensing
   - bank deposits/financial stability
   - currency/banking
   - equalization

2. `batch-02-borders-trade-mobility`
   - landlocked goods movement
   - tariffs/customs/market access
   - border agency/inspections
   - citizenship/passports/mobility
   - aviation safety/air links
   - agriculture/food inspection/market access

3. `batch-03-democratic-legal-process`
   - Clarity Act
   - clear question/clear majority
   - 2026 ballot timing/status
   - referendum mechanics
   - petition vs referendum vs negotiations
   - Quebec Secession Reference

4. `batch-04-rights-courts-public-safety`
   - Charter/civil liberties
   - courts/criminal law/prosecutions
   - policing/RCMP
   - prisons/corrections/parole
   - firearms/licensing
   - reproductive health rights

5. `batch-05-indigenous-land-water`
   - Indigenous rights/treaties
   - First Nations jurisdiction/treaty relationships/consent
   - parks/Crown/public lands
   - water rights/rivers/infrastructure

6. `batch-06-state-capacity-foreign-security`
   - defence/security/foreign affairs
   - international recognition
   - state capacity/public institutions
   - tax collection/revenue administration
   - statistics/census/public data
   - privacy/identity/data systems

7. `batch-07-energy-resources-economy`
   - resources/environment constraints
   - major-project approvals/permitting
   - U.S. alignment/partnership
   - broad fiscal/economic position
   - debt/assets settlement
   - labour standards/public-sector bargaining

8. `batch-08-regulators-public-services`
   - transition service interruption risk
   - daily-life federal regulators
   - drug approvals/medicine supply
   - public health surveillance/vaccine reporting
   - emergency/disaster aid
   - students/universities/research funding

9. `batch-09-remaining-high-value`
   - case studies
   - bankruptcy/insolvency/creditor protection
   - election law/parties/campaign finance

## Per-topic dossier factory

For every migrated topic:

1. **Question lock**
   - Use `current_public_question` from `content/topic-question-registry.yml`.
   - Confirm manifest question, `_index.yml` title, and topic `index.mdx` frontmatter match.

2. **Source refresh**
   - Run separate lanes:
     - base packet/factual floor;
     - pro-source lane;
     - anti-source/pro-federation lane;
     - neutral mediator/dedup lane.
   - Prefer primary law, government, court, regulator, fiscal/statistical, treaty, and institutional sources.
   - Add current credible sources when needed; preserve source IDs and source quality labels.

3. **Overview rewrite**
   - Required headings:
     - `## Short answer`
     - `## The debate in plain English`
     - `## Where the debate turns`
     - `## Read the briefs`

4. **Pro rewrite**
   - Required headings:
     - `## Bottom line`
     - `## The case in 3–5 pillars`
     - `## Best objections / replies`
     - `## What would change this assessment`
     - `## Sources`

5. **Anti rewrite**
   - Same v3 structure as pro.
   - Must be the strongest honest anti-independence/pro-federation case, not a straw man.

6. **Neutral rewrite**
   - Required headings:
     - `## Bottom line`
     - `## What each side gets right`
     - `## What survives both arguments`
     - `## The practical test`
     - `## What would change this assessment`
     - `## Sources`
   - Neutral is a mediator synthesis after pro/anti, not a third advocacy side.

7. **Evidence artifacts**
   - Update `sources.yml` for any source additions or changed source-quality notes.
   - Update `claims.yml` for supported, disputed, unsupported, and high-risk claims.
   - Update `audit-log.yml` with source refresh, v3 migration, citation validation, and result.
   - Update `redebate-log.yml` with pro/anti/neutral review notes.

8. **Citation contract**
   - Source MDX keeps numbered bracket citations such as `[1]`.
   - `## Sources` lists matching numbered entries.
   - Dense citation clusters stay in source; renderer turns 3+ adjacent citations into evidence chips.

## Batch acceptance gate

Before opening a PR for a dossier batch, run:

```bash
npm test &&
npm run validate:topics &&
npm run validate:dossier-migration &&
npm run test:content &&
npm run validate:citations &&
npm run validate:public-audit &&
npm run validate:secrets &&
npm run test:a11y &&
npm run lint &&
npm run typecheck &&
GITHUB_PAGES=true npm run build &&
npm run validate:agents &&
npm run validate:pr-safety &&
git diff --check
```

After merge, verify GitHub `build`, `deploy`, and `secret-scan`, then live-check representative pages from the batch.

## Review standard

Each batch gets an independent review before merge:

- **Spec compliance:** v3 sections, citation/source matching, manifest status, audit/redebate updates.
- **Source quality:** current credible source coverage, no missing obvious counter-evidence, no unsupported high-risk claims.
- **Reader quality:** plain-English answer, no repetitive legacy containers, mobile-readable pillars, no raw Markdown artifacts.
- **Fairness:** serious pro and anti briefs; neutral compares what survives both sides.

## Migration status updates

When a topic is migrated successfully:

- set `migration_status: v3_complete`;
- set `source_refresh_required: false`;
- keep the batch assignment for historical traceability;
- ensure `validate:dossier-migration` passes in strict v3 mode for that topic.

If a topic needs more research or question review:

- set `migration_status: needs_review` or `blocked`;
- do not mark it complete;
- explain the blocker in the batch PR notes.
