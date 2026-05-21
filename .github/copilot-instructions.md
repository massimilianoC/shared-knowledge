# GitHub Copilot Instructions

This file configures GitHub Copilot behavior for this workspace. It is a thin alias — the **binding rules** live in [`../AI_GUIDELINES.md`](../AI_GUIDELINES.md).

## Repository context

Knowledge-management workspace for AI agents. Contains skills, agents, patterns, decisions, and domain notes extracted from real projects. Organized by **domain-first taxonomy** (`llm/`, `sfad/`, …). It is **not** an application — it is a structured Markdown documentation knowledge base.

## Required language

All reusable documentation generated in this repository must be written in **English**. If the source material in `inbox/` is in another language, translate and normalize it into English when creating or updating structured files.

## Expected Copilot behavior

### When suggesting content for a new Markdown file

- Use the matching template (`templates/skill-template.md` or `templates/agent-template.md`).
- Always include the required sections (Description, Inputs / Outputs, Steps, Pitfalls, Related, Source for skills; Role, Included skills, When / When NOT, Recommended system prompt, Limitations, Source for agents).
- Link related artifacts with **relative paths** that match the new layout (e.g. `../../knowledge/sfad/patterns/STABILITY_LAYERS.md`).

### When completing a skill file

- "Common pitfalls to avoid" must include concrete ❌ / ✅ examples when relevant.
- The "Steps / Procedure" section uses an explicit priority order.
- Cross-link related patterns, decisions, and sibling skills.

### When completing an agent file

- The "Included skills" list must contain working relative links.
- "When NOT to use this agent" is as important as "When to use".
- The "Recommended system prompt" is directly copyable into a real assistant configuration.

## Naming conventions

| File type | Location | Name format |
| --- | --- | --- |
| Skill | `skills/<domain>/<class>/` | `kebab-case.md` |
| Agent | `agents/<domain>/` | `kebab-case.md` |
| Pattern | `knowledge/<domain>/patterns/` | `SCREAMING_SNAKE_CASE.md` |
| Decision | `knowledge/<domain>/decisions/` | `kebab-case.md` |
| Domain note | `knowledge/<domain>/domain/` | `kebab-case.md` |

Current domains: `llm/`, `sfad/`. Create a new domain only when content doesn't fit any existing one.

## What NOT to do

- Do not suggest source code — this repository contains Markdown documentation only.
- Do not create files outside the defined structure.
- Do not duplicate content that already exists — suggest a link instead.
- Do not create agents with fewer than 2 included skills.
- Do not silently move files; updating relative links is mandatory after any move.

## Read first

1. [`../AI_GUIDELINES.md`](../AI_GUIDELINES.md) — master rules.
2. [`../CLAUDE.md`](../CLAUDE.md) — supported commands.
3. [`../MAP.md`](../MAP.md) — current catalog.
4. [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow.
