# Decision: Prefer Storage-Native Multi-Tenancy over Shared Payload Filtering

## Evidence status
Status: **Validated reference** for systems where tenant isolation is a primary
requirement. Product-specific implementation details are examples, not part of
the normative decision.

## Context
A multi-tenant retrieval system needs an independent storage-level backstop if
application policy is missed or implemented incorrectly. Storage engines expose
different isolation primitives: native tenants or partitions, dedicated
collections, shared indexes with payload filters, or combinations of these.

## Decision
When isolation is more important than minimum operational footprint, map the
hard tenant key to a storage-native tenant, partition, shard, namespace, or
equivalent isolation primitive. Apply finer-grained scope and expiry filters
inside that boundary.

Do not treat a shared-index payload predicate as equivalent to an independent
tenant boundary. If only logical filtering is available, record the reduced
isolation strength and require compensating controls and negative tests.

## Options considered

### Storage-native tenant or partition
- Gives the backend adapter an independent tenant-selection step.
- Reduces the chance that one omitted predicate exposes another tenant.
- May increase tenant lifecycle, capacity, or operational complexity.

### Dedicated collection or index per tenant
- Provides a strong boundary and simple reasoning for small tenant counts.
- Can become operationally expensive at high tenant cardinality.

### Shared index with payload filtering
- Usually simpler to operate and efficient for many small tenants.
- Makes isolation depend on every query and mutation carrying the correct
  predicate.
- Requires exhaustive adapter-level denial tests and stronger credential and
  network controls.

## Concrete Weaviate example
Weaviate exposes collection-level multi-tenancy. A reference adapter maps the
verified hard tenant key to a Weaviate tenant, explicitly selects that tenant on
every operation, and then applies scope and expiry filters within it. Vectors are
self-provided so the embedding trust boundary remains outside storage.

The package deliberately omits release-specific configuration and client syntax.
An adopter must verify tenant creation, tenant selection, filter behavior,
readiness, backup, and lifecycle semantics against the selected supported
release.

## Consequences
- The architecture is defined by isolation capabilities, not by a database
  product.
- A backend adapter must document whether its Layer 2 boundary is physical,
  logical, or operational.
- Replacing storage requires re-running the anti-leakage suite, including a test
  that bypasses the application policy layer.
- Native multi-tenancy does not replace intra-tenant scope filtering.

## How to apply it
- Record the hard tenant key and the exact native primitive it maps to.
- Make tenant and scope parameters non-optional on all data operations.
- Reject any adapter path capable of searching without tenant selection.
- Keep administrative cross-tenant operations outside ordinary retrieval
  contracts and require explicit, auditable authorization.
- Document compensating controls when the backend provides only logical
  partitioning.

## Related knowledge
- [DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [rag-tenant-scope-data-model](../domain/rag-tenant-scope-data-model.md)

## Source
The capability decision was extracted from a validated multi-tenant RAG
implementation. Weaviate is retained as a concrete reference example; its
product behavior is not generalized into a universal guarantee.
Date: 2026-08-26
