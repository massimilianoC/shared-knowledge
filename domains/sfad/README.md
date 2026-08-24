# SFAD: Spec-First Agentic Development

Reusable package for bootstrapping and operating projects with explicit specifications, durable agent context, traceable decisions, and verified delivery slices.

## Start here

1. For a new project, use [`agents/sfad-bootstrap-agent.md`](agents/sfad-bootstrap-agent.md) with [`skills/bootstrap/spec-first-bootstrap.md`](skills/bootstrap/spec-first-bootstrap.md).
2. Copy [`templates/spec-first-methodology/core/`](templates/spec-first-methodology/core/) into the target repository root. Overlay [`templates/spec-first-methodology/flavors/`](templates/spec-first-methodology/flavors/) only when relevant.
3. Apply [`skills/bootstrap/pre-src-checklist-runner.md`](skills/bootstrap/pre-src-checklist-runner.md) before creating `src/`.
4. For ongoing delivery, use [`agents/sfad-execution-agent.md`](agents/sfad-execution-agent.md).

## Package layout

| Directory | Contents |
| --- | --- |
| [`skills/`](skills/) | Bootstrap, governance, execution, and dependency-coordination capabilities. |
| [`agents/`](agents/) | Project bootstrap and ongoing execution agents. |
| [`knowledge/`](knowledge/) | Patterns, decisions, and SFAD context. |
| [`templates/spec-first-methodology/`](templates/spec-first-methodology/) | Complete core and flavor template kit for a new repository. |
| [`templates/agentic-project/`](templates/agentic-project/) | Supplemental templates for constitution, feature specs, and session handoffs. |

## Adoption modes

- **New repository:** apply the full core template kit and enforce the Pre-`src/` gate.
- **Existing repository:** begin with the agent contract and architecture overview; backfill remaining documents incrementally.
- **Prototype:** declare the temporary calibration explicitly, retain the contract, and record deviations as time-boxed decisions.

## Key constraints

- Stable decisions require an ADR or explicit product decision.
- The named Single Source of Truth owns domain decisions and authorization.
- Boundary schemas precede call sites.
- Milestones deliver vertical, testable increments rather than infrastructure-only phases.

## Selective import

For full bootstrap, copy the complete `sfad/` package. For a focused need, import only the selected skill or agent plus its linked patterns, decisions, included skills, and required templates. Do not import raw sources from `inbox/processed/`. Reconcile the package's guidance with the target repository's existing instructions and compliance requirements before it becomes binding.
