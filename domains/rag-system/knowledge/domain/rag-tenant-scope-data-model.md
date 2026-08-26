# Domain: Multi-Tenant RAG Authorization, Chunk, and Generation Model

## Evidence status
The tenant, scope, actor-binding, retention, and core chunk fields are a
**validated reference**. Generation, pipeline, and content-integrity fields are
**compatible extensions** derived from the retrieval-lifecycle review.

## Context
This is a storage- and framework-neutral reference model for the
[double-sandboxing pattern](../patterns/DOUBLE_SANDBOXING.md). Field names are
examples to adapt to the target domain; their security roles and relationships
are the portable contract.

## Trusted service credential

| Field role | Example shape | Notes |
|---|---|---|
| Hard tenant key | string | Mandatory; derived from verified claims, never trusted from request data |
| Actor identity and type | string values | Identifies the authorized caller context |
| Roles | optional list | Cross-tenant administrative authority must be explicit and auditable |
| Allowed scopes | list of scope pairs | Intersected with requested scopes, never unioned |
| Actor bindings | optional identifiers | Project, conversation, agent, session, or domain equivalents |
| Issued and expiry times | timestamps | Short-lived credential with enforced expiry |
| Unique token identifier | string | Supports audit and replay controls |
| Issuer and audience | strings | Pinned during verification |

## Scope model

```text
Scope
  scopeType
  scopeId
```

Common examples include organization-wide knowledge, project knowledge, and
ephemeral conversation attachments. These are not a required enumeration. Scope
types come from the target product's actual isolation and lifecycle boundaries.

## Indexed chunk model

| Field role | Example field | Evidence | Notes |
|---|---|---|---|
| Stable chunk identity | `chunkId` | Validated | Exact-match identity |
| Stable document identity | `documentId` | Validated | Exact-match identity |
| Retrieved content | `text` | Validated | Searchable content, not an authorization field |
| Scope discriminator | `scopeType`, `scopeId` | Validated | Mandatory intra-tenant filter |
| Owner or actor metadata | `ownerActorId` | Validated | Domain-specific audit and policy context |
| Display name | `documentName` | Validated | Keep exact and partial-search representations separate when needed |
| Retention class | `retentionPolicy` | Validated | Drives cleanup behavior |
| Creation and expiry | `createdAt`, `expiresAt` | Validated | Expiry remains an active retrieval filter until deletion |
| Pipeline identity | `pipelineId` | Extension | Separates incompatible chunking and ingestion paths |
| Chunking strategy | `chunkingStrategyId` | Extension | Identifies formatter and splitter behavior |
| Embedding generation | `embeddingGenerationId` | Extension | Associates the chunk with one vector space |
| Normalized content hash | `contentHash` | Extension | Hash of the exact text sent for document embedding |
| Source freshness token | `sourceRevision` | Extension | Detects work made stale during processing |

The hard tenant key may be stored as metadata, encoded in the storage tenant or
partition, or both. It is always mandatory in the authorized operation context,
even when the storage boundary makes it implicit on the indexed object.

## Authorized retrieval context

```text
AuthorizedRetrievalContext
  hardTenantKey
  allowedScopes[]
  actorBindings
  activeGenerationId
  currentTime
```

The policy compiler creates this immutable context. Dense, lexical, hybrid,
reranked, fallback, delete, and offline mutation paths all consume the same
tenant and scope constraints.

## Portable filter shape

```text
tenantBoundary = selectTenant(hardTenantKey)
scopeFilter = OR over allowed scopes of (scopeType AND scopeId)
freshnessFilter = expiresAt is absent or expiresAt is after currentTime
generationFilter = object belongs to activeGenerationId when generations share storage
effectiveFilter = scopeFilter AND freshnessFilter AND generationFilter
```

Use a non-null expiry sentinel only when the selected store benefits from it and
the behavior is verified. The portable invariant is active exclusion of expired
content, not a particular representation.

## Concrete Weaviate example
For a multi-tenant Weaviate collection, the hard tenant key selects the Weaviate
tenant before the query runs. The object properties hold scope, expiry,
identity, content, and generation metadata. The query applies the OR-of-ANDs
scope filter plus expiry and, when generations share a collection, the explicit
generation filter. Exact configuration, tokenization, and client syntax remain
implementation concerns verified against the selected supported release.

## Related knowledge
- [DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [VERSIONED_EMBEDDING_GENERATIONS](../patterns/VERSIONED_EMBEDDING_GENERATIONS.md)
- [storage-native-multitenancy-over-payload-filtering](../decisions/storage-native-multitenancy-over-payload-filtering.md)

## Related skills
- [rag-double-sandbox-bootstrap](../../skills/rag-double-sandbox-bootstrap.md)

## Source
Core fields were extracted from a validated multi-tenant RAG implementation.
Generation and integrity fields are compatible extensions and are labeled as
such rather than retroactively attributed to the reference installation.
Date: 2026-08-26
