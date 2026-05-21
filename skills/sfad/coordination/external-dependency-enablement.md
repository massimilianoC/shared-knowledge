# Skill: External Dependency Enablement

## Description
Coordinates work with an upstream owner (another team / repo / vendor) so this project never builds the UI on imaginary endpoints. Maintains `EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` as the co-owned contract surface, ensures the upstream "leads by at least one slice", and blocks slices whose contracts are not `agreed`.

## When to invoke
- During project bootstrap, when an external dependency exists.
- When opening a new milestone — every slice with an upstream contract needs status check.
- When the upstream owner changes a contract (must trigger spec + Integration Contract changelog updates + regression check on dependent slices).
- When a slice is `blocked` because of a missing endpoint — open a proposal for the contract shape.

## Expected inputs
- Name of the dependency (team / repo / vendor) and a primary contact.
- The upcoming milestone(s) and the slices that depend on upstream contracts.
- For each contract: endpoint/event/function signature, request schema, response schema, error cases, permissions, audit semantics, lifecycle semantics, example payload, schema versioning mechanism.

## Produced outputs
- `docs/planning/EXTERNAL_DEPENDENCY_ENABLEMENT_SPEC.md` with:
  1. **Operating principles** (3–5 bullets): the dependency is SSoT for X; leads by ≥ 1 slice; etc.
  2. **Definition of "ready"** for a slice (8-point list).
  3. **Per-milestone contracts**: endpoints/events/schemas required, status (`agreed | in-progress | pending | blocked`), which slice they unblock.
  4. **Backlog of pending requests**.
  5. **Changelog**.
- Slice statuses in `EXECUTION_SPEC.md` aligned with contract readiness.
- Proposals under `docs/architecture/proposals/` when a contract shape needs to be designed collaboratively.

## Steps / Procedure
1. **Identify the dependency early** — during Phase G of bootstrap, write this spec.
2. **Negotiate the "leads by 1 slice" rule** — the dependency owner commits to delivering the contracts for the *next* slice before this team consumes them.
3. **Per-milestone sync** (before declaring the milestone open):
   - Which contracts are needed for this milestone?
   - Which are `agreed`? Which need design work?
   - Readiness date per contract.
4. **Block when blocked**:
   - Contract `pending` or `blocked` → corresponding slice stays `planned` in `EXECUTION_SPEC.md`.
   - Do **not** invent the missing pieces in production code.
   - Dev MSW mocks allowed but marked `// TODO(M<n>): replace with real endpoint`.
   - Open a proposal in `docs/architecture/proposals/` to suggest the contract shape.
5. **Update on every contract change**:
   - Spec entry updated.
   - Spec changelog entry (date + author + change).
   - `INTEGRATION_CONTRACT.md` changelog (if HTTP/IPC conventions affected).
   - Re-test slices that depend on the changed contract.

## The "ready" definition (8-point baseline)
A slice is `ready-backend` only when **all** of:
- [ ] Endpoint / topic / function signature agreed
- [ ] Request schema agreed (positive + ≥ 1 error)
- [ ] Response schema agreed (positive + ≥ 1 error)
- [ ] Permissions / auth semantics documented
- [ ] Audit / side-effects documented
- [ ] Lifecycle semantics clear (hard delete? soft delete? lifecycle action?)
- [ ] At least one example payload (real or fixture) available
- [ ] Schema versioning header / mechanism in place

If any one fails → slice stays `planned`.

## Spec template skeleton

```markdown
# External Dependency Enablement Spec

> Stability: **evolving**. Co-owned with <upstream team>. Changes logged in changelog below.

## 1. Operating principles
- <Upstream> is the SSoT for <concerns>.
- <Upstream> leads by ≥ 1 slice.
- This repo does not invent missing endpoints in production.

## 2. Definition of "ready" (per slice)
<8-point list>

## 3. Per-milestone contracts

### M0
| Contract | Slice it unblocks | Status | Notes |
| :------- | :--------------- | :----- | :---- |
| POST /admin/login | M0.1 | agreed | example fixture in repo |
| GET /admin/me | M0.2 | agreed | |

### M1
| Contract | Slice it unblocks | Status | Notes |
| :------- | :--------------- | :----- | :---- |
| GET /devices?status=pending | M1.1 | in-progress | ETA 2026-06-03 |

## 4. Backlog of pending requests
- <items that don't fit a near milestone>

## 5. Changelog
| Date | Change | Author |
| :--- | :----- | :----- |
| 2026-05-21 | Initial spec | <name> |
```

## Common pitfalls to avoid
- "Backend will catch up next sprint" — frontend ships imaginary logic, two-week rework later.
- Spec lives in a Slack/chat thread — untraceable; new joiners cannot reconstruct history.
- Frontend defines schemas alone, "backend will conform" — produces incompatibility and rework.
- No status column — can't tell pending from done; standups devolve.
- No changelog — cannot tell when a contract changed; cannot replay why a slice broke.
- Skipping the spec because "we'll figure it out" — guarantees the rework happens.

## What if there is no external dependency?
Skip the spec. Note in `AGENTS.md`: *"this repo is self-contained; no external dependency enablement file is maintained."*

## Usage examples
```
Example prompt: "We're opening M3. Sync the enablement spec with the backend team:
they confirmed /devices/:id/approve and /devices/:id/reject are agreed for M3.1 and M3.2,
but the audit endpoint /audit/devices/:id slips to M4. Update the spec and block M3.3."
```
```
Example prompt: "The backend changed the response shape for GET /me — `roles` is now an
array of objects, not strings. Update the spec changelog, the Integration Contract changelog,
and re-trigger regression on M1.2 and M2.4."
```

## Related skills
- [microslice-tracker](../execution/microslice-tracker.md)
- [milestone-lifecycle](../execution/milestone-lifecycle.md)
- [adr-writer](../governance/adr-writer.md)
- [spec-first-bootstrap](../bootstrap/spec-first-bootstrap.md)

## Source
Extracted from: `inbox/methodology/procedures/05-EXTERNAL_DEPENDENCY_ENABLEMENT.md`
Date: 2026-05-21
