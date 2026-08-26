# Decision: Self-Provide Embeddings through an Independent Capability

## Evidence status
Status: **Validated reference** for the separation between embeddings and
storage. The strict generation contract is a linked **compatible extension**.

## Context
Many retrieval stores can call an embedding provider from inside the storage
pipeline. That convenience couples storage configuration to model selection and
moves raw, potentially sensitive document text across a less explicit trust
boundary.

## Decision
Compute document and query vectors through a separate, pluggable embeddings
capability. The retrieval backend receives already-computed vectors and
already-authorized metadata; it never calls an embeddings provider.

Use a contract equivalent to:

```text
EmbeddingsProvider
  contract()
  embedDocuments(texts)
  embedQuery(text)
```

The contract exposes dimensions and every compatibility input defined by
[VERSIONED_EMBEDDING_GENERATIONS](../patterns/VERSIONED_EMBEDDING_GENERATIONS.md).

## Why
- Keeps the movement of raw text within an explicit application-controlled
  boundary.
- Decouples storage selection from embedding model and provider selection.
- Makes deterministic, network-free test providers straightforward.
- Allows query and document calls to have different operational policies while
  preserving one compatible vector-space contract.
- Makes vector validation, privacy controls, cost accounting, and generation
  migration observable outside storage.

## Rejected alternative
Automatic storage-side vectorization is not the portable default because it
couples model configuration, raw-text handling, retry behavior, and generation
state to one backend. A target system may deliberately adopt it only after
documenting equivalent trust, audit, versioning, and migration guarantees.

## Consequences
- Production deployments operate and observe a separate embeddings capability.
- Storage migrations do not inherently require an embedding-provider change.
- Embedding migrations require explicit generation management rather than a
  hidden storage configuration update.
- Raw text exposure, provider failure, cost, and caching policy remain visible
  application concerns.

## Concrete Weaviate example
Configure a Weaviate collection to accept self-provided vectors and disable
automatic vectorization for the relevant vector space. The package does not pin
configuration syntax; adopters verify it against their selected supported
release.

## How to apply it
- Keep backend and embeddings capabilities behind separate factories or
  configuration bindings.
- Provide a deterministic test implementation and at least one production
  implementation.
- Bound production calls with deadlines and concurrency limits.
- Reject malformed dimensions, non-finite values, and invalid normalization.
- Never return a fabricated or empty vector on provider failure.
- Let the retrieval orchestrator decide whether an explicitly configured,
  authorized lexical fallback is safe; see
  [fail-closed-security-graceful-retrieval-degradation](fail-closed-security-graceful-retrieval-degradation.md).
- Include embedding generation in query-vector cache keys and diagnostics.

## Source
The separation decision was extracted from a validated reference implementation.
The strict generation contract is a compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
Date: 2026-08-26
