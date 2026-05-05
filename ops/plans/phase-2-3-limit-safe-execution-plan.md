# Phase 2/3 limit-safe execution plan

Status: approved by project owner.
Scope: after the UX/Ops sprint, complete remaining existing dossiers, then plan the next 50 highest-value questions and build them in batches.

## Non-negotiables

- One batch = one fresh context = one commit = one validation gate.
- Do not run a giant all-in-one dossier job.
- Do not mark a dossier complete unless it satisfies the full-dossier contract.
- Do not invent sources, source IDs, run dates, external audits, legal authority, or government/regulator verification.
- Neutral reports are mediator/synthesis reports comparing pro and anti strengths/weaknesses; they are not a third advocacy position.
- Keep public copy non-partisan, uncertainty-labelled, citation-backed, and clear for normal readers.
- Use numbered report citations: cite sources inline as `[1]`, `[2]`, etc.; include a `## Sources` section in every report with matching numbered source entries. Do not use raw source IDs as the public inline citation format.
- Never commit secrets, raw provider logs, raw agent transcripts, hidden chain-of-thought, personal contact data, or unredacted submissions.

## Recovery files

These files are the source of truth for fresh contexts:

- `ops/plans/phase-2-3-limit-safe-execution-plan.md` — this plan.
- `ops/plans/dossier-buildout-phase-2.md` — inventory of existing questions and remaining dossier work.
- `ops/plans/dossier-buildout-batches.yml` — batch queue for existing questions.
- `ops/plans/dossier-buildout-progress.md` — append-only progress, commits, validation, blockers.
- `ops/plans/next-50-questions.md` — ranked public/civic rationale list.
- `ops/plans/next-50-questions.yml` — machine-readable next-50 build queue.

Before each batch, read the plan/progress files. After each batch, update them before committing.

## Phase 2.0 — inventory existing questions

1. Inspect `content/topics/_index.yml`, topic report files, sources, claims, and public audit artifacts.
2. Classify every existing question:
   - `complete_full_dossier`
   - `has_reports_but_needs_depth`
   - `missing_pro`
   - `missing_anti`
   - `missing_neutral`
   - `missing_claims`
   - `missing_sources`
   - `needs_truthful_status_downgrade`
3. Save inventory to `ops/plans/dossier-buildout-phase-2.md`.
4. Save batches of 3–5 questions to `ops/plans/dossier-buildout-batches.yml`.

## Phase 2 per-batch dossier factory

Batch size: 3–5 existing questions maximum.

For each question in a batch, use this sequence:

1. Source Steward — compile bounded source pack and source limitations.
2. Pro Report Agent — strongest honest pro-independence case supported by available sources.
3. Anti Report Agent — strongest honest anti-independence/pro-federation case supported by available sources.
4. Claim/Citation Agent — normalize claims and verify source IDs.
5. Neutral Mediator Agent — only after pro + anti exist; compare strengths, weaknesses, evidence quality, and uncertainty.
6. Citation Format Agent — enforce public citation format: all report body citations are numbered bracket references (`[1]`, `[2]`, etc.) and every report has a `## Sources` section listing the matching numbered source records.
7. Synthesis Auditor — check fairness, overclaiming, missing citations, uncertainty, and public wording.
8. UX/Public Clarity Auditor — check reader comprehension, short answer, source limits, and next links.

Full-dossier report contract, where applicable:

- Short answer
- What current sources support
- Core argument
- What is known
- What is disputed
- Assumptions
- Strongest evidence
- Weak points
- Counterarguments
- Sources
- What would change this assessment
- Open questions
- Main uncertainty
- Reader checklist

## Phase 2 validation gate

After each batch:

```bash
npm run test:content
npm run validate:citations
npm run validate:public-audit
npm run validate:secrets
npm run validate:agents
npm test
npm run lint
npm run typecheck
npm run test:a11y
GITHUB_PAGES=true npm run build
```

Then run the repo's static internal-link checker against `out` if available.

Commit format:

```txt
[verified] Complete remaining dossier batch <N>
```

Push `main`, watch GitHub Actions/Pages, and verify representative live URLs before proceeding.

## Phase 3.0 — next 50 planning

Create a ranked list of the next 50 questions using these criteria:

1. Public usefulness — would an Alberta voter reasonably ask this?
2. Decision relevance — legal, financial, institutional, family, business, Indigenous, municipal, or cross-border impact.
3. Sensitivity / controversy / virality potential — prioritize important questions that people are likely to argue about, share, or find emotionally/politically salient, especially where a neutral source-first dossier can raise the quality of public thinking.
4. Source availability — official/legal/academic/primary sources exist.
5. Confusion risk — common misinformation or misunderstanding zone.
6. Coverage gap — current site lacks this category/topic.
7. Dossier feasibility — can pro/anti/neutral reports be produced responsibly without inventing evidence?

Topic selection should not chase outrage for its own sake. The point is to surface important, sensitive, high-salience questions and handle them with unusually fair pro/anti/neutral treatment, clear uncertainty labels, and strong sourcing.

Save:

- `ops/plans/next-50-questions.md`
- `ops/plans/next-50-questions.yml`

Each question record should include:

```yaml
id:
title:
category:
priority_rank:
controversy_virality_score: 1-5
why_it_matters:
why_people_may_share_or_argue:
likely_source_types:
known_source_leads:
dossier_complexity: low | medium | high
recommended_batch:
```

Likely categories:

- legal process / constitution
- economy and public finance
- pensions and benefits
- taxation
- currency/banking
- Indigenous rights and treaties
- municipalities
- borders/customs/trade
- healthcare
- education
- agriculture/energy
- policing/courts/corrections
- federal assets/liabilities
- citizenship/passports/immigration
- practical household impacts
- democratic process/public legitimacy

## Phase 3 buildout

Batch size: 5 next-50 questions maximum.

Each batch follows the same dossier factory sequence as Phase 2. If evidence is insufficient, mark the topic truthfully as partial/incomplete; do not fabricate completeness.

Commit format:

```txt
[verified] Add next-50 dossier batch <N>
```

## Limit and safety controls

- Each automated runner must acquire a lock before editing: `.hermes/runlocks/stayorgoab-dossier-run.lock`.
- If the lock exists and the process appears active, exit with a short status report.
- If the working tree has uncommitted changes not created by the current batch, validate/commit them first or stop and report.
- Never proceed to the next batch while validation/CI is red.
- After 2 failed fix attempts on the same validation failure, stop and report the blocker.
- Every 2–3 batches, run broader mobile/browser QA for Questions, Sources, Method/Ops, representative reports, Claims, and Sources dossier tabs.

## Final report contract

Report to the project owner with:

- UX sprint completion, commit hashes, live verification.
- Existing dossiers completed count, topic list, commit hashes, validation results.
- Next 50 plan location.
- Next 50 built count, remaining count, commit hashes, validation results.
- Any source limitations, blockers, risks, or continuation plan.
