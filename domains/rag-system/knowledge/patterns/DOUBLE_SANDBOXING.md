# Pattern: Double Sandboxing (Two Independent Isolation Layers)

## Problem
A multi-tenant RAG / vector-search subsystem must guarantee that a bug or a leaked
credential in any single component can never expose one tenant's data to another.
A single isolation layer — whether it lives in application code or in the storage
engine — has exactly one failure domain; if that layer has a bug or is bypassed,
nothing else stops the leak.

## Solution
Apply two **independent, structurally different** isolation layers to every
operation, so that a failure in either one alone cannot cause cross-tenant leakage.
Neither layer is a substitute for the other, and they must fail for different
reasons in different ways (not "redundancy for its own sake" — genuinely different
failure domains).

### Layer 1 — Application policy sandbox (logical, pre-storage)
A deny-by-default policy service that runs in application code, before any call
reaches the data store:
- Verifies a short-lived (≤120s), signed service-to-service JWT from a trusted
  caller (gateway, monolith module, BFF) — never a user-facing credential.
- Asserts the request's hard tenant key (e.g. `organizationId`) matches the
  token's, unless an explicit, auditable god-mode role is present.
- Asserts any actor-binding claims on the token (e.g. "bound to project X") match
  the request, for every actor-binding dimension the domain has.
- Computes the allowed scopes as the **intersection** of requested ∩ token-allowed
  — never a union, never an escalation.
- Has zero knowledge of the storage engine — it only produces a fully
  pre-authorized parameter object.

**What it cannot cover alone:** application logic has bugs — a missed guard on a
new endpoint, a wrong DTO mapping — and a bug here would otherwise reach
unfiltered storage with no backstop.

### Layer 2 — Storage-engine native multi-tenancy sandbox (physical, at-storage)
The hard tenant key maps 1:1 to a storage-engine-native tenant/partition — for
example a Weaviate **tenant** (physically separate shards, `multiTenancy: {
enabled: true }` on the collection), not a `WHERE` clause on shared storage.
Every single data operation explicitly resolves the tenant before touching data
(e.g. `.withTenant(organizationId)`); there is no code path that queries without
one. Inside the tenant, a second, finer-grained filter narrows by sub-tenant scope
(project / chat / agent-equivalent) and excludes expired data as an active filter,
not only via a background cleanup job.

**What it cannot cover alone:** anyone with direct storage credentials (leaked API
key, misconfigured network exposure, an internal script that skips the policy
layer) could pick any tenant deliberately or by mistake. Native multi-tenancy
prevents cross-tenant *accidents inside correct code*, not a caller that bypasses
the policy layer entirely.

### Why both, not just one

| If only Layer 1 existed | If only Layer 2 existed |
|---|---|
| A bug in policy code, a missed guard on a new endpoint, or a wrong DTO mapping could send the request straight to a shared/unfiltered store with no independent backstop. | Someone with direct storage credentials could freely pick any tenant and read/write across organizations — native multi-tenancy stops cross-tenant access, but nothing stops a caller that skips policy from choosing the wrong tenant, or ignoring finer scope filters. |

With both layers: a policy bug still hits a hard-filtered adapter (the adapter
contract mandates tenant key + allowed-scopes are always present — no method
accepts an unscoped query). A storage-level credential leak still requires
bypassing token issuance and the policy compiler to reach a *specific* tenant with
a *valid* scope filter. The two layers use structurally different failure domains
(application logic vs. storage-engine shard routing), so the same root cause
cannot defeat both at once.

## Recommended structure

```
policy/
  gateway-token.guard.ts        ← verifies JWT, pins issuer/audience, fails closed
  rag-policy.service.ts         ← Layer 1: assertOrganizationMatch, assertActorBinding,
                                   resolveAllowedScopes, assertRequestShape
adapters/backend/
  rag-backend-adapter.interface.ts   ← tenant key + allowedScopes always non-optional
  in-memory-rag-backend.adapter.ts   ← dev/test implementation
  weaviate-rag-backend.adapter.ts    ← Layer 2: .withTenant(...) + intra-tenant filter
adapters/embeddings/
  rag-embeddings-adapter.interface.ts ← self-provided vectors, decoupled from storage
```

## Non-negotiable invariants
- The hard tenant key is never taken from the request body — always from the
  verified token, at every layer that touches it.
- No adapter method may have an optional tenant key or optional allowed-scopes
  parameter. An optional one is a defect that reopens the single point of failure
  this pattern exists to close.
- No adapter re-derives the tenant key independently — it receives the same
  already-validated value the policy layer produced, end to end.
- Fail closed on any ambiguity (missing scope, unresolvable actor binding, missing
  secret) — never a silent fallback to "no filter" or "all scopes."
- Vectors are always self-provided (see
  [self-provided-embeddings](../decisions/self-provided-embeddings.md)) — the
  storage engine never receives raw text to embed server-side, so "what text was
  read by which embedding provider" stays inside the application boundary.
- Multi-tenancy alone (Layer 2) is never sufficient by itself — always pair it
  with the intra-tenant scope filter, or one compromised tenant-level credential
  exposes every scope within that tenant.

## Variants
| Scenario | Approach |
|---|---|
| Storage engine has shard-level native multi-tenancy (Weaviate) | Layer 2 gives physical isolation; intra-tenant filter still required |
| Storage engine only has payload-partitioning (Qdrant) | Layer 2 is logical, not physical — see [weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md); compensate with more exhaustive negative tests |
| Health/readiness probes | Must hit the storage engine's own readiness endpoint only — never a data-bearing query, or a probe silently becomes a cross-tenant read path |

## Common mistakes to check for when auditing an existing implementation
- A search/write method that accepts a query without a tenant key parameter "for
  internal/admin use" — this is a god-mode bypass that needs its own explicit,
  logged, narrowly-scoped role check, not an unguarded code path.
- Tenant resolution happening in two different places with two different sources
  (adapter reads the tenant key from the DTO body while the guard already
  validated it from the token) — these can drift apart.
- Expiry enforced only by a background cleanup job, with no active filter at
  query time — a chunk can be read for the entire gap between expiry and the next
  cleanup run.
- A collection created without native multi-tenancy enabled, with the tenant
  boundary reimplemented as an application-level filter instead — this silently
  downgrades Layer 2 from physical to logical isolation without anyone deciding
  to.

## Related skills
- [rag-weaviate-double-sandbox-bootstrap](../../skills/rag-weaviate-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](../../skills/rag-multitenancy-leakage-audit.md)

## Related knowledge
- [MULTITENANT_RAG_ARCHITECTURE](MULTITENANT_RAG_ARCHITECTURE.md)
- [weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md)
- [self-provided-embeddings](../decisions/self-provided-embeddings.md)
- [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
