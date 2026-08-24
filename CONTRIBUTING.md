# Contributing

This repository is maintained by people and AI agents. Contributions turn project experience into reusable domain packages.

## Before you contribute

1. Read [AI_GUIDELINES.md](AI_GUIDELINES.md).
2. Read [domains/README.md](domains/README.md) and the target package README.
3. Search the package for an existing pattern, decision, skill, or agent before creating one.

## Where files belong

| Artifact | Location |
| --- | --- |
| Skill | `domains/<domain>/skills/<class>/skill-name.md` |
| Agent | `domains/<domain>/agents/agent-name.md` |
| Pattern | `domains/<domain>/knowledge/patterns/PATTERN_NAME.md` |
| Decision | `domains/<domain>/knowledge/decisions/decision-name.md` |
| Domain note | `domains/<domain>/knowledge/domain/topic-name.md` |
| Domain-specific template | `domains/<domain>/templates/...` |

A domain package is copied as a whole. Do not place a package artifact in root `skills/`, `agents/`, or `knowledge/`.

## Content standards

- Write all produced content in English.
- Keep one skill focused on one reusable capability.
- Include source traceability and working relative links.
- Give agents at least two related included skills and a testable system prompt.
- Add an ADR-style decision when the package makes a durable architectural choice.

## Review checklist

- [ ] Target domain and skill class are semantically correct.
- [ ] Content duplicates no existing artifact.
- [ ] Required sections from the relevant template are present.
- [ ] Links resolve after copying `domains/<domain>/` alone.
- [ ] Package `README.md` and root `MAP.md` are updated.
- [ ] The source is archived in `inbox/processed/` when applicable.
- [ ] No secrets, client data, or proprietary credentials are included.

## Working with agents

Agents follow the same rules as human contributors. Their final report must list created, updated, linked, and archived artifacts. If an agent proposes a package-wide reorganization, wait for explicit approval before moving files.
