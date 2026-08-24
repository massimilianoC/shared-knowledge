# Skill: Pre-`src/` Checklist Runner

## Description
Verifies a project is ready to create its first `src/` directory by walking the Pre-`src/` Checklist box by box. Identifies missing artifacts, unfilled placeholders, broken links, and tag drift. Outputs a pass/fail report and a punch list of files to produce before code may be written.

## When to invoke
- After Phase A–H of the project bootstrap; right before the first commit.
- When a contributor proposes the first `src/` commit and wants confirmation that the gate is green.
- During retrofit, after the user backfills the methodology docs into an existing repo — to grade how close they are.

## Expected inputs
- Repository root path.
- Information about whether this is a fresh project or a retrofit (retrofit skips the gate but still grades).

## Produced outputs
- A ticked/unticked checklist report.
- A punch list: each unticked box → the file/section to produce.
- A green-light recommendation (`OK, you may create src/`) or a `NOT READY` block with reasons.

## Steps / Procedure

### A — Identity & contracts
- [ ] `AGENTS.md` exists at the repo root.
- [ ] `AGENTS.md` has no `${PLACEHOLDER}` left (`grep ${ AGENTS.md`).
- [ ] Aliases exist for every assistant in scope (`CLAUDE.md`, `GEMINI.md`, `COPILOT.md`, ...).
- [ ] Each alias is ≤ 20 lines, links to `AGENTS.md`, contains no new rules.
- [ ] `README.md` has TL;DR + entry-point links.

### B — Vision
- [ ] `docs/vision/VISION_AND_MISSION.md` exists with `Stability: stable`.
- [ ] Audience and non-audience explicit.
- [ ] At least 3 non-objectives listed.

### C — Architecture
- [ ] `docs/architecture/ARCHITECTURE_OVERVIEW.md` exists with `Stability: stable`.
- [ ] System positioning diagram present (ASCII or image).
- [ ] SSoT named per concern (domain data, auth, policy, ...).
- [ ] Binding architectural constraints listed and numbered (`A1`, `A2`, ...).
- [ ] `docs/architecture/TECH_STACK.md` exists; language/runtime/frameworks/testing locked.
- [ ] `docs/architecture/SECURITY_AND_AUTH.md` exists; includes threat model + per-PR security checklist.
- [ ] If external dep: `docs/architecture/INTEGRATION_CONTRACT.md` exists with HTTP/IPC conventions + changelog.
- [ ] `docs/architecture/decisions/0001-stack.md` exists and is `accepted`.

### D — Requirements
- [ ] `docs/requirements/FUNCTIONAL_REQUIREMENTS.md` exists; FRs IDed, MoSCoW-prioritized, milestone-mapped.
- [ ] `docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md` exists; measurable targets only.

### E — Analysis
- [ ] `docs/analysis/DOMAIN_MODEL.md` exists; conceptual aggregates + cardinality.
- [ ] `docs/analysis/USER_PERSONAS.md` exists (or explicitly marked N/A).

### F — UI/UX (if applicable)
- [ ] `docs/ui-ux/DESIGN_PRINCIPLES.md` exists.
- [ ] `docs/ui-ux/INFORMATION_ARCHITECTURE.md` lists top-level routes/pages.

### G — Planning
- [ ] `docs/planning/ROADMAP_MILESTONES.md` exists; M0 fully spelled out (Goal, Scope IN, Scope OUT, DoD).
- [ ] `docs/planning/EXECUTION_SPEC.md` lists M0 micro-slices with checks and FR coverage.
- [ ] If external dep: `docs/planning/EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` exists with M0 contracts `agreed`.

### H — Documentation hygiene
- [ ] `docs/INDEX.md` lists every top-level doc.
- [ ] Every doc has a `Stability:` line.
- [ ] Every doc opens with a one-paragraph purpose.
- [ ] All internal links in `docs/INDEX.md` resolve.

### I — Tooling readiness (still no `src/`)
- [ ] `.gitignore` configured (language-appropriate).
- [ ] License chosen (if applicable).
- [ ] CI configuration sketched (placeholder workflow OK).
- [ ] `.env.example` or runtime-config example present (if backend deps).
- [ ] PR template under `.github/PULL_REQUEST_TEMPLATE.md` reflects the DoD.

### J — Process
- [ ] At least one stakeholder reviewed and accepted vision + roadmap.
- [ ] M0 issue is open in the tracker, linked to the milestone in the roadmap.
- [ ] Team agrees on which assistant aliases and tooling are in scope.

### K — Finally
- [ ] Link check: every link in every doc resolves.
- [ ] `grep -r "\${" docs/` returns zero matches.
- [ ] `grep -r "TODO" docs/` — only intentional ones remain.

## Output report shape
```
PRE-SRC GATE — <PROJECT_NAME>

Section A — Identity & contracts            5/5 ✓
Section B — Vision                          3/3 ✓
Section C — Architecture                    7/9 ✗
  Missing: docs/architecture/decisions/0001-stack.md
  Issue:   ARCHITECTURE_OVERVIEW.md has no SSoT-per-concern table
...
Section K — Finally                         2/3 ✗
  Issue:   docs/INDEX.md has 1 broken link → docs/planning/ROADMAP.md

RESULT: NOT READY (3 sections incomplete).
Next steps:
1. Write ADR 0001-stack.md (template at docs/architecture/decisions/0000-template-adr.md).
2. Add SSoT-per-concern table to ARCHITECTURE_OVERVIEW.md §2.
3. Fix broken link in INDEX.md.
```

## Common pitfalls to avoid
- Treating the checklist as cosmetic — every unticked box represents lost rationale or unresolved ambiguity.
- Auto-ticking boxes "in spirit" — the box must correspond to an actual artifact in the repo.
- Skipping the `${` grep — leftover placeholders are the #1 source of broken bootstraps.
- Greenlight despite missing M0 spec in the Roadmap — without M0 fully spelled out, there is no first slice to open.

## Usage examples
```
Example prompt: "Run the Pre-src checklist on this repo and tell me what's missing."
```

## Related skills
- [spec-first-bootstrap](spec-first-bootstrap.md)
- [agents-md-author](agents-md-author.md)
- [stability-classifier](../governance/stability-classifier.md)

## Source
Extracted from: `inbox/processed/methodology/checklists/PRE_SRC_CHECKLIST.md`
Date: 2026-05-21
