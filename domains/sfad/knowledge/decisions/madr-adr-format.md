# Decision: Use MADR-Style ADRs Under `docs/architecture/decisions/`

- **Status**: accepted
- **Date**: 2026-05-21
- **Context source**: SFAD ADR Procedure (Beehouse Admin Dashboard)

## Context
Architectural decisions made in chat threads, PR comments, or design docs scattered across Notion/Confluence become invisible 6 months later. Future devs (and future agents) re-debate the same point because the rationale is missing.

The team needs a format that is:
- versioned with the code;
- short enough to actually be written;
- structured enough to be referenced (`ADR-0007`);
- discoverable (located predictably, named predictably);
- compatible with multiple tools and external readers.

## Options considered

### Option A — Free-form decision docs in `docs/`
- Pros: no template overhead.
- Cons: no discipline → docs vary wildly in shape; hard to grep / index.

### Option B — Nygard's original ADR template
- Pros: well-known; minimal.
- Cons: lacks Status / Deciders / Consequences sections that the team finds load-bearing.

### Option C — MADR (Markdown Any Decision Record)
- Pros: structured but compact; canonical sections (Status, Context, Options, Decision, Consequences); rich enough; widely adopted; works with stock Markdown.
- Cons: slightly more verbose than Option B.

### Option D — Heavy RFC-style documents
- Pros: comprehensive.
- Cons: nobody writes them; rot.

## Decision
**We choose Option C** (MADR-ish). One file per decision, under `docs/architecture/decisions/`, named `NNNN-kebab-title.md` (4-digit zero-padded, sequential, no gaps).

Sections (mandatory):
- **Status**: `proposed | accepted | superseded by ADR-XXXX | deprecated`
- **Date**: ISO `YYYY-MM-DD`
- **Deciders**
- **Affected docs** (other `stable` docs that change)
- **Affected FRs / Milestones** (if applicable)
- **Context** (2–5 paragraphs)
- **Options considered** (at least 2, including "do nothing")
- **Decision** (1-paragraph rationale)
- **Consequences** (positive / negative / risks)
- **Implementation notes**
- **Changelog**

## Consequences
- ✅ Decisions are versioned with code; rationale survives.
- ✅ Cross-referencing is mechanical (`ADR-0007`).
- ✅ Superseding produces an audit trail (old ADR retained, status updated).
- ❌ Slight overhead per decision (~30–60 min of writing).
- ❌ Requires discipline to **open the ADR before** the change ships, not after.
- ⚠️ Risk: bloating numbering with trivial decisions. Mitigate by the "if unsure, write the ADR — cheap to write, expensive to retrofit" rule but reserve ADRs for choices that constrain future code.

## Implementation notes
- Template lives at `docs/architecture/decisions/0000-template-adr.md` (copy-and-rename).
- A PR that touches a `stable` doc must reference an ADR; CI may grep for this.
- Superseded ADRs are **never** deleted; status changes to `superseded by ADR-NNNN`.
- Tech Stack ADR (`0001-stack.md`) is the most important; it pins language, runtime, top frameworks, test framework, lint/format, CI.

## Related
- Pattern: [STABILITY_LAYERS](../patterns/STABILITY_LAYERS.md) (why `stable` docs need ADRs)
- Skill: [adr-writer](../../skills/governance/adr-writer.md)

## Source
Inferred from: `inbox/processed/methodology/procedures/04-ADR_PROCEDURE.md`, `inbox/processed/methodology/checklists/ADR_CHECKLIST.md`
