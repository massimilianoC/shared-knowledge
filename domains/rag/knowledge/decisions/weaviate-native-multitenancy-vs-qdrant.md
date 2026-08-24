# Decision: Weaviate native multi-tenancy over Qdrant payload-partitioning

## Problem
A multi-tenant RAG subsystem needs the storage-layer half of the
[double-sandboxing pattern](../patterns/DOUBLE_SANDBOXING.md) — Layer 2, the
physical/at-storage isolation. Which vector database's multi-tenancy model
actually delivers physical isolation, versus which one only delivers a filtered
query on shared storage?

## Decision
Prefer Weaviate with native multi-tenancy (`multiTenancy: { enabled: true }`,
`organizationId` mapped 1:1 to a Weaviate **tenant** = physically separate shard)
whenever the project's stated priority is **data isolation correctness over
latency/throughput or minimal ops footprint**.

```ts
await client.collections.create({
  name: collectionName,
  multiTenancy: weaviate.configure.multiTenancy({ enabled: true }),
  vectorizers: weaviate.configure.vectors.selfProvided(),
  properties: [ /* chunkId, documentId, text, scopeType, scopeId, ... */ ],
});

// Every operation resolves the tenant explicitly — no exceptions:
const tenantCollection = client.collections.get(collectionName).withTenant(organizationId);
```

## Why
- Weaviate's multi-tenancy is **shard-level physical isolation**, not a `WHERE`
  clause on shared storage. A credential leak or a policy-layer bug still has to
  land on a *specific* tenant/shard, not "any row matching a filter that might be
  wrong."
- Tenants are created lazily (`ensureTenant`), so onboarding a new organization
  requires zero migration.
- This directly serves the reference project's ADR-level priority: "sandboxing
  and privacy, not generic chatbot speed."

## Rejected alternative
Qdrant, when moderate tenant cardinality and ops-simplicity are the priority.
Qdrant's multitenancy is **payload-partitioning on shared storage**, not
shard-level physical isolation — it relies more heavily on the application always
sending the correct filter on every query. It is a legitimate choice when
isolation-by-physical-shard is not required, but it is a **weaker Layer 2
guarantee**: a filter-building bug degrades all the way to "no isolation" instead
of "no isolation for one tenant, still shard-isolated from all others."

## How to apply it
- Default to Weaviate whenever the project brief states isolation/compliance as
  the top requirement (regulated data, per-org contractual isolation guarantees).
- If Qdrant is chosen anyway (lower tenant cardinality, cost/ops priority),
  compensate explicitly: write more exhaustive negative tests on the
  filter-building code, and document the weaker guarantee rather than assuming
  Weaviate-equivalent isolation — do not let the choice pass silently as
  equivalent.
- Either way, Layer 2 is never sufficient alone — pair it with Layer 1 (see
  [DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md)).

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/DOUBLE_SANDBOXING.md`, `inbox/rag-bootstrap-toolkit/ARCHITECTURE_REFERENCE.md`
Date: 2026-07-01
