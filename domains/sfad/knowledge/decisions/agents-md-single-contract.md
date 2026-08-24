# Decision: One `AGENTS.md`, Many Thin Aliases (not one file per assistant)

- **Status**: superseded by [tool-neutral-agent-contract-with-adapters](tool-neutral-agent-contract-with-adapters.md) on 2026-08-24
- **Date**: 2026-05-21
- **Context source**: extracted from SFAD methodology kit (Beehouse Admin Dashboard)

## Context
A modern repo is touched by Claude, Gemini, Copilot, Cursor, Codex, in-house agents. Each assistant has its own conventions for which file it reads as "system instructions". The naive approach is to maintain one file per assistant (`CLAUDE.md`, `GEMINI.md`, ...) — each duplicating the same rules.

This leads to:
- drift between files (one file says "use Zustand", another never updated);
- creative re-litigation of first principles at every PR;
- silent disagreement between assistants on the same change.

## Options considered

### Option A — One file per assistant
- Pros: each assistant reads its native file by default; no extra abstraction.
- Cons: rules diverge; updates are O(N) on number of assistants; no obvious "canonical" source.

### Option B — Single `AGENTS.md` referenced from each assistant's expected file
- Pros: one source of truth; aliases are 5–15 lines and stable; adding a new assistant is appending one file.
- Cons: requires a convention all assistants honor ("read `AGENTS.md`"); minor onboarding step.

### Option C — Embed rules in CI / pre-commit only
- Pros: enforces correctness mechanically.
- Cons: agents still need a readable contract; CI catches code but not architectural drift; rules become invisible to humans.

## Decision
**We chose Option B**. A single `AGENTS.md` at the repo root carries every binding rule. Each assistant-specific file (`CLAUDE.md`, `GEMINI.md`, `COPILOT.md`, ...) is a thin alias (≤ 20 lines) that:
- defers to `AGENTS.md`;
- adds **only** UX preferences specific to that assistant (tool selection hints, reply language).

The follow-up decision preserves the single contract but clarifies that tool adapters may contain tool-specific loading and command mechanics, while scoped project knowledge may live close to the affected module. Hard controls belong in CI, hooks, or permissions.

## Consequences
- ✅ Rules cited from a single, citable location ("violates Rule 4.2 in AGENTS.md").
- ✅ Adding a new assistant = one new alias file.
- ✅ Aliases drifting is detectable mechanically (length check, link check).
- ❌ Requires discipline: a contributor who edits `CLAUDE.md` instead of `AGENTS.md` adds noise. Mitigate with PR review / a doc linter.
- ⚠️ Risk: if an assistant ignores aliases entirely, it misses rules. Mitigate by also placing the canonical `AGENTS.md` content (or a link) in the assistant's vendor-specific location when that exists.

## Implementation notes
- Pre-`src/` Checklist asserts: aliases exist, are ≤ 20 lines, link to `AGENTS.md`, and contain no new rules.
- Periodic grep: aliases should not contain section headers like `## Definition of Done` (that belongs only in `AGENTS.md`).

## Related
- Pattern: [AGENT_CONTRACT_FILE](../patterns/AGENT_CONTRACT_FILE.md)
- Pattern: [SPEC_FIRST_AGENTIC_DEVELOPMENT](../patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- Skill: [agents-md-author](../../skills/bootstrap/agents-md-author.md)
- Decision: [tool-neutral-agent-contract-with-adapters](tool-neutral-agent-contract-with-adapters.md)

## Source
Inferred from: `inbox/processed/methodology/principles/01-AGENT_CONTRACT_PATTERN.md`
