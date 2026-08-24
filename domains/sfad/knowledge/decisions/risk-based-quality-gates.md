# Decision: Apply Quality Gates by Change Risk, Not a Universal Tool Threshold

The project uses a mandatory verification baseline for all non-trivial changes and escalates gates according to behavioural, security, reversibility, and compliance risk.

## Context

The inbox guidance proposes fixed complexity and mutation-testing thresholds. These can be useful defaults, but language, project maturity, and change type determine whether a threshold measures confidence or creates ritual.

## Options considered

### A — Identical gates and scores for every change

Rejected: encourages gaming metrics and makes low-risk work unnecessarily slow.

### B — No prescribed gates; reviewer judgement only

Rejected: agent-generated changes need reproducible, mechanical evidence.

### C — Baseline gates plus risk-based escalation

Chosen: objective baseline checks always run; additional checks and accountable human approval scale with risk.

## Decision

Use option C. Mutation/property testing, SAST, E2E, threat review, rollout controls, and independent review are selected by a recorded risk classification. Threshold changes require an ADR or documented project policy update.

## Consequences

- Evidence is more relevant to the change being shipped.
- Teams need a short, explicit risk rubric.
- High-risk work receives more, not less, human accountability.

## How to apply it

Classify the slice before implementation; place the selected gates in the plan and PR DoD; attach command output or CI links before closing the slice.

## Related

- [RISK_BASED_VERIFICATION_GAUNTLET](../patterns/RISK_BASED_VERIFICATION_GAUNTLET.md)
- Skill: [risk-based-verification-gauntlet](../../skills/execution/risk-based-verification-gauntlet.md)

## Source
Synthesized from `inbox/Best Practice Programmazione Con LLM.md` and `inbox/Guidelines.md`.
Date: 2026-08-24
