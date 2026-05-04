# StayOrGoAB Production Readiness Plan

Source spec reviewed: `/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`

Repo inspected: `/home/ching/work/stayorgoab`

Remote inspected: `https://github.com/chrisdothinger/stayorgoab.git`

Spec canonical target: `github.com/stayorgoab/site`, primary domain `stayorgoab.ca`, secondary `stayorgoab.ai`.

Current local validation snapshot:

```txt
npm run lint       PASS
npm run typecheck  PASS
npm test           PASS, 7 tests
```

A delegated validation audit also reported passing `test:content`, `validate:citations`, `validate:agents`, `validate:secrets`, and a full `npm run build` after generated audit artifacts were produced. One known caveat: `npm run validate:public-audit` can fail on a clean tree if generated `public/*.json` audit artifacts do not exist yet; `npm run build` runs generation first.

## Executive summary

The repo is no longer just a scaffold. It has a Next.js/TypeScript static-first site, core public routes, content files, agent scaffolding, required workflow filenames, and passing baseline lint/type/test checks.

It is not production-ready under the baseline spec yet.

The main gap is depth and operational reality: the repo has the shape of the autonomous public-GitHub civic site, but several required systems are thin, stubbed, or incomplete. The next push should focus on production credibility: canonical repo/domain alignment, honest topic states, complete initial sparse topic coverage, stronger content/source/claim validation, richer Facts/Sources/Agents/Audit pages, real public audit artifacts, correction/source-suggestion flow, and meaningful autonomous workflow behavior.

## Guiding production standard

Production-ready means:

1. A normal Albertan can land on the site, understand the purpose in 10 seconds, find current facts, search questions, inspect sources, and understand uncertainty without political or technical clutter.
2. A skeptic can inspect GitHub and see content, sources, claims, agent roles, prompts, rubrics, schedules, audit manifests, release logs, changelog, and redaction rules.
3. The system never overclaims completeness: sparse topics are visibly sparse; full dossiers are only marked full when neutral/pro/anti reports, claims, sources, audits, redebate history, changelog references, and GitHub links exist.
4. No workflow requires human approval, human review, human verification, or human sign-off. Automated checks may block publication.
5. No secrets, raw logs, raw transcripts, hidden chain-of-thought, private submissions, or unnecessary personal data are committed or published.
6. Launch validation scripts run meaningfully and pass.

## Current state by area

### Already in decent shape

- Next.js / React / TypeScript / Tailwind-style app is present.
- Required npm scripts mostly exist in `package.json`.
- Core routes exist under `src/app` for home, facts, questions, topic drill-ins, sources, method, agents, audit, glossary, changelog, disclaimer, and repo.
- Content directories exist under `content/` for status, topics, sources, claims, glossary, changelog, disclaimer.
- Agent files exist under `agents/` for six MVP personas, prompts, rubrics, policies, registry, and permissions.
- Required GitHub Actions workflow filenames exist under `.github/workflows/`.
- Public artifact generator scripts exist under `scripts/`.
- Baseline local validation passes for lint, typecheck, and unit/content tests.

### Not production-ready yet

- Canonical repo/domain mismatch remains: current remote is `chrisdothinger/stayorgoab`, while the spec target is `github.com/stayorgoab/site` and `stayorgoab.ca`.
- `/ops` route is missing.
- API routes are missing: search/status/audit/source/claim/agent-runs/user-input and protected machine endpoints for audit/redebate/publish/rollback.
- Topic corpus is below the spec’s minimum initial sparse set.
- Some topics are marked `full_dossier` before the full spec requirements are enforced.
- Source schema is under-modeled compared with the spec.
- Public audit page and artifacts exist but are not yet tied to real autonomous workflow runs.
- Most autonomous workflows are visible but stub-like rather than operational.
- `/facts`, `/sources`, `/agents`, `/audit`, and `/method` need more production UX/data depth.
- Correction/source suggestion mechanism is missing.
- Standalone `validate:public-audit` has a generation prerequisite that should be explicit or automated.
- A11y/mobile production checks need to be run and made part of CI with screenshots or reports.

## Phase 0 — Baseline alignment and production decision record

Goal: lock the operating baseline so all future work points in the same direction.

Deliverables:

- Update `STATUS.md` with current validation status and current production gap summary.
- Update `DECISIONS.md` with explicit decisions:
  - whether `chrisdothinger/stayorgoab` remains a temporary fallback or becomes the public canonical repo;
  - whether/when to migrate to `github.com/stayorgoab/site`;
  - whether deployment target is GitHub Pages, Vercel, Cloudflare Pages, or another host;
  - how `stayorgoab.ca` and `stayorgoab.ai` will map to the site.
- Replace ambiguous/fallback repo links where production needs a single canonical value, or label them clearly as temporary.
- Create a launch checklist file, e.g. `ops/runbooks/launch-checklist.md`, mapped to spec section 23.

Acceptance criteria:

- No one reading the repo has to guess what the canonical repo/domain/deploy path is.
- Temporary fallback state is obvious and dated.
- No previous-builder references.
- No human approval/review fields or workflow states.

Validation:

```txt
npm run lint
npm run typecheck
npm run validate:secrets
```

## Phase 1 — Honest content state and initial topic coverage

Goal: make the public knowledge base honest before adding more polish.

Deliverables:

- Add the missing spec-required sparse topic stubs in `content/topics/_index.yml` and matching topic folders:
  - `petition-vs-referendum-vs-negotiations`
  - `clarity-act`
  - `quebec-secession-reference`
  - `clear-question-majority`
  - `referendum-ballot-2026`
  - `economy-overall` or a deliberate alias/rename decision for current `economy-fiscal`
  - `equalization`
  - `federal-debt-assets`
  - `indigenous-treaties` or a deliberate alias/rename decision for current `indigenous-rights-treaties`
  - `military-security`
  - `currency-banking`
  - `borders-trade`
  - `public-services`
  - `energy-environment`
  - `bureaucracy-governance`
  - `international-recognition`
  - `case-studies`
- Downgrade any `full_dossier` topic that does not meet the full spec definition.
- Add honest sparse placeholder copy for all incomplete topics.
- Add missing seed source records from spec section 14.4.
- Add or normalize topic slugs to avoid drift from spec names.

Acceptance criteria:

- `/questions` includes at least the full initial sparse topic set.
- Sparse topics clearly show state, next autonomous step, and why they matter.
- No topic claims to be a full dossier unless it has neutral/pro/anti reports, claims, sources, audit history, redebate history, changelog references, and GitHub source links.
- Source records include all seed official/legal/news source entries from the spec.

Validation:

```txt
npm run test:content
npm run generate:search-index
npm run build
```

## Phase 2 — Schema and validation hardening

Goal: make overclaiming and bad civic data hard to ship.

Deliverables:

- Expand source schema to include spec fields:
  - `slug`
  - `author`
  - `published_at`
  - `accessed_at`
  - `source_type`
  - `stance`
  - `reliability_category`
  - `summary`
  - `how_used`
  - `related_topic_slugs`
  - `archive_url`
  - `content_hash`
  - `last_checked_at`
  - `status`
- Expand topic validation for:
  - unsupported states;
  - missing search metadata;
  - stale or malformed audit dates;
  - broken internal topic links;
  - invalid report state transitions;
  - forbidden `human_review_required` / `human_reviewed` fields anywhere.
- Expand claim validation for:
  - source-supported claims with zero sources;
  - invented source IDs;
  - high-risk claims without required autonomous checks;
  - legal/financial/election claims missing uncertainty language or source support.
- Add full dossier validation for:
  - report files exist;
  - required report sections exist;
  - claim ledger exists and maps to sources;
  - topic source list exists;
  - audit and redebate logs exist;
  - changelog references exist;
  - GitHub source links are derivable.
- Fix `validate:public-audit` generation dependency:
  - either make it fail with a clear “run generate first” message;
  - or add `validate:public-audit:generated` / `prevalidate:public-audit` behavior;
  - or commit stable generated artifacts if that is the intended public record.
- Strengthen secret detection patterns for GitHub tokens, OpenAI keys, bearer tokens, cookies, private keys, `.env`, raw auth headers, and raw provider logs.

Acceptance criteria:

- The validator catches civic-content mistakes before build/deploy.
- Full dossier status cannot be assigned casually.
- `validate:public-audit` behavior is deterministic in CI.
- Secret scanner is credible enough for a public repo.

Validation:

```txt
npm run test:content
npm run validate:citations
npm run validate:public-audit
npm run validate:secrets
npm test
npm run build
```

## Phase 3 — Public UX completion

Goal: make the site feel production-grade for normal users, not just structurally correct.

Deliverables:

- Home:
  - first viewport clearly states what the site is;
  - current status rows come from `content/status/status-snapshot.yml`;
  - primary paths to Facts, Questions, Sources, Method are above the fold.
- Facts:
  - status snapshot;
  - petition vs referendum vs negotiations;
  - process timeline;
  - key dates;
  - legal baseline;
  - known/unknown sections;
  - source list;
  - audit metadata.
- Questions:
  - keep dense AINO-style index;
  - add last-audited recency filter;
  - add empty-state suggestions;
  - group rows by category;
  - ensure expanded rows show short answer, state, audit dates, source count, claim count, neutral/pro/anti/claims/sources/audit links.
- Topic pages:
  - overview sections: short answer, known, disputed, unknown, argument map, claims/sources, audit history.
  - report routes include thesis, core argument, assumptions, strongest evidence, weak points, counterarguments, source notes, what would change assessment, open questions.
- Sources:
  - search and filters by source type, topic, publisher, date, stance, status.
  - source detail pages show required metadata and linked claims/topics.
- Method:
  - explain autonomy, what AI is not allowed to do, source handling, pro/anti/neutral workflow, audit/redebate, public GitHub, redaction, corrections, disclaimer.
- Agents:
  - render registry, permission matrix, personas, prompts, rubrics, schedules, public/redacted distinction, latest public runs.
- Audit:
  - render manifest, latest runs, release log, rollback log, repo health, source health, topic states, stale audits, broken links, search status, secret-scan summary.
- Add `/ops` as public read-only operational observability.
- Make `/repo` a real redirect to the canonical repo.

Acceptance criteria:

- Mobile works at 360px with no horizontal scroll.
- The site looks like a warm civic index / living Markdown knowledge base, not a card dashboard.
- Normal readers are not overwhelmed by audit clutter, but skeptics can drill into it.
- Disclaimer is restrained and not pasted everywhere.

Validation:

```txt
npm run lint
npm run typecheck
npm run test:a11y
npm run build
```

## Phase 4 — Public auditability layer

Goal: turn auditability from static files into a real product feature.

Deliverables:

- Generate and/or publish:
  - `public/audit-manifest.json`
  - `public/source-map.json`
  - `public/claim-map.json`
  - `public/latest-agent-runs.json`
  - `public/latest-release.json`
  - `public/repository-health.json`
  - `public/search-index.json`
  - `ops/audit-manifests/latest.json`
  - `ops/agent-runs/by-date/*.public.json`
- Add page-level compact metadata:
  - Last audited
  - Last debated
  - Sources
  - Agent run
  - GitHub source
  - Changelog
- Add public run summary schema enforcement:
  - run id;
  - agent id/name;
  - trigger;
  - sanitized summaries;
  - files changed;
  - sources checked;
  - claims added/changed;
  - checks run/passed/failed;
  - public artifacts;
  - commit sha;
  - risk flags;
  - redactions applied.
- Add redaction validation for public artifacts.
- Add release and rollback log integration.

Acceptance criteria:

- Outsiders can answer: what changed, which agent changed it, which sources support it, which checks ran, which commit shipped, whether corrected/rolled back.
- Public artifacts never contain raw agent logs, raw transcripts, chain-of-thought, private submissions, secrets, cookies, auth headers, or private local paths.
- Every public page links to relevant source/audit/changelog/GitHub artifacts without cluttering normal reading.

Validation:

```txt
npm run generate:audit-manifest
npm run validate:public-audit
npm run validate:secrets
npm run build
```

## Phase 5 — API and correction/source suggestion flow

Goal: support public usability and autonomous intake without collecting unnecessary personal data.

Deliverables:

- Read-only APIs:
  - `/api/search`
  - `/api/search/topics`
  - `/api/search/sources`
  - `/api/status-snapshot`
  - `/api/audit-manifest`
  - `/api/source-map`
  - `/api/claim-map`
  - `/api/agent-runs`
- User input API/UI:
  - `/api/user-input`
  - compact “Report an issue” / “Suggest a source” links on relevant pages.
- User input model:
  - no required name, phone, address, or unnecessary personal data;
  - sanitize raw input;
  - store public summarized outcome only;
  - route accepted input into autonomous source/citation/risk checks.
- Protected machine endpoint shells:
  - `/api/agent/audit`
  - `/api/agent/redebate`
  - `/api/agent/publish`
  - `/api/agent/rollback`
- Machine endpoints must require secret-backed authentication and must not expose secrets/client tokens.

Acceptance criteria:

- Users can suggest a correction/source without handing over personal data.
- Raw submissions are not public by default.
- Protected endpoints reject unauthenticated calls.
- Public summaries are redacted.

Validation:

```txt
npm run lint
npm run typecheck
npm test
npm run validate:secrets
npm run build
```

## Phase 6 — Autonomous workflow implementation

Goal: replace workflow-shaped stubs with useful autonomous operations.

Deliverables:

- Enrich `.github/workflows/*.yml` with least-privilege permissions and real commands.
- Add `ops/schedules.yml` fields:
  - workflow;
  - cron;
  - timezone;
  - purpose;
  - allowed_outputs;
  - required_checks;
  - public_log_level;
  - publish_raw_logs: false;
  - human_gate: false.
- Implement script-backed workflow behavior for:
  - source discovery;
  - source health check;
  - claim/citation validation;
  - bias audit;
  - policy-risk audit;
  - topic dossier build/update;
  - redebate trigger checks;
  - public run summary generation;
  - release log update;
  - rollback log update.
- Keep the initial six-agent team understandable; document expansion agents but do not overbuild them.
- Ensure automated checks may block publication; no human approval gates.

Acceptance criteria:

- Workflows do more than echo.
- Scheduled workflows produce sanitized public summaries.
- Agent permissions are path-scoped where possible.
- Release can publish passing builds; rollback can restore last stable release when health checks fail.
- No workflow prints secrets or raw env vars.

Validation:

```txt
npm run validate:agents
npm run validate:citations
npm run validate:public-audit
npm run validate:secrets
npm run build
```

## Phase 7 — Deployment, domains, SEO, and launch polish

Goal: ship a credible public production site.

Deliverables:

- Final hosting decision and configured deployment.
- Domain mapping:
  - `stayorgoab.ca` primary;
  - `stayorgoab.ai` redirect or method/agents landing decision.
- SEO metadata:
  - site title;
  - default description;
  - topic metadata;
  - canonical URLs;
  - Open Graph/social previews;
  - sitemap;
  - robots.txt;
  - structured data where useful.
- Performance pass.
- Accessibility pass.
- Mobile pass at required viewport widths.
- Error handling and 404 behavior.
- Privacy-conscious analytics only, if configured.
- Final launch checklist completed.

Acceptance criteria:

- Public site is reachable on the intended domain.
- Build/deploy pipeline is repeatable from GitHub plus non-secret deployment config.
- Lighthouse/accessibility targets pass or documented exceptions are explicit.
- Search works.
- Source links work.
- GitHub/audit links work.
- No horizontal mobile overflow.
- No secrets or raw logs in repo/public artifacts.

Validation:

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

## Recommended immediate execution order

If using Codex/Hermes agents, execute in this order:

1. `Phase 0`: Update status/decisions/launch checklist and canonical repo/domain decision notes.
2. `Phase 1`: Add missing sparse topics and seed sources; downgrade overclaimed full dossiers.
3. `Phase 2`: Harden validation so bad states cannot ship.
4. `Phase 3`: Fill public UX gaps for Facts, Sources, Agents, Audit, Method, `/ops`, and `/repo` redirect.
5. `Phase 4`: Make audit artifacts and page metadata real and inspectable.
6. `Phase 5`: Add read-only APIs and correction/source suggestion flow.
7. `Phase 6`: Make workflows operational instead of mostly stubs.
8. `Phase 7`: Deploy, domain, SEO, a11y/mobile/performance, final launch.

## Codex goal for implementation

Use this as the practical `/goal` for a coding agent:

```txt
/goal Bring the current StayOrGoAB repository at /home/ching/work/stayorgoab to full production readiness according to stayorgoab_codex_autonomous_public_github_baseline_spec.md. Work phase by phase. First align repo/domain/status decisions, then make topic states honest and add missing sparse topics/sources, then harden validation, then complete public UX routes/pages, then implement public audit artifacts, APIs, user input, autonomous workflows, and final deployment polish. Never add human approval/review/verification gates. Never commit secrets, raw logs, raw transcripts, chain-of-thought, private submissions, or personal data. After each phase run the relevant npm validation commands, fix failures, and update STATUS.md and changelog.
```
