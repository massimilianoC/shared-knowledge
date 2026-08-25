# Pattern: Vertical Micro-Slices with Explicit States

## Summary
Decompose every milestone into **vertical, testable, shippable** increments — micro-slices — and track each through an explicit state machine. No horizontal "infrastructure-only" milestones. No slice closes without a concrete check.

Stability: **stable**.

## What a micro-slice IS
A vertical, testable, shippable increment that:
- maps to one or more Functional Requirements (FR);
- depends on upstream contracts that are *ready or agreed*;
- closes with a concrete check (unit/integration/E2E test or formalized manual verification);
- is reviewed via a single PR (usually).

## What a slice is NOT
- A multi-week epic (that is a milestone).
- A refactor without user-visible outcome (that is a chore).
- An exploration (that is a proposal/spike).

## Slice identity
- **ID**: `M<n>.<m>` (e.g., `M2.3`).
- **Title**: imperative, scoped ("Approve/reject device with confirmation dialog").
- **Owner**: a single name.

## State machine

```
planned ──▶ ready-backend ──▶ in-progress ──▶ qa-ready ──▶ done
   │                              │
   │                              ▼
   └──────────────────────────▶ blocked
```

| State | Entry condition | Exit condition |
| :--- | :--- | :--- |
| `planned` | Slice listed in Execution Spec | Backend contract acknowledged |
| `ready-backend` | Contract available (real or stub explicitly approved) | Agent picks up the slice |
| `in-progress` | Agent has opened a draft PR | All Step 1–6 of the agentic workflow green |
| `blocked` | Discovered gap (backend missing, ADR needed, schema undefined) | Blocker resolved |
| `qa-ready` | Implementation complete, check pending | Check passes |
| `done` | Check passes + docs updated + PR merged | — |

A slice may regress `qa-ready → in-progress` if review surfaces a bug.

## The three gates

### Gate A — Backend-ready
- [ ] Endpoint(s) signed off with the upstream team.
- [ ] Schema (request/response) agreed.
- [ ] Error cases enumerated.
- [ ] Permissions required documented.
- [ ] At least one example payload available (real or fixture).

If any of the five cannot be ticked → slice stays `planned`, not `ready-backend`.

### Gate B — Frontend-ready
- [ ] Schema implemented in code (validated boundary).
- [ ] UI integrated with the real contract or with an explicit MSW/fixture marked `// TODO(M<n>): replace with real endpoint`.
- [ ] Page/hook/component routed and reachable.

### Gate C — QA-ready
- [ ] The check declared in the Execution Spec is green.
- [ ] DoD checklist is ticked in the PR body.

## The tracker

Lives in `EXECUTION_SPEC.md`. Two tables per active milestone:

**Slices definition**

| Slice | Goal | Backend prereq | Frontend scope | Check | FR |
| :--- | :--- | :--- | :--- | :--- | :--- |

**Slices progress**

| Slice | Status | Backend | Frontend | Check planned | Gap | Last update |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

Both update together.

## "Blocked" really means
Not "we're waiting a bit". It means: **this slice cannot make forward progress until X is delivered**. When marking blocked:
1. Name X in the Gap column + link to issue/proposal.
2. Set the slice aside; pick the next `ready-backend` slice.
3. Surface the block in the next standup. Do not hide it.

If a slice has been blocked > 1 sprint → escalate. The milestone may need reshuffling.

## Anti-patterns

| Anti-pattern | Why it hurts |
| :--- | :--- |
| Two slices `in-progress` at once for the same owner | Context-switching cost; neither finishes cleanly. |
| Slice closes without check passing | DoD eroded; "done" stops meaning anything. |
| Slice silently expands ("just one more thing") | Estimates useless; reviews drag. |
| No FR mapping | Lost traceability. |
| Tracker not updated until end of week | Stale; standups become guessing games. |
| Horizontal slice ("just infrastructure this sprint") | Postpones risk; nothing demoable. |

## Calibration
- **Solo dev**: still update the tracker — it is future-you's memory.
- **Multi-person team**: tracker beats Slack threads.
- **Issue-tracker-first orgs**: keep `EXECUTION_SPEC.md` authoritative; mirror to Jira/Linear, not the other way around.

## Related
- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- Skill: [microslice-tracker](../../skills/execution/microslice-tracker.md)
- Skill: [milestone-lifecycle](../../skills/execution/milestone-lifecycle.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
