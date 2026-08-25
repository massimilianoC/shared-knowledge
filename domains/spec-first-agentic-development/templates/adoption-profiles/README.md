# SFAD Adoption Profiles

Choose one profile before creating project files. Both profiles use the same SFAD principles; the difference is the amount of permanent project structure introduced on day one.

```text
Base profile ──promote when needed──> Full profile
     │                                      │
     └─ compact operational contract          └─ base plus the complete architecture,
        and first feature loop                   requirements, planning, and governance kit
```

## Base profile: SFAD Compact

Copy [`base/`](base/) into a new repository, replace placeholders, and use it for the first feature. It contains only the minimum durable layer:

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Tool-neutral project contract, reading order, decision gates, and commands. |
| `README.md` | Project entry point and current status. |
| `docs/INDEX.md` | Index of the few authoritative project documents. |
| `docs/planning/ROADMAP.md` | Ordered outcomes and current delivery focus. |
| `specs/feature/spec.md` | Outcome, acceptance examples, verification, and decisions for one feature. |
| `docs/decisions/0000-template-adr.md` | Lightweight ADR template for material decisions. |

Use Base for a new project, a small team, or an uncertain product where the first priority is learning without losing intent. It is not a throwaway profile: keep the contract, feature specs, acceptance evidence, and material decisions current.

## Full profile: Base plus complete extensions

Full **includes Base conceptually and operationally**. Do not replace Base files with parallel documents. Start with `base/`, then add the complete extensions in this order:

1. Copy [`../spec-first-methodology/core/`](../spec-first-methodology/core/) to supply the canonical vision, architecture, requirements, analysis, planning, and tool-adapter templates.
2. Add [`../agentic-project/`](../agentic-project/) for the constitution, feature-spec refinement, and session-handoff assets.
3. Overlay a stack flavor from [`../spec-first-methodology/flavors/`](../spec-first-methodology/flavors/) only when it matches the project.
4. Reconcile duplicated paths deliberately: the Full profile's canonical paths are `docs/planning/ROADMAP_MILESTONES.md`, `docs/planning/EXECUTION_SPEC.md`, and the full architecture/requirements structure. Migrate Base content into those documents, then retire the Base-only `ROADMAP.md` rather than maintaining both.

The existing comprehensive template kit is therefore the **Full extension layer**, while `base/` is the stable entry point and promotion source. This keeps shared rules in one place and prevents the two profiles from drifting.

## Promotion signals

Promote Base to Full when one or more of these becomes true:

- More than one contributor or coding agent needs recurring handoffs.
- A feature depends on another repository, vendor, service, or team.
- The project has material security, privacy, money, compliance, or migration risk.
- Architecture decisions recur, or the same context is repeatedly reconstructed.
- The roadmap needs milestones and micro-slices beyond a short ordered backlog.

Promotion is incremental. Preserve accepted decisions and feature specs; add the missing Full documents in priority order rather than rewriting a working repository.

## Integrity rules

- Base and Full are adoption profiles, not competing methodologies.
- A target repository has one `AGENTS.md`, one active roadmap, and one canonical document per concern.
- No profile ships project-specific commands, owners, policies, or credentials without replacing placeholders.
- Use the relevant SFAD skills and patterns for verification, decision gates, and handoffs as the project needs them.
