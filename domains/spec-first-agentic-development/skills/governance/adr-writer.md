# Skill: ADR Writer (MADR Format)

## Description
Writes an Architecture Decision Record in MADR format under `docs/architecture/decisions/`. Handles new ADRs, supersession of existing ones, and the promotion from `proposed` to `accepted`. Verifies coherence with the rest of the `decisions/` archive.

## When to invoke
- A library/framework choice that constrains future code is being made.
- A change to any `stable` doc is proposed.
- A boundary contract change (new endpoint family, new event topic, schema breaking change).
- A deviation from a pillar (must be justified and time-boxed).
- A naming / structural convention that affects > 1 file.
- An existing ADR is being superseded.

Do **not** invoke for: bug fixes, single-file refactors, features that fit the current architecture, UI copy choices.

## Expected inputs
- Decision subject (short title).
- Context: what changed, what triggered the decision, constraints.
- At least 2 options (including "do nothing / status quo" if relevant), with pros/cons.
- Proposed decision and one-paragraph rationale.
- Affected `stable` docs and milestones/FRs.
- (If superseding) the older ADR ID.

## Produced outputs
- A new file `docs/architecture/decisions/NNNN-kebab-title.md` (4-digit zero-padded, sequential, no gaps).
- Status starts at `proposed`; promoted to `accepted` in the same or follow-up PR.
- Affected `stable` docs updated **in the same PR** that promotes the ADR.
- (If superseding) older ADR file updated with status `superseded by ADR-NNNN`.

## Template (MADR-ish)

```markdown
# ADR NNNN — <Title>

- **Status**: proposed | accepted | superseded by ADR-XXXX | deprecated
- **Date**: YYYY-MM-DD
- **Deciders**: <names or roles>
- **Affected docs**: <list of stable docs this touches>
- **Affected FRs / Milestones**: <if applicable>

## Context

<2–5 paragraphs: situation, trigger, constraints>

## Options considered

### Option A — <name>
- Pros: ...
- Cons: ...

### Option B — <name>
- Pros: ...
- Cons: ...

### Option C — <name>  (often "status quo / do nothing")
- Pros: ...
- Cons: ...

## Decision

**We choose <Option X>** because <one paragraph rationale>.

## Consequences

- ✅ Positive: ...
- ❌ Negative: ...
- ⚠️ Risks to monitor: ...

## Implementation notes

<concrete steps, links to PRs, deadlines if time-boxed>

## Changelog

| Date | Change |
| :--- | :--- |
| YYYY-MM-DD | Initial accepted |
```

## Steps / Procedure
1. List `docs/architecture/decisions/` to compute the next NNNN.
2. Pick a short, unambiguous kebab title (avoid generic names like "Refactor").
3. Open the file with `Status: proposed`.
4. Fill Context (situation, trigger, constraints — 2–5 paragraphs).
5. Enumerate at least 2 options with pros/cons (include "do nothing" if relevant).
6. State the chosen option with a one-paragraph rationale.
7. Spell out consequences (positive / negative / risks). Risks must be measurable or observable.
8. Add Implementation notes (next steps, PR links, time-box if applicable).
9. Start the Changelog with `Initial proposed | YYYY-MM-DD`.
10. Iterate via PR comments. Keep history in git, **not** in the body.
11. To promote: change `Status: proposed` → `Status: accepted` and update the affected `stable` docs in the same PR.
12. If superseding: open new ADR with `Supersedes ADR-NNNN`, and update the old ADR with `Status: superseded by ADR-MMMM`.

## Key patterns
- See decision: [madr-adr-format](../../knowledge/decisions/madr-adr-format.md).
- One file per decision; sequential numbering, no gaps.
- Decision body reflects **current** thinking — history lives in git.
- A `stable` doc edit always references an ADR.

## Common pitfalls to avoid
- ADR written *after* the decision shipped — decision becomes opaque.
- 10-page ADR — nobody reads it; the actual decision is buried.
- Single-option ADR — at minimum compare against "status quo".
- Deleting an ADR when reversed — lost history; same point gets re-debated. Mark `deprecated` or `superseded` instead.
- Missing "Consequences" — cannot tell when to revisit.
- Risks worded vaguely ("may cause issues"). Make them measurable.
- Marketing language ("clearly the best choice") — drop it.

## Usage examples
```
Example prompt: "Open ADR-0004 to switch from Axios to a typed fetch wrapper. The trigger
is unbounded retry logic in Axios interceptors. We need to choose between
fetch-with-zod, ky, and undici."
```
```
Example prompt: "ADR-0002 (localStorage tokens) is being reversed in favor of httpOnly
cookies. Write ADR-0007 that supersedes it."
```

## Related skills
- [stability-classifier](stability-classifier.md)
- [agents-md-author](../bootstrap/agents-md-author.md)
- [pr-dod-enforcer](../execution/pr-dod-enforcer.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
