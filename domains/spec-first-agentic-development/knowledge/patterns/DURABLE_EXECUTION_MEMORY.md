# Pattern: Durable Execution Memory

## Summary
Use a lightweight handoff record to recover an interrupted agent session, while keeping enduring project truth in the existing specifications, ADRs, and execution tracker.

Stability: **evolving**.

## Boundary between temporary and durable state

| State type | Location | Lifetime |
| --- | --- | --- |
| Accepted decisions and requirements | ADRs, requirements, architecture docs | Versioned project truth |
| Slice state and delivery evidence | `docs/planning/EXECUTION_SPEC.md` | Versioned operational truth |
| Current task, commands run, blockers, next safe action | A project-configured handoff record, e.g. `dev/SESSION_HANDOFF.md` | Short-lived, reviewed at handoff |
| Secrets, raw production data, private tokens | Nowhere in handoff records | Never record |

## Handoff protocol

1. In `AGENTS.md`, declare the handoff location and whether it is committed, ignored, or generated. Before stopping or compacting, record task ID/slice, files changed, evidence run, current blocker, and the next safe action.
2. On resume, read the project contract, current slice, and the handoff record; reconcile inconsistencies in favour of accepted, versioned project documents.
3. Promote lasting discoveries to the appropriate ADR, requirement, architecture document, or tracker in the same change.
4. Retire or rotate stale handoff records when the slice closes; they are not a second backlog.

## Common pitfalls

- ❌ Keeping the only decision rationale in a chat-summary file.  
  ✅ Promote it to an ADR or the canonical document before closing the slice.
- ❌ Committing logs, access tokens, or copied customer data for “context”.  
  ✅ Record only references, redacted identifiers, and reproducible commands.
- ❌ Treating an unchecked task list as the project plan.  
  ✅ Treat the roadmap and execution spec as the delivery source of truth.

## Related

- [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- [STABILITY_LAYERS](STABILITY_LAYERS.md)
- Skill: [session-handoff-and-recovery](../../skills/execution/session-handoff-and-recovery.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
