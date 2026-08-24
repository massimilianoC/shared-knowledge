# Domain: Multi-Tenant RAG — Token Claims and Chunk Data Model

## Context
Reference data model for a multi-tenant RAG subsystem built on the
[double-sandboxing pattern](../patterns/DOUBLE_SANDBOXING.md). Validated on a
NestJS + LangChain JS + Weaviate implementation; the field names are a starting
point to adapt to the target domain's own tenant/scope vocabulary, not to copy
verbatim.

## Gateway token claims
| Field | Type | Notes |
|---|---|---|
| organizationId | string | hard tenant boundary — never optional, never from the request body |
| userId | string | |
| actorType | string | |
| roles | string[]? | e.g. `super_admin` for explicit, auditable cross-org god-mode |
| allowedScopes | GatewayScope[] | intersected with requested scopes, never unioned |
| projectId | string? | present if the token is bound to one project |
| chatId | string? | present if the token is bound to one chat |
| agentId | string? | present if the token is bound to one agent |
| iat / exp | number | short TTL, ≤120s recommended |
| jti | string | |
| iss / aud | string / string[] | pinned at verification, not just checked for presence |

## Scope model
| scopeType | Use case | Lifecycle |
|---|---|---|
| org_knowledge_pack | Org-wide knowledge base (policies, docs shared org-wide) | Long-lived, versioned |
| user_project | User/team projects with ACL (owner/editor/reader at the gateway level) | Long-lived |
| chat_ephemeral | On-demand chat attachments | Short TTL, mandatory cleanup |

`GatewayScope = { scopeType, scopeId }`. Derive your own `scopeType` union from
the target product's real isolation boundaries — the three above are one
concrete instance, not a required set.

## Indexed chunk metadata (Weaviate collection properties)
| Field | Type | Notes |
|---|---|---|
| chunkId | text (field tokenization) | exact-match filter key |
| documentId | text (field tokenization) | exact-match filter key |
| text | text (default tokenization) | retrieved content, not a filter key |
| scopeType | text (field tokenization) | |
| scopeId | text (field tokenization) | |
| ownerUserId | text (field tokenization) | |
| documentName | text (field tokenization) | |
| retentionPolicy | text (field tokenization) | |
| createdAt | text (ISO string) | |
| expiresAt | text (ISO string) | far-future sentinel (`9999-12-31T23:59:59.999Z`) for "no expiry" instead of a nullable field, so `greaterThan(now)` applies uniformly |

Every chunk also carries the hard tenant key (`organizationId`) implicitly via
the Weaviate tenant it's written into — it is not a queryable property inside the
tenant, because the tenant boundary itself already enforces it (see
[weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md)).

## Common operational query shapes
```ts
// Ensure tenant exists (lazy onboarding, zero migration)
const existing = await collection.tenants.getByNames([organizationId]);
if (!existing[organizationId]) await collection.tenants.create([{ name: organizationId }]);

// Every read/write resolves the tenant explicitly
const tenantCollection = client.collections.get(collectionName).withTenant(organizationId);

// searchSimilar: OR-of-ANDs over allowed scopes, AND'd with an expiry filter
const scopeFilters = allowedScopes.map((scope) =>
  Filters.and(
    tenantCollection.filter.byProperty('scopeType').equal(scope.scopeType),
    tenantCollection.filter.byProperty('scopeId').equal(scope.scopeId),
  ),
);
const notExpired = tenantCollection.filter.byProperty('expiresAt').greaterThan(new Date());
const combinedFilter = Filters.and(Filters.or(...scopeFilters), notExpired);
```

## Related knowledge
- [DOUBLE_SANDBOXING](../patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md)

## Related skills
- [rag-weaviate-double-sandbox-bootstrap](../../skills/rag-weaviate-double-sandbox-bootstrap.md)

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/ARCHITECTURE_REFERENCE.md`, `inbox/rag-bootstrap-toolkit/skill/references/WEAVIATE_SETUP.md`
Date: 2026-07-01
