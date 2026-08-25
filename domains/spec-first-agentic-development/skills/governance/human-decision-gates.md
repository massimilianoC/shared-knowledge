# Skill: Human Decision Gates

## Description
Keeps the human actively responsible for product intent and material risk while allowing an agent to execute approved, reversible work autonomously. It turns vague “ask for confirmation” behaviour into explicit, testable decision gates.

## When to invoke
- Bootstrapping a project, accepting a feature spec, or planning a high-impact slice.
- A request affects scope, architecture, security/privacy, external spending, compliance, irreversible data, or acceptance trade-offs.
- An agent finds an ambiguity that cannot be resolved from approved project documents.

## Expected inputs
- The decision, recommended option, feasible alternatives, consequences, and deadline.
- Risk classification and the relevant requirement/ADR/slice.
- The authorized decision owner when known.

## Produced outputs
- A concise decision request or an ADR/proposal.
- Explicit approval, rejection, or deferred decision recorded in the canonical document.
- Clear autonomous execution boundaries after the decision.

## Steps / Procedure
1. Check whether the decision is already settled by a stable document or accepted ADR.
2. Classify it: routine/reversible, material, high-risk, or critical.
3. For material-or-higher decisions, present a recommended option, alternatives, consequences, and the latest safe decision point.
4. Ask one focused question; do not ask for ceremonial approval of routine file edits.
5. Record the answer in the spec, ADR, or execution tracker and continue within its boundary.
6. Escalate rather than infer authority for security, legal, financial, or irreversible changes.

## Key patterns
- Decision risk is distinct from implementation complexity.
- Human review prioritizes outcome, risk, and evidence over generated syntax.
- [human-approval-by-decision-risk](../../knowledge/decisions/human-approval-by-decision-risk.md)

## Common pitfalls to avoid
- ❌ “Please confirm I may create the next file.”  
  ✅ “Choose retention option A (30 days) or B (1 year); this changes privacy exposure and storage cost.”
- ❌ An agent picks a payment provider because it is familiar.  
  ✅ Open an ADR and request the accountable owner’s decision.
- ❌ The answer remains only in chat.  
  ✅ Record the decision in the relevant project artifact.

## Usage examples
```
Example prompt: "A proposed export needs a 90-day retention period, but the product brief is silent.
Prepare a focused stakeholder decision with recommendation and impacts."
```

## Related skills
- [adr-writer](adr-writer.md)
- [requirements-to-acceptance-traceability](../execution/requirements-to-acceptance-traceability.md)
- [risk-based-verification-gauntlet](../execution/risk-based-verification-gauntlet.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
