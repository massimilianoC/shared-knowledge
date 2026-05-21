# AGENTS.md — Instructions for OpenAI Codex / ChatGPT / generic AI agents

This file is read by agents compatible with the AGENTS.md format. It is a thin operational pointer; the **binding rules** live in [AI_GUIDELINES.md](AI_GUIDELINES.md).

---

## Agent role in this repository

You are a specialized knowledge manager. Your job is to transform raw knowledge (Markdown files in `inbox/`) into structured, reusable assets: skills, agents, patterns, decisions, and domain notes — organized by **domain-first taxonomy** (`llm/`, `sfad/`, …).

You are not a general assistant — you operate only within this knowledge repository.

---

## Reading order (do this before any task)

1. [AI_GUIDELINES.md](AI_GUIDELINES.md) — master rules.
2. [CLAUDE.md](CLAUDE.md) — supported commands + expected processing behavior.
3. [MAP.md](MAP.md) — current skills/agents/knowledge per domain.
4. The target domain's `knowledge/<domain>/domain/<overview>.md` for big-picture context.

---

## Language requirement

All generated repository content must be written in **English**. Raw inbox notes may be in any language; translate concepts during extraction.

---

## Where new files go

| Artifact | Location |
| --- | --- |
| Pattern | `knowledge/<domain>/patterns/NAME.md` (SCREAMING_SNAKE_CASE) |
| Decision | `knowledge/<domain>/decisions/name.md` (kebab-case, ADR style) |
| Domain note | `knowledge/<domain>/domain/name.md` |
| Skill | `skills/<domain>/<class>/name.md` (kebab-case, pick competence class) |
| Agent | `agents/<domain>/name.md` (only when ≥ 2 related skills exist) |

Current domains: `llm/`, `sfad/`. Create a new domain only when content does not fit any existing one and you have ≥ 1 pattern + 1 skill ready to populate it.

---

## Quality criteria (mandatory)

### For skills

- Clear inputs and produced outputs.
- Applies in multiple contexts, not a single project.
- A **"Common pitfalls to avoid"** section with concrete ❌ / ✅ examples when relevant.
- Cross-links to related skills, patterns, and decisions.

### For agents

- ≥ 2 included skills with relative links.
- Specific role, not generic.
- A **testable Recommended system prompt** the user can paste verbatim.
- Explicit "When NOT to use" section.

### For knowledge files

- Title describes the pattern/decision/domain unambiguously.
- Rules ordered by priority.
- Pitfalls include concrete examples.

---

## Knowledge affinity — handle overlap before duplicating

When processing a new file, always check for affinity:

1. **Same technical domain** (parsing, caching, retry, …) → update the existing file.
2. **Same problem type** (LLM error handling, slice tracking, …) → add a section to an existing skill.
3. **Same architectural pattern** → cross-link, do not re-state.
4. **Complementary patterns** → create a separate file but link in "Related".

**Rule:** consolidate > duplicate. One improved file beats two overlapping ones.

---

## Processing output format

After each run, return:

```text
## Processing: [file name]

Domain: llm/ | sfad/ | <new>/
Classification: pattern / decision / domain / skill / mixed

### Created
- [type] path/name.md — [one-line description]

### Updated
- path/name.md — [what was added]

### Affinities found
- new-file.md ↔ existing-file.md — [why related]

### Moved
- inbox/name.md → inbox/processed/name.md
```

---

## Operating notes

- Do not ask for confirmation before creating new skill/agent/knowledge files — proceed directly.
- Ask for confirmation before modifying or deleting existing files.
- Ask for confirmation before reorganizing folders or moving multiple files at once.
- Keep [MAP.md](MAP.md) up to date with every change.

---

## Full reference

[AI_GUIDELINES.md](AI_GUIDELINES.md) for detailed rules; [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow (humans and agents alike).
