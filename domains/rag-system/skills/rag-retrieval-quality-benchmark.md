# Skill: RAG Retrieval Quality Benchmark

## Description
Builds a reproducible, security-aware benchmark for comparing lexical, dense,
hybrid, reranked, chunking, and embedding-generation candidates. Use it before
promoting a retrieval strategy or embedding generation; do not infer target
quality from another corpus's metrics.

## Evidence status
Status: **Compatible extension**. The procedure operationalizes external search
lessons without declaring any model, vector dimension, fusion parameter, or
latency threshold universally optimal.

## Expected inputs
- A representative, access-controlled document corpus or immutable evaluation
  snapshot.
- A judged query set with expected relevant documents or chunks.
- The active retrieval strategy and one or more named candidates.
- Target-defined quality, latency, cost, and security acceptance criteria.
- Read access to generation manifests and retrieval diagnostics.

## Produced outputs
- A versioned evaluation dataset and run manifest.
- Per-strategy relevance, latency, resource, fallback, and coverage metrics.
- Results segmented by query and tenant/scope class.
- A recommendation to retain, shadow, promote, or reject a candidate, with
  explicit uncertainty and regressions.

## Steps / Procedure

1. **Freeze the evaluation contract.** Record corpus snapshot, query-set
   revision, judgments, metric definitions, candidate configurations, embedding
   generations, chunking strategies, and retrieval strategy identifiers.

2. **Build representative query classes.** Include exact identifiers and names,
   lexical terminology, conceptual queries, partial names, bounded misspellings,
   ambiguous queries, no-answer queries, and domain-specific navigational forms.

3. **Include security-negative cases.** Add queries whose relevant-looking
   content exists only in another tenant, disallowed scope, expired object, or
   inactive generation. A candidate failing isolation is rejected regardless of
   relevance gains.

4. **Establish baselines.** Run lexical-only and dense-only strategies before
   hybrid or reranked candidates. Use the same authorized context and candidate
   corpus for every comparable run.

5. **Measure retrieval quality.** Use target-appropriate metrics such as
   Recall@k, MRR, or nDCG. Report exact-match and semantic-query segments
   separately so aggregate gains do not hide regressions.

6. **Measure systems behavior.** Record end-to-end and backend latency
   percentiles, index size, memory or storage use, embedding throughput, online
   dependency error rate, fallback rate, and reranker overhead.

7. **Test robustness.** Exercise provider timeouts, malformed vectors, cold or
   unavailable optional dependencies, generation changes, and cache invalidation.
   Confirm all degraded paths preserve tenant and scope filters.

8. **Compare candidates against declared gates.** Do not promote a candidate
   because one metric improved. Evaluate quality, latency, cost, coverage,
   operational complexity, and security together.

9. **Publish reproducible evidence.** Store the run manifest, aggregate results,
   per-query diagnostics subject to privacy policy, known limitations, and the
   promotion decision. Keep raw tenant content out of shared reports unless it
   is explicitly authorized and sanitized.

## Key patterns
- Compare against cheap baselines before adding complexity.
- Segment metrics by query class and tenant/scope behavior.
- Tie every result to immutable corpus, query-set, generation, and strategy IDs.
- Treat relevance metrics and approximate-index recall as different measures.
- Keep the anti-leakage gate independent and mandatory.

## Common pitfalls to avoid
- Copying vector dimensions, branch weights, candidate counts, or deadlines from
  a different corpus.
- Using approximate-nearest-neighbor recall as a substitute for relevance.
- Evaluating only successful semantic queries and omitting provider failures.
- Comparing strategies with different authorized candidate corpora.
- Reporting an average that hides exact-match or cross-scope regressions.
- Promoting a candidate without a reproducible run manifest.

## Related skills
- [rag-double-sandbox-bootstrap](rag-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](rag-multitenancy-leakage-audit.md)

## Related knowledge
- [HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](../knowledge/patterns/HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md)
- [VERSIONED_EMBEDDING_GENERATIONS](../knowledge/patterns/VERSIONED_EMBEDDING_GENERATIONS.md)
- [atomic-embedding-generation-activation](../knowledge/decisions/atomic-embedding-generation-activation.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
The benchmark procedure is repository synthesis designed to prevent external
case-study parameters from becoming unverified defaults.
Retrieved: 2026-08-26
