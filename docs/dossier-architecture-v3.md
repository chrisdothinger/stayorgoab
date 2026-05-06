# Dossier architecture v3 — lean public reader layer

Status: current contract for refreshed full dossiers.

## Purpose

V3 separates the public reader layer from the audit layer.

The public reader layer should answer the question clearly, show the serious arguments, and keep citations close to claims. It should not repeat the same evidence through many administrative containers.

The audit layer remains complete and publicly inspectable through:

- numbered citations and `## Sources` sections;
- topic `claims.yml` files;
- topic `sources.yml` source maps;
- topic `audit-log.yml` review history;
- topic `redebate-log.yml` debate-refresh history;
- generated public audit manifests and source/claim pages.

## Public route architecture

Each full dossier keeps the same route family:

```txt
/questions/[topic]/          overview
/questions/[topic]/pro/      pro-independence debate brief
/questions/[topic]/anti/     anti-independence / pro-federation debate brief
/questions/[topic]/neutral/  neutral mediator synthesis
/questions/[topic]/claims/   claim map
/questions/[topic]/sources/  source map
```

The route family does not change in v3. The public report shape does.

## Overview contract

```md
## Short answer

## The debate in plain English

## Where the debate turns

## Read the briefs
```

Job: orient a cold reader quickly. Do not repeat the same conclusion in multiple sections.

## Pro / anti debate-brief contract

```md
## Bottom line

## The case in 4 pillars

### 1. [Pillar]
Argument + citation.
Limit / caveat.

### 2. [Pillar]
Argument + citation.
Limit / caveat.

### 3. [Pillar]
Argument + citation.
Limit / caveat.

### 4. [Pillar]
Argument + citation.
Limit / caveat.

## Best objections / replies

## What would change this assessment

## Sources
```

Three to five pillars are allowed, but four is the default. Evidence and caveats belong inside each pillar, not in a separate repeated evidence bucket.

## Neutral mediator contract

```md
## Bottom line

## What each side gets right

## What survives both arguments

## The practical test

## What would change this assessment

## Sources
```

Job: mediate the already-written pro and anti briefs. It is not a third advocacy argument and should not flatten meaningful disagreement into false balance.

## Retired public containers

Do not use these as standalone sections in refreshed v3 reports:

- `What current sources support`
- `What is known`
- `What is disputed`
- `Assumptions`
- `Strongest evidence`
- `Weak points`
- `Counterarguments`
- `Open questions`
- `Main uncertainty`
- `Reader checklist`

Their jobs are merged into pillars, objections/replies, the neutral mediation sections, and the audit layer.

## Validation approach

During migration, validation accepts both:

1. legacy full dossiers that still use the older broad section contract; and
2. refreshed v3 dossiers that use the lean contract above.

New or refreshed dossiers should use v3. Legacy compatibility exists only to avoid forcing a risky mass rewrite of all existing dossiers at once.

## Implementation surfaces

Canonical architecture constants live in:

```txt
src/lib/dossier-contract.ts
```

The public method page exposes the current v3 shape. Report pages build section-jump navigation from actual headings instead of a hard-coded legacy list, so old and v3 reports both remain navigable during migration.

Agent-facing instructions live in:

```txt
agents/rubrics/dossier-debate-brief-framework.md
agents/prompts/pro-report.md
agents/prompts/anti-report.md
agents/prompts/neutral-synthesis.md
```
