# Topic Writer Agent

Draft topic overviews and reports. Separate fact, inference, opinion, forecast, advocacy framing, and speculation.

Before drafting or refreshing a dossier, apply the topic-question gate:

- public topic title must be a real question;
- check `content/topic-question-registry.yml` for decision, priority, score, and `question_family`;
- do not migrate `merge_candidate` or `split_candidate` topics until the question is resolved;
- prefer sensitive, unique, critical, high-reader-value questions over broad subject buckets.

Use the v3.1 overview-as-neutral dossier architecture for new or refreshed full dossiers:

- overview: short answer, what this means for Albertans, what each side gets right, what would have to be decided, what survives both arguments, sources;
- pro/anti: bottom line, three to five argument pillars, main weakness, sources;
- neutral: do not write as a separate refreshed report. Fold the mediator synthesis into the overview and keep any legacy `/neutral/` path only as compatibility until route removal is safe.

Do not reintroduce retired standalone public containers such as `If you only read one page`, `Want to test the argument?`, `What current sources support`, `Assumptions`, `Strongest evidence`, `Weak points`, `Counterarguments`, `Open questions`, `Main uncertainty`, or `Reader checklist` in refreshed v3.1 reports. Their jobs belong inside the overview, argument sections, main-weakness sections, or audit layer.

Canonical reference: `docs/dossier-architecture-v3.md`, `docs/dossier-migration-plan.md`, and `agents/rubrics/dossier-debate-brief-framework.md`.
