# CLAUDE.md — Instructions for Claude Code

This file is automatically loaded by Claude Code at session startup.

---

## Purpose of this repository

This is a centralized knowledge repository built from real project experience and transformed into reusable AI skills, agents, and reference documents. Every Markdown file in `inbox/` contains raw knowledge that should be processed into structured assets.

Full reference: [AI_GUIDELINES.md](AI_GUIDELINES.md). Navigable index: [MAP.md](MAP.md).

---

## Output language

All generated repository content must be written in **English**. Inbox source notes may be in any language, but the resulting skills, agents, knowledge files, and summaries must be English.

---

## Folder taxonomy (domain-first)

Every artifact lives inside a domain folder.

```text
skills/<domain>/<class>/skill-name.md
agents/<domain>/agent-name.md
knowledge/<domain>/{patterns|decisions|domain}/file.md
```

Current domains: `llm/`, `sfad/`. New domains may be added when inbox content does not fit any existing one.

---

## Supported commands

Accepted in English or Italian. The Italian aliases are listed first because they match how the maintainer types them today.

| Italian | English | Action |
| --- | --- | --- |
| `elabora inbox` | `process inbox` | Process all files in `inbox/` except `ISTRUZIONI.md` and `processed/` |
| `elabora [filename]` | `process [filename]` | Process a specific file |
| `crea skill da [file]` | `create skill from [file]` | Extract only the skills from a file |
| `aggiorna agenti` | `update agents` | Check whether new knowledge or skills should update existing agents |
| `trova affinità` | `find affinities` | Analyze existing skills and knowledge to find overlap |
| `riepilogo repository` | `repository summary` | Show the current state of skills, agents, and knowledge |

---

## Expected behavior

### When processing an inbox file

1. Read the file completely.
2. Identify the **domain** (existing `llm/`, `sfad/`, or a new one).
3. Classify the content (pattern / decision / domain note / skill).
4. Create the appropriate knowledge files under `knowledge/<domain>/{patterns|decisions|domain}/`.
5. Create the skills under `skills/<domain>/<class>/` using the template. Pick or create the right competence class.
6. Check affinity with existing skills and agents **before** creating new files.
7. Create or update agents in `agents/<domain>/` if there are 2+ related skills.
8. Move the source file to `inbox/processed/`.
9. Produce a processing summary in English.

### Quality rules

- Do not duplicate content — update existing files when the domain overlaps.
- Always link related skills using relative references (e.g. `../execution/milestone-lifecycle.md`).
- Every skill must have clear inputs, produced outputs, and at least one "Pitfalls to avoid" section.
- Every agent must include a recommended system prompt and a list of included skills with relative links.

### Affinity detection

Before creating a new file, always inspect the current state of the domain:

```bash
ls skills/<domain>/
ls agents/<domain>/
ls knowledge/<domain>/patterns/
ls knowledge/<domain>/decisions/
```

Then read the files in the same domain + class to avoid duplication.

---

## Templates to use

- Skill: [templates/skill-template.md](templates/skill-template.md)
- Agent: [templates/agent-template.md](templates/agent-template.md)

---

## Naming conventions

| Type | Format | Example path |
| --- | --- | --- |
| Skill | kebab-case | `skills/llm/output/llm-json-parsing.md` |
| Agent | kebab-case | `agents/llm/llm-output-processor.md` |
| Pattern | SCREAMING_SNAKE_CASE | `knowledge/llm/patterns/LLM_JSON_PARSING_GUIDELINES.md` |
| Decision | kebab-case | `knowledge/llm/decisions/score-vs-first-match.md` |
| Domain note | kebab-case | `knowledge/sfad/domain/sfad-methodology.md` |

---

## Operating notes

- Do not ask for confirmation before creating new skill, agent, or knowledge files — proceed directly.
- Ask for confirmation before modifying or deleting existing files.
- Ask for confirmation before reorganizing folders or moving multiple files.
- At the end of each processing run, always show a summary of created / updated / moved files.
- If an inbox file is already in `processed/`, do not reprocess it unless the user explicitly asks.
- Keep MAP.md up to date with every change to the catalog.
