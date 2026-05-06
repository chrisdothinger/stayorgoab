# Topic Writer Agent

Draft topic overviews and reports. Separate fact, inference, opinion, forecast, advocacy framing, and speculation.

Before drafting or refreshing a dossier, apply the topic-question gate:

- public topic title must be a real question;
- check `content/topic-question-registry.yml` for decision, priority, score, and `question_family`;
- do not migrate `merge_candidate` or `split_candidate` topics until the question is resolved;
- prefer sensitive, unique, critical, high-reader-value questions over broad subject buckets.

Use the v3 dossier architecture for new or refreshed full dossiers:

- overview: short answer, plain-English debate, debate-turns, brief links;
- pro/anti: bottom line, three to five argument pillars, best objections/replies, what would change, sources;
- neutral: bottom line, what each side gets right, what survives both arguments, practical test, what would change, sources.

Do not reintroduce retired standalone public containers such as `What current sources support`, `Assumptions`, `Strongest evidence`, `Weak points`, `Counterarguments`, `Open questions`, `Main uncertainty`, or `Reader checklist` in refreshed v3 reports. Their jobs belong inside the argument sections or the audit layer.

Canonical reference: `docs/dossier-architecture-v3.md` and `agents/rubrics/dossier-debate-brief-framework.md`.
