# RAG: Multi-Tenant Retrieval-Augmented Generation

Reusable package for designing or auditing multi-tenant RAG systems with explicit tenant isolation and anti-leakage verification.

## Start here

1. Read [`knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md`](knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md).
2. Bootstrap with [`skills/rag-weaviate-double-sandbox-bootstrap.md`](skills/rag-weaviate-double-sandbox-bootstrap.md).
3. Validate with [`skills/rag-multitenancy-leakage-audit.md`](skills/rag-multitenancy-leakage-audit.md).
4. Use [`agents/rag-bootstrap-architect.md`](agents/rag-bootstrap-architect.md) when both activities are needed.

## Package contents

- Two patterns define the trust boundary and isolation model.
- Three decisions record storage, embedding, and test-gate choices.
- One domain model describes tenant, scope, and chunk metadata.
- Two complementary skills support bootstrap and audit.

## Selective import

For an audit, import the audit skill and its linked knowledge. For a complete implementation, import the bootstrap agent and all included skills. Copy the full `rag/` package when dependency boundaries are uncertain. Adapt database, embedding, and access-control choices to the target environment while retaining independent application and storage-level tenant isolation.
