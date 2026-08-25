# Skill: Milestone Lifecycle (Open / Execute / Close)

## Description
Drives a milestone through its three phases: **Open** (promote in roadmap, decompose into slices, align upstream contracts), **Execute** (one slice at a time, deviation handling), and **Close** (verify DoD, retrospective, promote next). Updates `ROADMAP_MILESTONES.md`, `EXECUTION_SPEC.md`, and (when applicable) `EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md`.

## When to invoke
- A previous milestone is closed (or this is M0) and the team is ready to open the next.
- Mid-milestone deviation is discovered and scope/contract must be updated.
- The team is at milestone close and needs to verify DoD + write the retrospective.

## Expected inputs
- Target milestone ID (`Mn`) and theme.
- Functional Requirements scheduled for this milestone (at least the "must" ones).
- Upstream contract status (`agreed | in-progress | pending | blocked`) if external dep exists.
- Phase trigger: `open` | `execute` | `close`.

## Produced outputs
### On Open
- Updated `ROADMAP_MILESTONES.md` block for `Mn` (Goal, Scope IN, Scope OUT, DoD).
- New "Micro-slices Mn" section in `EXECUTION_SPEC.md` with definition + progress tables.
- (If applicable) updated `EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` per-milestone block.
- Issue/ticket opened in the tracker, linked from the roadmap.
- Open Checklist ticked.

### On Execute (per slice)
- Slice transitions through the state machine (`microslice-tracker` skill).
- Possible proposals/ADRs opened on deviation.

### On Close
- All DoD boxes ticked, each referencing the PR/slice/test that closed it.
- All slices `done` or explicitly moved to a future milestone (with reason).
- ADRs opened during the milestone are `accepted` or `superseded` — none `proposed`.
- Retrospective written (in-roadmap "Mn close note" or `docs/planning/sprints/<milestone>/RETRO.md`).
- `Mn+1` sketched in the roadmap; backend/external "what we'll need" pre-populated.

## Steps / Procedure

### Phase 1 — Open
1. **Promote in roadmap**: expand the milestone from one-liner to full block. Goal must be a **user-visible capability**, not internal infrastructure.
   ```markdown
   ## Mn — <Theme>
   **Goal**: <one sentence — user-visible capability>
   **Scope IN**:
   - bullet
   **Scope OUT** (deferred to Mn+1 or later):
   - bullet
   **Definition of Done**:
   - [ ] check 1
   - [ ] check 2
   ```
2. **Decompose** into vertical micro-slices. Each slice: ID, goal, backend prereq, frontend scope, check, FR mapping.
3. **Align external deps**: for each slice with an upstream contract, ensure status is `agreed` (not `pending`). Slices dependent on `pending` contracts stay `planned`.
4. **Run the Open Checklist** (see below).
5. Open the milestone issue/ticket; mark status **open**.

### Phase 2 — Execute (one slice at a time)
1. Pick the next `ready-backend` slice. Transition to `in-progress` (use [microslice-tracker](microslice-tracker.md)).
2. Follow the [doc-driven-task-workflow](doc-driven-task-workflow.md) — Plan → Read → Schema → Implement → Test → Verify → Document.
3. On slice close: transition to `qa-ready` → `done`. Tick the corresponding box in milestone DoD if applicable. Update FR coverage.
4. **Deviations**:
   - Small (≤ 2h rework): keep slice; note in tracker's "notes" column.
   - Architecture impact: open a proposal under `docs/architecture/proposals/`, mark slice `blocked`, surface in standup.
   - New requirement discovered: add an FR with explicit priority; decide whether it fits this milestone or moves.

### Phase 3 — Close
1. Verify DoD: every box ticked, each pointing to PR/slice/test.
2. Run the **Close Checklist** (below).
3. Write retrospective (shipped / deferred / surprises / decisions with ADR links / carryover).
4. Sketch `Mn+1` in the roadmap. Pre-populate the external-dep "what we'll need" entry.
5. Change milestone status to **closed**. Begin Phase 1 for `Mn+1`.

## The Open Checklist
- [ ] Milestone block fully populated (Goal, Scope IN, Scope OUT, DoD).
- [ ] Goal is user-visible capability.
- [ ] DoD items are concrete (each becomes a test or manual check).
- [ ] ≥ 3 slices (or this is a deliberately tiny milestone).
- [ ] Each slice has ID, goal, prereq, scope, check, FR coverage.
- [ ] Slice order is intentional.
- [ ] No horizontal infrastructure-only slice.
- [ ] All upstream contracts `agreed`; pending → slice stays `planned`.
- [ ] Every slice maps to ≥ 1 FR. Every "must" FR scheduled for this milestone is covered.
- [ ] Issue opened in tracker; linked from roadmap.
- [ ] No `stable` doc requires immediate change to start (else ADR `accepted` first).
- [ ] New libraries needed → ADRs accepted.

## The Close Checklist
- [ ] Every DoD item ticked, each referencing PR/slice/test that closed it.
- [ ] DoD items not delivered → explicitly moved (with reason) to a future milestone; never silently dropped.
- [ ] Every slice in `done` state or explicitly moved.
- [ ] No `blocked` slice without an open follow-up.
- [ ] FR coverage updated; any new FR discovered listed with priority + target milestone.
- [ ] `INTEGRATION_CONTRACT.md` changelog updated for every shipped contract change.
- [ ] `EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` changelog updated (if applicable).
- [ ] All ADRs opened during milestone are `accepted` or `superseded` — none `proposed`.
- [ ] `docs/INDEX.md` lists every doc created during the milestone.
- [ ] CI green on the merge commit that closes the milestone.
- [ ] NFR coverage targets met (if specified).
- [ ] Retro doc written.
- [ ] `Mn+1` sketched; backend/external "what we'll need" entry present.

## Common pitfalls to avoid
- Goal stated as infrastructure ("set up auth scaffolding") instead of user-visible capability.
- Horizontal slices that lump infrastructure across the milestone.
- Closing the milestone with a `blocked` slice and no follow-up.
- DoD items silently dropped because they "didn't get done".
- Forgetting to update FR coverage (lost traceability).
- Skipping the retrospective ("we have no time") — this is where methodology improvements come from.
- Over-scoping; fix by pushing slices to `Mn+1` (documented) or inserting `Mn.5` (rare).

## Usage examples
```
Example prompt: "Open M3 — Devices Approval. Goal: admin can approve/reject pending devices
with confirmation + audit. Decompose into slices and align backend contracts."
```
```
Example prompt: "Run the M2 close checklist for me. Tell me what's still pending."
```

## Related skills
- [microslice-tracker](microslice-tracker.md)
- [doc-driven-task-workflow](doc-driven-task-workflow.md)
- [external-dependency-enablement](../coordination/external-dependency-enablement.md)
- [pr-dod-enforcer](pr-dod-enforcer.md)
- [adr-writer](../governance/adr-writer.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
