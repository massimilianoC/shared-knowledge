# Decision: Anti-leakage E2E suite is a mandatory merge gate

## Problem
"The build compiles and the happy path works" is not evidence that a multi-tenant
isolation design actually holds under adversarial conditions. How do you make
data-isolation correctness a verifiable, enforced property instead of an
assumption?

## Decision
Ship every implementation of the [double-sandboxing pattern](../patterns/DOUBLE_SANDBOXING.md)
with a fixed anti-leakage E2E suite, required green in CI before merge — not an
optional or "nice to have" addition:

1. **Allow-path** — same tenant + correct scope retrieves what was indexed.
2. **Deny — cross-tenant** — a request for a different organization/tenant is
   rejected.
3. **Deny — cross-actor-binding**, once per actor-binding dimension the domain has
   (e.g. cross-project, cross-chat, cross-agent) — not just one generic test if
   the domain has multiple binding dimensions.
4. **Deny — scope escalation** — requesting a scope beyond what the token allows
   is rejected.
5. **Health/readiness** — reachable with the configured backend, without
   performing a data query.
6. **Ingest + retrieve consistency** — using a deterministic embeddings stub.
7. **Adapter-only test** — call the backend adapter directly with a wrong tenant
   key, **bypassing the policy layer entirely**. This is the test that proves
   Layer 2 holds independently of Layer 1, not just that Layer 1 catches
   everything in practice.

## Why
- Tests 2–4 are the actual acceptance bar for "isolation actually works" — each
  one maps directly to a concrete exploitation scenario, not an abstract best
  practice.
- Test 7 is the one test most implementations skip, and it is the one that
  distinguishes "Layer 1 happens to catch every request today" from "Layer 2 is a
  real independent backstop" — without it, the double-sandboxing claim is
  unverified.
- Making the suite a CI gate (not a suggestion) means a future PR that
  accidentally removes a guard, adds an endpoint without wiring the policy check,
  or loosens a filter fails the build instead of shipping a silent regression.

## Rejected alternative
Relying on code review alone to catch missing tenant checks. Rejected because
policy bugs are exactly the kind of defect that passes casual review (a missing
`.withTenant(...)` chain, an optional parameter added "temporarily") — the whole
point of the double-sandboxing pattern is that a human/process failure in one
layer should not be the only thing standing between a bug and a leak.

## How to apply it
- Write the five denial tests *before* the production adapter exists, against a
  stub adapter — they define the contract for the adapter, not an afterthought
  once it's built.
- Port all five denial scenarios verbatim into any new project adopting this
  pattern; only the actor-binding dimensions in test 3 change per domain.
- Do not report a bootstrap or audit task complete without this suite passing —
  treat it the same as a missing test, not a style nit.

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/ARCHITECTURE_REFERENCE.md`, `inbox/rag-bootstrap-toolkit/IMPLEMENTATION_GUIDE.md`, `inbox/rag-bootstrap-toolkit/agent/rag-bootstrap-architect.md`
Date: 2026-07-01
