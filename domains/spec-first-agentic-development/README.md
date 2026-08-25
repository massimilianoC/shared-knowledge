# Spec-First Agentic Development

Reusable package for bootstrapping and operating projects with explicit specifications, durable agent context, traceable decisions, and verified delivery slices.

## Start here

1. Choose **Base (SFAD Compact)** or **Full** in [`templates/adoption-profiles/`](templates/adoption-profiles/README.md).
2. For a new project, use [`agents/sfad-bootstrap-agent.md`](agents/sfad-bootstrap-agent.md) with [`skills/bootstrap/spec-first-bootstrap.md`](skills/bootstrap/spec-first-bootstrap.md).
3. Apply [`skills/bootstrap/pre-src-checklist-runner.md`](skills/bootstrap/pre-src-checklist-runner.md) before creating `src/` when using the Full profile.
4. For ongoing delivery, use [`agents/sfad-execution-agent.md`](agents/sfad-execution-agent.md).

## Package layout

| Directory | Contents |
| --- | --- |
| [`skills/`](skills/) | Bootstrap, governance, execution, and dependency-coordination capabilities. |
| [`agents/`](agents/) | Project bootstrap and ongoing execution agents. |
| [`knowledge/`](knowledge/) | Patterns, decisions, and SFAD context. |
| [`templates/spec-first-methodology/`](templates/spec-first-methodology/) | Complete core and flavor template kit for a new repository. |
| [`templates/agentic-project/`](templates/agentic-project/) | Supplemental templates for constitution, feature specs, and session handoffs. |
| [`templates/adoption-profiles/`](templates/adoption-profiles/) | Base (Compact) starter and Full composition guide. |

## Adoption modes

- **Base (Compact):** start with the minimum durable project layer; promote when recurring complexity justifies it.
- **Full:** apply Base plus the full core, operating complements, and any relevant flavor; enforce the Pre-`src/` gate.
- **Existing repository:** begin with the agent contract and architecture overview; backfill remaining documents incrementally.
- **Prototype:** use Base with one outcome and explicitly time-box deviations.

## Key constraints

- Stable decisions require an ADR or explicit product decision.
- The named Single Source of Truth owns domain decisions and authorization.
- Boundary schemas precede call sites.
- Milestones deliver vertical, testable increments rather than infrastructure-only phases.

## Selective import

For full bootstrap, copy the complete `spec-first-agentic-development/` package. For a focused need, import only the selected skill or agent plus its linked patterns, decisions, included skills, and required templates. Reconcile the package's guidance with the target repository's existing instructions and compliance requirements before it becomes binding.
