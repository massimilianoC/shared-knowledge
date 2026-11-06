# Decision: No `src/` Until the Pre-`src/` Checklist Is Green

- **Status**: accepted
- **Date**: 2026-05-21
- **Context source**: SFAD Pillar 1 and Pre-`src/` checklist

## Context
The dominant industry default is to write code first and document later. The result is:
- architecture congealed in random files;
- agents make incoherent decisions across PRs;
- rationale lost; every refactor re-debates first principles;
- security/quality invariants drift silently;
- onboarding requires tribal knowledge.

The team's hypothesis: forcing a layered, agent-readable documentation skeleton **before** the first commit to `src/` produces dramatically more coherent agentic output, at the cost of a few days of upfront writing.

## Options considered

### Option A — Code first, doc later (industry default)
- Pros: feels fast on day 1; familiar.
- Cons: rationale lost; agents drift; refactor cost compounds; onboarding is oral.

### Option B — Doc first, then code (SFAD)
- Pros: agents have stable ground truth; PRs cite a contract; security invariants are explicit.
- Cons: 2–5 day upfront cost; can feel like ceremony for tiny prototypes.

### Option C — Doc and code in parallel
- Pros: appears to balance.
- Cons: in practice docs lag the code; the *intent* is lost as soon as the code dictates the spec.

## Decision
**We choose Option B**. A `src/` directory is not created until the [Pre-`src/` Checklist](../../skills/bootstrap/pre-src-checklist-runner.md) is fully ticked. The first commit ships `AGENTS.md` and the `docs/` skeleton.

For **tiny prototypes (1-week throwaway)** the checklist collapses to:
- `AGENTS.md` + `README.md` + a single `ROADMAP.md` with one milestone;
- `AGENTS.md` declares: *"this is a prototype; full SFAD postponed"*.

For **retrofit on an existing repo**, Phase I (the gate) is skipped but every other artifact is backfilled in priority order: `AGENTS.md` → `ARCHITECTURE_OVERVIEW.md` → `TECH_STACK.md` → `NFR` → `ROADMAP` → `FR`.

## Consequences
- ✅ Day-1 agentic output has a coherent contract to follow.
- ✅ Rationale survives team turnover.
- ✅ Onboarding consumes docs, not Slack archaeology.
- ❌ Upfront cost is real: 2–5 days for a serious product.
- ❌ Stakeholders impatient to "see the code" may push back; mitigate by showing the Vision + Roadmap as deliverables.
- ⚠️ Risk: the team ships docs that don't reflect actual constraints (cargo-cult SFAD). Mitigate by reviewing the docs with stakeholders before promoting to `stable`.

## Implementation notes
- The gate is mechanical: the [Pre-`src/` Checklist](../../skills/bootstrap/pre-src-checklist-runner.md) lists every box.
- A `grep ${ docs/` returning any match → gate fails (unfilled placeholders).
- Pre-commit hook (optional): reject the first commit that adds `src/` if the checklist file is not 100% ticked.

## Related
- Pattern: [SPEC_FIRST_AGENTIC_DEVELOPMENT](../patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- Skill: [spec-first-bootstrap](../../skills/bootstrap/spec-first-bootstrap.md)
- Skill: [pre-src-checklist-runner](../../skills/bootstrap/pre-src-checklist-runner.md)

## Source
Source materials are intentionally excluded from this public repository.
