# Skill: RAG Multi-Tenancy Leakage Audit

## Description
Audits a retrieval or vector-search implementation for cross-tenant and
cross-scope exposure against the
[double-sandboxing pattern](../knowledge/patterns/DOUBLE_SANDBOXING.md). The audit
is capability-based and applies across frameworks, storage engines, deployment
topologies, retrieval modes, and embedding providers.

## Evidence status
The core policy and storage checks are a **validated reference**. Generation,
hybrid retrieval, and scoped fallback checks are **compatible extensions** used
only when those capabilities exist.

## Expected inputs
- Read access to trust-boundary, policy, retrieval, embeddings, generation, and
  storage-adapter code and configuration.
- The domain's intended hard tenant key, scopes, actor bindings, retention, and
  administrative exceptions.
- The selected backend's documented tenant-isolation capabilities.
- The enabled retrieval modes and generation lifecycle.

## Produced outputs
- Prioritized findings with a concrete actor/request/data exploitation scenario.
- Evidence identifying the affected path and failed isolation layer.
- Severity and confidence per finding.
- A recommendation to block, defer with stated risk, or accept the design.
- A coverage matrix across backends, retrieval modes, fallbacks, and generations.

## Steps / Procedure

1. **Locate the trusted-caller boundary.** Confirm the service credential is
   mandatory; signature, issuer, audience, expiry, tenant, actor, and non-empty
   allowed scopes are verified; missing security configuration rejects.

2. **Locate the policy compiler.** Confirm it has no storage dependency and:
   - derives the hard tenant key from verified claims;
   - checks every actor-binding dimension;
   - intersects rather than unions requested and allowed scopes;
   - rejects empty or ambiguous authorization;
   - runs before every online and offline data operation.

3. **Inspect capability contracts.** Tenant and allowed scopes must be
   non-optional on every data method. Readiness must not query tenant data. The
   backend must not call an embeddings provider or own business policy.

4. **Audit the storage sandbox.** Identify the actual tenant primitive and
   classify it as physical, logical, or operational. Verify every search, read,
   write, batch, update, and delete explicitly selects the tenant or partition
   and applies intra-tenant scope and expiry filters. Inspect administrative and
   maintenance paths separately.

5. **Audit every retrieval mode.** Dense, lexical, hybrid, reranked, and fallback
   paths must receive the same immutable authorized context. Fusion and reranking
   may process only candidates already filtered by tenant and scope.

6. **Audit embeddings and caches.** Confirm embeddings are a separate capability;
   malformed vectors are rejected; cache keys include generation identity; raw
   query handling follows privacy policy; provider failure cannot fabricate a
   vector or invoke an unscoped fallback.

7. **Audit generation state.** Confirm incompatible generations cannot mix,
   inactive candidates cannot serve ordinary traffic, activation is explicit,
   and per-tenant generation lookup fails closed on ambiguity.

8. **Audit tests.** Walk the full matrix in
   [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md),
   especially the adapter-only bypass and retrieval-mode parity cases.

9. **Prioritize findings.** Use these defaults:
   - **Critical**: policy bypass, data operation without tenant selection,
     unscoped fallback, or cross-tenant administrative path.
   - **High**: tenant selected but intra-tenant scopes or expiry omitted; inactive
     generation exposed; external reranker receives unauthorized candidates.
   - **Medium**: missing independent tests or observability for an otherwise
     enforced boundary.

10. **Report exploitation scenarios.** State the actor, credential binding,
    requested tenant/scope/mode, reachable code path, and exposed data. Do not
    report only the violated rule.

## Concrete Weaviate audit example
For a Weaviate adapter, verify that the collection is multi-tenant, vectors are
self-provided, and every data operation selects the verified Weaviate tenant
before applying allowed-scope and expiry filters. Mechanically inspect all
collection access paths for operations that can execute without tenant
selection. Verify exact API and configuration behavior against the selected
supported release rather than assuming a copied snippet is current.

## Key patterns
- Mechanically enumerate every adapter call and retrieval mode.
- Verify the two sandbox layers independently.
- Treat fallback and maintenance paths as production data paths.
- Describe exploitability, not stylistic nonconformance.

## Common pitfalls to avoid
- Accepting “multi-tenancy enabled” without examining scope filters.
- Auditing only dense retrieval after lexical or hybrid search is added.
- Ignoring offline import, cleanup, and generation activation code.
- Treating an optional tenant parameter as a minor typing concern.
- Assuming a backend product guarantees more isolation than its configured
  primitive actually provides.
- Silently fixing a critical isolation defect without reporting its scenario.

## Related skills
- [rag-double-sandbox-bootstrap](rag-double-sandbox-bootstrap.md)
- [rag-retrieval-quality-benchmark](rag-retrieval-quality-benchmark.md)

## Related knowledge
- [DOUBLE_SANDBOXING](../knowledge/patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md)
- [HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](../knowledge/patterns/HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md)
- [VERSIONED_EMBEDDING_GENERATIONS](../knowledge/patterns/VERSIONED_EMBEDDING_GENERATIONS.md)

## Source
The core audit procedure was extracted from a validated reference
implementation. Retrieval-mode and generation checks are compatible extensions.
Date: 2026-08-26
