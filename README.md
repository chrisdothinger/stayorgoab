# StayOrGoAB

StayOrGoAB is a source-first, non-partisan civic research website about Alberta independence, referendum mechanics, and the practical questions Albertans would need answered before making a high-consequence decision.

The project is built in public so readers can inspect the content model, source library, claim mapping, validation checks, and agent-run summaries behind the site.

## Project status

- **Launch target:** `https://stayorgoab.ca`
- **Current GitHub Pages preview:** `https://chrisdothinger.github.io/stayorgoab/`
- **Primary repository:** `https://github.com/chrisdothinger/stayorgoab`
- **Canonical dossier standard:** Q1 / `legal-process`
- **Current hosting path:** static export through GitHub Pages

The production domain is not live yet. Domain setup is tracked in [`ops/runbooks/domain-launch-plan.md`](ops/runbooks/domain-launch-plan.md).

## What the site publishes

StayOrGoAB organizes public research into question dossiers:

- short neutral overviews written for non-specialist readers;
- pro and anti argument briefs with consistent Q1-style section structure;
- source lists with access dates and reliability metadata;
- claim ledgers linking public claims back to sources;
- public audit artifacts showing what the repository says was checked and when.

The site is civic information, not legal, financial, investment, tax, immigration, or voting advice.

## How trust is handled

This repository treats public trust as an engineering problem:

- source metadata lives in version-controlled YAML;
- topic pages, claim pages, and source pages are generated from repository data;
- validation scripts fail on known structural drift, missing citations, malformed sources, and unsafe PR patterns;
- public agent-run summaries are redacted and generated from repository records;
- external/unknown pull requests require human review before merge.

Key public-trust files:

- [`SECURITY.md`](SECURITY.md) — PR security and human-review policy
- [`ops/runbooks/launch-checklist.md`](ops/runbooks/launch-checklist.md) — launch readiness checklist
- [`ops/runbooks/domain-launch-plan.md`](ops/runbooks/domain-launch-plan.md) — GitHub Pages/custom-domain plan
- [`agents/registry.yml`](agents/registry.yml) — agent registry
- [`agents/permissions.yml`](agents/permissions.yml) — agent permissions
- [`ops/schedules.yml`](ops/schedules.yml) — scheduled audit/update workflow definitions

## Local development

Prerequisites:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

## Validation commands

Run the full pre-launch check set before public release or major content changes:

```bash
npm run lint
npm run typecheck
npm test
npm run test:content
npm run test:a11y
npm run generate:search-index
npm run generate:audit-manifest
npm run validate:public-audit
npm run validate:citations
npm run validate:topics
npm run validate:dossier-migration
npm run validate:agents
npm run validate:secrets
npm run validate:pr-safety
npm run build
```

## Repository layout

```txt
agents/      Agent registry, permissions, prompts, personas, and rubrics
content/     Source records, topic dossiers, claim ledgers, and migration manifest
docs/        Content architecture and topic/question standards
ops/         Runbooks, schedules, release records, latest public agent-run summaries
public/      Static assets and generated public audit/search artifacts
scripts/     Validators and static artifact generators
src/         Next.js app, components, content loaders, and tests
tests/       Playwright accessibility/product-contract tests
```

## Contributing

StayOrGoAB is not currently operating as a broad open-contribution project, but issue reports and source corrections are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the safe contribution path and review rules.

## License

License terms are intentionally pending before public launch. Until a license is added, all rights are reserved by the repository owner unless otherwise stated.
