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

A topic should pass all of these before a new dossier is drafted or an existing dossier is migrated to the v3.1 overview-neutral/evidence-chip standard:

1. **Question form** — public title and canonical registry question end with `?`.
2. **Single-question focus** — the dossier answers one main question, not a bundle of loosely related issues.
3. **Uniqueness check** — the question belongs to a `question_family`, has a structured `overlap_review`, and has been checked against same-family and adjacent-family topics.
4. **Boundary test** — the registry must say what this question includes and what nearby questions cover instead.
5. **Score threshold** — total score is at least 16/25 unless explicitly held as an archive/research item.
6. **Research lanes** — base, pro-source, anti-source, and mediator-dedup lanes are defined.
7. **Source-first answerability** — credible public sources can support a fair dossier without speculation masquerading as fact.
8. **Public value** — a normal reader can quickly understand why the question matters.

## Scoring rubric

Each criterion is scored 1–5 in `content/topic-question-registry.yml`.

| Criterion | Meaning |
|---|---|
| `public_importance` | Does it affect real civic decisions, money, rights, institutions, safety, or daily life? |
| `sensitivity` | Is it controversial, emotionally loaded, rights-related, financially material, or trust-sensitive? |
| `uniqueness` | Is it clearly different from existing dossiers? |
| `answerability` | Can credible sources support a fair overview-as-neutral answer plus pro and anti briefs? |
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
| `cancel_duplicate` | Do not keep as a public dossier candidate because another question already covers the reader need. |

## Structured overlap review

Each registry entry must include `overlap_review`. The audit agent is not done just because a question is grammatical.

Required checks before `decision: keep`:

1. Name the closest same-family or adjacent-family topics.
2. Say whether each nearby topic is a parent, child, sibling, duplicate, bundle, or adjacent dependency.
3. State the boundary in plain English: **this question answers X; the nearby question answers Y**.
4. Record the canonical slug that should survive if overlap is found.
5. Reject boilerplate notes like “distinct enough if source depth remains strong.” That sentence is catnip for false confidence.
6. Use reciprocal checks. If `A` says it was checked against `B`, `B` should usually say how it differs from `A`; known high-risk pairs are hard validator errors if one-way.
7. Boundary text must be complete and explicit — no truncated fragments, and no vague “adjacent but distinct” handwaving.

Example boundaries:

- `currency-banking` covers currency choice, monetary policy, lender-of-last-resort risk, and banking stability. It does **not** cover passports, border inspections, or tariffs.
- `borders-trade` covers goods, tariffs, customs costs, rules of origin, trucking, rail, pipelines, and market access. It does **not** cover citizenship or aviation safety.
- `border-enforcement-customs` survives only as a state-capacity question about a CBSA-like inspection/enforcement function.
- `courts-criminal-law` covers laws, courts, judges, prosecutions, appeals, and active cases. `federal-prisons-corrections-parole` covers custody, parole, transfers, staff, facilities, and sentence administration.
- `energy-environment` now asks whether resources are actually unlocked; `environmental-assessment-pipeline-approvals` asks who approves major projects and whether process timelines get faster.

## Research hardening workflow

Before adding or refreshing a topic:

1. **Candidate question draft** — write the question in plain English.
2. **Duplicate scan** — compare it against all topics in the same `question_family` and neighbouring families.
3. **Sensitivity/value score** — score all five criteria and record the total.
4. **Pro-source lane** — identify why a serious pro-independence argument needs this question and what evidence it would use.
5. **Anti-source lane** — identify why a serious anti-independence/pro-federation argument needs this question and what evidence it would use.
6. **Mediator-dedup lane** — decide whether the question is unique, too broad, too narrow, or better merged.
7. **Registry update** — update `content/topic-question-registry.yml` before writing or migrating the dossier.
8. **Dossier migration** — only then update the dossier to the Q1 `legal-process` v3.1 standard: overview-as-neutral, exact Q1 overview/pro/anti section hierarchy, compact evidence-chip citations, and a normalized bottom `## Sources` block.

## Deduplication rules

Do not keep two topics just because the slugs differ. Keep separate topics only when they answer different reader questions and the boundary is recorded in `overlap_review`.

Current hard boundaries and required reciprocal checks:

- Retire subject bundles. The old borders/currency/citizenship bundle is replaced by a landlocked-corridors question; currency, citizenship, border agency, and goods-trade questions are separate.
- The landlocked-corridors topic must be checked against currency, citizenship/mobility, goods-trade, border-agency capacity, resource-market access, and major-project approvals.
- `referendum-mechanics` covers petition/referendum process; the post-referendum negotiation question covers what Canada and Alberta would have to settle after a successful vote.
- `economy-fiscal` is the macro dashboard; the old duplicate overall-economy slot is replaced by a U.S.-alignment question.
- Equalization, federal debt/assets, tax collection, and the macro-economy question must be kept separate: savings/transfer flows, settlement balance sheet, revenue machinery, and overall household/fiscal outcome.
- `indigenous-rights-treaties` covers broad rights, land, treaties, and consultation; the narrower Indigenous-sovereignty question asks whether First Nations could remain tied to Canada or require separate agreements.
- `borders-trade`, `border-enforcement-customs`, `immigration-passports-mobility`, and `air-transport-aviation-safety` must not all re-answer “will people be able to travel?” Each has a narrower boundary.
- `courts-criminal-law`, `rcmp-provincial-policing`, and `federal-prisons-corrections-parole` are separate only if court/prosecution, policing, and sentence/custody administration stay clearly separated.
- `energy-environment` asks whether resources are actually unlocked; `environmental-assessment-pipeline-approvals` asks who approves projects and whether permitting gets faster.
- U.S. alignment must be checked against international recognition and defence/security so the question stays about partnership trade-offs, not generic diplomacy or military replacement.

## Relationship to dossier v3

This standard is upstream of `docs/dossier-architecture-v3.md`.

Sequence:

1. Harden the question.
2. Confirm uniqueness and value.
3. Build/update source packets.
4. Write the v3.1 overview-as-neutral synthesis plus pro/anti debate briefs.
5. Keep numbered citations and evidence-chip display.
6. Validate claims, sources, audit logs, and public release metadata.
