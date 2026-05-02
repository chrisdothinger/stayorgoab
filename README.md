# StayOrGoAB

StayOrGoAB is a source-first, non-partisan civic research website about Alberta independence and the referendum process.

The site is built as a static-first public GitHub project. Content is canonical in this repository, public audit artifacts are generated during builds, and Hermes agents can later operate through repo commits and workflow dispatches.

## Commands

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

## Repository target

The original canonical target is `github.com/stayorgoab/site`. This implementation currently uses the authorized fallback repository `github.com/chrisdothinger/stayorgoab`.
