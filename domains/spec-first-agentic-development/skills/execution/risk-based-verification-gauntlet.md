# Skill: Risk-Based Verification Gauntlet

## Description
Selects, executes, and reports an evidence-based quality gate for an agentic change. It always uses the project’s baseline checks and adds contract, end-to-end, security, property, mutation, rollout, or human-review gates when the risk warrants them.

## When to invoke
- Before implementation planning for any non-trivial slice.
- Before declaring a change complete or opening its PR.
- When a generated change affects security, permissions, money, personal data, data migration, or irreversible actions.

## Expected inputs
- Target requirement/slice, changed boundary, risk factors, and project commands.
- Existing quality baseline and CI capabilities.
- Required acceptance examples and accountable owner for high-risk approval.

## Produced outputs
- A recorded risk tier and selected verification plan.
- Reproducible command/CI evidence and any failed-check resolution.
- A completion recommendation or a clear list of unmet gates.

## Steps / Procedure
1. Classify the change as low, medium, high, or critical based on behaviour, blast radius, reversibility, and regulated/security impact.
2. Run the applicable baseline: formatting/lint, type/schema validation, targeted tests, and build/package verification.
3. Add gates by risk: contract/negative tests for medium; SAST, threat review, E2E, and independent human review for high; rollback/staged rollout, independent review, and accountable approval for critical.
4. Use mutation or property testing only when a meaningful invariant or test-adequacy question exists; apply project-specific thresholds.
5. Link command output or CI results to the PR/slice, explain any exception, and do not mark the slice complete if a required gate is missing.

## Key patterns
- [RISK_BASED_VERIFICATION_GAUNTLET](../../knowledge/patterns/RISK_BASED_VERIFICATION_GAUNTLET.md)
- Verification demonstrates acceptance behaviour; it is not a generic test-count ritual.

## Common pitfalls to avoid
- ❌ Treating `npm test` as enough for an authorization change.  
  ✅ Add permission-focused integration/acceptance evidence and human approval.
- ❌ Disabling a failing gate to release.  
  ✅ Record a time-bounded exception and follow-up owner; use an ADR for policy changes.
- ❌ Applying mutation testing to every style-only change.  
  ✅ Spend the verification budget where logic and risk justify it.

## Usage examples
```
Example prompt: "Classify and verify this new account-deletion workflow. It handles personal data,
has an irreversible action, and adds an API boundary."
```

## Related skills
- [pr-dod-enforcer](pr-dod-enforcer.md)
- [requirements-to-acceptance-traceability](requirements-to-acceptance-traceability.md)
- [human-decision-gates](../governance/human-decision-gates.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
