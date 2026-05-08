# StayOrGoAB Domain Launch Plan

Status: repo-preparation plan only. Do not change DNS, buy domains, transfer repositories, or alter GitHub Pages custom-domain settings without Chris approval.

## Production target

- Primary public domain: `stayorgoab.ca`
- Secondary domain decision pending: `stayorgoab.ai`
- Current fallback preview: `https://chrisdothinger.github.io/stayorgoab/`
- Current repository fallback: `github.com/chrisdothinger/stayorgoab`
- Possible future canonical repository: `github.com/stayorgoab/site`

## Repo work that can be done before approval

1. Keep `NEXT_PUBLIC_SITE_URL` and `SITE_BASE_PATH` configurable.
2. Keep fallback GitHub Pages builds on `SITE_BASE_PATH=/stayorgoab`.
3. Use `SITE_BASE_PATH=` for a root custom-domain build after launch approval.
4. Generate public audit artifacts from repository records, not hand-edited snapshots.
5. Keep public run summaries redacted and summarized.
6. Keep Q1 `legal-process` as the required standard for future dossier structure, formatting, source depth, claim linkage, and source disclosure behavior.

## Chris approval required

Ask Chris before any of these external actions:

1. Confirm or purchase `stayorgoab.ca`.
2. Confirm or purchase `stayorgoab.ai`.
3. Decide whether `stayorgoab.ai` redirects to `.ca`, parks, mirrors, or hosts AI-method content.
4. Add or edit DNS records at the registrar/DNS provider.
5. Set or change the GitHub Pages custom domain.
6. Add `public/CNAME` for `stayorgoab.ca` if doing so would affect production Pages behavior.
7. Transfer or create a canonical GitHub org/repo.

## Expected GitHub Pages DNS shape

For an apex GitHub Pages domain, GitHub currently expects A records to GitHub Pages IPs and may support AAAA records. Verify the current GitHub Pages docs immediately before execution; do not rely on stale DNS notes.

For `www`, use a CNAME to the GitHub Pages host if Chris wants `www.stayorgoab.ca` live.

## Launch execution checklist

1. Chris confirms domain ownership/access and primary/secondary behavior.
2. Repo switches production build environment to:
   - `NEXT_PUBLIC_SITE_URL=https://stayorgoab.ca`
   - `SITE_BASE_PATH=`
3. Add `public/CNAME` with `stayorgoab.ca` if GitHub Pages custom domain is approved.
4. Configure GitHub Pages custom domain and HTTPS.
5. Configure DNS records.
6. Wait for DNS and certificate provisioning.
7. Run final validation:
   - `npm run lint`
   - `npm run typecheck`
   - `npm test`
   - `npm run test:content`
   - `npm run test:a11y`
   - `npm run validate:topics`
   - `npm run validate:dossier-migration`
   - `npm run validate:citations`
   - `npm run validate:agents`
   - `npm run validate:public-audit`
   - `npm run validate:secrets`
   - `npm run build`
8. Verify live routes:
   - `/`
   - `/questions/`
   - `/questions/legal-process/`
   - `/questions/legal-process/claims/`
   - `/questions/legal-process/sources/`
   - `/sources/`
   - `/method/`
   - `/agents/`
   - `/audit/`
9. Record launch evidence in `ops/releases/release-log.yml`, `ops/agent-runs/latest.public.json`, and `STATUS.md`.

## Rollback path

If launch breaks routing, assets, HTTPS, or DNS:

1. Remove or revert the Pages custom-domain setting.
2. Revert DNS records to previous values if needed.
3. Rebuild fallback mode with `SITE_BASE_PATH=/stayorgoab`.
4. Record the incident in `ops/incidents/incident-log.yml` and the public release log once stable.
