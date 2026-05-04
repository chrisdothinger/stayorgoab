# Decisions

## D-001 — Canonical repository target vs active fallback

**Decision:** Keep `github.com/stayorgoab/site` as the spec target and treat `github.com/chrisdothinger/stayorgoab` as the active implementation fallback.

**Reason:** The authenticated GitHub session previously could not create or use `stayorgoab/site`; Chris approved `chrisdothinger/stayorgoab` as the working repository. The baseline spec still names `stayorgoab/site` as the public end-state target.

**Implication:** Repo links may point to the fallback during implementation, but production-facing docs should make the fallback status explicit until migration or supersession is decided.

## D-002 — Domain target

**Decision:** Preserve `stayorgoab.ca` as the primary public domain target and `stayorgoab.ai` as secondary.

**Reason:** This matches the spec and public identity.

**Implication:** No DNS/deployment action is taken in this work package. Domain execution belongs to the launch/deployment phase.

## D-003 — Hosting posture

**Decision:** Maintain static-first implementation compatible with Vercel, Cloudflare Pages, Netlify, or GitHub Pages until a final hosting choice is executed.

**Reason:** Current repository uses Next.js `output: export`, YAML/MDX canonical content, and generated public artifacts. That keeps deployment portable.

## D-004 — Topic honesty over fake completeness

**Decision:** Sparse topics are allowed and expected, but only actual complete dossiers may use `full_dossier`.

**Reason:** The spec explicitly requires honest state labels and warns against pretending every topic is complete.

**Implication:** Missing topics should be added as `stub` or `seed_overview` with “research is still building” copy; pro/anti/neutral links should not imply complete reports where files do not exist.

## D-005 — Human input is signal, not authority

**Decision:** Human collaborators may submit corrections, sources, topic suggestions, UX feedback, and bug reports, but workflows must not require human approval/review/sign-off.

**Reason:** Full autonomy is a core baseline mandate. Automated quality, source, safety, accessibility, performance, and security checks are the blockers.
