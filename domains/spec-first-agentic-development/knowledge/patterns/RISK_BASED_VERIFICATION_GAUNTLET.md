# Pattern: Risk-Based Verification Gauntlet

## Summary
Require multiple complementary checks before an agentic change is accepted, selecting the depth of verification according to change risk rather than applying one arbitrary score or tool to every repository.

Stability: **stable**.

## Baseline gates

Every non-trivial change has reproducible evidence for applicable formatting/linting, type or schema checks, targeted automated tests, and a build or package check. The PR links the relevant requirement, slice, and evidence.

## Risk tiers

| Tier | Typical change | Additional gates |
| --- | --- | --- |
| Low | copy, isolated presentation, docs | link/lint checks and targeted smoke test |
| Medium | feature logic, API client, workflow | unit/integration and contract tests; negative cases |
| High | auth, payments, permissions, personal data, destructive actions | threat review, security scanning, end-to-end/acceptance test, independent human review |
| Critical | irreversible data changes, regulated or safety impact | rollback plan, independent review, staged rollout, explicit accountable owner |

Property-based or mutation testing is valuable for logic with meaningful invariants or tests whose adequacy is uncertain. It is not an automatic production gate for every UI change; teams set and review thresholds per component.

## Rules ordered by priority

1. Evidence must test the promised behaviour, not merely execute code paths.
2. A green agent report is evidence, not authorization; high and critical changes require independent human review, and critical changes require a named accountable decision.
3. Run deterministic controls in CI where possible. A markdown instruction cannot enforce a security boundary.
4. Preserve failed-check output and the resolution in the PR or handoff record.
5. Calibrate thresholds with a baseline, then adjust through an ADR rather than silently weakening them.

## Common pitfalls

- ❌ `85% mutation score` blocks a trivial documentation or CSS change.  
  ✅ Run mutation testing only where it assesses meaningful behavioural confidence.
- ❌ A unit test passes while an authorization path is untested.  
  ✅ Treat authorization as high risk and add integration/acceptance evidence.
- ❌ Human reviewer checks syntax but not the user outcome.  
  ✅ Review the acceptance scenario, risk classification, and proof first.

## Related

- [CONTRACT_TO_ACCEPTANCE_TRACEABILITY](CONTRACT_TO_ACCEPTANCE_TRACEABILITY.md)
- [DOC_DRIVEN_AGENTIC_WORKFLOW](DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- Decision: [risk-based-quality-gates](../decisions/risk-based-quality-gates.md)
- Skill: [risk-based-verification-gauntlet](../../skills/execution/risk-based-verification-gauntlet.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
