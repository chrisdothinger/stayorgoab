# Contributing to StayOrGoAB

StayOrGoAB is a public civic-research project. Contributions are welcome when they improve source quality, factual clarity, accessibility, or repository safety.

## What helps most

Good contributions usually do one of these things:

- correct a factual error with a public source;
- add or improve source metadata;
- identify a claim that needs stronger evidence or uncertainty language;
- improve accessibility, mobile layout, or reader clarity;
- fix validation, build, or documentation drift;
- report a broken link or stale access date.

## Source standards

For source/content changes, include enough information for another reviewer to verify the claim:

- original source URL;
- archive URL if available;
- publisher/author;
- publication date and access date;
- which public claim or topic the source supports;
- whether the source is official, academic, news, advocacy, or analysis.

Avoid adding unsourced assertions, private documents, screenshots without provenance, raw social-media claims, or personally identifying information.

## Dossier structure standard

New, migrated, or substantially refreshed dossiers must follow the Q1 `legal-process` baseline:

- overview pages use the Q1 section order;
- pro/anti reports use `Bottom line`, `The case in # pillars`, `Main weakness`, and `Sources`;
- pillar headings are numbered `###` headings under the pillar section only;
- source sections use the normalized source-list shape validated by the content tests.

## Security and review policy

Before opening a pull request, read [`SECURITY.md`](SECURITY.md).

External or unknown-user pull requests require human review before merge, even if CI passes. CI is necessary; it is not sufficient.

Do not submit changes that include:

- secrets, tokens, cookies, API keys, or credentials;
- raw logs, private transcripts, or chain-of-thought;
- unnecessary personal data;
- hidden prompt-injection instructions for agents or LLMs;
- obfuscated scripts or workflow changes without a clear explanation.

## Local validation

Run the focused checks relevant to your change. For broad changes, run:

```bash
npm run lint
npm run typecheck
npm test
npm run test:content
npm run validate:citations
npm run validate:topics
npm run validate:dossier-migration
npm run validate:agents
npm run validate:secrets
npm run validate:pr-safety
npm run build
```

For UI or public-page changes, also run:

```bash
npm run test:a11y
```

## Pull request checklist

A good PR should state:

- what changed;
- why it changed;
- which files or public pages are affected;
- which validation commands passed;
- any remaining uncertainty or follow-up needed.

Small, reviewable PRs are strongly preferred.
