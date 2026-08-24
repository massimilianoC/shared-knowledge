# Skill: RAG Weaviate Double-Sandbox Bootstrap

## Description
Bootstraps a multi-tenant RAG (Retrieval-Augmented Generation) subsystem in a
Node.js backend, built on the [double-sandboxing pattern](../knowledge/patterns/DOUBLE_SANDBOXING.md):
an application-level deny-by-default policy layer plus Weaviate's native
multi-tenancy as an independent, physical isolation layer. Use it whenever a
project needs RAG/vector search with strict per-tenant data isolation, ahead of
raw latency or minimal operational footprint.

## Expected inputs
- Confirmation of the "trusted caller" in the target project (gateway, monolith
  module, BFF) — whoever will sign the service token.
- The target domain's actual isolation boundaries (organizations? workspaces?
  teams? sessions?), to derive the scope model from — not assumed in advance.
- Node.js backend (NestJS recommended for guards/DI/DTO validation; Express/
  Fastify work with more hand-rolled boilerplate).
- A running or provisionable Weaviate instance for local dev.

## Produced outputs
- Service token guard verifying a short-lived, signed JWT with pinned
  issuer/audience.
- Policy service (Layer 1) with denial unit tests, no storage dependency.
- Backend adapter interface + in-memory implementation, then a Weaviate
  implementation (Layer 2).
- Embeddings adapter, fully decoupled from the backend adapter.
- Ingestion pipeline (chunk → embed → index) with full metadata attached before
  reaching any adapter.
- Retrieval entrypoint: policy → search → (optional rerank) → return.
- Anti-leakage E2E test suite, green, wired into CI (see
  [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md)).

## Steps / Procedure

### 0. Prerequisites
Decide, before writing code, who the trusted caller is. Install `langchain`,
`@langchain/textsplitters`, `weaviate-client` (v3+), `jsonwebtoken`,
`class-validator`, `class-transformer`. Stand up Weaviate locally (Docker Compose
block in [WEAVIATE_SETUP reference](#reference-weaviate-docker-compose--collection-schema)
below).

### 1. Define the scope model
Don't reuse `org_knowledge_pack|user_project|chat_ephemeral` blindly — derive
scope types from the target product's actual isolation boundaries. Keep the hard
tenant key (`organizationId` or equivalent) as a separate, mandatory field
regardless of scope type. See
[rag-tenant-scope-data-model](../knowledge/domain/rag-tenant-scope-data-model.md)
for the full claims/scope shape.

### 2. Service token guard (trust boundary)
A `CanActivate` guard (NestJS) or equivalent middleware:
- Rejects any request without `Authorization: Bearer <token>`.
- Verifies with `jwt.verify(token, secret, { issuer, audience })` — pin both.
- Rejects if the secret isn't configured (fail closed, don't silently allow).
- Rejects if mandatory claims (hard tenant key, user id, non-empty
  `allowedScopes`) are missing after decode.
- Attaches decoded claims + a correlation id to the request context; never trust
  the tenant key from the request body from this point on.

### 3. Policy service (Layer 1) — before touching storage
One class, unit-testable in isolation, zero storage dependency:
- `assertOrganizationMatch(requestOrgId, claims)` — throws unless equal (or an
  explicit, logged god-mode role bypass).
- `assertActorBinding(claims, request)` — throws if the token is bound to a
  narrower actor context than the request targets.
- `resolveAllowedScopes(claims, requestedScopes?)` — returns the intersection;
  throws if the token has zero allowed scopes.
- `assertRequestShape(request)` — throws if the hard tenant key is missing from
  the request DTO itself, even though it's also on the token.

Write the five denial tests **now**, against a stub adapter — they define the
contract for everything after this point.

### 4. Backend adapter interface (pluggable storage contract)
```ts
export interface RagBackendAdapter {
  indexChunks(chunks: ChunkToIndex[]): Promise<void>;
  searchSimilar(params: ScopedSearchParams): Promise<ScoredChunk[]>;
  deleteByScope(params: ScopedDeleteParams): Promise<{ deletedCount: number }>;
  isReady(): Promise<boolean>;
}
```
No overload without the tenant key + `allowedScopes`. Implement an in-memory
adapter first (`Map`-based, cosine similarity by hand) so policy + API surface
can be built and tested before Weaviate is wired in. Select via a factory + env
var (`RAG_BACKEND=in_memory|weaviate`).

### 5. Weaviate adapter (Layer 2)
- [ ] Collection created once, idempotently, with `multiTenancy: { enabled: true }`
      and `vectorizers: weaviate.configure.vectors.selfProvided()`.
- [ ] `ensureTenant(organizationId)` called before every write/read, lazily
      creating the tenant.
- [ ] Every operation resolves `.withTenant(organizationId)` explicitly — grep
      the finished adapter for any `collections.get(...)` call **not**
      immediately followed by `.withTenant(...)` and treat it as a bug.
- [ ] `searchSimilar` builds an OR-of-ANDs filter over `allowedScopes`, AND'd
      with an expiry filter (`expiresAt > now`, far-future sentinel for
      no-expiry chunks).
- [ ] `deleteByScope` requires the tenant key as non-optional.
- [ ] `isReady()` hits Weaviate's own readiness probe and nothing else — never a
      data query.

### 6. Embeddings adapter (pluggable, independent of storage)
Separate interface (`embedDocuments`, `embedQuery`, `dimensions`), separate
factory, separate env var (`RAG_EMBEDDINGS_PROVIDER`). Start with a deterministic
stub (hash-based, no network, reproducible) for tests/CI, plus an
OpenAI-compatible HTTP client for production. See
[self-provided-embeddings](../knowledge/decisions/self-provided-embeddings.md)
for why the backend adapter must never call this directly.

### 7. Ingestion pipeline (chunk → embed → index)
Chunking via LangChain JS text splitters, selectable strategy
(`recursive|markdown|language`) behind an env var. If migrating an existing
chunking implementation, add a `shadow` mode: compute the new strategy's output
alongside the old one for metrics only, never write it to storage until a
deliberate cutover. Attach full metadata to every chunk before it reaches the
embeddings/backend adapters.

### 8. Retrieval + retention
Single entrypoint: resolve policy (Layer 1) → `searchSimilar` (Layer 2) →
optionally rerank/post-process → return. TTL-scoped data needs both the active
`expiresAt` filter and a background cleanup job for eventual physical deletion —
the filter alone does not substitute for actually deleting expired data.

### 9. Test gate
Before considering the port done, all items in
[anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md)
must be green, plus an adapter-level test calling the backend adapter directly
with a wrong tenant key, bypassing the policy layer — this is what proves Layer 2
holds independently.

### 10. Integration with the trusted caller
The trusted caller issues the service token per-request, never a long-lived
shared secret. It propagates a correlation id end-to-end. It — not the RAG
subsystem — owns rate limiting, quota, and billing/usage events.

## Reference: Weaviate Docker Compose + collection schema
```yaml
services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:1.31.12
    restart: unless-stopped
    ports:
      - "127.0.0.1:${WEAVIATE_HOST_PORT:-18080}:8080"
      - "127.0.0.1:${WEAVIATE_GRPC_HOST_PORT:-50061}:50051"
    environment:
      DEFAULT_VECTORIZER_MODULE: "none"        # vectors are always self-provided
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: "false"
      AUTHENTICATION_APIKEY_ENABLED: "true"
      AUTHENTICATION_APIKEY_ALLOWED_KEYS: "${WEAVIATE_API_KEY}"
      AUTHORIZATION_ADMINLIST_ENABLED: "true"
      AUTHORIZATION_ADMINLIST_USERS: "<service-name>"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/v1/.well-known/ready"]
```
Bind ports to `127.0.0.1` in local/dev compose unless external exposure is
genuinely needed. See
[rag-tenant-scope-data-model](../knowledge/domain/rag-tenant-scope-data-model.md)
for the full collection property list and query shapes.

## Key patterns
- **Double sandboxing** — two independent isolation layers, see
  [DOUBLE_SANDBOXING](../knowledge/patterns/DOUBLE_SANDBOXING.md).
- **Adapter Factory** — pluggable backend/embeddings implementations selected by
  env var, never hardcoded.
- **Fail closed everywhere** — missing config, missing claims, empty
  allowed-scopes, ambiguous resolution are always a reject, never a silent
  fallback.
- **Shadow-mode migration** — compute a new pipeline strategy's output
  alongside the old one before cutover, never mixing outputs in one result set.

## Common pitfalls to avoid
- Wiring the Weaviate adapter in before the policy layer and its denial tests
  exist — there must never be a point where an uncontrolled path reaches real
  storage.
- An adapter method with an optional tenant key or optional allowed-scopes
  parameter — reopens the single point of failure the pattern exists to close.
- Letting the backend adapter call an embeddings provider directly.
- Health/readiness probes that perform an actual data query "just to check
  connectivity."
- Reporting the bootstrap complete without the anti-leakage suite green.

## Usage examples
```
Example prompt: "Bootstrap a multi-tenant RAG service in our NestJS backend.
Isolation boundary is per-organization, with per-project and per-chat scoping.
Use Weaviate as the vector backend."
```
```
Example prompt: "We're porting the RAG double-sandbox pattern from another repo
into this monolith. Our trusted caller is the existing AuthModule. Walk me
through the build order."
```

## Related skills
- [rag-multitenancy-leakage-audit](rag-multitenancy-leakage-audit.md)

## Related knowledge
- [DOUBLE_SANDBOXING](../knowledge/patterns/DOUBLE_SANDBOXING.md)
- [MULTITENANT_RAG_ARCHITECTURE](../knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md)
- [rag-tenant-scope-data-model](../knowledge/domain/rag-tenant-scope-data-model.md)
- [weaviate-native-multitenancy-vs-qdrant](../knowledge/decisions/weaviate-native-multitenancy-vs-qdrant.md)
- [self-provided-embeddings](../knowledge/decisions/self-provided-embeddings.md)
- [anti-leakage-test-suite-as-gate](../knowledge/decisions/anti-leakage-test-suite-as-gate.md)

## Source
Extracted from: `inbox/rag-bootstrap-toolkit/IMPLEMENTATION_GUIDE.md`, `inbox/rag-bootstrap-toolkit/skill/SKILL.md`, `inbox/rag-bootstrap-toolkit/skill/references/WEAVIATE_SETUP.md`
Date: 2026-07-01
