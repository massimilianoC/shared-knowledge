# Decision: Fail Closed for Security, Degrade Gracefully for Optional Retrieval Capabilities

## Evidence status
Status: **Compatible extension**. It clarifies, rather than weakens, the
validated fail-closed security rule.

## Context
A retrieval system depends on authorization, storage, query embeddings, lexical
indexes, fusion, and optional rerankers. Treating every failure identically can
either make optional dependencies unnecessarily fatal or, worse, turn a security
failure into an unsafe fallback.

## Decision
Classify failures by the invariant they affect:

| Failure class | Required behavior |
|---|---|
| Invalid credential, tenant, scope, actor binding, or generation mapping | Reject; no fallback |
| Missing security configuration | Reject; no fallback |
| Storage tenant selection or mandatory filter failure | Reject; no fallback |
| Malformed query vector | Do not execute the semantic branch |
| Optional embedding dependency unavailable | Use an explicitly enabled scoped lexical mode, or return an availability error |
| Optional reranker unavailable | Return the already-authorized pre-rerank order, or return an availability error |

Graceful degradation is allowed only after authorization succeeds and only to a
mode that preserves the same tenant, scope, expiry, retention, and generation
constraints.

## Options considered

### Fail every dependency error
Safe but unnecessarily couples availability to optional semantic or reranking
capabilities when an authorized lower-capability mode could still serve value.

### Fallback on every error
Rejected because authorization, tenant, scope, filter, or generation failures
must never become broader retrieval.

### Classify failures and allow only scoped capability degradation
Chosen because it preserves security invariants while making optional
dependencies operationally replaceable.

## Consequences
- The embeddings adapter still fails instead of returning a fabricated or empty
  vector.
- The retrieval orchestrator, not the embeddings adapter, decides whether a
  safe lower-capability mode exists.
- Fallback behavior is explicit configuration, observable, and tested.
- Products requiring strict semantic behavior may disable fallback and return a
  controlled availability error.

## Operational controls
- Bound optional calls with deadlines and concurrency limits.
- Validate response dimensions, finiteness, and required normalization.
- Use short, generation-aware caches where privacy policy permits.
- Open a circuit breaker after repeated dependency failures.
- Record fallback rate, reason, latency, and active generation without logging
  sensitive raw queries.

## Test requirements
- Prove fallback returns only allowed tenant and scope data.
- Prove an authorization failure never reaches fallback.
- Prove a malformed vector is never sent to storage.
- Prove reranker failure cannot expand or replace the candidate set.
- Prove degraded responses are observable according to the product contract.

## How to apply it
1. Enumerate failures at every trust, embedding, retrieval, fusion, reranking,
   storage, and generation boundary.
2. Classify each as security-critical, mandatory-capability, or optional-capability.
3. Define the only permitted lower-capability mode for each optional failure.
4. Verify that the fallback consumes the same authorized context.
5. Add metrics, tracing, and the required denial tests before enabling it.

## Related knowledge
- [HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](../patterns/HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md)
- [DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md)
- [self-provided-embeddings](self-provided-embeddings.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search),
adapted so availability fallback cannot bypass the package's security boundary.
Retrieved: 2026-08-26
