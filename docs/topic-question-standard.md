# Topic question standard

StayOrGoAB topics are not generic subject buckets. Each dossier should answer one sharp public question that a voter, journalist, policymaker, or directly affected group would reasonably care about.

This standard exists so the project does not spend time polishing repetitive or low-value dossiers.

## Core rule

Every new or substantially refreshed dossier must be anchored to a public-facing question.

Good:

- `Does the Clarity Act give Ottawa a veto over Alberta independence?`
- `Would Alberta actually stop paying equalization if it became independent?`
- `Would bank deposits and credit-union savings still be protected?`

Weak:

- `The Clarity Act`
- `Equalization`
- `Currency and banking`

Subject labels can still exist internally as categories, but the public title should be a question.

## Acceptance gate for a topic

A topic should pass all of these before a new dossier is drafted or an existing dossier is migrated to the v3/evidence-chip standard:

1. **Question form** — public title and canonical registry question end with `?`.
2. **Single-question focus** — the dossier answers one main question, not a bundle of loosely related issues.
3. **Uniqueness check** — the question belongs to a `question_family` and has been checked against existing topics in that family.
4. **Score threshold** — total score is at least 16/25 unless explicitly held as an archive/research item.
5. **Research lanes** — base, pro-source, anti-source, and mediator-dedup lanes are defined.
6. **Source-first answerability** — credible public sources can support a fair dossier without speculation masquerading as fact.
7. **Public value** — a normal reader can quickly understand why the question matters.

## Scoring rubric

Each criterion is scored 1–5 in `content/topic-question-registry.yml`.

| Criterion | Meaning |
|---|---|
| `public_importance` | Does it affect real civic decisions, money, rights, institutions, safety, or daily life? |
| `sensitivity` | Is it controversial, emotionally loaded, rights-related, financially material, or trust-sensitive? |
| `uniqueness` | Is it clearly different from existing dossiers? |
| `answerability` | Can credible sources support a pro, anti, and neutral treatment? |
| `reader_value` | Would voters, journalists, policymakers, or affected groups actually use the answer? |

Classification:

- **21–25:** flagship question.
- **16–20:** keep, but usually not the top public hook.
- **11–15:** merge, reframe, or hold for research.
- **≤10:** archive unless a current event raises its value.

## Decision labels

| Label | Meaning |
|---|---|
| `keep` | Distinct enough to maintain as a dossier candidate. |
| `reframe` | Keep the area, but rewrite the public question before major dossier work. |
| `merge_candidate` | Likely overlaps another topic; resolve before migration. |
| `split_candidate` | Too broad or bundled; split into sharper questions or choose a primary question. |

## Research hardening workflow

Before adding or refreshing a topic:

1. **Candidate question draft** — write the question in plain English.
2. **Duplicate scan** — compare it against all topics in the same `question_family` and neighbouring families.
3. **Sensitivity/value score** — score all five criteria and record the total.
4. **Pro-source lane** — identify why a serious pro-independence argument needs this question and what evidence it would use.
5. **Anti-source lane** — identify why a serious anti-independence/pro-federation argument needs this question and what evidence it would use.
6. **Mediator-dedup lane** — decide whether the question is unique, too broad, too narrow, or better merged.
7. **Registry update** — update `content/topic-question-registry.yml` before writing or migrating the dossier.
8. **Dossier migration** — only then update the dossier to lean v3 + evidence-chip citations.

## Deduplication rules

Do not keep two topics just because the slugs differ. Keep separate topics only when they answer different reader questions.

Examples:

- `referendum-mechanics` and `petition-vs-referendum-vs-negotiations` overlap. The second should likely merge into the first unless it becomes a sharply distinct explainer.
- `indigenous-rights-treaties` and `indigenous-treaties` overlap. Keep only if one focuses on broad rights/land/consultation and the other answers a narrower consent question.
- `economy-fiscal` and `economy-overall` overlap. Keep both only if one focuses on government budget/debt/taxes and the other on household/investment/macroeconomic effects.
- `borders-currency-citizenship` is a bundle. It should not be refreshed as one mega-topic if stronger single-question dossiers exist for borders, currency, citizenship, and mobility.

## Relationship to dossier v3

This standard is upstream of `docs/dossier-architecture-v3.md`.

Sequence:

1. Harden the question.
2. Confirm uniqueness and value.
3. Build/update source packets.
4. Write the lean v3 overview/pro/anti/neutral reports.
5. Keep numbered citations and evidence-chip display.
6. Validate claims, sources, audit logs, and public release metadata.
