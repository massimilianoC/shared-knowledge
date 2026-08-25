# Skill: Agent Context Architecture

## Description
Designs and audits a compact, tool-neutral instruction system for AI coding agents. It establishes `AGENTS.md` as the project contract, scopes detail near the relevant code or documentation, and moves non-negotiable controls into deterministic tooling.

## When to invoke
- Starting or retrofitting a repository used by more than one coding agent.
- Instructions have become long, contradictory, or tool-specific copies have drifted.
- A team wants to add Claude Code, Codex, Cursor, Kiro, or another agent safely.

## Expected inputs
- Existing instructions, agents in scope, project boundaries, and canonical docs.
- Applicable CI checks, hooks, permissions, and security controls.
- A list of rules that must be enforced rather than merely suggested.

## Produced outputs
- A context architecture map: contract, scoped knowledge, adapters, and mechanical controls.
- A concise `AGENTS.md` plan or audit report.
- Thin tool adapters and an adapter-parity checklist where needed.
- A list of rules that must be moved to CI/hooks/permissions.

## Steps / Procedure
1. Inventory every instruction file and identify its owner, scope, loading behaviour, and canonical source.
2. Put common policy, reading order, boundaries, and DoD in `AGENTS.md`; link to details rather than copying them.
3. Keep module-specific detail near that module or in tool-scoped rules with explicit triggers.
4. Make every tool adapter link to the contract and prohibit new project policy inside adapters.
5. Convert “must never” controls to deterministic checks where technically possible.
6. Test a representative task with each supported agent and resolve instruction conflicts before declaring parity.

## Key patterns
- [THREE_LAYER_AGENT_CONTEXT](../../knowledge/patterns/THREE_LAYER_AGENT_CONTEXT.md)
- [AGENT_CONTRACT_FILE](../../knowledge/patterns/AGENT_CONTRACT_FILE.md)
- `AGENTS.md` communicates; CI, hooks, and permissions enforce.

## Common pitfalls to avoid
- ❌ Adding another comprehensive rule file for each IDE.  
  ✅ Use one contract and minimal adapters.
- ❌ Putting all architecture into the startup instructions.  
  ✅ Use links and scoped context to preserve attention for the task.
- ❌ Treating a prompt instruction as a secret-protection mechanism.  
  ✅ Use secret scanning and protected-path controls.

## Usage examples
```
Example prompt: "Audit our AGENTS.md, CLAUDE.md, and Cursor rules. Identify duplicates,
make a tool-neutral contract plan, and propose deterministic enforcement for every hard rule."
```

## Related skills
- [agents-md-author](../bootstrap/agents-md-author.md)
- [stability-classifier](stability-classifier.md)
- [adr-writer](adr-writer.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
