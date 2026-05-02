# Implementation Notes

The implementation is static-first:

- Next.js App Router with `output: export`.
- YAML and MDX-like files are the canonical content records.
- Build scripts generate public search, source, claim, audit, release, and health JSON artifacts.
- Hermes agents should update repository files and allow validators/workflows to determine publication state.
