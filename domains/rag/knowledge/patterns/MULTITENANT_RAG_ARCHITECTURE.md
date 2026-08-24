# Pattern: Multi-Tenant RAG Service Architecture

## Problem
How do you build a Retrieval-Augmented Generation subsystem as a standalone,
independently deployable service — instead of folding it into a monolith or core
gateway — while keeping strict per-tenant data isolation as the top priority
(ahead of latency or minimal operational footprint)?

## Solution

### Separate the RAG service from the auth/gateway boundary
- **Gateway (authoritative):** authentication, authorization business rules,
  licensing/quota, central audit.
- **RAG service (specialized):** document parsing/chunking, embedding, indexing,
  scope-aware retrieval, **technical** sandbox enforcement.

The RAG subsystem has **no public authentication of its own** — only a
service-to-service trust boundary with whoever the trusted caller is (a gateway, a
monolith's internal module, a BFF). This is what makes the pattern portable: the
RAG subsystem never re-implements user auth, it only verifies a short-lived,
pre-authorized token issued by the trusted caller.

### The trust boundary: gateway-issued service token
Every internal RAG call carries a signed JWT, verified with pinned
issuer/audience, short TTL (≤120s recommended):

```ts
export type RagScopeType = 'org_knowledge_pack' | 'user_project' | 'chat_ephemeral';

export interface GatewayScope {
  scopeType: RagScopeType;
  scopeId: string;
}

export interface GatewayTokenClaims {
  organizationId: string;   // hard tenant boundary — never optional
  userId: string;
  actorType: string;
  roles?: string[];         // e.g. 'super_admin' for cross-org god-mode
  allowedScopes: GatewayScope[];
  projectId?: string;       // present if token is bound to one project
  chatId?: string;          // present if token is bound to one chat
  agentId?: string;         // present if token is bound to one agent
  iat?: number;
  exp: number;
  jti: string;
  iss?: string;
  aud?: string | string[];
}
```

Verification: `jwt.verify(token, secret, { issuer, audience })`, then a mandatory
claims check (hard tenant key, user id, non-empty `allowedScopes`) before the
request reaches any controller. Missing secret ⇒ reject. Invalid/expired token ⇒
reject. No fallback, no anonymous path.

### The scope model
Derive scope types from the **target product's actual isolation boundaries** —
don't transplant someone else's scope enum verbatim. The reference implementation
uses three, each with a distinct lifecycle:

| `scopeType` | Use case | Lifecycle |
|---|---|---|
| `org_knowledge_pack` | Org-wide knowledge base (policies, docs shared org-wide) | Long-lived, versioned |
| `user_project` | User/team projects with ACL (owner/editor/reader at the gateway level) | Long-lived |
| `chat_ephemeral` | On-demand chat attachments | Short TTL, mandatory cleanup |

Every indexed chunk carries the hard tenant key + `scopeType` + `scopeId` +
`ownerUserId` + optional actor bindings (`projectId`/`chatId`/`agentId`) +
`retentionPolicy`. The hard tenant key is always a separate, mandatory field —
never folded into `scopeId`.

### Backend adapter contract (pluggable storage)
```ts
export interface RagBackendAdapter {
  indexChunks(chunks: ChunkToIndex[]): Promise<void>;
  searchSimilar(params: ScopedSearchParams): Promise<ScoredChunk[]>;
  deleteByScope(params: ScopedDeleteParams): Promise<{ deletedCount: number }>;
  isReady(): Promise<boolean>;
}
```
Contract rules (load-bearing, not decorative — a reviewer should reject a PR that
violates them):
- The adapter receives only pre-authorized, policy-compiled parameters; the hard
  tenant key and `allowedScopes` are always present, no overload without them.
- The adapter enforces the tenant key as a hard filter regardless of what the
  caller already checked (see [DOUBLE_SANDBOXING](DOUBLE_SANDBOXING.md)).
- The adapter does not embed text — vectors come from a separate
  `RagEmbeddingsAdapter` (see
  [self-provided-embeddings](../decisions/self-provided-embeddings.md)).
- The adapter does not enforce business policy — that is Layer 1's job. The
  adapter is the last-line technical guard, not the only guard.

Implement an in-memory adapter first to unblock policy/API development before the
production backend (e.g. Weaviate) is wired in. Select the implementation via a
factory + env var (`RAG_BACKEND=in_memory|weaviate`).

### Ingestion pipeline modes (non-promiscuous migration)
Chunking strategy switchable via env without changing the API contract:
- `current` — default, pre-migration behavior.
- `shadow` — current output is used for indexing/response; the new strategy's
  output is computed only for metrics/comparison logging, **never written** to
  the repository or vector store.
- `<new-strategy>` — becomes the primary path once cut over.

Invariant: no mode ever mixes chunks from two strategies in the same result set;
any future dual-index requires an explicit pipeline id/namespace before
persisting both paths.

### Seven non-negotiable invariants
1. The hard tenant key is a hard boundary — never bypassable, never taken from
   the request body, always from the verified token.
2. Policy enforcement happens before the adapter — the policy service always
   runs before any storage call.
3. The adapter is the last-line technical guard — it applies filters even though
   policy was already checked (defense in depth, not redundancy for its own
   sake).
4. Fail closed — any scope ambiguity, tenant-mapping ambiguity, or token issue
   produces a deny, never a silent fallback.
5. No imports from the trusted caller's core code — integration is via HTTP/API
   only (keeps the RAG subsystem independently deployable and testable).
6. No direct access to the trusted caller's own database/collections — the RAG
   subsystem's persistence is a separate store.
7. Test gate is mandatory — build + full test suite green before every commit,
   including the anti-leakage E2E suite (see
   [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md)).

## Variants
| Scenario | Approach |
|---|---|
| Target framework is NestJS | Guards + DI + `class-validator` DTOs map directly onto the token guard / policy service / adapter split |
| Target framework is plain Express/Fastify | Same split, more hand-rolled guard/middleware boilerplate |
| Storage priority is ops-simplicity over physical isolation | See [weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md) |
| Migrating an existing chunking implementation | Use `shadow` pipeline mode before cutover, never mix strategy outputs |

## Quick checklist for a new project
- [ ] Scope model derived from the target domain's real isolation boundaries, not copied verbatim
- [ ] Service token guard verifies signature + pins issuer/audience + fails closed on missing secret
- [ ] Policy service has zero storage dependency and is independently unit-testable
- [ ] Backend adapter interface has non-optional tenant key + allowed-scopes on every method
- [ ] In-memory adapter implemented before the production backend
- [ ] Embeddings adapter fully decoupled from the backend adapter
- [ ] Pipeline mode supports `shadow` migrations without mixing strategy outputs
- [ ] Anti-leakage E2E suite green (see [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md))

## Related skills
- [rag-weaviate-double-sandbox-bootstrap](../../skills/rag-weaviate-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](../../skills/rag-multitenancy-leakage-audit.md)

## Related knowledge
- [DOUBLE_SANDBOXING](DOUBLE_SANDBOXING.md)
- [rag-tenant-scope-data-model](../domain/rag-tenant-scope-data-model.md)
- [weaviate-native-multitenancy-vs-qdrant](../decisions/weaviate-native-multitenancy-vs-qdrant.md)
- [self-provided-embeddings](../decisions/self-provided-embeddings.md)
- [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md)

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/ARCHITECTURE_REFERENCE.md`, `inbox/rag-bootstrap-toolkit/IMPLEMENTATION_GUIDE.md`
Date: 2026-07-01
