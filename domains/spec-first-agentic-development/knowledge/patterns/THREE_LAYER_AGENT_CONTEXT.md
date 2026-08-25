# Pattern: Three-Layer Agent Context

## Summary
Separate agent guidance into a concise, tool-neutral contract; focused domain rules; and executable enforcement. This preserves context budget and avoids contradictory copies of the same policy.

Stability: **stable**.

## The layers

| Layer | Purpose | Canonical location | Enforcement |
| --- | --- | --- | --- |
| Contract | Project identity, boundaries, workflow, reading order, DoD | `AGENTS.md` | Advisory, stable |
| Scoped knowledge | Module-specific conventions and reference material | `docs/` plus tool adapters | Loaded only when relevant |
| Deterministic controls | Tests, linters, secret scanning, protected-path checks | CI and tool hooks | Mechanical |

`AGENTS.md` is the single source for cross-agent policy. `CLAUDE.md`, Cursor rules, Kiro steering, and Codex-specific configuration are adapters: they may explain loading or commands for their tool, but must not introduce divergent project rules.

## Rules ordered by priority

1. Put safety boundaries and project-wide decisions in the contract; keep it concise and link outward for detail.
2. Put a rule near the files it governs only when it is not needed globally.
3. Put requirements that must always hold in CI, permission controls, or deterministic hooks; prose instructions are not enforcement.
4. Record the canonical source for every policy and test adapter parity when a new coding agent is introduced.
5. Avoid universal line-count limits. Measure instruction usefulness, conflicts, and load scope instead.

## Common pitfalls

- ❌ Copying security rules into `AGENTS.md`, `CLAUDE.md`, and `.cursor/rules/`.  
  ✅ One canonical rule in `AGENTS.md`; adapters link to it.
- ❌ Loading every architecture and API document for every edit.  
  ✅ Keep the root contract short and load module context when needed.
- ❌ “Never commit secrets” only in prose.  
  ✅ Add secret scanning and a blocking CI check.

## Related

- [AGENT_CONTRACT_FILE](AGENT_CONTRACT_FILE.md)
- [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- Decision: [tool-neutral-agent-contract-with-adapters](../decisions/tool-neutral-agent-contract-with-adapters.md)
- Skill: [agent-context-architecture](../../skills/governance/agent-context-architecture.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
