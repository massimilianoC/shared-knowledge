# Skill: Micro-Slice Tracker

## Description
Manages the lifecycle of a single micro-slice — the smallest unit of execution in SFAD. Owns state transitions (`planned → ready-backend → in-progress → blocked → qa-ready → done`), gate checks (A: backend-ready, B: frontend-ready, C: QA-ready), and the tracker tables in `EXECUTION_SPEC.md`.

## When to invoke
- Upstream signs off a contract → transition `planned → ready-backend`.
- Agent opens a PR → transition `ready-backend → in-progress`.
- Implementation done → transition `in-progress → qa-ready`.
- Check passes + PR merged → transition `qa-ready → done`.
- Gap discovered (missing endpoint, undefined schema, ADR needed) → transition `* → blocked`.
- Review surfaces a bug → regression `qa-ready → in-progress`.
- Daily stand-up: snapshot current state of all slices.

## Expected inputs
- Slice ID (`M<n>.<m>`).
- Trigger event (contract signed, PR opened, gap discovered, check passed, ...).
- Where applicable: links (PR URL, proposal/issue URL, ADR ID).

## Produced outputs
- Updated row(s) in the **Slices progress** table in `EXECUTION_SPEC.md`.
- Updated `Last update` and `Gap` columns.
- (On transition to `done`) updated FR coverage in `FUNCTIONAL_REQUIREMENTS.md`.
- (On transition to `blocked`) link to issue/proposal in the Gap column.

## Steps / Procedure

### State transitions

```
planned ──▶ ready-backend ──▶ in-progress ──▶ qa-ready ──▶ done
   │                              │
   │                              ▼
   └──────────────────────────▶ blocked
```

| Trigger | Action |
| :--- | :--- |
| Upstream signs off contract | `planned → ready-backend`. Link spec/contract in tracker. |
| Agent opens PR | `ready-backend → in-progress`. PR description references the slice (`Closes M<n>.<m>`). |
| Discovers missing schema field/endpoint/etc. | `* → blocked`. Update Gap column; open issue or proposal. |
| Implementation done | `in-progress → qa-ready`. Move check to "ready to run". |
| Check passes + PR approved + merged | `qa-ready → done`. Update FR coverage. |

### Gate verification

**Gate A — Backend-ready** (before `planned → ready-backend`):
- [ ] Endpoint(s) signed off with the upstream team.
- [ ] Request + response schemas agreed.
- [ ] Error cases enumerated.
- [ ] Permissions / auth semantics documented.
- [ ] Lifecycle semantics clear (hard delete? soft delete? lifecycle action?).
- [ ] At least one example payload (real or fixture) available.

If any box fails → slice stays `planned`.

**Gate B — Frontend-ready** (before `in-progress → qa-ready`):
- [ ] Schema implemented in code (validated boundary).
- [ ] UI integrated with the real contract or with an explicit MSW/fixture marked `// TODO(M<n>): replace with real endpoint`.
- [ ] Page/hook/component routed and reachable.

**Gate C — QA-ready** (before `qa-ready → done`):
- [ ] Check declared in the Execution Spec is green.
- [ ] PR DoD checklist ticked in the PR body.

### Tracker maintenance

Two tables per active milestone in `EXECUTION_SPEC.md`:

**Slices definition** (static after open):
```
| Slice | Goal | Backend prereq | Frontend scope | Check | FR |
| :---- | :--- | :------------- | :------------- | :---- | :- |
| Mn.1  | ...  | ...            | ...            | ...   | FR.x.y |
```

**Slices progress** (updated continuously):
```
| Slice | Status         | Backend | Frontend | Check planned             | Gap  | Last update |
| :---- | :------------- | :------ | :------- | :------------------------ | :--- | :---------- |
| Mn.1  | `in-progress`  | ready   | partial  | unit test on schema parse | none | 2026-05-19  |
```

### "Blocked" protocol
Blocked is **not** "we are waiting a bit". It means: this slice cannot move until X is delivered.
1. Name X in the Gap column with link to issue/proposal.
2. Set the slice aside; pick the next `ready-backend` slice.
3. Surface the block in the next standup. Do not hide it.

A slice `blocked` for > 1 sprint → escalate; milestone may need reshuffling.

## Common pitfalls to avoid
- Two slices `in-progress` at once for the same owner — context switching, neither finishes cleanly.
- Closing a slice without the check passing — DoD erodes.
- Slice silently expanding ("just one more thing") — estimates become useless.
- Tracker not updated until end of week — stale; standups become guessing games.
- Marking `done` without updating FR coverage — lost traceability.
- Skipping Gate A and starting work on a slice with an unsigned contract — produces imaginary endpoints in production code.

## Usage examples
```
Example prompt: "Transition M2.3 to in-progress. PR is https://github.com/org/repo/pull/142."
```
```
Example prompt: "Mark M3.5 blocked — the backend confirms the audit endpoint won't ship
until M4. Update the tracker and open a proposal."
```
```
Example prompt: "Show me a snapshot of all slices in M2 with their current state and gaps."
```

## Related skills
- [milestone-lifecycle](milestone-lifecycle.md)
- [doc-driven-task-workflow](doc-driven-task-workflow.md)
- [external-dependency-enablement](../coordination/external-dependency-enablement.md)
- [pr-dod-enforcer](pr-dod-enforcer.md)

## Source
Extracted from: `inbox/processed/methodology/procedures/03-MICROSLICE_TRACKING_PROCEDURE.md`
Date: 2026-05-21
