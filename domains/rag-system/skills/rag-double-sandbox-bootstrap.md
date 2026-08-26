# Skill: RAG Double-Sandbox Bootstrap

## Description
Bootstraps a multi-tenant retrieval-augmented generation subsystem using the
[double-sandboxing pattern](../knowledge/patterns/DOUBLE_SANDBOXING.md): an
application-level, deny-by-default policy sandbox plus an independent
storage-level tenant sandbox. The procedure is architecture-neutral and is
expressed as capability contracts rather than framework, library, deployment,
or software-release requirements.

## Evidence status
The isolation sequence and adapter boundaries are a **validated reference**.
Versioned embedding generations, offline/online separation, hybrid retrieval,
and controlled degradation are **compatible extensions** and must pass the
target system's own quality and security gates before becoming defaults.

## Expected inputs
- The trusted caller that authenticates users and issues pre-authorized service
  credentials.
- The domain's hard tenant key and finer-grained scope dimensions.
- The selected storage engine's tenant-isolation capabilities.
- The document source and the authorized ingestion boundary.
- The embedding provider contract and operational constraints.
- The target platform's equivalents for request interception, dependency
  injection, validation, background work, configuration, and testing.

## Produced outputs
- A trust-boundary verifier for short-lived, audience-bound service credentials.
- A storage-independent policy compiler with denial tests.
- A capability-based retrieval-backend contract and a deterministic test adapter.
- A production storage adapter with an independent tenant boundary.
- A versioned, self-provided embeddings adapter.
- Separate ingestion/build and online retrieval flows.
- Optional hybrid retrieval and scoped availability fallback.
- Anti-leakage tests and a retrieval-quality benchmark plan.

## Steps / Procedure

### 1. Define the isolation vocabulary
Derive the hard tenant key and scope types from the target domain. Keep the hard
tenant key separate and mandatory even if the product currently exposes only
one scope type. Record actor bindings, retention behavior, and whether an
explicit cross-tenant administrative mode exists.

### 2. Establish the trusted-caller boundary
Require a short-lived, signed service credential on every call. Verify its
signature, issuer, audience, expiry, hard tenant key, actor identity, and
non-empty allowed-scope set. Missing verification configuration or ambiguous
claims must reject the request. Never derive the hard tenant key from an
untrusted request field.

### 3. Build the policy sandbox first
Implement a storage-independent policy component that:
- asserts tenant equality unless an explicit, auditable administrative mode is
  authorized;
- checks every actor-binding dimension;
- computes requested scopes intersected with credential-allowed scopes;
- rejects an empty result or malformed request;
- emits immutable, pre-authorized operation parameters.

Write denial tests against a stub before connecting production storage.

### 4. Define capability contracts
Use contracts equivalent to:

```text
RetrievalBackend
  index(chunks, authorizedContext, generation)
  retrieve(query, authorizedContext, generation, mode)
  delete(scope, authorizedContext)
  readiness()

EmbeddingsProvider
  contract()
  embedDocuments(texts)
  embedQuery(text)
```

The hard tenant key and allowed scopes are non-optional on every data operation.
The retrieval backend never calls the embeddings provider, and neither adapter
owns business authorization policy.

### 5. Implement a deterministic reference backend
Implement a small in-memory or otherwise deterministic backend before the
production adapter. It must support the same authorized parameters and make
policy, API, generation, and retrieval-mode tests reproducible without network
dependencies.

### 6. Implement the storage sandbox
Map the hard tenant key to the strongest independent isolation primitive the
selected store provides. Every operation must explicitly select that tenant or
partition and then apply the finer-grained scope and expiry filters. If the
store provides only shared-storage filtering, document that Layer 2 is logical
rather than physical and strengthen negative tests accordingly.

#### Concrete Weaviate example
For Weaviate, configure a multi-tenant collection with self-provided vectors.
Resolve the collection for the verified tenant on every read and write, then
apply an OR-of-ANDs filter over allowed scopes plus the active expiry filter.
Treat any data operation that can execute without explicit tenant selection as
a defect. Verify exact configuration and client syntax against the selected,
supported release rather than copying a release-specific snippet from this
package.

See
[storage-native-multitenancy-over-payload-filtering](../knowledge/decisions/storage-native-multitenancy-over-payload-filtering.md).

### 7. Implement the versioned embeddings contract
Self-provide vectors through a separate adapter. Pin and expose the model
identity, model revision, dimensions, normalization, input formatter, query and
document prompt roles, and generation identifier. Validate vector dimensions,
finiteness, and normalization before storage or search. See
[VERSIONED_EMBEDDING_GENERATIONS](../knowledge/patterns/VERSIONED_EMBEDDING_GENERATIONS.md).

### 8. Separate ingestion from online retrieval
Keep throughput-oriented document processing outside the latency-sensitive
query path. Use immutable build identifiers, manifests, content hashes, and
resumable units for large rebuilds; use bounded incremental ingestion for small
changes. For small systems these can share a process, but not their contracts or
failure semantics. See
[OFFLINE_ONLINE_RAG_PIPELINE](../knowledge/patterns/OFFLINE_ONLINE_RAG_PIPELINE.md).

### 9. Add retrieval modes deliberately
Preserve dense retrieval as a valid baseline. Add lexical and hybrid modes only
behind an explicit retrieval contract, with the same authorized context and
filters applied to every branch. Reranking may process only already-authorized
candidates. See
[HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](../knowledge/patterns/HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md).

### 10. Define safe dependency degradation
Authorization, tenant mapping, and scope ambiguity always fail closed. An
optional semantic or reranking dependency may degrade to an explicitly enabled,
scope-filtered retrieval mode. Never fabricate an empty vector or silently drop
authorization filters. See
[fail-closed-security-graceful-retrieval-degradation](../knowledge/decisions/fail-closed-security-graceful-retrieval-degradation.md).

### 11. Stage and activate generations safely
Build a candidate generation separately from the active one. Validate contract
compatibility, source freshness, coverage by tenant and scope, index readiness,
security tests, and retrieval quality before atomic activation. Keep the prior
generation available for bounded rollback. See
[atomic-embedding-generation-activation](../knowledge/decisions/atomic-embedding-generation-activation.md).

### 12. Enforce both test gates
Run the complete anti-leakage suite for every retrieval mode, including fallback
paths and adapter-only bypass tests. Then run
[rag-retrieval-quality-benchmark](rag-retrieval-quality-benchmark.md) before
promoting a new retrieval strategy or embedding generation.

### 13. Integrate without collapsing boundaries
The trusted caller owns user authentication, authorization policy inputs,
quota, and billing. The RAG subsystem owns technical scope enforcement,
ingestion, embeddings, retrieval, and generation state. Exchange data through a
declared API, event, or artifact contract; do not read the trusted caller's
private database directly.

## Key patterns
- Double sandboxing with independent application and storage failure domains.
- Capability contracts instead of framework- or vendor-defined interfaces.
- Self-provided, versioned embeddings.
- Offline/online/control-plane separation.
- Immutable candidate generations with atomic activation.
- Security fail-closed and availability degrade-gracefully.

## Common pitfalls to avoid
- Selecting libraries before defining isolation and generation contracts.
- Treating a product-specific tenant API as the architecture itself.
- Allowing one retrieval branch or fallback path to omit scope filters.
- Mixing vectors, chunks, or query embeddings from different generations.
- Rebuilding directly into the active index.
- Calling an implementation complete with only allow-path or relevance tests.

## Related skills
- [rag-multitenancy-leakage-audit](rag-multitenancy-leakage-audit.md)
- [rag-retrieval-quality-benchmark](rag-retrieval-quality-benchmark.md)

## Related knowledge
- [DOUBLE_SANDBOXING](../knowledge/patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [OFFLINE_ONLINE_RAG_PIPELINE](../knowledge/patterns/OFFLINE_ONLINE_RAG_PIPELINE.md)
- [VERSIONED_EMBEDDING_GENERATIONS](../knowledge/patterns/VERSIONED_EMBEDDING_GENERATIONS.md)
- [HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](../knowledge/patterns/HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md)

## Source
The isolation core was extracted from a validated reference implementation.
The compatible extensions synthesize lessons from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search),
adapted to preserve the package's multi-tenant trust boundary.
Date: 2026-08-26
