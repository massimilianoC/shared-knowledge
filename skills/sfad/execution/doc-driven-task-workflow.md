# Skill: Doc-Driven Task Workflow (7-Step Loop)

## Description
Executes a single non-trivial coding task using the 7-step SFAD workflow: Plan → Read Context → Schema First → Implement → Test → Verify → Document. Treats documentation as both prerequisite and deliverable; updates `EXECUTION_SPEC.md`, `FUNCTIONAL_REQUIREMENTS.md`, `INTEGRATION_CONTRACT.md`, `docs/INDEX.md`, and ADRs in the same PR as the code.

## When to invoke
- Any non-trivial coding task in an SFAD-compliant repo: new feature, slice implementation, refactor with user impact, boundary change.
- The agent reaches a "what's next?" moment inside a slice and needs the deterministic loop to drive forward.

Do **not** invoke for typo fixes, comment-only changes, or pure documentation PRs (those skip Schema/Test).

## Expected inputs
- Target slice ID (`M<n>.<m>`) and the FR(s) it closes.
- Pointer to the milestone in `ROADMAP_MILESTONES.md`.
- Any task brief under `docs/tasks/<id>.md` (if present).
- The repo's `AGENTS.md` and `docs/INDEX.md`.

## Produced outputs
- A 3–7 step plan posted in chat (or `docs/tasks/<id>.md` for non-trivial tasks).
- Code changes that follow the plan.
- New/updated schemas (when boundary changed) preceding call sites in the diff.
- Tests for new hooks/services/components/boundary schemas.
- Updated docs in the same PR: Execution Spec slice, FR coverage, Integration Contract changelog, INDEX, ADRs (if architectural).
- A PR description with the workflow steps and any skipped ones flagged.

## The 7 steps

```
1. PLAN  →  2. READ CONTEXT  →  3. SCHEMA FIRST  →  4. IMPLEMENT
                                                       │
6. VERIFY  ←  5. TEST  ◄───────────────────────────────┘
   │
   ▼
7. DOCUMENT
```

### Step 1 — Plan
- 3–7 numbered steps in chat.
- Name target milestone + FR(s).
- List files expected to change.
- Declare assumptions explicitly.
- If you can't write the plan in 3–7 steps → the task is not yet understood; ask more questions.

### Step 2 — Read context
Read, in order:
1. `AGENTS.md`
2. `docs/INDEX.md`
3. `docs/architecture/ARCHITECTURE_OVERVIEW.md`
4. Current milestone in `docs/planning/ROADMAP_MILESTONES.md`
5. Current Execution Spec slice
6. Existing code in the relevant feature folder

Goal: prevent duplicating components (`Button`, `Dialog`, ...) and prevent contradicting an architectural/security/NFR constraint.

### Step 3 — Schema first
If the task touches any boundary (HTTP API, file format, IPC):
1. Define / update the schema (Zod / JSON Schema / Protobuf / OpenAPI / ...).
2. Derive types from the schema.
3. Add positive + negative examples / tests.
4. **Only then** write call sites.

### Step 4 — Implement
- Small components / functions. Soft cap ~200 lines/file.
- Business logic in hooks/services; UI files render.
- No ad-hoc fetches in UI components — typed boundary client only.
- TypeScript strict (or equivalent); no `any` at boundaries.
- Logger only — no `console.log` in committed code.

### Step 5 — Test
- ≥ 1 unit/integration test per new hook/service.
- Smoke E2E (or equivalent) for any new user-facing route.
- Contract test for every new boundary schema (positive + negative).

### Step 6 — Verify
```
typecheck && lint && test && build
```
All four green. No rule disabled without a `// reason:` comment.

### Step 7 — Document (same PR)
- Tick the slice in `EXECUTION_SPEC.md`.
- Update FR table if a requirement was completed/added.
- Add a changelog entry in `INTEGRATION_CONTRACT.md` if the contract evolved.
- Update `docs/INDEX.md` if a new doc appeared.
- Append an ADR if an architectural decision was made.

## When to break the workflow
- **Hotfix under incident**: may skip Step 1 (Plan); must retroactively add Step 7 (Document) in the same PR or within 24h.
- **Pure typo fix**: skip Plan + Schema; keep Verify + Document.
- **Documentation-only PR**: skip Schema + Test; keep Verify (link check, lint) + Document.

In all cases, the PR description states which steps were skipped and why.

## Loop, not waterfall
The 7 steps repeat **per slice**, not per milestone. A milestone walks the loop many times. Within a slice, iterate inside steps when needed: "implement → test → realize schema is wrong → back to Step 3".

## Common pitfalls to avoid
- Skipping Step 1: agent dives in, three changes later realizes the wrong file is being edited.
- Skipping Step 2: produces a second `Button` component that duplicates an existing one.
- Doing Step 3 last: hand-typed structures drift from real payloads; bugs ship.
- Skipping Step 5 because "I tested manually": no regression safety net for the next change.
- Skipping Step 7: docs lag the code; the *intent* is lost; next person re-debates.
- Two slices in flight at once for the same author: context-switching tax.

## Usage examples
```
Example prompt: "Drive me through M2.3 — approve device dialog. The backend confirmed
POST /devices/:id/approve and POST /devices/:id/reject. Use the 7-step workflow."
```
```
Example prompt: "This is a hotfix for a CSP issue blocking the login redirect. Walk
the abbreviated workflow (hotfix variant)."
```

## Related skills
- [microslice-tracker](microslice-tracker.md)
- [milestone-lifecycle](milestone-lifecycle.md)
- [pr-dod-enforcer](pr-dod-enforcer.md)
- [adr-writer](../governance/adr-writer.md)

## Source
Extracted from: `inbox/methodology/principles/05-DOC_DRIVEN_AGENTIC_WORKFLOW.md`
Date: 2026-05-21
