# Contributing

Contributions turn project experience into reusable domain packages. Thank you for helping. By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report security problems privately as described in [`SECURITY.md`](SECURITY.md).

## Ways to contribute

- Fix an error, broken link, or unclear instruction in an existing artifact.
- Propose a new skill, agent, pattern, or package (open an issue first for anything larger than a fix).
- Add or improve an offline-tested example.

## Before you start

1. Read [`domains/README.md`](domains/README.md) and the target package README.
2. Search the package for an existing pattern, decision, skill, or agent before creating one. Do not duplicate knowledge.
3. Use [`templates/skill-template.md`](templates/skill-template.md) or [`templates/agent-template.md`](templates/agent-template.md) for new artifacts.

## Where files belong

| Artifact | Location |
| --- | --- |
| Skill | `domains/<domain>/skills/<class>/skill-name.md` |
| Agent | `domains/<domain>/agents/agent-name.md` |
| Pattern | `domains/<domain>/knowledge/patterns/PATTERN_NAME.md` |
| Decision | `domains/<domain>/knowledge/decisions/decision-name.md` |
| Domain note | `domains/<domain>/knowledge/domain/topic-name.md` |
| Domain-specific template | `domains/<domain>/templates/...` |
| Example tests and validation rules | `validation/` |

A domain package is copied as a whole. Do not place a package artifact in root-level `skills/`, `agents/`, or `knowledge/`.

## Content standards

- Write in English.
- Keep one skill focused on one reusable capability.
- An agent includes at least two related skills and a testable system prompt.
- Add an ADR-style decision when a package makes a durable architectural choice.
- Include source or evidence status and working relative links that still resolve when `domains/<domain>/` is copied alone.
- Keep guidance project-neutral: no source-project names, private measurements, client data, or credentials.

## Pull request checklist

- [ ] Target domain and skill class are correct.
- [ ] Content duplicates no existing artifact.
- [ ] Required sections from the relevant template are present.
- [ ] Links resolve after copying `domains/<domain>/` alone.
- [ ] Package `README.md`, [`MAP.md`](MAP.md), and the root README are updated.
- [ ] No secrets, personal data, client data, or proprietary material.
- [ ] Runnable examples are registered in `validation/examples.json` and covered by tests.
- [ ] `npm test` passes on Node 20 or later without a live provider credential.
- [ ] `VERSION` and [`CHANGELOG.md`](CHANGELOG.md) are updated for release-worthy changes, following [`VERSIONING.md`](VERSIONING.md).

## Working with AI agents

Agents follow the same rules as human contributors. An agent's final report should list created, updated, linked, and archived artifacts. Wait for explicit maintainer approval before any package-wide reorganization. For example changes, follow [`validation/AGENTS.md`](validation/AGENTS.md): write Given/When/Then scenarios, use a local mock for provider behavior, and keep test infrastructure outside copyable packages.

## License

By contributing you agree that your contribution is released under the [MIT License](LICENSE).
