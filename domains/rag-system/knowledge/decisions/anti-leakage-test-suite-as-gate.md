# Decision: Anti-Leakage Tests Are a Mandatory Gate

## Evidence status
The double-sandbox isolation suite is a **validated reference**. Applying the
same suite to lexical, hybrid, generation, and fallback paths is a **compatible
extension** required when those capabilities are enabled.

## Context
A successful build and happy-path retrieval do not prove tenant isolation.
Policy and adapter defects are often one missing invocation, optional parameter,
or omitted filter away from cross-tenant exposure.

## Decision
Every implementation of
[DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md) ships with a fixed
anti-leakage suite required green before promotion or merge:

1. **Allow path**: same tenant and authorized scope retrieves indexed content.
2. **Cross-tenant deny**: another hard tenant cannot read, mutate, or delete it.
3. **Cross-actor-binding deny**: one case for every binding dimension.
4. **Scope-escalation deny**: requested scopes cannot exceed allowed scopes.
5. **Expiry deny**: expired content is excluded before physical cleanup.
6. **Readiness isolation**: readiness does not perform a user-data query.
7. **Ingest/retrieve consistency**: deterministic embeddings produce
   reproducible authorized results.
8. **Adapter-only deny**: bypass the policy component and prove the storage
   adapter still requires the correct tenant and scopes.
9. **Retrieval-mode parity**: lexical, dense, hybrid, reranked, and fallback
   modes apply identical authorization constraints when enabled.
10. **Generation isolation**: inactive, incomplete, or unauthorized generations
    cannot appear in ordinary retrieval.

## Why
- Denial cases are executable evidence for the isolation claim.
- The adapter-only case proves Layer 2 is independent rather than merely hidden
  behind a correct policy path.
- Retrieval-mode parity prevents a later optimization from adding an unfiltered
  branch.
- Generation isolation prevents migration state from becoming a new leakage or
  consistency boundary.

## Rejected alternative
Code review alone cannot prove that every endpoint, worker, backend method,
fallback, and retrieval mode preserves tenant selection and scope filtering.

## Consequences
- Every backend and retrieval mode carries a non-optional isolation test cost.
- A failed denial case blocks promotion even when relevance and latency improve.
- Storage replacements and generation migrations must reproduce the suite.
- Test fixtures need at least two tenants and enough scopes and actor bindings to
  exercise the real authorization model.

## How to apply it
- Write the core denial cases before production storage is connected.
- Reuse the same scenario matrix for every backend adapter.
- Add one case per real actor-binding dimension; do not use a single placeholder
  case when the domain has several.
- Run parity cases whenever a retrieval mode or fallback is added.
- Keep relevance benchmarks separate: higher quality never compensates for a
  failed isolation case.
- Do not report bootstrap, migration, or audit work complete while this gate is
  red.

## Related skills
- [rag-double-sandbox-bootstrap](../../skills/rag-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](../../skills/rag-multitenancy-leakage-audit.md)
- [rag-retrieval-quality-benchmark](../../skills/rag-retrieval-quality-benchmark.md)

## Source
The core suite was extracted from a validated reference implementation.
Retrieval-mode and generation cases are compatible extensions that protect the
same invariant as the package evolves.
Date: 2026-08-26
