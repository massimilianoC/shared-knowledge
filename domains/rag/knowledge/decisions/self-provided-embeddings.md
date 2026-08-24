# Decision: Self-provided embeddings, not server-side vectorization

## Problem
Most vector databases, including Weaviate, can compute embeddings server-side
from raw text if a vectorizer module is configured. Should the RAG subsystem let
the vector store embed text itself, or compute vectors in application code and
hand the store only the resulting vector?

## Decision
Always self-provide vectors. Configure the collection with
`vectorizers: weaviate.configure.vectors.selfProvided()` (and, belt-and-suspenders,
`DEFAULT_VECTORIZER_MODULE: "none"` at the Weaviate instance level). Embeddings are
computed by a separate, pluggable `RagEmbeddingsAdapter`; the vector store only
ever receives an already-computed vector plus already-authorized metadata.

```ts
export interface RagEmbeddingsAdapter {
  embedDocuments(texts: string[]): Promise<number[][]>;
  embedQuery(text: string): Promise<number[]>;
  dimensions: number;
}
```

## Why
- Keeps "what text got read by which embedding provider" fully inside the
  application boundary instead of delegating it to the vector store's own
  pipeline — this matters for auditability and for swapping embedding providers
  without touching the storage layer.
- Decouples the backend adapter from any specific embeddings API: the backend
  adapter's only responsibility is storing/filtering vectors, per the
  [double-sandboxing pattern](../patterns/DOUBLE_SANDBOXING.md)'s
  one-responsibility rule for the last-line technical guard.
- Makes a deterministic/stub embeddings implementation trivial to swap in for
  tests and CI (no network calls, reproducible output), because the adapter never
  cares how the vector was produced.

## Rejected alternative
Server-side vectorization (letting Weaviate — or any vector DB — embed raw text
on ingestion). Rejected because it hands raw, potentially sensitive document text
to a code path outside the RAG subsystem's own embeddings adapter, muddying the
audit boundary and coupling the storage engine's configuration to the choice of
embedding provider/model.

## How to apply it
- Never let the backend adapter call an embeddings provider directly, even for
  convenience — the two concerns must stay separate interfaces with separate
  factories/env vars (e.g. `RAG_BACKEND` vs `RAG_EMBEDDINGS_PROVIDER`).
- Provide at least two embeddings implementations: a deterministic stub (hash-based,
  no network) for tests/CI, and a production HTTP client with an explicit timeout
  and documented fail-closed behavior on provider errors (no silent
  empty-vector fallback).

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/DOUBLE_SANDBOXING.md`, `inbox/rag-bootstrap-toolkit/IMPLEMENTATION_GUIDE.md`
Date: 2026-07-01
