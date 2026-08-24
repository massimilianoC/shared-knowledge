# SFAD Agentic Project Template

This template is a starting point for a new repository that will be developed by humans and AI coding agents. It is intentionally tool-neutral: `AGENTS.md` holds project policy, while Claude Code, Codex, Cursor, Kiro, or another tool can add a small adapter without copying the policy.

## Choose an adoption path

| Situation | Start with |
| --- | --- |
| New product or long-lived project | Copy the template files, replace placeholders, complete the Pre-`src/` Checklist, then create the first slice. |
| Existing repository | Do **not** overwrite files. Use the retrofit path in `knowledge/sfad/domain/sfad-next-adoption-guide.md`; audit the current architecture first. |
| Short-lived prototype | Use only `AGENTS.md`, a one-milestone roadmap, and a brief feature spec; explicitly state that full SFAD is postponed. |

## Recommended layout

```text
AGENTS.md
docs/governance/PROJECT_CONSTITUTION.md
docs/architecture/decisions/
docs/planning/EXECUTION_SPEC.md
specs/<feature-id>/spec.md
dev/SESSION_HANDOFF.md
```

`dev/SESSION_HANDOFF.md` is an example of temporary operational memory. Declare the actual location and whether it is committed, ignored, or generated in the target project’s `AGENTS.md`. Requirements, architectural decisions, and completion evidence remain in the canonical `docs/` and `specs/` files.

## Language

The template and public documentation are English. A project may choose another documentation/reply language, but it must declare that choice in `AGENTS.md`; code, identifiers, file names, and commit messages remain English.

## Customization rules

1. Replace every `${PLACEHOLDER}` before use.
2. Adapt commands and gates to the actual stack; do not copy Node.js examples into a non-Node project.
3. Add a tool adapter only after identifying what is unique to that tool.
4. Implement “must never” rules in CI/hooks/permissions whenever possible.
5. Do not let the template outrank the target repository’s accepted ADRs or security policy.

## Related

- [SFAD Next Adoption Guide](../../knowledge/domain/sfad-next-adoption-guide.md)
- [Agentic Development Evidence Review](../../knowledge/domain/agentic-development-evidence-review.md)
