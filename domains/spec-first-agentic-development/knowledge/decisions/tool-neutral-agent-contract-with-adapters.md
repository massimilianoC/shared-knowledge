# Decision: Keep One Tool-Neutral Agent Contract and Use Tool Adapters

The repository keeps `AGENTS.md` as the canonical cross-agent contract. Tool-specific configuration is a thin adapter that links to the contract and describes only capabilities, commands, or loading mechanics unique to that tool.

## Context

Coding agents expose different configuration surfaces, but duplicating architectural and security policy across them produces drift. At the same time, each tool may support scoped rules, hooks, skills, or permissions that a neutral file cannot express.

## Options considered

### A — One large configuration file per tool

Rejected: policy diverges and each new tool requires copying the project’s operating model.

### B — Tool-neutral `AGENTS.md` plus thin adapters

Chosen: one project policy, with minimal adapters such as `CLAUDE.md` or a tool rule that point back to it.

### C — Only a generic README

Rejected: it is not operational enough to make agent behaviour predictable.

## Decision

Use option B. Bind project rules to `AGENTS.md`; make adapters link-only except for tool-specific execution guidance. Enforce non-negotiable controls with repository tooling and CI.

## Consequences

- New tools can be supported without rewriting governance.
- Adapter parity becomes a testable bootstrap check.
- Teams must identify the canonical policy before adding a configuration file.

## How to apply

Start with the template under `templates/sfad-agentic-project/`. For a supported tool, add the smallest adapter necessary and include it in the agent-context audit.

## Related

- [AGENT_CONTRACT_FILE](../patterns/AGENT_CONTRACT_FILE.md)
- [THREE_LAYER_AGENT_CONTEXT](../patterns/THREE_LAYER_AGENT_CONTEXT.md)
- Skill: [agent-context-architecture](../../skills/governance/agent-context-architecture.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
