# Pattern: Contract-to-Acceptance Traceability

## Summary
Turn a product request into a small, inspectable chain: an identified requirement, a structured behavioural statement, acceptance examples, a delivery slice, and executable evidence. The chain lets people review intent while agents implement details.

Stability: **stable**.

## Why
An agent can generate plausible code from an informal prompt while silently choosing scope, error behaviour, or security semantics. Traceability keeps the product decision visible and makes “done” testable without requiring a human to inspect every generated line.

## The chain

```text
User outcome → FR/NFR → structured requirement → acceptance examples
             → plan and micro-slice → implementation → automated evidence → demo
```

- **FR/NFR**: stable identifier, priority, owner, and milestone.
- **Structured requirement**: use EARS where it increases clarity, e.g. `WHEN <event> IF <condition> THEN THE SYSTEM SHALL <outcome>`.
- **Acceptance examples**: observable happy path, boundary/failure path, and security or accessibility expectation where relevant.
- **Evidence**: the smallest credible test, check, or demonstration that proves the acceptance example.

## Rules

1. Each non-trivial slice names at least one FR or NFR and one acceptance criterion.
2. Requirements describe externally observable behaviour, not a library, database table, or implementation step.
3. Use EARS as a precision aid, not as mandatory ceremony for a simple, unambiguous requirement.
4. A requirement is not complete until the delivery evidence is linked; a passing unit test alone is not automatically acceptance evidence.
5. Changes to an accepted requirement are explicit: revise the requirement, plan, and acceptance evidence together.

## Common pitfalls

- ❌ `FR.3.1: Use Redis for sessions.`  
  ✅ `FR.3.1: WHILE a session is valid, the system shall preserve authenticated access across a browser refresh.`
- ❌ One generic “works as expected” test.  
  ✅ Named positive and negative acceptance examples with their evidence.
- ❌ Rewriting IDs when priorities change.  
  ✅ Keep IDs stable and record the change in the requirement history or ADR.

## Related

- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [VERTICAL_MICRO_SLICES](VERTICAL_MICRO_SLICES.md)
- [RISK_BASED_VERIFICATION_GAUNTLET](RISK_BASED_VERIFICATION_GAUNTLET.md)
- Skill: [requirements-to-acceptance-traceability](../../skills/execution/requirements-to-acceptance-traceability.md)

## Source
Synthesized from `inbox/Best Practice Programmazione Con LLM.md` and `inbox/Guidelines.md`; EARS is an established requirements-writing technique.
Date: 2026-08-24
