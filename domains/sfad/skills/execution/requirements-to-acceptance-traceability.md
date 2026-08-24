# Skill: Requirements-to-Acceptance Traceability

## Description
Converts a user outcome into an approved, implementation-ready feature specification: stable FR/NFR links, structured requirements, observable acceptance examples, and a traceable micro-slice. Use it before planning a non-trivial feature or when an existing feature has unclear acceptance criteria.

## When to invoke
- A stakeholder describes a feature, bug fix, workflow, or policy outcome.
- An agent can implement the request but cannot state how success will be observed.
- A requirement changes after implementation has begun.

Do not invoke for a spelling correction or a fully specified, isolated mechanical task.

## Expected inputs
- Desired user/business outcome and affected audience.
- Known constraints, out-of-scope behaviour, and risk factors.
- Relevant existing FR/NFR IDs, architecture boundaries, and current milestone.
- A named stakeholder or decision owner for material ambiguity.

## Produced outputs
- A feature spec under `specs/<id>/spec.md` or the project’s equivalent.
- Stable FR/NFR references, EARS statements where useful, and positive/negative acceptance examples.
- A proposed micro-slice with selected verification evidence.
- A concise list of decisions requiring human approval, if any.

## Steps / Procedure
1. Restate the outcome, audience, non-goals, and measurable success condition. Ask only for missing material decisions.
2. Link or create stable FR/NFR IDs; do not encode implementation choices as requirements.
3. Express ambiguous/event/state-dependent behaviour using EARS. Keep simple requirements plain when EARS adds no clarity.
4. Write acceptance examples: at least normal behaviour plus relevant error, boundary, security, or accessibility behaviour.
5. Classify delivery risk and select evidence using the verification-gauntlet skill.
6. Map the work to one vertical micro-slice and update the plan/tracker after stakeholder approval.
7. On a later change, revise the requirement, acceptance evidence, and slice together; never silently let code become the only truth.

## Key patterns
- [CONTRACT_TO_ACCEPTANCE_TRACEABILITY](../../knowledge/patterns/CONTRACT_TO_ACCEPTANCE_TRACEABILITY.md)
- EARS is a constrained natural-language syntax, not a substitute for domain discovery.
- BDD/Gherkin is optional notation; the invariant is observable acceptance evidence.

## Common pitfalls to avoid
- ❌ `The system shall use PostgreSQL.`  
  ✅ `WHEN an authorized user saves a profile, the system shall preserve the confirmed changes.`
- ❌ A happy-path example only.  
  ✅ State expected failure and permission behaviour where it matters.
- ❌ Asking the user to approve every wording edit.  
  ✅ Ask only when outcome, scope, risk, or trade-off is material.

## Usage examples
```
Example prompt: "Turn ‘users can export their invoices’ into a traceable feature spec.
Exports contain personal data, must cover permission failures, and are planned for M2."
```

## Related skills
- [spec-first-bootstrap](../bootstrap/spec-first-bootstrap.md)
- [human-decision-gates](../governance/human-decision-gates.md)
- [risk-based-verification-gauntlet](risk-based-verification-gauntlet.md)
- [microslice-tracker](microslice-tracker.md)

## Source
Synthesized from: `inbox/Best Practice Programmazione Con LLM.md`, `inbox/Guidelines.md`, and the SFAD methodology.
Date: 2026-08-24
