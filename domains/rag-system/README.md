# RAG System: Architecture-Neutral Multi-Tenant Retrieval

Reusable knowledge package for designing, implementing, evolving, and auditing
multi-tenant retrieval-augmented generation systems. The package defines
capability and trust contracts rather than framework, product, deployment, or
software-release requirements.

Weaviate is retained as a concrete example of storage-native multi-tenancy. It
is not a required backend, and release-specific configuration must be verified
by each adopting project.

## Evidence model

### Validated reference core
- Trusted-caller service credential boundary.
- Deny-by-default tenant and scope policy compiler.
- Independent storage tenant sandbox with intra-tenant filters.
- Self-provided embeddings separated from storage.
- Shadow migration without mixed pipeline output.
- Mandatory anti-leakage tests.

### Compatible extensions
- Versioned embedding generations.
- Separate offline build, online retrieval, and generation control.
- Lexical and hybrid retrieval with scoped fallback.
- Candidate generations with atomic activation and rollback.
- Reproducible retrieval-quality benchmarking.

These extensions are architecturally compatible and externally evidenced, but
are not retroactively claimed as features of the original reference
installation.

### Experimental choices
Embedding models, vector dimensions, distance metrics, chunk sizes, fusion
weights, candidate counts, deadlines, cache policies, rerankers, index tuning,
and infrastructure products remain target-specific hypotheses until benchmarked.

## Start here
1. Read
   [`knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md`](knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md).
2. Understand the independent boundaries in
   [`knowledge/patterns/DOUBLE_SANDBOXING.md`](knowledge/patterns/DOUBLE_SANDBOXING.md).
3. Bootstrap with
   [`skills/rag-double-sandbox-bootstrap.md`](skills/rag-double-sandbox-bootstrap.md).
4. Validate isolation with
   [`skills/rag-multitenancy-leakage-audit.md`](skills/rag-multitenancy-leakage-audit.md).
5. Evaluate retrieval changes with
   [`skills/rag-retrieval-quality-benchmark.md`](skills/rag-retrieval-quality-benchmark.md).
6. Use [`agents/rag-bootstrap-architect.md`](agents/rag-bootstrap-architect.md)
   when the complete workflow is needed.

## Package contents
- Five patterns cover isolation, the portable RAG boundary, embedding
  generations, offline/online separation, and secure hybrid retrieval.
- Five decisions record storage isolation, embeddings, security tests,
  generation activation, and availability degradation.
- One domain model defines authorization, chunk, retention, and generation data.
- Three skills cover bootstrap, leakage audit, and retrieval benchmarking.
- One agent composes the complete workflow.

## Adoption rules
- Preserve the whole tenant and scope boundary when translating the package.
- Map capabilities to the target platform instead of copying example syntax.
- Classify storage isolation as physical, logical, or operational.
- Verify selected software releases from current authoritative documentation;
  this package intentionally carries no software-release pins.
- Keep compatible extensions labeled until the target implementation passes its
  own security, coverage, quality, latency, and rollback gates.
- Never let a retrieval optimization weaken the anti-leakage invariants.

## Selective import
For an isolation audit, import the audit skill and its linked validated
knowledge. For a bootstrap, import the bootstrap skill and both core patterns.
For retrieval evolution, add the benchmark skill plus the generation, pipeline,
hybrid, activation, and degradation artifacts. Copy the full package when the
dependency boundary is uncertain.

## External evidence

### RAG development guideline update source

The compatible extensions and the 2026-08-26 revision of these RAG development
guidelines were informed by:

> Niels Rogge, “How Hugging Face Inference Endpoints, Jobs, and Buckets Power
> Search on Papers with Code,” *Hugging Face Blog*, published 2026-08-21.

- [Published article](https://huggingface.co/blog/pwc-search)
- [Source document](https://github.com/huggingface/blog/blob/main/pwc-search.md)
- Retrieved: 2026-08-26

The source is used as production engineering evidence for versioned embedding
contracts, offline/online workload separation, immutable build artifacts,
hybrid retrieval, controlled fallback, incremental updates, and atomic
generation activation. Its hosted compute, object storage, relational database,
embedding model, dimensions, ranking parameters, and operational thresholds are
not adopted as package defaults.

This citation documents the provenance of the guideline update. It does not
replace or retroactively alter the validated reference implementation that
supports the package's isolation core.
