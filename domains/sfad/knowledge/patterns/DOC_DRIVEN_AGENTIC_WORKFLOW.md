# Pattern: Doc-Driven Agentic Workflow (7 Steps per Task)

## Summary
A deterministic 7-step loop that every AI assistant executes per non-trivial task: documentation is treated as a **prerequisite** and a **deliverable**, not an afterthought.

Stability: **stable**.

## Premise
Agents are fast but context-blind. Every conversation starts cold; the only durable shared context is **what is written down**. The workflow makes documentation load-bearing.

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
- 3–7 step plan in chat (or in `docs/tasks/<id>.md` for non-trivial).
- Names target milestone and FR(s) covered.
- Lists files expected to change.
- Declares assumptions explicitly.
- If the agent cannot write a plan in 3–7 steps → the task is not yet understood.

### Step 2 — Read context
Read, in order:
1. `AGENTS.md`
2. `docs/INDEX.md`
3. `docs/architecture/ARCHITECTURE_OVERVIEW.md`
4. Current milestone in `docs/planning/ROADMAP_MILESTONES.md`
5. Current Execution Spec slice
6. Existing code in the relevant feature folder (avoid duplicating `Button`, `Dialog`, etc.)

Prevents:
- duplicating components that already exist;
- contradicting an architectural/security/NFR constraint.

### Step 3 — Schema first
If the task touches a boundary (HTTP API, file format, IPC):
1. Define / update the schema (Zod / JSON Schema / Protobuf / OpenAPI / ...).
2. Derive types from schema.
3. Add positive + negative examples / tests.
4. **Only then** write call sites.

Why first: doing it last produces drift between hand-typed structures and real payloads.

### Step 4 — Implement
- Small components / functions. Soft cap ~200 lines per file.
- Business logic in hooks/services; UI files render.
- No ad-hoc fetches inside UI components — boundary access via the typed client only.
- TypeScript strict (or equivalent); no `any` at boundaries.
- Logger only — no `console.log` in committed code.

### Step 5 — Test
Minimum bar:
- One unit/integration test per new hook/service.
- Smoke E2E (or equivalent) for any new user-facing route.
- Contract tests for any new boundary schema.

A PR with new logic and zero tests is rejected unless the DoD explicitly allows it (e.g., prototype).

### Step 6 — Verify
```
typecheck && lint && test && build
```
All four green. No rule disabled without a `// reason:` comment.

### Step 7 — Document
- Tick the slice in `EXECUTION_SPEC.md`.
- Update FR table if a requirement was completed/added.
- Add an entry in `INTEGRATION_CONTRACT.md` changelog if the contract evolved.
- Update `docs/INDEX.md` if a new doc appeared.
- Append an ADR if an architectural decision was made.

**Documentation updates happen in the same PR as the code.** Not "later".

## Loop, not waterfall
The 7 steps repeat **per slice**, not per milestone. A single milestone walks the loop many times. Within a slice, the agent may iterate inside steps (e.g., "implement → test → realize schema is wrong → back to step 3").

## What the agent declares in the PR description
For every non-trivial change:
- target milestone (`M3`);
- FRs covered (`closes FR.5.4`);
- slice closed (`closes M3.7`);
- schemas touched;
- new/updated docs;
- DoD checklist (per the PR template).

## When to break the workflow
- **Hotfix under incident**: may skip Step 1 (Plan); must retroactively add Step 7 (Document) in the same PR.
- **Pure typo fix**: skip Plan + Schema; keep Verify + Document.
- **Documentation-only PR**: skip Schema + Test; keep Verify (link check, lint) + Document.

In all cases, the PR description states which steps were skipped and why.

## Optional tooling hooks
- **Pre-commit**: lint + typecheck.
- **PR template**: encodes the DoD.
- **CI**: typecheck + lint + test + build + coverage threshold.
- **Doc linter**: enforces `Stability:` header presence and link integrity in `docs/`.

## Related
- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [AGENT_CONTRACT_FILE](AGENT_CONTRACT_FILE.md)
- [VERTICAL_MICRO_SLICES](VERTICAL_MICRO_SLICES.md)
- Skill: [doc-driven-task-workflow](../../skills/execution/doc-driven-task-workflow.md)
- Skill: [pr-dod-enforcer](../../skills/execution/pr-dod-enforcer.md)

## Source
Extracted from: `inbox/processed/methodology/principles/05-DOC_DRIVEN_AGENTIC_WORKFLOW.md`
Date: 2026-05-21
