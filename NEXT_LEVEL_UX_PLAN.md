# StayOrGoAB Next-Level UX/UI Plan

Review timestamp: 2026-05-04T12:01:21Z

Source spec: `/mnt/c/Users/ching/OneDrive/Desktop/stayorgoab_codex_autonomous_public_github_baseline_spec.md`
Repo reviewed: `/home/ching/work/stayorgoab`
Current HEAD at review start: `ce670a6`

## Current repo state

StayOrGoAB is past scaffold/MVP. It is now a working static-first Next.js site with a credible content model, public routes, audit artifacts, agent/ops scaffolding, topic/search UX, and passing validation.

Verified locally during this review:

```txt
npm run test:content        PASS, 8 tests
npm run validate:citations  PASS
npm run validate:public-audit PASS
npm run validate:secrets    PASS
npm test                    PASS, 11 tests
npm run lint                PASS
npm run typecheck           PASS
npm run test:a11y           PASS, 20 tests
npm run build               PASS, 114 static pages
```

Current shape:

- 23 topic records.
- Topic states: 5 `full_dossier`, 1 `seed_overview`, 17 `stub`.
- 16 source records.
- 7 global claim records.
- 19 app `page.tsx` routes.
- 0 Next API route handlers.
- 13 visible GitHub workflow files.
- 7 generated public JSON artifacts: audit manifest, source map, claim map, latest agent runs, latest release, repository health, search index.

## Spec alignment summary

### Strong alignment

- Core identity: source-first, non-partisan Alberta independence civic knowledge base.
- Public GitHub-native structure exists.
- No human review/approval publication gates are present in core repo instructions.
- Static-first Next.js/TypeScript architecture is in place.
- Required public routes mostly exist: Home, Facts, Questions, topic pages, reports, claims, sources, source detail, Method, Agents, Audit, Ops, Glossary, Changelog, Disclaimer, Repo.
- Searchable Questions page exists with query, category, state, and time-sensitivity filters.
- Public audit artifacts generate deterministically before validation.
- Source/topic/claim validation is now meaningfully stronger than the initial scaffold.
- Mobile/a11y checks exist and pass across core public routes.

### Partial alignment

- UX direction is recognizable: warm off-white, civic-index rows, large typography, metadata rows, monospace utility labels, thin separators.
- The site feels serious and inspectable, but still rough around first-time-user guidance and interaction clarity.
- `/facts`, `/sources`, `/method`, `/agents`, `/audit`, and `/ops` now have useful public readouts, but several still feel like technical summaries rather than polished public product pages.
- Workflows exist and are public, but many remain echo/stub-like rather than operational autonomous workflows.
- Full dossiers exist for five topics, but the corpus is still shallow overall and most topics are stubs.
- Public audit exists as product scaffolding, but not yet as a complete page-level trust layer on every public route.

### Major remaining gaps

- API routes from the original spec are missing. Because `next.config.mjs` uses `output: 'export'`, the immediate path should likely be static JSON-first plus optional future dynamic deployment, not server API routes unless the hosting target changes.
- Correction/source suggestion flow is missing.
- Autonomous workflows are not yet useful enough; several are visible but not operational.
- SEO/metadata/OG/sitemap/robots launch polish remains.
- Canonical repo/domain/deployment is not executed yet.
- Homepage and Questions page are visually credible but too under-guided for cold public users.
- Filters/source pages lack the richer interactive affordances promised in the spec.
- Page-level audit metadata is not yet consistently integrated across every page in a normal-reader-friendly way.

## UX/UI diagnosis

The design is heading in the right direction. It does not look like a generic AI card dashboard, startup landing page, government clone, or campaign site. The civic-index aesthetic is real.

The problem is not visual identity. The problem is product ergonomics.

### What works

- Strong visual identity: warm paper, black/navy text, thin rules, monospace metadata, index rows.
- Serious non-partisan tone.
- Homepage immediately signals source-first/public-audit purpose.
- Current-status readout is valuable above the fold.
- Questions page has the right dense-index foundation.
- Source and audit routes are becoming inspectable.
- The design is more distinctive than a typical generated Next.js/Tailwind site.

### What feels weak

- Homepage has too many competing first-viewport objects: huge hero, status table, four subtle links, Questions section, topic rows.
- Primary actions are too quiet. A normal user needs a clearer path: “Start with current facts” or “Search questions.”
- Search is not visible on the homepage first viewport even though search is a core product promise.
- Questions filters are functional but visually understated; the fields may not obviously read as controls.
- Row actions are ambiguous: title opens page, plus expands preview, state label looks like status/action.
- Category nav is useful but visually noisy with long category labels.
- Metadata is sometimes too small/low-emphasis for public readability, especially mobile.
- Source page shows records, but no true search/filter UI yet.
- Sources/Audit/Ops use metric cards more than the original “row-first, living Markdown” spec intended.
- Page-level trust/audit metadata is present in places but not consistent enough to become a signature product feature.

## Next-level product direction

Target experience:

> A calm civic briefing room: one strong orientation path for normal readers, expandable source/audit trails for skeptics, and a precise AINO-style knowledge index for deeper research.

The site should feel less like “repo successfully rendered as pages” and more like “public civic product with a designed reading path.”

## Recommended next workstreams

### Workstream 1 — UX foundation pass: make the public path obvious

Goal: make a cold visitor understand and act in under 10 seconds.

Deliverables:

- Rework homepage first viewport into a guided civic doorway:
  - one clear purpose statement;
  - compact current-status block with last-updated/source clarity;
  - prominent but restrained primary action: `Start with current facts`;
  - secondary action: `Search questions`;
  - visible compact search entry.
- Reduce competition between hero and Questions preview.
- Add public trust strip: source count, topic count, last audit generated, GitHub/public audit link.
- Make “source” labels say `View source` or similar where practical.
- Add homepage search that routes to `/questions` with query, or promote `/questions` search visibly above the fold.

Acceptance criteria:

- First-time visitor can identify the site purpose and next action without reading the whole page.
- Facts/Questions paths are visible above the fold on mobile and desktop.
- Status block shows recency and source affordance clearly.
- No giant marketing-button aesthetic; still AINO/civic-index.

### Workstream 2 — Questions page as flagship UX

Goal: make `/questions` the strongest product surface.

Deliverables:

- Add result count and active filter summary.
- Add `Clear filters` control.
- Add last-audited recency filter promised by spec.
- Add maturity legend for `Full dossier`, `Seed overview`, `Stub`.
- Move `All (23)` to the first category control and show active category state.
- Make row actions clearer:
  - title/row opens dossier;
  - `+` explicitly expands summary;
  - expanded row shows short answer, state, last audited, source count, claim count, and report/source/claim links.
- Group rows by category when not searching/filtering, or add optional category section headings.
- Mobile: collapse category nav under `Browse categories`; ensure 44px tap targets.

Acceptance criteria:

- Search/filter state is obvious.
- Users can distinguish full dossiers from planned sparse topics instantly.
- Expanded rows answer “should I click deeper?” without visual clutter.
- Mobile layout remains no-horizontal-scroll at 360/390/430px.

### Workstream 3 — Sources page becomes a real source library

Goal: meet spec requirement for searchable/filterable source inspection.

Deliverables:

- Add client-side source search.
- Add filters for type, publisher, stance, reliability category, related topic, status/date.
- Add source result count and active filters.
- Improve source rows with clearer metadata hierarchy:
  - title;
  - publisher/date/type/stance;
  - summary/how-used;
  - linked topics and claim count;
  - external source link and local detail link.
- Reduce metric-card dominance; use rows/disclosures as the main pattern.

Acceptance criteria:

- User can find Elections Alberta, Clarity Act, pension, treaty, and media sources quickly.
- Source detail pages feel useful rather than just data dumps.
- Filters work with keyboard and screen readers.

### Workstream 4 — Page-level trust layer

Goal: turn auditability into a signature UX feature without overwhelming normal users.

Deliverables:

- Create a reusable `PageTrustMeta` / expanded `AuditMeta` component.
- Add compact page metadata to Home, Facts, Questions, Sources, Method, Agents, Audit, Ops, topic pages, source details, and report pages:
  - Last audited;
  - Last debated where relevant;
  - Sources;
  - Claims;
  - Agent run;
  - GitHub source;
  - Changelog/public audit.
- Use progressive disclosure: normal users see compact trust row; skeptics can expand details.
- Add tests ensuring key public pages expose trust metadata.

Acceptance criteria:

- Every important page answers “where did this come from?” in one glance.
- Audit clutter stays secondary.
- Public trust layer uses the civic-index row style, not badges.

### Workstream 5 — Facts page public briefing upgrade

Goal: make `/facts` the “send this to your parent” page.

Deliverables:

- Add process timeline component.
- Add key dates from data.
- Add petition vs referendum vs negotiations explainer with source links.
- Add known/disputed/unknown sections sourced to current records.
- Add “What changed since last audit?” compact row.
- Ensure all high-risk claims are framed as civic information, not legal/voting advice.

Acceptance criteria:

- A normal Albertan can understand petition vs referendum vs negotiations without going to Method.
- Facts page is the best plain-language entry point.
- High-risk status claims show recency/source visibility.

### Workstream 6 — Operational reality after UX baseline

Goal: after the UX is stronger, make the autonomous system less stub-like.

Deliverables:

- Make workflow commands real where safe:
  - source health check;
  - citation validation;
  - audit manifest generation;
  - public run summary generation;
  - release log update.
- Add redaction validation for public run summaries/artifacts.
- Add correction/source suggestion static-first flow:
  - if staying `output: export`, use GitHub issue links/forms or a static form provider with privacy constraints;
  - if moving to dynamic hosting, add `/api/user-input` and protected machine endpoint shells.
- Decide static export vs dynamic API strategy explicitly in `DECISIONS.md`.

Acceptance criteria:

- Workflows do more than echo.
- Public run summaries remain sanitized.
- The site has a safe user correction/source suggestion path.

### Workstream 7 — Launch polish

Goal: get ready for public domain launch.

Deliverables:

- Canonical repo/domain decision and links finalized.
- SEO metadata per route/topic.
- Sitemap and robots.
- Open Graph/social previews.
- Lighthouse/performance budget.
- Browser screenshot QA at desktop and mobile for Home, Facts, Questions, Sources, one full topic, Method, Audit, Ops.
- Final launch checklist update.

Acceptance criteria:

- Site is credible to share publicly.
- Build/deploy pipeline is repeatable.
- No secrets/raw logs/private data in repo or artifacts.

## Recommended execution order

1. **Homepage + Questions UX flagship pass** — highest visible leverage.
2. **Sources filter/search pass** — strongest trust/product utility improvement.
3. **Reusable page-level trust metadata** — turns auditability into a product feature.
4. **Facts page briefing upgrade** — improves public comprehension.
5. **Source/correction suggestion flow decision + implementation** — closes public feedback loop.
6. **Operational workflows become real** — strengthens autonomy claim.
7. **SEO/deploy/domain polish** — launch readiness.

## Immediate next sprint proposal

Implement a focused UX/UI sprint before more backend/autonomy work:

```txt
Goal: Make StayOrGoAB feel like a polished public civic product, with Home and Questions as the flagship experience.
Scope:
- Rework homepage first viewport and trust strip.
- Upgrade Questions search/filter/category/row disclosure UX.
- Add maturity legend/result counts/clear filters/last-audited filter.
- Improve mobile tap targets and category disclosure.
- Capture desktop/mobile screenshots for review.
Validation:
- npm run lint
- npm run typecheck
- npm test
- npm run test:content
- npm run test:a11y
- npm run build
```

This should come before deeper APIs/workflows because the site’s central public promise is comprehension. The repo already has enough structure; now the product needs to feel inevitable, not merely correct.
