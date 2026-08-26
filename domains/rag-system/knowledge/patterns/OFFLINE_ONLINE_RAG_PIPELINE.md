# Pattern: Separate Offline Build, Online Retrieval, and Generation Control

## Evidence status
Status: **Compatible extension**. The pattern generalizes production lessons
from an external search system and preserves the validated RAG trust and storage
boundaries in this package.

## Problem
Corpus embedding and live query retrieval may use the same model and index, but
they have different performance, cost, availability, retry, and audit needs.
Treating them as one synchronous pipeline couples throughput work to user-facing
latency and makes rebuilds difficult to inspect or roll back.

## Solution
Separate three logical planes. They may share a deployment in a small system,
but their contracts, state, and failure semantics remain distinct.

```text
Offline build plane             Online retrieval plane
authorized source export       trusted request
  -> normalize and chunk         -> policy compilation
  -> manifest and hash           -> lexical and/or query embedding
  -> document embeddings         -> scoped retrieval and fusion
  -> candidate index             -> optional reranking
             \                  /
              Generation control
       contracts, coverage, quality,
       activation, rollback, observability
```

## Offline build plane
Use it for full rebuilds, model or formatter changes, new chunking strategies,
and large backfills. Prefer:
- a stable build or generation identifier;
- bounded input and output units rather than loading the corpus at once;
- manifests containing counts, schemas, hashes, contract identifiers, and
  completion state;
- atomic output writes or completion markers;
- retry that resumes verified work instead of overwriting it;
- recorded throughput, failures, and resource use;
- import validation before production storage is changed.

Durable artifact storage is a capability, not a product requirement. It may be
object storage, a filesystem with appropriate durability, or another reviewable
handoff. A mutable store can host immutable run prefixes if the application
forbids overwriting a generation identifier and verifies checksums.

## Online retrieval plane
Keep only latency-sensitive work on the request path:
- verify the trusted caller and compile authorized tenant/scope parameters;
- embed the query when the selected mode requires it;
- retrieve lexical and/or dense candidates through the scoped backend;
- fuse and optionally rerank only authorized candidates;
- return provenance and generation identifiers with diagnostics where useful.

Protect optional online dependencies with deadlines, bounded concurrency,
response validation, short generation-aware caches, circuit breakers, and
observable fallback behavior.

## Incremental update path
Use a bounded path for new or changed documents when a full build would be
wasteful:
1. select or receive an authorized delta;
2. compute the normalized content hash;
3. skip content already materialized for the active contract;
4. chunk and embed in bounded batches;
5. recheck the source freshness token before writing;
6. discard stale work and retry from the new source revision;
7. record the update against the generation manifest or change ledger.

The RAG subsystem must not bypass its integration boundary to read the trusted
caller's private database. Snapshots and deltas arrive through a declared API,
event, or artifact exchange.

## Generation control plane
The control plane owns:
- embedding and chunking contracts;
- candidate and active generation state;
- coverage by tenant and scope;
- quality and anti-leakage gates;
- activation and rollback;
- operational metrics and audit events.

It does not own end-user authorization policy. Generation lookup and activation
must preserve the hard tenant boundary and require explicit administrative
authority.

## Small-system variant
A small deployment may run build and retrieval workers in one process and store
artifacts locally. It still keeps separate interfaces, queues or execution
paths, manifests, and generation state so later scaling does not change the
correctness model.

## Common pitfalls
- Making a long corpus rebuild part of an interactive request.
- Treating temporary compute output as the production handoff without manifests
  or checksums.
- Writing directly into the active index during a model or chunking migration.
- Retrying a build from the beginning when verified units already exist.
- Letting the offline worker read a caller-owned data store outside the declared
  integration contract.
- Describing a specific job runner or object store as a required architecture.

## Related patterns and decisions
- [MULTITENANT_RAG_ARCHITECTURE](MULTITENANT_RAG_ARCHITECTURE.md)
- [VERSIONED_EMBEDDING_GENERATIONS](VERSIONED_EMBEDDING_GENERATIONS.md)
- [atomic-embedding-generation-activation](../decisions/atomic-embedding-generation-activation.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
Specific hosted compute and storage products in the source are generalized here
into capability boundaries.
Retrieved: 2026-08-26
