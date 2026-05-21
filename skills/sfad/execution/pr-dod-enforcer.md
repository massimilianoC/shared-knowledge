# Skill: Pull Request & Definition-of-Done Enforcer

## Description
Generates compliant PR descriptions (with traceability to slice + FRs), enforces the PR Definition-of-Done checklist, and reviews PRs against the DoD before merge. Aligns branch naming, commit conventions, merge strategy, and reviewer responsibilities with the SFAD methodology.

## When to invoke
- The agent is about to open a PR for a slice (generate description + DoD).
- A PR is in review (verify DoD against the diff).
- A hotfix PR ships outside the normal flow (retroactive documentation rules).

## Expected inputs
- Slice ID (`M<n>.<m>`) and the FR(s) it closes.
- Brief summary of what changed and why (2–4 sentences).
- Schemas / boundary changes (if any).
- Test coverage (unit / integration / E2E / manual).
- New ADRs (if architectural).
- New docs (if any).

## Produced outputs
- A PR title in Conventional Commits format.
- A PR description with: Slice block, Summary, Schemas, Tests, Docs, DoD checklist, Notes/deviations.
- (In review mode) a pass/fail report per DoD line, with specific issues to fix.

## Branch naming

```
<type>/M<n>.<m>-<short-kebab-title>
```

- `<type>` ∈ `feat | fix | chore | docs | refactor | test | build | ci`.
- Example: `feat/M2.3-approve-device-dialog`.

## Commit conventions (Conventional Commits)

```
<type>(<scope>): <subject>
```

- `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`.
- Scope is the feature folder name (e.g., `devices`, `auth`).
- Subject in imperative ("add", "rename", "fix").
- Breaking changes: `feat(devices)!:` + body `BREAKING CHANGE: ...`.

## PR description template

```markdown
## Slice

- Closes M<n>.<m>
- Closes FR.<x>.<y>[, FR.<x>.<z>]
- Milestone: M<n>

## Summary

<2–4 sentences: what changed and why>

## Schemas / boundaries

- [ ] Added/updated schemas: <list>
- [ ] Updated INTEGRATION_CONTRACT.md changelog: yes / no / N.A.

## Tests

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E smoke
- [ ] Manual verification (describe)

## Docs

- [ ] EXECUTION_SPEC.md tracker updated
- [ ] FUNCTIONAL_REQUIREMENTS.md updated (if FR ticked)
- [ ] ROADMAP_MILESTONES.md DoD box ticked (if applicable)
- [ ] ADR opened (if architectural)
- [ ] INDEX.md updated (if new doc created)

## Definition of Done

<paste the full DoD checklist below>

## Notes / deviations

<anything the reviewer should know>
```

## The DoD checklist

### Traceability
- [ ] PR title follows `<type>(<scope>): <subject>`.
- [ ] PR description states `Closes M<n>.<m>` and `Closes FR.<x>.<y>`.
- [ ] PR is scoped to one slice (or one tightly related chore).

### Quality gates
- [ ] `typecheck` green
- [ ] `lint` green
- [ ] `test` green
- [ ] `build` green
- [ ] (UI) `e2e` smoke green for any new route
- [ ] No `console.log` (or equivalent) in committed code
- [ ] No `// @ts-ignore` (or equivalent) without `// reason:` comment

### Boundary integrity
- [ ] New API call has a schema validator (Zod / OpenAPI / equivalent)
- [ ] Types are *derived* from the schema, not hand-typed
- [ ] Mutations carry `Idempotency-Key`
- [ ] Errors mapped to structured `ApiError` shape
- [ ] No `any` on a boundary

### Security
- [ ] No secret / token hard-coded
- [ ] No `dangerouslySetInnerHTML` (or equivalent) without sanitization + `// reason:` comment
- [ ] No new domain added to CSP `connect-src` without ADR
- [ ] Destructive / sensitive actions have explicit confirmation + audit trail
- [ ] Tokens not persisted in `localStorage` long-term

### Architecture & docs
- [ ] No `stable` doc touched without a linked ADR
- [ ] `EXECUTION_SPEC.md` slice status updated
- [ ] `FUNCTIONAL_REQUIREMENTS.md` FR(s) ticked if applicable
- [ ] `ROADMAP_MILESTONES.md` DoD box ticked if applicable
- [ ] `INTEGRATION_CONTRACT.md` changelog updated if contract evolved
- [ ] `docs/INDEX.md` updated if a new doc was added
- [ ] ADR added/updated if architectural decision was made

### Tests
- [ ] ≥ 1 unit/integration test for every new hook/service/component with behavior
- [ ] Smoke E2E for every new user-facing route (UI projects)
- [ ] Schema test for every new boundary schema (positive + negative example)

### UX (if UI)
- [ ] A11y not regressed on touched pages
- [ ] Empty / error / loading states present
- [ ] Long-running operations surface as a `Job` (or equivalent) — not a frozen spinner
- [ ] Dark mode tested (if supported)
- [ ] i18n strings come from the dictionary (no concatenation)

### Dependencies
- [ ] New dependency is < 100KB gzipped, or ADR justifies the size
- [ ] New dependency is on the allow-list (or ADR adds it)
- [ ] Lockfile updated and committed

## Reviewer responsibilities
1. Read the slice in `EXECUTION_SPEC.md` to know what was promised.
2. Check the PR description's DoD checklist against the diff.
3. Verify schemas precede call sites in the diff (Step 3 of the workflow).
4. Spot-check ≥ 1 test to confirm it actually tests the new behavior, not just compiles.
5. If a `stable` doc is touched: look for the ADR link.
6. Approve only when all of the above pass.

## Merge strategy
- **Squash merge** for feature/fix PRs (one slice = one commit on `main`).
- **Merge commit** for milestone-close PRs (preserves slice-level history).
- **Rebase** for documentation-only PRs.

Declare team policy in `AGENTS.md`.

## Anti-patterns

| Anti-pattern | Fix |
| :--- | :--- |
| PR description is "fix stuff" | Reject. Title must reference slice + summary must be honest. |
| 5 unrelated changes in one PR | Reject. Split into per-slice PRs. |
| Tests in a follow-up PR | Reject. Tests ship with code. |
| Doc updates in a follow-up PR | Reject. Docs ship with code. |
| New library, no ADR | Reject. Open ADR or remove the library. |
| Disabled lint rule without `// reason:` | Reject. |

## Hotfix exception
Production-down hotfixes may skip Plan + Schema-first but **not** Verify + Document. Retroactive docs land in the same PR or a follow-up within 24h with the slice marked `hotfix`.

## Common pitfalls to avoid
- Treating the DoD as cosmetic — every unticked box can hide a regression.
- Stretching a PR to "just one more thing" beyond the slice — split it.
- Pretending tests are "covered" without spot-checking the test bodies.

## Usage examples
```
Example prompt: "Generate the PR description for M2.3 (approve device dialog). I added Zod
schema, the confirmation modal, the mutation hook, and three tests. New ADR-0005 for the
confirm-by-typing pattern."
```
```
Example prompt: "Review PR #142 against the DoD checklist. Tell me what's missing."
```

## Related skills
- [microslice-tracker](microslice-tracker.md)
- [doc-driven-task-workflow](doc-driven-task-workflow.md)
- [adr-writer](../governance/adr-writer.md)
- [stability-classifier](../governance/stability-classifier.md)

## Source
Extracted from: `inbox/methodology/procedures/06-PR_AND_DOD_PROCEDURE.md`, `inbox/methodology/checklists/PR_CHECKLIST.md`
Date: 2026-05-21
