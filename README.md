# Shared Knowledge Repository

A curated, version-controlled library of **reusable AI skills, agents, patterns, and decisions** distilled from real production projects. Designed to be loaded directly by AI coding assistants (Claude, Codex, Copilot, Gemini, …) **and** to remain readable by humans onboarding a project.

---

## What lives here

- **`skills/`** — atomic, reusable capabilities. One file = one clearly defined skill.
- **`agents/`** — specialized agents that compose 2+ related skills with a recommended system prompt.
- **`knowledge/`** — the source material that justifies the skills:
  - `patterns/` — recurring technical patterns,
  - `decisions/` — architectural decisions with rationale (ADR style),
  - `domain/` — domain knowledge (industry, client, business context).
- **`templates/`** — copy-ready Markdown templates for new skills and agents.
- **`inbox/`** — raw notes waiting to be processed (any language welcome).
- **`MAP.md`** — the navigable map of the repository.

Everything is grouped **by domain first** (`llm/`, `sfad/`, …), then by competence class for skills.

---

## Folder structure (domain-first taxonomy)

```text
inbox/
  processed/

skills/
  llm/
    output/          # JSON parsing, output repair, sanitization
    platform/        # multi-provider catalog, gateway, cost, credits,
                     # context budget, background tasks
  sfad/
    bootstrap/       # empty-repo → ready-to-open-M0
    governance/      # stability tagging, ADRs (MADR)
    execution/       # milestones, slices, 7-step workflow, PR DoD
    coordination/    # external dependencies / parallel-team contracts

agents/
  llm/               # llm-output-processor, multiprovider-llm-architect
  sfad/              # sfad-bootstrap-agent, sfad-execution-agent

knowledge/
  llm/
    patterns/        # SCREAMING_SNAKE_CASE.md
    decisions/       # kebab-case.md (ADR style)
    domain/          # kebab-case.md
  sfad/
    patterns/
    decisions/
    domain/

templates/
  skill-template.md
  agent-template.md
```

A domain folder groups every artifact (skill, agent, pattern, decision, domain note) needed to think about that competence area. New domains are created as the library grows.

### Current domains

| Domain | Scope |
| --- | --- |
| `llm/` | LLM engineering: output parsing/repair, multi-provider platform (catalog, gateway, cost, credits, context, background tasks). |
| `sfad/` | Spec-First Agentic Development: methodology to bootstrap, govern, execute, and coordinate projects touched by AI agents. |

See **[MAP.md](MAP.md)** for the full index, dependency graph, and per-domain skill/agent listing.

---

## For humans

### Start here

1. Open **[MAP.md](MAP.md)** to see what skills/agents/knowledge are available.
2. Pick a skill that matches your task, e.g. [`skills/sfad/bootstrap/spec-first-bootstrap.md`](skills/sfad/bootstrap/spec-first-bootstrap.md).
3. Copy the **Steps / Procedure** section into your workflow, or paste the **Recommended system prompt** (from an agent) into your assistant.

### Contribute new knowledge

You have two paths:

- **OPTION A** — You already know the file type. Drop the file directly in the right domain folder. Then ask an AI assistant to derive the skill/agent.
- **OPTION B** — You have raw notes (any language). Drop them in `inbox/` and run the processing command (see below).

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full contribution flow, naming conventions, and quality checklist.

---

## For AI agents

### Reading order

When you start a task in this repository, read in this order:

1. **[CLAUDE.md](CLAUDE.md)** — operational instructions for AI assistants in this repo.
2. **[AI_GUIDELINES.md](AI_GUIDELINES.md)** — the master rule reference (output language, folder taxonomy, processing rules, file conventions).
3. **[MAP.md](MAP.md)** — current skills/agents/knowledge per domain.
4. The target domain's `knowledge/<domain>/domain/<domain-overview>.md` for big-picture context (e.g. [`knowledge/sfad/domain/sfad-methodology.md`](knowledge/sfad/domain/sfad-methodology.md)).
5. The specific skill or agent file you are asked to use.

### Processing inbox content

When the user provides raw notes:

```text
"elabora inbox"         # process every file in inbox/ (except ISTRUZIONI.md and processed/)
"elabora <filename>"    # process a specific file
"crea skill da <file>"  # extract only the skills from one file
"aggiorna agenti"       # check whether new skills should update existing agents
"trova affinità"        # detect overlap between skills and knowledge
"riepilogo repository"  # show the current state of skills, agents, knowledge
```

These commands are accepted in **both English and Italian** (the user's native language). The English equivalents are:

```text
"process inbox" | "process <filename>" | "create skill from <file>"
"update agents" | "find affinities" | "repository summary"
```

The rules for processing are codified in [AI_GUIDELINES.md](AI_GUIDELINES.md) §"Rule 1 — How to process a file in inbox/".

### Output language

All structured outputs created or updated in this repository must be written in **English**. Raw inbox notes can be in any language; the assistant translates concepts into English during extraction.

---

## Quick template for raw inbox notes

```markdown
# Title / Project name or topic

## Context
Short description of the project or situation

## What we implemented / Patterns used
...

## Mistakes to avoid
...

## Lessons learned
...
```

Free-form text also works — the assistant will interpret it.

---

## License

[MIT](LICENSE) © 2026 Massimiliano Camillucci. The methodology kit, skill templates, and knowledge files are intended to be copy-able into other repositories — treat them as a living standard. Attribution appreciated, not required.

---

## Stability of this repository

- `skills/`, `agents/`, `knowledge/patterns/` — stable; changes follow the principles documented in `knowledge/sfad/patterns/STABILITY_LAYERS.md`.
- `knowledge/decisions/` — append-only; superseded decisions are marked, never deleted.
- `inbox/` — ephemeral; once processed, files are moved to `inbox/processed/`.
- `templates/` — evolving; updated as the library grows.
- `MAP.md` — updated on every change.
