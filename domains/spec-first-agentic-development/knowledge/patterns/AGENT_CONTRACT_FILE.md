# Pattern: AGENTS.md as Single Agent Contract

## Summary
Centralize cross-agent project policy into **one file at the repo root** (`AGENTS.md`). Give every assistant-specific file (`CLAUDE.md`, `GEMINI.md`, `COPILOT.md`, `CURSOR.md`, ...) a thin adapter that defers to it. Scoped knowledge may live close to the relevant module; deterministic controls belong in tooling.

Stability: **stable**.

## Why
Without a binding contract, different assistants make divergent choices: one introduces Redux while another uses Zustand; one bypasses the backend "for local dev"; one silently disables a linter rule. Every PR re-litigates first principles.

A single contract:
- removes the "which file does this assistant read?" question;
- makes rules **citable** (an agent can say "this violates Rule 4.2");
- forces the team to agree on rules once, instead of per-assistant;
- makes onboarding a new assistant a 5-line addition, not a rewrite.

## Shape

```
repo-root/
├── AGENTS.md       # The contract. Everything binding is here.
├── CLAUDE.md       # Alias: "read AGENTS.md, plus these Claude-specific notes"
├── GEMINI.md       # Alias
├── COPILOT.md      # Alias
└── CURSOR.md       # Add aliases as new assistants join
```

Adapters are intentionally thin (5–15 lines) and contain only **assistant-specific mechanics or UX preferences** (tool loading, command hints, thinking-mode advice, reply language). They never add new cross-agent project rules.

## Mandatory sections of `AGENTS.md`

| # | Section | Purpose |
| :-: | :--- | :--- |
| 0 | Project identity | What the repo is, what it is **not**, target audience. |
| 1 | Non-negotiable principles | Numbered, terse — the pillars. |
| 2 | Scope IN / OUT | What lives here, what does not. |
| 3 | Reading order | The exact list of files read before any task. |
| 4 | Workflow | The 7-step task workflow. |
| 5 | Code conventions | Pointer to Tech Stack. |
| 6 | Security baseline | Forbidden by default. |
| 7 | Boundary interaction rules | How this repo talks to its SSoT. |
| 8 | State & data conventions | Server vs UI vs form state. |
| 9 | The agent must NEVER | Closed list of forbidden actions, grep-friendly. |
| 10 | Definition of Done | The PR checklist. |
| 11 | Cross-references | Links to architecture, requirements, milestones. |

## Properties a good contract has
- **Imperative voice.** "Do X." / "Never do Y." Not "the team prefers".
- **Numbered rules.** Easy to cite.
- **Grep-friendly.** Forbidden tokens listed verbatim (`localStorage`, `dangerouslySetInnerHTML`).
- **Self-contained.** ~90% of decisions doable from `AGENTS.md` + the current milestone doc.
- **Stable.** Changes go via ADR.

## Properties to avoid
- ❌ Polite suggestions ("when possible, try to ...").
- ❌ Long prose paragraphs (agents scan, not read).
- ❌ Architecture details (belongs in `ARCHITECTURE_OVERVIEW.md`).
- ❌ Code snippets > 5 lines (link out).
- ❌ Duplicated content from requirements/milestone docs.

## Alias — minimal shape

```markdown
# CLAUDE.md

This file is an **alias** of [`AGENTS.md`](AGENTS.md). Claude must follow **the entirety** of the rules defined there.

## Claude-specific notes

- Use "extended thinking" for architectural tasks but **not** for micro-edits.
- Replies to the user in <project language>; code and identifiers in English.
- Prefer multi-edit tools for multiple edits in the same file.

Read [`AGENTS.md`](AGENTS.md) now.
```

## Failure modes & remedies

| Failure | Symptom | Remedy |
| :--- | :--- | :--- |
| `AGENTS.md` is too long | Agents skim, miss rules | Split: behavior in `AGENTS.md`; detail in `ARCHITECTURE_OVERVIEW.md`, `INTEGRATION_CONTRACT.md`. |
| Aliases drift | `CLAUDE.md` ≠ `GEMINI.md` on the same rule | Pre-`src/` check: aliases < 20 lines, link to `AGENTS.md`. |
| Vague wording | Creative interpretation | Replace "avoid X" with "never X. If unavoidable, open ADR." |
| Rules contradict reality | Code violates contract, nobody notices | Each PR review checks the DoD section explicitly. |

## When to update `AGENTS.md`
- A pillar changes (rare).
- A new pillar emerges from repeated PR conflicts.
- A new assistant joins → add an alias, do **not** change the contract.
- A new tooling decision affects agent behavior.

## Related
- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [THREE_LAYER_AGENT_CONTEXT](THREE_LAYER_AGENT_CONTEXT.md)
- [STABILITY_LAYERS](STABILITY_LAYERS.md)
- Decision: [agents-md-single-contract](../decisions/agents-md-single-contract.md)
- Skill: [agents-md-author](../../skills/bootstrap/agents-md-author.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
