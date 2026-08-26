# Decision: Build Embedding Generations Beside Production and Activate Atomically

## Evidence status
Status: **Compatible extension**. The decision extends the validated shadow-mode
rule but is not claimed as part of the original reference installation.

## Context
Changing an embedding model, formatter, dimensions, prompt roles, normalization,
or chunking strategy can make new and old vectors incompatible. Rebuilding
directly into the active index creates partial coverage, mixed generations, and
an expensive rollback path.

## Decision
Build every incompatible candidate generation beside the active generation.
Import and index it independently, verify it, then switch an explicit active
pointer atomically. Retain the prior generation for a bounded rollback window.

Activation requires:
- a complete and immutable embedding contract;
- verified artifact schemas and checksums;
- current source hashes or freshness tokens;
- expected coverage by tenant and scope;
- storage index readiness;
- the anti-leakage suite for all enabled retrieval modes;
- target-defined retrieval-quality and latency gates.

## Options considered

### In-place rebuild
Rejected for incompatible changes because queries observe partial state and
rollback requires recomputation or restoration.

### Mixed generations in one result set
Rejected because vector scores and chunks may not be comparable, even when
dimensions happen to match.

### Shadow computation without candidate persistence
Retained as the lowest-risk first migration stage. It supports comparison but
cannot prove candidate-index readiness or provide atomic activation.

### Isolated candidate generation with an active pointer
Chosen because validation and rollback are explicit state changes rather than
emergency data operations.

## Consequences
- Candidate generations require additional temporary storage and lifecycle
  management.
- Activation becomes an auditable control-plane operation rather than an
  incidental import side effect.
- Coverage and quality evidence must be produced before promotion.
- Rollback is fast while the prior generation is retained, but retention must be
  bounded by cost and data-lifecycle policy.

## Multi-tenant consequences
- Global activation requires complete eligible coverage across all tenants.
- Per-tenant or cohort activation is allowed when the active-generation mapping
  is authorized, auditable, deterministic, and fails closed.
- Candidate collections, namespaces, partitions, or named vector spaces must
  preserve the same storage-level tenant isolation as production.
- Generation administration is not an ordinary cross-tenant search operation.

## Storage-neutral implementation
The active pointer may be an application configuration record, an alias, a
registry entry, or another atomic routing primitive. The contract requires an
atomic, observable switch and bounded rollback; it does not require a specific
database feature.

## How to apply it
1. Declare a generation and freeze its contract.
2. Build immutable, checksummed artifacts.
3. Import into an isolated target.
4. Verify coverage, freshness, security, quality, and readiness.
5. Activate through one audited state transition.
6. Monitor generation-specific metrics.
7. Roll back by restoring the prior pointer if acceptance criteria regress.
8. Retire old artifacts only after the rollback window and retention policy.

## Related knowledge
- [VERSIONED_EMBEDDING_GENERATIONS](../patterns/VERSIONED_EMBEDDING_GENERATIONS.md)
- [OFFLINE_ONLINE_RAG_PIPELINE](../patterns/OFFLINE_ONLINE_RAG_PIPELINE.md)
- [MULTITENANT_RAG_ARCHITECTURE](../patterns/MULTITENANT_RAG_ARCHITECTURE.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
Retrieved: 2026-08-26
