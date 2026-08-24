# Decision: Ask for Human Approval by Decision Risk

Agents ask focused questions and obtain explicit approval for material product, architectural, security, financial, legal, or irreversible decisions. They do not request confirmation for routine reversible implementation steps already covered by an approved specification.

## Context

Unbounded autonomy can make unapproved decisions; asking for approval after every file creates friction and trains users to rubber-stamp. The method needs predictable, high-value checkpoints.

## Options considered

### A — Confirm every phase and edit

Rejected: too slow and obscures the decisions that actually need stakeholder attention.

### B — Never interrupt the agent

Rejected: agents must not silently choose material business or risk trade-offs.

### C — Confirm only defined, material decision classes

Chosen: approvals are driven by a short risk rubric and recorded with the resulting decision.

## Decision

Use option C. Ask for a concise decision when scope, architecture, privacy/security, external cost, compliance, destructive action, or acceptance trade-off is materially affected. Present the recommended option, alternatives, consequences, and the latest safe time to decide.

## Consequences

- Users remain responsible for intent and risk acceptance.
- Agents can work autonomously within an approved slice.
- Decisions are auditable instead of buried in chat.

## How to apply it

Use a `Decision needed` block in the feature spec or ADR and update the execution tracker after the answer. Escalate unclear high-risk work instead of guessing.

## Related

- [CONTRACT_TO_ACCEPTANCE_TRACEABILITY](../patterns/CONTRACT_TO_ACCEPTANCE_TRACEABILITY.md)
- Skill: [human-decision-gates](../../skills/governance/human-decision-gates.md)

## Source
Synthesized from `inbox/Guidelines.md` and the SFAD stakeholder-review principle.
Date: 2026-08-24
