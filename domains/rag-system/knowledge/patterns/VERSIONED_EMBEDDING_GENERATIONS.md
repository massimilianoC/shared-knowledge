# Pattern: Versioned Embedding Generations

## Evidence status
Status: **Compatible extension**. It is consistent with the validated
self-provided-embeddings boundary but has not been claimed as part of the
original reference installation.

## Problem
An embedding model name is not a complete compatibility contract. Retrieval can
degrade silently when the model revision, output dimensions, input formatter,
normalization, task prompt, or source content changes while stored vectors and
live query vectors are still treated as interchangeable.

## Solution
Treat every compatible vector space as an immutable, identified embedding
generation. Store and validate a contract equivalent to:

```text
EmbeddingGeneration
  generationId
  modelId
  modelRevision
  dimensions
  distanceMetric
  normalization
  inputFormatId
  queryPromptId
  documentPromptId
  chunkingStrategyId
  createdAt
```

The field names are illustrative. The invariant is that every input affecting
vector compatibility is explicit, immutable for the generation, and available
to ingestion, import, online query embedding, retrieval, and audit code.

## Per-chunk integrity metadata
Every indexed chunk should carry or be traceable to:
- `embeddingGenerationId`;
- `pipelineId` or `chunkingStrategyId`;
- a content hash over the exact normalized text sent for embedding;
- stable document and chunk identities;
- source revision or freshness token when the source supports one.

Generation-wide fields may live in a manifest or registry rather than being
duplicated on every object, provided retrieval can prove the association.

## Runtime invariants
1. Document and query vectors used together belong to the same generation.
2. Returned vectors have the declared dimensions and contain only finite values.
3. Required normalization is verified before indexing or search.
4. Query and document task roles cannot be swapped silently.
5. A formatter, prompt, model revision, dimension, or chunking change creates a
   candidate generation rather than mutating the active one in place.
6. Cache keys include the embedding generation; a model change cannot reuse
   stale query vectors.
7. Raw query text is not required in logs; use a privacy-preserving fingerprint
   when correlation is needed.

## Generation lifecycle
Use explicit states such as:

```text
declared -> building -> imported -> indexed -> verified -> active -> retired
```

Only one generation is authoritative for a given retrieval context unless a
deliberate evaluation mode names both. Never fuse chunks or scores across
generations merely because they have the same dimensions.

## Multi-tenant adaptation
A single global activation is safe only when coverage is complete for every
eligible tenant and scope. Large installations may activate per tenant or tenant
cohort, but the active-generation lookup must itself be authorized, auditable,
and fail closed on ambiguity.

## Common pitfalls
- Pinning a provider display name but not its immutable model revision.
- Treating equal dimensions as proof that two vector spaces are compatible.
- Hashing source documents before normalization while embedding normalized text.
- Reusing query-vector caches after a generation switch.
- Writing a new generation into the active namespace before validation.
- Copying a dimension chosen for another corpus without a local quality test.

## Related patterns and decisions
- [OFFLINE_ONLINE_RAG_PIPELINE](OFFLINE_ONLINE_RAG_PIPELINE.md)
- [HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md)
- [self-provided-embeddings](../decisions/self-provided-embeddings.md)
- [atomic-embedding-generation-activation](../decisions/atomic-embedding-generation-activation.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
The source demonstrates a versioned embedding contract in production; the
multi-tenant adaptation and package-level invariants are repository synthesis.
Retrieved: 2026-08-26
