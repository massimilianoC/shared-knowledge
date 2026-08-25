# Skill: Spec-First Project Bootstrap (SFAD)

## Description
Bootstraps a new project using the **Spec-First Agentic Development (SFAD)** methodology. It starts with the Base (SFAD Compact) contract, roadmap, feature spec, and decision record; the Full profile adds the complete vision, architecture, requirements, planning, governance, and handoff kit. The goal is a coherent, agent-readable documentation layer proportionate to the project before the first commit to `src/`.

## When to invoke
- The user is starting a new repository and wants to "do it right".
- The user has an empty (or near-empty) repo and asks for help structuring it before writing code.
- The user mentions *Spec-First*, *SFAD*, *agentic methodology*, *AGENTS.md*, or asks to apply the Beehouse-style approach to another project.
- The user wants to retrofit SFAD on an existing repo (skip the Pre-`src/` gate, still produce documents in priority order).

Do **not** invoke when:
- The user is mid-task on an already-bootstrapped repo.
- The request is a one-off code change.

## Expected inputs
Gather in order, one at a time if not provided inline:
1. **Project name** (canonical), e.g., "Beehouse Admin Dashboard".
2. **Repo slug**, e.g., `v1_beehouse_admin_dashboard`.
3. **Project kind**: "admin frontend", "REST API service", "mobile app", "CLI tool", "library", ...
4. **SSoT (Single Source of Truth)**: who owns domain truth. If this repo IS the SSoT, confirm explicitly.
5. **Primary audience**: roles / personas.
6. **Explicit non-audience**: who is NOT served.
7. **One-paragraph vision** (free text).
8. **One-sentence mission** (free text).
9. **Documentation language** (e.g., Italian replies + English code identifiers).
10. **External dependency**: yes/no; if yes, name it.
11. **Flavor**: stack-specific overlay? Available: `frontend-react`. Otherwise stay stack-agnostic.
12. **Adoption profile**: `base` (default) or `full`. Choose `full` for recurring handoffs, external dependencies, material risk, or multi-contributor delivery.

## Produced outputs

### Base profile — minimum durable outputs
- `AGENTS.md`, `README.md`, `docs/INDEX.md`, `docs/planning/ROADMAP.md`, one feature spec, and the lightweight ADR template from [`templates/adoption-profiles/base/`](../../templates/adoption-profiles/base/).
- Baseline verification commands and risk-specific evidence appropriate to the first feature.

### Full profile — extensions over Base

Use the composition guide in [`templates/adoption-profiles/`](../../templates/adoption-profiles/README.md). The following complete outputs extend Base; they do not create competing sources of truth.

### Phase A — Repo-root contracts
- `AGENTS.md` (binding contract; mandatory sections §0–§12)
- `CLAUDE.md`, `GEMINI.md`, `COPILOT.md` (thin aliases, ≤ 20 lines, link to `AGENTS.md`)
- `README.md` (TL;DR + entry points)
- `docs/governance/PROJECT_CONSTITUTION.md` (stable decision principles and accountable owners)

### Phase B — Vision
- `docs/vision/VISION_AND_MISSION.md` — `Stability: stable`. Sections: Vision, Mission, Audience, Non-audience, Guiding principles, Non-objectives, Time horizon.

### Phase C — Architecture
- `docs/architecture/ARCHITECTURE_OVERVIEW.md` — `Stability: stable`. Sections: positioning diagram, roles & responsibilities (names SSoT per concern), conceptual model, binding constraints (A1..An), deploy topology, security boundary, data strategy, error strategy, evolution, non-scope.
- `docs/architecture/TECH_STACK.md` — `Stability: stable`. Locks language, runtime, frameworks, testing, lint/format, CI, folder structure, forbidden libs.
- `docs/architecture/SECURITY_AND_AUTH.md` — `Stability: stable`. Threat model, authN/authZ, CSRF/CORS/CSP, secret handling, audit conventions, per-PR security checklist.
- `docs/architecture/INTEGRATION_CONTRACT.md` — `Stability: evolving` (if external dep). HTTP/IPC conventions, schema → typed boundary mapping, long-running pattern, error → UX mapping, "missing endpoint" policy, changelog.
- `docs/architecture/decisions/0000-template-adr.md` — copy as is.
- `docs/architecture/decisions/0001-stack.md` — first ADR; status `accepted`.
- `docs/architecture/proposals/PROPOSAL_TEMPLATE.md` — copy as is.

### Phase D — Requirements
- `docs/requirements/FUNCTIONAL_REQUIREMENTS.md` — `Stability: evolving`. Tabular per concern; columns: ID (`FR.x.y`), description, MoSCoW priority, milestone.
- `docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md` — `Stability: stable`. Measurable targets only.
- The first feature spec with linked FR/NFR, acceptance examples, a risk tier, and a decision-owner check.

### Phase E — Analysis
- `docs/analysis/DOMAIN_MODEL.md` — `Stability: evolving`. Entities, aggregates, cardinality.
- `docs/analysis/USER_PERSONAS.md` — `Stability: evolving`. One block per persona.

### Phase F — UI/UX (only if flavor `frontend-react` or any UI project)
- `docs/ui-ux/DESIGN_PRINCIPLES.md`
- `docs/ui-ux/INFORMATION_ARCHITECTURE.md`

### Phase G — Planning
- `docs/planning/ROADMAP_MILESTONES.md` — `Stability: evolving`. M0 fully spelled out (Goal, Scope IN, Scope OUT, DoD); M1..M3 sketched; later milestones may be one-liners.
- `docs/planning/EXECUTION_SPEC.md` — `Stability: evolving`. M0 micro-slices in tracker with check + FR coverage.
- `docs/planning/EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` (if external dep). Co-owned with dependency team.

### Phase H — Index
- `docs/INDEX.md` — verifies every doc just written is linked; grouped by stability layer.

### Phase I — Pre-`src/` gate
Run the **Pre-`src/` Checklist** (see `skills/pre-src-checklist-runner.md`). Do **not** create `src/` until every box is ticked.

### Phase J — First commit
Recommend single commit: `chore: bootstrap project docs (SFAD methodology)`.

## Steps / Procedure
1. Gather inputs (one question at a time; respect what is already provided inline).
2. Confirm Base or Full profile, flavor, and retrofit/prototype variant.
3. Generate the Base files; have the user read `AGENTS.md` end-to-end before proceeding.
4. If Full was selected, generate Phase A through H in dependency order; otherwise create only the first feature spec and roadmap entry.
5. **For Full only:** generate Phase B (Vision); confirm with user.
6. **For Full only:** generate Phase C (Architecture); ensure SSoT is named per concern.
7. **For Full only:** generate Phase D (Requirements); ensure at least the next 2 milestones are FR-mapped.
8. **For Full only:** generate Phase E (Analysis).
9. **For Full only:** generate Phase F (UI/UX) if applicable.
10. **For Full only:** generate Phase G (Planning); ensure M0 is **fully** specified.
11. **For Full only:** create the first acceptance-ready feature spec using `requirements-to-acceptance-traceability`.
12. **For Full only:** generate Phase H (`docs/INDEX.md`).
13. Run Phase I (Pre-`src/` gate) for Full. For Base, validate the contract, roadmap, feature spec, and declared baseline commands. If any prerequisite fails, produce the missing artifact and re-check.
14. Recommend Phase J first commit.

## Key patterns
- Single-source agent contract — see [AGENT_CONTRACT_FILE](../../knowledge/patterns/AGENT_CONTRACT_FILE.md).
- Three-layer context architecture — see [THREE_LAYER_AGENT_CONTEXT](../../knowledge/patterns/THREE_LAYER_AGENT_CONTEXT.md).
- Layered stability tagging — see [STABILITY_LAYERS](../../knowledge/patterns/STABILITY_LAYERS.md).
- SSoT discipline — see [SSOT_AND_BOUNDARY](../../knowledge/patterns/SSOT_AND_BOUNDARY.md).
- Vertical micro-slices in the execution spec — see [VERTICAL_MICRO_SLICES](../../knowledge/patterns/VERTICAL_MICRO_SLICES.md).
- Doc-driven task workflow encoded in `AGENTS.md` — see [DOC_DRIVEN_AGENTIC_WORKFLOW](../../knowledge/patterns/DOC_DRIVEN_AGENTIC_WORKFLOW.md).

## Common pitfalls to avoid
- Leaving `${PLACEHOLDER}` tokens unfilled — grep `${` across `docs/` before declaring done.
- Writing Vision/Architecture in long prose; keep each doc focused (1–2 pages for Vision).
- Skipping non-audience and non-objectives lists; they prevent scope creep later.
- Declaring everything `stable` (nothing iterates) or everything `evolving` (pillars drift).
- Creating `src/` before the gate; resist the urge.
- Forgetting to overlay flavor templates (e.g., `frontend-react/`) on top of `core/`.
- Aliases growing into mini-contracts; keep them ≤ 20 lines and rule-free.

## Variants

### Retrofit (existing repo with code)
- Skip Phase I (Pre-`src/` gate is in the past; document the deviation in `AGENTS.md`).
- Backfill in priority order: `AGENTS.md` → `ARCHITECTURE_OVERVIEW.md` → `TECH_STACK.md` → `NFR` → `ROADMAP` → `FR`. Vision/mission may come last if blocking.
- Surface every contradiction between existing code and drafted docs (e.g., "`src/x.ts` makes direct DB calls, which violates Pillar 4").

### Prototype week
- Produce only `AGENTS.md` + `README.md` + a single one-milestone `ROADMAP.md`.
- State explicitly in `AGENTS.md`: *"this is a prototype; full SFAD postponed."*

## Usage examples
```
Example prompt: "Start a new SaaS billing dashboard project — I want SFAD applied from day 1.
Stack: React + TS, talking to a separate Rails backend (SSoT). Audience: internal finance ops.
Documentation in English."
```
```
Example prompt: "We already have ~3k LOC in this repo. Retrofit AGENTS.md and the core
architecture docs. Don't block on Vision yet."
```

## Related skills
- [agents-md-author](agents-md-author.md)
- [stability-classifier](../governance/stability-classifier.md)
- [pre-src-checklist-runner](pre-src-checklist-runner.md)
- [adr-writer](../governance/adr-writer.md)
- [milestone-lifecycle](../execution/milestone-lifecycle.md)
- [external-dependency-enablement](../coordination/external-dependency-enablement.md)
- [requirements-to-acceptance-traceability](../execution/requirements-to-acceptance-traceability.md)
- [agent-context-architecture](../governance/agent-context-architecture.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
