# Pull Request Safety Checklist

## Summary

- 

## Type of change

- [ ] Content / civic knowledge base
- [ ] Source, claim, or audit metadata
- [ ] UI / frontend code
- [ ] Build, workflow, dependency, or configuration change
- [ ] Documentation only

## Required checks

- [ ] I understand that all PR content is untrusted until reviewed.
- [ ] This PR contains no secrets, credentials, private logs, raw agent transcripts, or personal contact data.
- [ ] This PR contains no prompt-injection instructions aimed at agents, LLMs, reviewers, CI, or future automation.
- [ ] Any source/citation changes are traceable and do not overstate legal, government, or external-audit authority.
- [ ] Any dependency, workflow, script, or package-lock change is explicitly explained above.

## Human review gate

This project requires full human review before merge. Agent/automation review can support the reviewer, but must not be the only merge authority.
