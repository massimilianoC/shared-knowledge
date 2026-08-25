# Skill: RAG Multi-Tenancy Leakage Audit

## Description
Audits an existing RAG/vector-search implementation for cross-tenant data
leakage risk against the [double-sandboxing pattern](../knowledge/patterns/DOUBLE_SANDBOXING.md).
Use it whenever a RAG or vector-search feature already exists and needs a
security review for missing deny-by-default checks, optional tenant parameters,
or storage-level isolation gaps — before or instead of building new features on
top of it.

## Expected inputs
- Read access to the target codebase (service token guard, policy layer, backend
  adapter(s), collection/schema setup).
- Knowledge of what the domain's hard tenant key and actor-binding dimensions are
  supposed to be (organizations? projects? chats? agents? sessions?).

## Produced outputs
- A prioritized list of findings, each with: the concrete exploitation scenario
  (what request, from what actor, would leak what data) — not just "violates best
  practice."
- Severity classification per finding (see Steps below).
- A recommendation of whether existing gaps are safe to defer (with the specific
  risk stated) or must block further feature work.

## Steps / Procedure

1. **Locate the trust boundary.** Find the service token guard. Confirm: it
   verifies signature **and** pins issuer/audience; fails closed if the
   verification secret isn't configured; rejects requests missing any mandatory
   claim (hard tenant key, actor id, allowed-scopes array).

2. **Locate the policy layer (Layer 1).** Confirm it has zero storage/adapter
   dependency and is independently unit-tested. Check:
   - Hard tenant key from the request is asserted equal to the token's, except
     through an explicit, named, auditable god-mode role.
   - Actor-binding claims are asserted for **every** actor-binding dimension the
     domain has, not just the first one implemented.
   - Allowed scopes are computed as an intersection, never a union or the full
     requested set unchecked — grep for any code path that could return more than
     the token allows.
   - An empty/missing allowed-scopes set throws, it does not silently resolve to
     "no restriction."
   - Policy service runs before any adapter/storage call on **every** code path,
     including newly added endpoints — grep every controller method for a policy
     call preceding the first adapter call.

3. **Locate the backend adapter contract.** Confirm the tenant key and
   allowed-scopes (or equivalent) are non-optional on every method signature — no
   overload without them. Confirm `isReady()`/equivalent performs a readiness
   probe only, never a data query.

4. **Audit the storage-layer adapter (Layer 2).** For Weaviate:
   - Collection created with `multiTenancy: { enabled: true }` and
     `vectorizers.selfProvided()`.
   - `ensureTenant()` called before every write/read.
   - **Mechanically grep** every `collections.get(...)` call and verify each is
     immediately chained with `.withTenant(...)` — treat every unchained match as
     a defect.
   - `searchSimilar` builds an OR-of-ANDs filter over every allowed scope (a
     single flat AND across all allowed scopes is a bug — it would incorrectly
     require matching all of them simultaneously).
   - Expiry enforced as an active filter at query time, not only by a background
     cleanup job.
   - `deleteByScope` requires the hard tenant key as non-optional; no
     delete-all-tenants path exists, even for admin tooling.

5. **Audit the embeddings adapter.** Confirm it's a fully separate
   interface/factory from the backend adapter — the backend adapter must never
   call an embeddings provider directly (see
   [self-provided-embeddings](../knowledge/decisions/self-provided-embeddings.md)).

6. **Audit the test suite** against
   [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md).
   Specifically check for the adapter-only test that bypasses the policy layer
   entirely — its absence means Layer 2's independent guarantee is unverified,
   even if every other test is green.

7. **Prioritize findings:**
   - **Critical** — anything that lets Layer 1 be bypassed entirely, or lets
     Layer 2 be queried without a tenant.
   - **High** — multi-tenancy present but the intra-tenant scope filter is
     missing (one compromised tenant-level credential exposes every scope within
     that tenant).
   - **Medium** — missing tests for an otherwise-correct implementation.

8. **Report.** For each finding, state the concrete request/actor/data
   combination that would exploit it — do not silently fix critical findings
   without flagging them first; data isolation defects warrant explicit
   confirmation before behavior changes.

## Key patterns
- Grep-verify claims mechanically wherever possible (e.g. every
  `collections.get(` call chained with `.withTenant(`, every adapter method
  signature checked for an optional tenant-key parameter) rather than trusting a
  visual code read.
- State the exploitation scenario, not the rule violated — "this lets a caller
  with a token bound to chat A read chunks belonging to chat B by sending
  `chatId: B` in the request body" is actionable; "missing validation" is not.

## Common pitfalls to avoid
- Treating an optional tenant-key parameter as a style nit instead of a critical
  finding.
- Accepting "we have multi-tenancy enabled" as sufficient without checking for
  the intra-tenant scope filter.
- Missing the adapter-only bypass test as a gap — most implementations have the
  allow-path and cross-tenant tests but skip the one that proves Layer 2 holds
  independently.
- Silently fixing a critical finding instead of flagging it and letting the
  request owner decide explicitly.
- Auditing only the happy path code and skipping newly added endpoints for the
  "policy runs before adapter" check.

## Usage examples
```
Example prompt: "Audit our existing RAG service for cross-tenant leakage risk.
We use Weaviate with multi-tenancy but I'm not sure the policy layer is being
enforced consistently across all endpoints."
```
```
Example prompt: "We're adding a new admin endpoint to the RAG service that
searches across all organizations. Review whether this breaks our isolation
guarantees before we merge it."
```

## Related skills
- [rag-weaviate-double-sandbox-bootstrap](rag-weaviate-double-sandbox-bootstrap.md)

## Related knowledge
- [DOUBLE_SANDBOXING](../knowledge/patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md)
- [self-provided-embeddings](../knowledge/decisions/self-provided-embeddings.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
