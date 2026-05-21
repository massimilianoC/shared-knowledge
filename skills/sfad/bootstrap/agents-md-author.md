# Skill: Author a Binding `AGENTS.md` (Single Agent Contract)

## Description
Produces a complete, binding `AGENTS.md` for a repository — the one file every AI coding assistant must read before any task. Also generates the thin assistant-specific aliases (`CLAUDE.md`, `GEMINI.md`, `COPILOT.md`, `CURSOR.md`, ...). Enforces the 12 mandatory sections, imperative voice, and the "rules live in `AGENTS.md`, aliases carry only UX hints" rule.

## When to invoke
- The user wants to create or refresh `AGENTS.md` for a repo (new project or retrofit).
- The user mentions divergent agent behavior across PRs and wants to lock the rules.
- A new assistant joins the project → add an alias without touching the contract.
- A pillar / boundary rule needs to be added; the contract must reflect it.

Do **not** invoke when the user just wants to discuss agent preferences in chat without producing a file.

## Expected inputs
- Project identity (1 paragraph: what the repo *is* and what it explicitly is *not*).
- Audience and non-audience.
- SSoT name (or "this repo IS the SSoT", explicitly).
- Project kind (admin frontend, REST service, mobile app, CLI, library, ...).
- Documentation language preference (replies vs code identifiers).
- Stack pointer (link to `TECH_STACK.md` if it exists).
- The list of "must NEVER do" actions specific to this project (closed list, grep-friendly).
- The list of assistants the team uses (Claude, Gemini, Copilot, Cursor, Codex, ...).

## Produced outputs
- `AGENTS.md` with the 12 mandatory sections:
  - §0 Project identity
  - §1 Non-negotiable principles (numbered)
  - §2 Scope IN / OUT
  - §3 Reading order
  - §4 Agentic workflow (7-step)
  - §5 Code conventions
  - §6 Security baseline
  - §7 Boundary interaction rules
  - §8 State & data conventions
  - §9 The agent must NEVER (closed list, grep-friendly)
  - §10 Definition of Done (per PR)
  - §11 Cross-references
  - §12 Language conventions
- One alias per assistant in scope (≤ 20 lines each, link to `AGENTS.md`, only UX-specific notes).

## Steps / Procedure
1. Collect inputs (one at a time if missing).
2. Draft §0 (Project identity). One paragraph. Anchor for everything later.
3. Draft §1 (Non-negotiable principles) using the 12 SFAD pillars as starter — customize wording, never drop a pillar without explicit reason.
4. Draft §2 (Scope IN / OUT). Closed lists.
5. Insert §3 (Reading order) — the binding 5-item list.
6. Insert §4 (7-step workflow) — Plan → Read → Schema → Implement → Test → Verify → Document.
7. Draft §5 (Code conventions) — defer details to `TECH_STACK.md`; keep naming, soft cap (~200 LOC/file), `console.log` ban, `@ts-ignore` policy.
8. Draft §6 (Security baseline) — defer details to `SECURITY_AND_AUTH.md`; keep grep-friendly forbiddens (`localStorage` tokens, `dangerouslySetInnerHTML`).
9. Draft §7 (Boundary interaction rules) — defer to `INTEGRATION_CONTRACT.md`; state "one typed client per SSoT", "no ad-hoc fetch in feature code".
10. Draft §8 (State & data conventions) — server / UI / form / routing.
11. Draft §9 (NEVER list). Closed, imperative, grep-friendly.
12. Draft §10 (PR DoD). Same shape as PR Checklist; can be paste-ready.
13. Draft §11 (Cross-references).
14. Draft §12 (Language). Replies in `${PROJECT_LANGUAGE}`; code in English.
15. For each assistant in scope, write an alias file (≤ 20 lines) — only UX-specific notes; defer to `AGENTS.md`.
16. Verify: aliases contain **no** new rules; aliases all link to `AGENTS.md`; `AGENTS.md` has no `${PLACEHOLDER}` leftover; all cross-reference links resolve.

## Key patterns
- See [AGENT_CONTRACT_FILE](../../../knowledge/sfad/patterns/AGENT_CONTRACT_FILE.md) for shape and properties.
- Use **imperative voice** ("Do X." / "Never Y.") — not "the team prefers".
- **Grep-friendly forbiddens**: list tokens verbatim (`localStorage`, `dangerouslySetInnerHTML`, `@ts-ignore`).
- Aliases carry **only** UX preferences (tool selection hints, thinking-mode advice, reply language).

## Common pitfalls to avoid
- Letting aliases grow into mini-contracts (drift).
- Vague rules ("when possible, try to ...") that agents interpret creatively. Replace with "never X. If unavoidable, open ADR."
- Embedding architecture detail (move it to `ARCHITECTURE_OVERVIEW.md`).
- Code snippets > 5 lines (link out).
- Duplicating content from milestone / requirements docs (link, don't copy).
- Forgetting a `Stability:` line on `AGENTS.md` itself (`stable`; changes via ADR).
- Adding a new rule mid-sprint without ADR.

## Usage examples
```
Example prompt: "Generate AGENTS.md for a React + TS admin console talking to a separate Rails
backend (SSoT). Audience: internal ops. Reply language: Italian. We use Claude, Copilot,
and Cursor."
```
```
Example prompt: "Add a Codex alias to this repo without touching AGENTS.md."
```

## Related skills
- [spec-first-bootstrap](spec-first-bootstrap.md)
- [stability-classifier](../governance/stability-classifier.md)
- [adr-writer](../governance/adr-writer.md)

## Source
Extracted from: `inbox/methodology/principles/01-AGENT_CONTRACT_PATTERN.md`, `inbox/methodology/templates/core/AGENTS.md.template`
Date: 2026-05-21
