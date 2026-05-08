# Dossier architecture v3.1 — overview-as-neutral reader layer

Status: current contract for refreshed full dossiers.

Q1 `legal-process` is the canonical baseline for every new, migrated, or substantially refreshed dossier. If a future dossier does not match Q1's section hierarchy and source-list formatting, treat it as incomplete even if the sources are strong. The pro/anti baseline is `## Bottom line`, `## The case in # pillars`, `## Main weakness`, and `## Sources`.

## Purpose

V3.1 separates the public reader layer from the audit layer and removes a reader-path duplication found in the v3 pilot.

The public reader layer should answer the question clearly, show the strongest fair side arguments, and keep citations close to claims. The overview is the neutral synthesis. It is not a teaser for a separate neutral report.

The audit layer remains complete and publicly inspectable through:

- numbered citations and `## Sources` sections, with long public citation clusters rendered as compact evidence chips;
- topic `claims.yml` files;
- topic `sources.yml` source maps;
- topic `audit-log.yml` review history;
- topic `redebate-log.yml` debate-refresh history;
- generated public audit manifests and source/claim pages.

## Public route architecture

Each refreshed full dossier uses this reader-facing route family:

```txt
/questions/[topic]/          overview + neutral synthesis
/questions/[topic]/pro/      pro-independence debate brief
/questions/[topic]/anti/     anti-independence / pro-federation debate brief
/questions/[topic]/claims/   claim map
/questions/[topic]/sources/  source map
```

Legacy `/questions/[topic]/neutral/` pages may exist during migration for backward compatibility, but refreshed dossiers should not show `Neutral` as a separate public nav item once the neutral synthesis has been merged into the overview.

## Overview contract

```md
## Short answer

## What this means for Albertans

## What each side gets right

## What would have to be decided

## What survives both arguments

## Sources
```

Job: give a cold reader the balanced answer in one place. The overview should include the former neutral-report job: what each side gets right, where claims overreach, what survives both arguments, what is still unresolved, and what evidence supports the answer.

Do not add a separate "If you only read one page" or "Want to test the argument?" section. The page itself should make the hierarchy obvious.

## Pro / anti debate-brief contract

```md
## Bottom line

## The case in 3 pillars

### 1. [Pillar]
Argument + citation.
Limit / caveat.

### 2. [Pillar]
Argument + citation.
Limit / caveat.

### 3. [Pillar]
Argument + citation.
Limit / caveat.

## Main weakness

## Sources
```

Three to five pillars are allowed, but three is the default for compact reader-first dossiers. Evidence and caveats belong inside each pillar, not in a separate repeated evidence bucket.

## Retired public containers

Do not use these as standalone sections in refreshed v3.1 reports:

- `Neutral` as a separate nav tab after its synthesis is merged into the overview;
- `If you only read one page`;
- `Want to test the argument?` / overview deep-dive panels;
- `What current sources support`;
- `What is known`;
- `What is disputed`;
- `Assumptions`;
- `Strongest evidence`;
- `Weak points`;
- `Counterarguments`;
- `Open questions`;
- `Main uncertainty`;
- `Reader checklist`.

Their jobs are merged into the overview, pro/anti pillars, the `Main weakness` section, and the audit layer.

## Citation display contract

Public dossier citations keep deterministic numbered source IDs under the hood, but the reader layer should avoid footnote explosions:

- One or two supporting sources may render as compact inline numeric citation links.
- Three or more adjacent citation numbers render as an `Evidence: N sources` chip.
- Opening the chip shows the exact numbered source links for that claim.
- Source links jump to the matching `## Sources` list item.
- Writers should still cite claims precisely; do not remove sources merely to make prose look cleaner.

This preserves source-first auditability while making dense civic prose readable on mobile.

## Validation approach

During migration, validation accepts both:

1. legacy full dossiers that still use the older broad section contract;
2. v3 lean dossiers with a separate neutral synthesis; and
3. refreshed v3.1 dossiers that merge the neutral synthesis into the overview.

New or substantially refreshed dossiers should use v3.1. Legacy compatibility exists only to avoid forcing a risky mass rewrite of all existing dossiers at once.

## Implementation surfaces

Canonical architecture constants live in:

```txt
src/lib/dossier-contract.ts
```

Public navigation is implemented in:

```txt
src/components/DossierNav.tsx
src/components/TopicSearch.tsx
```

The public method page exposes the current v3.1 shape. Report pages build section-jump navigation from actual headings instead of a hard-coded legacy list, so old and v3.1 reports both remain navigable during migration.

Agent-facing instructions live in:

```txt
agents/rubrics/reader-first-dossier-writing.md
agents/rubrics/dossier-debate-brief-framework.md
agents/prompts/pro-report.md
agents/prompts/anti-report.md
```

The older `agents/prompts/neutral-synthesis.md` is legacy guidance only until remaining dossiers have been migrated into overview-as-neutral form.
