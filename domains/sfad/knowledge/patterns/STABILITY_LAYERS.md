# Pattern: Stability Layers for Documentation

## Summary
Every document in a repo declares a stability label — **`stable | evolving | draft`** — on its first non-title line. The label governs who can modify it, how, and through which gate. It is a *social contract* made explicit, not folklore.

Stability: **stable**.

## The three layers

### `stable`
- Changes only via accepted ADR or explicit, durably-recorded product decision.
- Examples: Vision & Mission, Architecture Overview, Tech Stack, Security & Auth, Non-Functional Requirements, Design Principles.
- Touching a `stable` doc → PR must reference an ADR (existing or opened in the same PR).

### `evolving`
- Changes per milestone close (or sprint close). No ADR required, but contract-bearing docs (Integration Contract, Enablement Spec) log changes in an inline changelog.
- Examples: Functional Requirements, Roadmap, Integration Contract, Domain Model, Execution Spec, Enablement Spec.
- Mid-milestone edits are allowed for *adding* (a new FR, a new endpoint) but not for *breaking* previously-shipped contracts.

### `draft`
- Anything goes until promoted. Used for: proposals/RFCs, in-flight ADRs, sprint plans being drafted.
- A `draft` doc must declare its **intended destination layer** at the top.
- A `draft` cannot be referenced as authoritative by any `stable` or `evolving` doc.

## Where the label lives

First line below the title:

```markdown
# Architecture Overview

> Stability: **stable**. This is the technical Single Source of Truth for the project. Changes only via ADR in `decisions/`.
```

Consistent phrasing → grep-friendly:

```
grep -r "Stability: " docs/
```

## Promotion rules

```
draft ── promote ──▶ evolving ── promote ──▶ stable
                       │
                       └── demote (with ADR) ──▶ draft
```

- `draft → evolving`: a proposal is accepted and merged into a working doc.
- `evolving → stable`: rare; usually a doc starts `stable`.
- `stable → evolving`: only via accepted ADR that records the demotion.
- A doc is **never** silently downgraded.

## Per-section stability (advanced)

Long docs may have mixed stability:

```markdown
## 4. Architectural constraints (binding)

> Stability of this section: **stable**.

...

## 14. Changelog

> Stability of this section: **evolving**.
```

Use sparingly. If too many sections diverge, split the doc.

## Common mistakes

| Mistake | Why it hurts | Fix |
| :--- | :--- | :--- |
| Marking everything `stable` | Nothing iterates; PRs stall | Be honest. Roadmap is `evolving`. |
| Marking everything `evolving` | Pillars drift, principles erode | Lock vision/architecture/NFR at `stable`. |
| No label at all | Agents don't know how to treat the doc | Reject PR adding a doc without label. |
| Label disagrees with reality | Doc claims `stable`, edited weekly | Fix the label or the editing habit. |

## Stability vs. trust
A `stable` doc is not "frozen forever" — it is **frozen unless we explicitly decide otherwise**. The label signals:
- When reading: "treat this as ground truth."
- When writing: "do not edit casually."
- When reviewing: "any PR that touches this needs an ADR link."

## Related
- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [AGENT_CONTRACT_FILE](AGENT_CONTRACT_FILE.md)
- Skill: [stability-classifier](../../skills/governance/stability-classifier.md)

## Source
Extracted from: `inbox/processed/methodology/principles/02-STABILITY_LAYERS.md`
Date: 2026-05-21
