# Domain: Spec-First Agentic Development (SFAD)

## What it is
**SFAD** is a project bootstrap and ongoing-development methodology designed for repositories that will be touched by multiple AI coding assistants alongside humans. It treats documentation as load-bearing infrastructure, not a deliverable produced after code stabilizes.

## Origin
- Distilled from the **Beehouse Admin Dashboard** repository (`v1_beehouse_admin_dashboard`).
- Beehouse is the canonical reference instance: a React + TS + Zod admin console talking to a separate backend SSoT, with IoT + AI + reporting concerns.
- The methodology was extracted from Beehouse's actual `docs/` shape, `AGENTS.md`, and lessons learned during M0–M2.

## Core ideas
- **Spec-first**: vision → architecture → requirements → roadmap → execution exist as Markdown before any line of `src/`.
- **Single agent contract**: `AGENTS.md` is the operational rulebook; assistant aliases (`CLAUDE.md`, `GEMINI.md`, ...) defer to it.
- **Layered stability**: every doc has a `Stability: stable | evolving | draft` tag governing who can edit it and how.
- **Doc-driven workflow**: agents follow a 7-step loop per task (Plan → Read → Schema → Implement → Test → Verify → Document).
- **Vertical micro-slices**: milestones decompose into testable slices with explicit states; no horizontal infrastructure-only sprints.

See [SPEC_FIRST_AGENTIC_DEVELOPMENT](../patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md) for the canonical pattern reference.

## When SFAD fits
- Any project expected to run > 1 week with multiple contributors (human or AI).
- Repositories that depend on another team / repo / vendor (frontend + backend, app + SDK).
- Teams suffering from incoherent agentic decisions, duplicated logic, lost rationale.
- Long-lived products where onboarding cost matters more than day-1 speed.

## When SFAD is overkill
- 1–2 day spikes, throwaway proofs of concept.
- Pure research notebooks without shippable deliverable.
- Single-author solo experiments with no expectation of handoff.

For 1-week prototypes, SFAD collapses to: `AGENTS.md` + `README.md` + one-milestone `ROADMAP.md`, with `AGENTS.md` explicitly stating *"prototype; full SFAD postponed"*.

## Canonical artifacts (in any compliant repo)
- `AGENTS.md` — binding contract (mandatory)
- `CLAUDE.md` / `GEMINI.md` / `COPILOT.md` — thin aliases
- `README.md` — TL;DR + entry points
- `docs/INDEX.md` — navigable index
- `docs/vision/VISION_AND_MISSION.md` — stable
- `docs/architecture/ARCHITECTURE_OVERVIEW.md` — stable, names the SSoT per concern
- `docs/architecture/TECH_STACK.md` — stable
- `docs/architecture/INTEGRATION_CONTRACT.md` — evolving (when external SSoT exists)
- `docs/architecture/SECURITY_AND_AUTH.md` — stable
- `docs/architecture/decisions/` — MADR ADRs
- `docs/architecture/proposals/` — RFCs not yet accepted
- `docs/requirements/FUNCTIONAL_REQUIREMENTS.md` — evolving (MoSCoW, milestone-mapped)
- `docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md` — stable (measurable)
- `docs/analysis/DOMAIN_MODEL.md` — evolving
- `docs/analysis/USER_PERSONAS.md` — evolving
- `docs/ui-ux/` — only if UI-bearing
- `docs/planning/ROADMAP_MILESTONES.md` — evolving (M0..Mn with DoD)
- `docs/planning/EXECUTION_SPEC.md` — evolving (current micro-slices)
- `docs/planning/EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` — evolving (when applicable)

## Calibration knobs (project-level)
| Knob | Beehouse example | How to pick |
| :--- | :--- | :--- |
| Documentation language | Italian replies + English code | Pick one, declare in `AGENTS.md` §12. |
| Milestone size | M0..M8, 2–4 weeks each | Smaller teams collapse to M0..M3. |
| External enablement | Yes (separate backend repo) | Drop the spec when no external dep. |
| UI/UX docs | Yes (admin console) | Drop for non-UI projects. |
| Prioritization | MoSCoW | RICE / weighted-shortest-job-first also work. Pick one. |
| Stack flavor | Frontend React (Vite + Zod + react-query + Zustand + Tailwind + shadcn/ui) | Use a published flavor or stay agnostic. |
| Issue tracker | GitHub Issues, spec authoritative | Jira / Linear / GH Issues all fine — spec still wins. |

## Related artifacts in this repo
- Patterns:
  - [SPEC_FIRST_AGENTIC_DEVELOPMENT](../patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
  - [AGENT_CONTRACT_FILE](../patterns/AGENT_CONTRACT_FILE.md)
  - [STABILITY_LAYERS](../patterns/STABILITY_LAYERS.md)
  - [SSOT_AND_BOUNDARY](../patterns/SSOT_AND_BOUNDARY.md)
  - [VERTICAL_MICRO_SLICES](../patterns/VERTICAL_MICRO_SLICES.md)
  - [DOC_DRIVEN_AGENTIC_WORKFLOW](../patterns/DOC_DRIVEN_AGENTIC_WORKFLOW.md)
- Decisions:
  - [agents-md-single-contract](../decisions/agents-md-single-contract.md)
  - [pre-src-gate](../decisions/pre-src-gate.md)
  - [madr-adr-format](../decisions/madr-adr-format.md)
- Skills: `skills/spec-first-bootstrap.md`, `skills/agents-md-author.md`, `skills/microslice-tracker.md`, `skills/adr-writer.md`, `skills/milestone-lifecycle.md`, `skills/external-dependency-enablement.md`, `skills/pr-dod-enforcer.md`, `skills/stability-classifier.md`, `skills/doc-driven-task-workflow.md`, `skills/pre-src-checklist-runner.md`.
- Agents: `agents/sfad-bootstrap-agent.md`, `agents/sfad-execution-agent.md`.

## Original source
Methodology kit and worked example originally lived under `inbox/processed/methodology/` (processed 2026-05-21):
- `METHODOLOGY.md` — the method itself.
- `INDEX.md` / `README.md` — navigation.
- `principles/00-PILLARS.md` … `05-DOC_DRIVEN_AGENTIC_WORKFLOW.md` — non-negotiables.
- `procedures/00-OVERVIEW.md` … `06-PR_AND_DOD_PROCEDURE.md` — how-to playbooks.
- `checklists/PRE_SRC_CHECKLIST.md`, `MILESTONE_OPEN_CHECKLIST.md`, `MILESTONE_CLOSE_CHECKLIST.md`, `PR_CHECKLIST.md`, `ADR_CHECKLIST.md`.
- `templates/core/`, `templates/flavors/frontend-react/` — copy-ready templates.
- `examples/BEEHOUSE_AS_INSTANCE.md` — the reference instance walkthrough.
- `skill/spec-first-bootstrap/SKILL.md` — the original Claude Code skill description.

Now archived under `inbox/processed/methodology/`.
