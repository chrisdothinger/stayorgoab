# StayOrGoAB Launch Checklist

This checklist maps the launch path to the baseline spec and `PRODUCTION_READINESS_PLAN.md`. It is not a human approval gate. Automated checks and public evidence decide whether the site can publish.

## 1. Repository and identity

- [ ] Canonical repository decision recorded: fallback vs `github.com/stayorgoab/site`.
- [ ] Public repo links are accurate or explicitly labeled fallback.
- [ ] `stayorgoab.ca` primary domain decision executed.
- [ ] `stayorgoab.ai` secondary behavior decided and executed.
- [ ] README/status/docs contain no previous-builder references.

## 2. Content integrity

- [ ] Initial sparse topic set exists.
- [ ] Sparse topics clearly show current state, next autonomous step, and why the topic matters.
- [ ] Full dossiers include neutral/pro/anti reports, claim ledger, sources, audit history, redebate history, changelog references, and GitHub source links.
- [ ] Source records include required metadata.
- [ ] Claim records map to real sources.
- [ ] High-risk legal/financial/election/Indigenous claims use uncertainty language and source support.

## 3. Public UX

- [ ] Home explains purpose within 10 seconds.
- [ ] Facts page includes status snapshot, petition/referendum/negotiation distinction, timeline, key dates, legal baseline, known/unknowns, sources, and audit metadata.
- [ ] Questions page includes search, filters, category navigation, expandable rows, and no card-gallery layout.
- [ ] Sources page supports search/filter/detail inspection.
- [ ] Method page explains autonomy, source handling, audits, corrections, redaction, public GitHub, and disclaimer.
- [ ] Agents page renders registry, permissions, personas, prompts, rubrics, schedules, and public/redacted distinction.
- [ ] Audit/Ops pages expose manifests, runs, releases, rollback, repo health, source health, and stale topics.

## 4. Public artifacts

- [ ] `public/search-index.json` generated.
- [ ] `public/audit-manifest.json` generated.
- [ ] `public/source-map.json` generated.
- [ ] `public/claim-map.json` generated.
- [ ] `public/latest-agent-runs.json` generated.
- [ ] `public/latest-release.json` generated.
- [ ] `public/repository-health.json` generated.
- [ ] Public artifacts contain no secrets, private paths, raw logs, raw transcripts, chain-of-thought, cookies, auth headers, or private submissions.

## 5. APIs and input

- [ ] Public read APIs work for search/status/audit/source/claim/agent runs.
- [ ] Correction/source suggestion flow does not require name, phone, address, or unnecessary personal data.
- [ ] Raw submissions are not public by default.
- [ ] Protected machine endpoints reject unauthenticated requests.

## 6. Autonomous workflows

- [ ] Workflows have explicit least-privilege `permissions:` blocks.
- [ ] Scheduled workflows run real scripts, not just echo commands.
- [ ] Agent outputs are path-scoped where practical.
- [ ] Public run summaries are sanitized.
- [ ] Automated checks can block publish/trigger rollback.
- [ ] No workflow requires human approval, review, verification, or sign-off.

## 7. Final validation

Run and pass:

```txt
npm run lint
npm run typecheck
npm test
npm run test:content
npm run test:a11y
npm run generate:search-index
npm run generate:audit-manifest
npm run validate:public-audit
npm run validate:citations
npm run validate:agents
npm run validate:secrets
npm run build
```

## 8. Launch evidence

- [ ] Validation output summarized in `STATUS.md`.
- [ ] Changelog records launch candidate.
- [ ] Public audit manifest references launch build.
- [ ] Rollback path documented and tested.
- [ ] No horizontal overflow at 360px.
- [ ] Source, GitHub, audit, and changelog links work.
