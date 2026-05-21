# AI Agent Guidelines — Shared Knowledge Repository

This document is the master reference for all AI agents working in this repository.
Claude, GitHub Copilot, Codex, and other compatible agents must follow these guidelines.

---

## Repository purpose

This repository collects knowledge extracted from real projects and transforms it into:
- **skills** — reusable capabilities, documented and cross-linked
- **agents** — specialized agents composed of multiple related skills
- **knowledge** — patterns, architectural decisions, and domain knowledge

The goal is to let future projects reuse knowledge that has already been validated in production.

---

## Rule 0 — Output language

All structured outputs created or updated in this repository must be written in **English**.
This includes:
- skills
- agents
- knowledge documents
- templates
- summaries produced during inbox processing

Raw inbox notes may be written in any language, but generated repository content must be English.

---

## Folder structure (domain-first taxonomy)

Every artifact lives **inside a domain folder** (`llm/`, `sfad/`, or a new one you create). Inside a domain, files are grouped by competence class for skills, by file type for knowledge, and at the domain root for agents.

```text
inbox/                   ← raw Markdown files to process (user input)
  processed/             ← files already processed

skills/
  <domain>/
    <class>/             ← competence class (output, platform, bootstrap,
      <skill>.md         ←  governance, execution, coordination, …)
agents/
  <domain>/
    <agent>.md
knowledge/
  <domain>/
    patterns/            ← architectural and technical patterns
    decisions/           ← decisions with rationale (ADR style)
    domain/              ← domain knowledge (industry, client, context)
templates/
  skill-template.md
  agent-template.md
```

### Current domains

- `llm/` — LLM Engineering. Skill classes: `output/`, `platform/`.
- `sfad/` — Spec-First Agentic Development. Skill classes: `bootstrap/`, `governance/`, `execution/`, `coordination/`.

### Adding a new domain

When inbox content does not fit any existing domain:

1. Create `skills/<new-domain>/`, `agents/<new-domain>/`, `knowledge/<new-domain>/{patterns,decisions,domain}/`.
2. Inside `skills/<new-domain>/`, create competence classes only when there are ≥ 2 related skills; otherwise keep skills directly under the domain folder until enough exist to warrant subdivision.
3. Add the new domain to `MAP.md` under "Index by domain".

### Adding a new competence class

Inside an existing domain, create a new class folder (`skills/<domain>/<new-class>/`) only when there are ≥ 2 skills that share a clear scope (e.g., "release coordination", "prompt engineering"). A class with a single skill is premature — keep it next to its siblings until it accumulates company.

---

## Rule 1 — How to process a file in inbox/

When the user says **"elabora inbox"** or provides a new Markdown file:

### Step 1 — Read and classify

Read the file and identify:

- **Domain** the content belongs to (`llm/`, `sfad/`, or a new domain you create).
- **Technical patterns** → go to `knowledge/<domain>/patterns/`
- **Architectural decisions** → go to `knowledge/<domain>/decisions/`
- **Domain knowledge** → goes to `knowledge/<domain>/domain/`
- **Reusable capabilities or procedures** → become one or more files in `skills/<domain>/<class>/`

### Step 2 — Create the knowledge files

For each meaningful pattern or decision, create a file under the right domain folder:

- Patterns: `knowledge/<domain>/patterns/SCREAMING_SNAKE_CASE.md` (e.g., `LLM_JSON_PARSING.md`).
- Decisions: `knowledge/<domain>/decisions/kebab-case.md` (e.g., `score-vs-first-match.md`).
- Domain notes: `knowledge/<domain>/domain/kebab-case.md`.

### Step 3 — Create the skills
For each reusable capability or repeatable procedure, create a file in `skills/<domain>/<class>/`.
Use the template in `templates/skill-template.md`. File names are kebab-case (e.g., `llm-json-parsing.md`).
Pick the **competence class** that matches the skill's scope (output, platform, bootstrap, governance, execution, coordination, …). If no existing class fits and you have ≥ 2 related skills, create a new class folder; otherwise place the skill at `skills/<domain>/<existing-closest-class>/` and revisit later.

**One skill = one clearly defined capability.**
If a capability is too large, split it into smaller skills and link them in the “Related skills” section.

### Step 4 — Check affinity with existing skills and knowledge
Before creating new files, look for overlap with existing ones:
- Skills in the same domain → may share sections or should evolve together
- Similar patterns → should be consolidated into one updated file
- Related decisions → should be cross-linked

### Step 5 — Create or update agents
After creating the skills, verify whether:
- **An agent already exists** in that domain → add the new skills to its “Included skills” section
- **There are 2+ strongly related new skills** → create a new agent in `agents/`
- **No suitable agent exists** → do not force agent creation

### Step 6 — Move the processed file
```
inbox/file-name.md → inbox/processed/file-name.md
```

---

## Rule 2 — Criteria for creating a skill

Create a skill when the content describes:
- A repeatable procedure with clear steps
- A technical pattern applicable in multiple contexts
- A set of operating rules with explicit inputs and outputs
- A checklist of pitfalls to avoid

**Do not create a skill** for:
- Implementation details specific to a single project
- One-off configuration that is not reusable
- Copy-paste code with no transferable logic

---

## Rule 3 — Criteria for creating or updating an agent

### Create a new agent when:
- There are **at least 2 skills** in the same functional domain
- The skills together cover a complete workflow (input → output)
- The agent would have a clear role and a natural user

### Update an existing agent when:
- A new skill fits the agent’s domain
- A new decision or pattern changes the recommended behavior
- A new LLM model behavior has been documented

### Do not create an agent when:
- There is only 1 skill in the domain
- The available skills are too heterogeneous
- The agent would be too generic (for example, “agent for everything”)

---

## Rule 4 — Affinity detection across knowledge

When you load new knowledge, check for affinity across these dimensions:

| Dimension | How to verify it |
|---|---|
| **Technical domain** | Same technology, language, or framework |
| **Structural pattern** | Same type of problem (parsing, caching, retry, etc.) |
| **LLM model** | Same model → update the agent’s bug table |
| **Workflow phase** | Same pipeline point (input, processing, output) |

If the affinity is strong (same domain + same pattern), **consolidate** instead of duplicating:
- Add a section to the existing knowledge file
- Update the skill with the new pattern
- Add a row to the agent’s bug table

---

## Rule 5 — Format and conventions

### File names and locations

| Type | Format | Example path |
|---|---|---|
| skill | kebab-case | `skills/llm/output/llm-json-parsing.md` |
| agent | kebab-case | `agents/llm/llm-output-processor.md` |
| pattern | SCREAMING_SNAKE_CASE | `knowledge/llm/patterns/LLM_JSON_PARSING_GUIDELINES.md` |
| decision | kebab-case | `knowledge/llm/decisions/score-vs-first-match.md` |
| domain note | kebab-case | `knowledge/sfad/domain/sfad-methodology.md` |

### Required content for each skill
- Description (1–2 lines)
- Expected inputs / produced outputs
- Main steps or rules
- Pitfalls to avoid
- Related skills
- Source (inbox file or original project)

### Required content for each agent
- Role (1–2 lines)
- Included skills (with links)
- When to use / when not to use
- Recommended system prompt
- Known limitations
- Source

### Required content for each decision
- The decision taken (first line)
- **Why** (rationale and context)
- **Rejected alternative** and why it was rejected
- **How to apply it** in new contexts

---

## Rule 6 — Repository evolution over time

This repository is alive. When you add new knowledge:
1. **Update** existing skills and agents if the domain overlaps
2. **Add** bug tables, pitfalls, or new sections to existing files when appropriate
3. **Link** new files to older ones with cross-references
4. **Never duplicate** content — prefer linking to an existing section

---

## Expected output for each processing session

When the user says “elabora inbox” or something equivalent, produce a summary like this:

```text
## Processing completed

### Files processed
- inbox/file-name.md

### Domain
- llm/ | sfad/ | <new-domain>/

### Created
- knowledge/<domain>/patterns/PATTERN_NAME.md
- skills/<domain>/<class>/skill-name.md
- agents/<domain>/agent-name.md (if applicable)

### Updated
- skills/<domain>/<class>/existing-skill.md (added section X)
- agents/<domain>/existing-agent.md (added skill Y)

### Affinities found
- skill-name.md ↔ other-skill.md (same domain + class)

### Moved to processed
- inbox/processed/file-name.md
```
