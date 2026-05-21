# Skill: Stability Classifier and Tagger

## Description
Assigns and enforces `Stability: stable | evolving | draft` tags across every document in a `docs/` tree. Handles initial tagging during project bootstrap, promotion/demotion (with the right gates), and review when documents drift away from their declared layer.

## When to invoke
- During project bootstrap, after each top-level doc is written.
- During a milestone close, to verify no doc silently drifted.
- When a contributor promotes a `draft` proposal to `evolving`, or demotes a `stable` doc via ADR.
- During PR review when a `stable` doc is touched (must reference an ADR).

## Expected inputs
- Path of the target doc (or the whole `docs/` tree for an audit).
- For new docs: the doc's role (vision / architecture / requirements / planning / proposal / sprint plan / ...).
- For promotions/demotions: the trigger (accepted proposal, ADR ID, milestone close).

## Produced outputs
- Updated first line below the title: `> Stability: <layer>. <one-sentence rationale>.`
- For promotions: updated header + entry in the doc's changelog (when contract-bearing).
- For demotions: ADR link in the changelog + status update.
- Audit report: list of docs missing the tag, mismatched tags, or stale labels (when no edits match the declared cadence).

## Steps / Procedure
1. Read the doc (or list `docs/` if running an audit).
2. Identify the role:
   - **`stable`**: Vision, Architecture Overview, Tech Stack, Security & Auth, Non-Functional Requirements, Design Principles.
   - **`evolving`**: Functional Requirements, Roadmap, Integration Contract, Domain Model, Execution Spec, Enablement Spec, Information Architecture.
   - **`draft`**: Proposals/RFCs, in-flight ADRs, sprint plans being drafted.
3. Insert/replace the header line:
   ```markdown
   > Stability: **<layer>**. <One-sentence rationale or change policy>.
   ```
4. For `draft` docs, also declare the intended destination layer:
   ```markdown
   > Stability: **draft**. Intended stability when accepted: **stable**.
   ```
5. For promotion `draft → evolving` or `evolving → stable`: update the header and add a changelog entry with date + trigger.
6. For demotion `stable → evolving` (rare): require an accepted ADR; link it; add changelog entry.
7. Audit pass (optional):
   - `grep -r "Stability: " docs/` — list every tagged doc; flag missing tags.
   - For each `stable` doc edited in the last N days without an ADR link in the PR, flag it.
   - For each `evolving` doc that has not been edited across the last 2 milestones, suggest demotion review.
   - For each `draft` doc older than 1 sprint, ask the owner: promote, demote, or close.

## Key patterns
See [STABILITY_LAYERS](../../../knowledge/sfad/patterns/STABILITY_LAYERS.md). Promotion graph:
```
draft ── promote ──▶ evolving ── promote ──▶ stable
                       │
                       └── demote (with ADR) ──▶ draft
```

## Common pitfalls to avoid
- Marking **everything** `stable` (nothing iterates; PRs stall).
- Marking **everything** `evolving` (pillars drift; principles erode).
- Adding a doc without any `Stability:` line — reject the PR.
- Silent downgrade `stable → evolving` without an ADR.
- Per-section tags everywhere — use sparingly; if too many sections diverge, split the doc.
- Stale labels (the doc has been edited weekly but still claims `stable`) — fix the label *or* the editing habit.

## Usage examples
```
Example prompt: "I just wrote docs/architecture/INTEGRATION_CONTRACT.md.
Which stability tag should it carry?"
```
```
Example prompt: "Audit docs/ — list every doc with no Stability line, and every stable doc
touched in the last 60 days without a referenced ADR."
```
```
Example prompt: "Promote proposal docs/architecture/proposals/PROPOSAL-token-rotation.md
to ADR-0004."
```

## Related skills
- [agents-md-author](../bootstrap/agents-md-author.md)
- [adr-writer](adr-writer.md)
- [spec-first-bootstrap](../bootstrap/spec-first-bootstrap.md)

## Source
Extracted from: `inbox/methodology/principles/02-STABILITY_LAYERS.md`
Date: 2026-05-21
