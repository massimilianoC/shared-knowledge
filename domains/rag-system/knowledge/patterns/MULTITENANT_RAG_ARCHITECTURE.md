# Pattern: Architecture-Neutral Multi-Tenant RAG Service

## Evidence status
Status: **Validated reference** for the trust boundary, policy sandbox, storage
sandbox, self-provided embeddings, scope model, and anti-leakage gate.
Generation management, hybrid retrieval, and offline/online separation are
linked **compatible extensions**.

## Problem
How do you design a reusable retrieval-augmented generation subsystem that can
change frameworks, deployment topology, embedding providers, and storage engines
without weakening tenant isolation or coupling authorization to retrieval
technology?

## Solution
Define the subsystem through trust and capability boundaries rather than a
specific application stack.

```text
Trusted caller
  -> signed, short-lived authorized context
RAG trust boundary
  -> deny-by-default policy compiler
  -> immutable tenant/scope operation context
Retrieval orchestration
  -> embeddings capability
  -> retrieval-backend capability
  -> optional fusion/reranking capability
Storage boundary
  -> explicit native tenant/partition selection
  -> intra-tenant scope and expiry filters
```

The roles may run in one process or several services. Deployment topology does
not change the invariants.

## Trusted caller and service credential
The trusted caller owns user authentication, business authorization, licensing,
and quota. It issues a short-lived, signed credential containing at least:

```text
hardTenantKey
actorId
actorType
allowedScopes[]
optional actor bindings
issuedAt / expiresAt
unique token identifier
issuer / audience
```

The RAG boundary verifies the signature, issuer, audience, expiry, and mandatory
claims before any controller, handler, worker, or storage adapter runs. Missing
verification configuration rejects the request. There is no anonymous or
unscoped fallback.

## Scope model
Derive scopes from the target product's actual authorization boundaries. A
portable model separates:
- the hard tenant key, which selects the storage tenant or partition;
- a scope type and scope identifier, which select authorized content within the
  tenant;
- optional actor bindings, which prevent a credential issued for one project,
  session, agent, or equivalent context from being reused for another;
- retention and expiry, which remain active retrieval filters until physical
  deletion is complete.

## Policy compiler: Layer 1
The policy component has no storage dependency. It:
- asserts the verified hard tenant key;
- checks all actor bindings;
- intersects requested scopes with credential-allowed scopes;
- rejects missing, empty, or ambiguous results;
- emits immutable, pre-authorized operation parameters.

It does not know database query syntax, vector dimensions, ranking algorithms,
or infrastructure topology.

## Capability contracts
Use contracts equivalent to:

```text
RetrievalBackend
  index(chunks, authorizedContext, generation)
  retrieve(query, authorizedContext, generation, retrievalMode)
  delete(scope, authorizedContext)
  readiness()

EmbeddingsProvider
  contract()
  embedDocuments(texts)
  embedQuery(text)
```

Contract rules:
- hard tenant and allowed scopes are non-optional on every data operation;
- only pre-authorized parameters reach the backend;
- the backend independently enforces tenant selection and scope filters;
- the backend never embeds text;
- the embeddings provider never owns authorization policy;
- readiness does not perform a user-data query;
- retrieval mode cannot weaken the authorized context.

Implement a deterministic backend and embeddings provider first so policy,
generation, API, and test behavior do not depend on production infrastructure.

## Storage sandbox: Layer 2
Map the hard tenant key to the strongest native isolation primitive available.
Inside it, apply the OR-of-ANDs allowed-scope filter plus expiry and any mandatory
retention constraints. If the selected store exposes only a shared-index payload
filter, explicitly record that the second layer is logical and strengthen
negative tests and operational controls.

### Concrete Weaviate example
A Weaviate adapter maps the hard tenant key to a Weaviate tenant, explicitly
selects that tenant on every read, write, search, and delete, and then applies
scope and expiry filters. The collection accepts self-provided vectors. This is
an implementation example of the capability contract, not a package dependency.
Exact configuration and client syntax must be verified for the selected
supported release.

## Ingestion and generation evolution
The validated migration baseline provides `current`, `shadow`, and explicit
cutover modes. Shadow computation never writes candidate output into the active
index. Any persisted candidate uses a separate pipeline and embedding-generation
identity. See:
- [OFFLINE_ONLINE_RAG_PIPELINE](OFFLINE_ONLINE_RAG_PIPELINE.md);
- [VERSIONED_EMBEDDING_GENERATIONS](VERSIONED_EMBEDDING_GENERATIONS.md);
- [atomic-embedding-generation-activation](../decisions/atomic-embedding-generation-activation.md).

## Retrieval evolution
Dense retrieval is a valid baseline. Lexical, hybrid, fusion, and reranking are
explicit modes that reuse the exact same authorized context. Optional dependency
fallback is permitted only after successful authorization and only to a mode
with identical filters. See
[HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK](HYBRID_RETRIEVAL_WITH_SCOPED_FALLBACK.md).

## Non-negotiable invariants
1. The hard tenant key never comes from untrusted request data.
2. Policy compilation precedes every storage call and offline data operation.
3. The storage adapter independently selects a tenant or partition.
4. Every retrieval branch and fallback path applies the same allowed scopes and
   expiry constraints.
5. Authorization, tenant, scope, or generation ambiguity fails closed.
6. Embeddings are self-provided through a separate capability.
7. Incompatible generations never mix in one result set.
8. The subsystem does not import caller internals or read caller-owned private
   databases outside a declared integration contract.
9. Anti-leakage tests are mandatory for every backend and retrieval mode.

## Architecture-neutral adoption checklist
- [ ] Hard tenant and scope vocabulary derived from the target domain
- [ ] Trusted credential verification pins issuer and audience and fails closed
- [ ] Policy compiler has no retrieval or storage dependency
- [ ] Tenant and allowed scopes are non-optional in every backend data method
- [ ] Deterministic test adapters exist before production infrastructure
- [ ] Storage isolation strength is documented as physical, logical, or operational
- [ ] Embedding generation contract is explicit and validated
- [ ] Offline build and online retrieval have separate contracts
- [ ] Candidate generations cannot write into the active namespace
- [ ] Every retrieval and fallback mode passes anti-leakage tests
- [ ] Retrieval changes pass a reproducible quality benchmark

## Related skills
- [rag-double-sandbox-bootstrap](../../skills/rag-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](../../skills/rag-multitenancy-leakage-audit.md)
- [rag-retrieval-quality-benchmark](../../skills/rag-retrieval-quality-benchmark.md)

## Related knowledge
- [DOUBLE_SANDBOXING](DOUBLE_SANDBOXING.md)
- [rag-tenant-scope-data-model](../domain/rag-tenant-scope-data-model.md)
- [storage-native-multitenancy-over-payload-filtering](../decisions/storage-native-multitenancy-over-payload-filtering.md)
- [self-provided-embeddings](../decisions/self-provided-embeddings.md)
- [anti-leakage-test-suite-as-gate](../decisions/anti-leakage-test-suite-as-gate.md)

## Source
The isolation core was extracted from a validated reference implementation.
The compatible extensions and this update to the RAG development guidelines
were informed by Niels Rogge,
[“How Hugging Face Inference Endpoints, Jobs, and Buckets Power Search on Papers with Code”](https://huggingface.co/blog/pwc-search),
*Hugging Face Blog*, published 2026-08-21; see also the
[source document](https://github.com/huggingface/blog/blob/main/pwc-search.md).
Retrieved: 2026-08-26. Product, framework, model, and tuning examples remain
non-normative.
Date: 2026-08-26
