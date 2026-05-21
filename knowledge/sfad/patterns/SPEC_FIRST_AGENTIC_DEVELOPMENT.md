# Pattern: Spec-First Agentic Development (SFAD)

## Summary
A meta-pattern for starting any non-trivial project: ship a layered, agent-readable documentation skeleton — vision, architecture, requirements, roadmap, execution spec — **before the first commit to `src/`**, with a binding `AGENTS.md` contract that every AI assistant must read first.

Stability tag of this pattern: **stable**.

## When to apply
- Brand-new repository with more than 1 week of expected work.
- Retrofit on an existing repo that suffers from incoherent agentic decisions, duplicated logic, missing rationale.
- Multi-team setup where one repo depends on another (frontend + backend, app + vendor API).

## When NOT to apply
- 1–2 day prototypes / spikes — collapse to `AGENTS.md` + `README.md` + one-milestone `ROADMAP.md`.
- Pure research notebooks without shippable deliverable.

## The five pillars

| # | Pillar | Concrete meaning |
| :-: | :--- | :--- |
| 1 | Spec-first | Vision / Architecture / Requirements / Roadmap / Execution Spec exist as Markdown before `src/`. |
| 2 | Agent contract | `AGENTS.md` at root binds every assistant. Aliases (`CLAUDE.md`, `GEMINI.md`, ...) defer to it. |
| 3 | Layered stability | Each doc declares `Stability: stable \| evolving \| draft`. The label governs who edits and how. |
| 4 | Doc-driven workflow | Agents read a fixed reading order before each task and update docs as part of Definition of Done. |
| 5 | Vertical micro-slices | Milestones decompose into testable slices with explicit gates; no horizontal "infrastructure-only" milestones. |

## The 12 non-negotiables

1. **Spec before code.** No `src/` until the Pre-`src/` Checklist is green.
2. **`AGENTS.md` is THE contract.** Assistant-specific files are thin aliases.
3. **Stability is declared, not implied.** Every doc has a `Stability:` line.
4. **Single Source of Truth is explicit.** Architecture names the SSoT per concern.
5. **Schema-driven boundaries.** Every API/file/IPC boundary has a typed schema; no `any`.
6. **Idempotent mutations.** Every state-changing op carries `Idempotency-Key` (UUID v4).
7. **Long-running work is observable.** First-class `Job` with ID/status/retry/cancel.
8. **RBAC server-side, UI cosmetic.** The client only hides/disables.
9. **Audit is part of the feature.** No audit trail → not done.
10. **Forward-compatible schemas.** Schema version header; tolerate unknown fields.
11. **No secrets in the client.** Reveal-once, last-four after, rotation endpoints.
12. **Vertical micro-slices.** No pure-infrastructure milestones.

## The document stack

```
repo-root/
├── AGENTS.md                              # Binding agent contract
├── CLAUDE.md / GEMINI.md / COPILOT.md     # Thin aliases → AGENTS.md
├── README.md                              # TL;DR + entry points
└── docs/
    ├── INDEX.md                           # Navigable index, grouped by stability
    ├── vision/VISION_AND_MISSION.md       # stable
    ├── architecture/
    │   ├── ARCHITECTURE_OVERVIEW.md       # stable — technical SSoT
    │   ├── TECH_STACK.md                  # stable
    │   ├── INTEGRATION_CONTRACT.md        # evolving
    │   ├── SECURITY_AND_AUTH.md           # stable
    │   ├── decisions/                     # MADR ADRs
    │   └── proposals/                     # RFCs not yet accepted
    ├── requirements/
    │   ├── FUNCTIONAL_REQUIREMENTS.md     # evolving (MoSCoW, milestone-mapped)
    │   └── NON_FUNCTIONAL_REQUIREMENTS.md # stable (measurable)
    ├── analysis/
    │   ├── DOMAIN_MODEL.md                # evolving
    │   └── USER_PERSONAS.md               # evolving
    ├── ui-ux/                             # (only if UI-bearing)
    │   ├── DESIGN_PRINCIPLES.md
    │   └── INFORMATION_ARCHITECTURE.md
    ├── planning/
    │   ├── ROADMAP_MILESTONES.md          # evolving — M0..Mn with DoD
    │   ├── EXECUTION_SPEC.md              # evolving — current micro-slices
    │   └── EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md  # evolving (if applicable)
    └── guidelines/                        # read-only inputs from external owners
```

Not every project needs every folder (a CLI tool has no `ui-ux/`). The **top-down order is invariant**: vision → architecture → requirements → roadmap → execution.

## The reading order (binding for agents)

Before any task, agents read in this exact order:

1. `AGENTS.md`
2. `docs/INDEX.md`
3. `docs/architecture/ARCHITECTURE_OVERVIEW.md`
4. The current milestone in `docs/planning/ROADMAP_MILESTONES.md`
5. Any task brief under `docs/tasks/<id>.md` (if present)

## The 7-step workflow per task

```
Plan → Read context → Schema first → Implement → Test → Verify → Document
```

See [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md) for details.

## Anti-patterns this pattern blocks
- "Let's start coding, we'll document later."
- "We need a refactor sprint with no user-visible outcome."
- "Frontend will simulate the missing backend endpoint in prod."
- "Each AI assistant has its own instructions file."
- "ADR? We'll discuss it in Slack."
- "It's just a small change, no need to update docs."

## Calibration knobs
- Documentation language (declare in `AGENTS.md`).
- Milestone size (M0..M8 typical; collapse to M0..M3 for smaller teams).
- Drop External Enablement file when no external dep exists.
- Drop UI/UX docs for non-UI projects.
- Pick one prioritization scheme (MoSCoW, RICE) and stay consistent.

## Related
- [AGENT_CONTRACT_FILE](AGENT_CONTRACT_FILE.md)
- [STABILITY_LAYERS](STABILITY_LAYERS.md)
- [SSOT_AND_BOUNDARY](SSOT_AND_BOUNDARY.md)
- [VERTICAL_MICRO_SLICES](VERTICAL_MICRO_SLICES.md)
- [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- Decision: [agents-md-single-contract](../decisions/agents-md-single-contract.md)
- Decision: [pre-src-gate](../decisions/pre-src-gate.md)
- Decision: [madr-adr-format](../decisions/madr-adr-format.md)
- Domain: [sfad-methodology](../domain/sfad-methodology.md)
- Skill: [spec-first-bootstrap](../../../skills/sfad/bootstrap/spec-first-bootstrap.md)

## Source
Extracted from: `inbox/methodology/` (METHODOLOGY.md, principles/00-PILLARS.md)
Date: 2026-05-21
