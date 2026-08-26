# Pattern: Hybrid Retrieval with Scoped Fallback

## Evidence status
Status: **Compatible extension**. Dense retrieval remains the validated baseline
for this package. Lexical, hybrid, fusion, reranking, and fallback behavior must
be benchmarked and security-tested in the target installation before becoming
defaults.

## Problem
Dense retrieval handles conceptual similarity but can underperform on exact
identifiers, rare names, filenames, and literal terminology. Lexical retrieval
has the opposite strengths. Adding both branches carelessly can duplicate
authorization logic, leak data through an unfiltered fallback, or create ranking
behavior that cannot be evaluated or reproduced.

## Solution
Compile authorization once, then pass the same immutable tenant, scope, expiry,
and generation context to every retrieval branch.

```text
trusted request
  -> policy compiler
  -> authorized retrieval context
       |-> lexical candidates --|
       |-> dense candidates -----|-> rank fusion -> optional reranker -> result
```

Each branch returns only authorized candidates. Fusion and reranking never act
as security filters and may not reintroduce excluded objects.

## Retrieval modes
- `lexical`: exact terms, identifiers, rare names, and a low-cost baseline.
- `dense`: semantic similarity through a generation-compatible query vector.
- `hybrid`: bounded candidates from both branches, combined by an explicit,
  observable fusion strategy.
- `hybrid_reranked`: hybrid candidates followed by a separately budgeted
  relevance model.

Mode selection is explicit in configuration or request policy. No availability
error silently changes authorization or expands the candidate corpus.

## Fusion
Prefer rank-based fusion when branch scores use incomparable scales; consider
normalized score fusion only when its behavior is measured on the target data.
Record branch weights, candidate limits, fusion method, and ranking configuration
as part of the retrieval strategy identifier.

Exact-identity rules may deterministically promote verified document identifiers
or canonical names before or after fusion. Keep exact-match fields separate from
fields tokenized for partial lexical search.

## Scoped availability fallback
If the query-embedding or reranking dependency is unavailable, the orchestrator
may use a configured lower-capability mode only when:
- authorization and scope compilation succeeded;
- the fallback backend applies the same tenant, scope, expiry, and generation
  constraints;
- no fabricated or empty vector is submitted;
- the fallback is observable in metrics and tracing;
- callers can distinguish degraded behavior when the product contract requires
  it.

Security failures, missing tenant mappings, empty allowed scopes, and ambiguous
generation state never fall back.

## Concrete Weaviate example
Weaviate can execute keyword, vector, and hybrid retrieval within a tenant and
accept self-provided query vectors. A Weaviate adapter should select the verified
tenant first and pass the same scope/expiry filter to lexical, vector, hybrid,
and fallback queries. Search fields and weights are schema decisions; exact
filter fields should not automatically double as partial-text search fields.

Verify supported fusion, filter, vector, and tenant behavior against the selected
release. The package does not make Weaviate's query syntax part of the portable
backend contract.

## Security and privacy constraints
- An external reranker receives only pre-authorized candidate text and metadata.
- Logs use query fingerprints or redaction where raw queries may contain tenant
  data.
- Query-vector caches include the embedding generation and appropriate privacy
  boundaries.
- Every mode participates in cross-tenant, cross-scope, expiry, and adapter-only
  negative tests.

## Common pitfalls
- Applying filters to the dense branch but not the lexical branch.
- Using fallback as a synonym for unscoped or global search.
- Copying fusion weights, candidate counts, or deadlines from another corpus.
- Comparing raw scores produced on incompatible scales without calibration.
- Sending an entire tenant corpus to an external reranker.
- Treating higher ANN recall as proof of higher end-to-end relevance.

## Related skills and decisions
- [rag-retrieval-quality-benchmark](../../skills/rag-retrieval-quality-benchmark.md)
- [fail-closed-security-graceful-retrieval-degradation](../decisions/fail-closed-security-graceful-retrieval-degradation.md)
- [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md)

## Source
Compatible extension synthesized from
[How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code](https://huggingface.co/blog/pwc-search).
The source's retrieval parameters are examples, not defaults for this package.
Retrieved: 2026-08-26
