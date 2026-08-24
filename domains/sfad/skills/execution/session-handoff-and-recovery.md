# Skill: Session Handoff and Recovery

## Description
Creates, resumes, and retires a safe session handoff record for long-running agentic work. It prevents context compaction from losing operational state without turning temporary notes into a competing project source of truth.

## When to invoke
- A task spans multiple sessions, agents, worktrees, or days.
- Context is being compacted, the agent is stopping mid-slice, or ownership changes.
- The next agent needs to understand blockers and reproduce verification evidence.

## Expected inputs
- Current milestone/slice, task objective, files changed, commands/evidence run, and blocker.
- References to canonical requirements, ADRs, and architecture docs.
- Any known sensitive-data restrictions.

## Produced outputs
- A concise record at the project-configured handoff location (for example `dev/SESSION_HANDOFF.md`).
- Reconciled next action and a list of durable facts that need promotion.
- A cleanup decision when the slice closes.

## Steps / Procedure
1. Read the contract to determine the handoff location and committed/ignored lifecycle, then read the current execution slice and existing handoff before resuming work.
2. Record the objective, current status, changed files, evidence, blocker, and one next safe action.
3. Link to canonical documents; do not paste their content or duplicate decisions.
4. Promote durable requirements, architecture decisions, and delivered evidence to their true sources in the same PR.
5. Redact secrets, customer data, tokens, and sensitive logs.
6. On slice closure, remove stale temporary details and leave only the canonical delivery record.

## Key patterns
- [DURABLE_EXECUTION_MEMORY](../../knowledge/patterns/DURABLE_EXECUTION_MEMORY.md)
- The handoff record is a cache; accepted project documents win on conflict.

## Common pitfalls to avoid
- ❌ `context.md` contains the only explanation of a security decision.  
  ✅ Write an ADR and link it from the handoff.
- ❌ Copying test logs and secrets into a versioned summary.  
  ✅ Link to CI output and redact any sensitive reference.
- ❌ Accumulating completed tasks forever.  
  ✅ Archive or reset the handoff when its slice is done.

## Usage examples
```
Example prompt: "Prepare a handoff for M2.3 after the contract tests passed but staging E2E is blocked
by a missing sandbox credential. Include the exact next safe action without recording the credential."
```

## Related skills
- [doc-driven-task-workflow](doc-driven-task-workflow.md)
- [microslice-tracker](microslice-tracker.md)
- [human-decision-gates](../governance/human-decision-gates.md)

## Source
Synthesized from: `inbox/Best Practice Programmazione Con LLM.md` and `inbox/Guidelines.md`.
Date: 2026-08-24
