# Pattern: Double Sandboxing with Independent Policy and Storage Boundaries

## Evidence status
Status: **Validated reference**. The pattern is architecture- and
storage-neutral; examples illustrate capabilities without defining the contract.

## Problem
A multi-tenant retrieval subsystem must prevent a defect or compromised
credential in one component from exposing another tenant's data. One isolation
layer creates one failure domain: if it is missed, bypassed, or misconfigured,
nothing independent prevents the leak.

## Solution
Apply two structurally different isolation layers to every data operation.

## Layer 1: application policy sandbox
A deny-by-default policy compiler runs before storage:
- verifies the trusted caller's short-lived service credential;
- derives the hard tenant key only from verified claims;
- checks all actor-binding dimensions;
- computes requested scopes intersected with allowed scopes;
- rejects empty or ambiguous authorization;
- emits immutable, storage-independent operation parameters.

Application code can still contain a missed interceptor, incorrect handler
wiring, or faulty mapping. Layer 1 therefore cannot be the only defense.

## Layer 2: storage tenant sandbox
The backend adapter maps the verified hard tenant key to a storage-native tenant,
partition, shard, namespace, dedicated collection, or the strongest equivalent
available. Every read, write, search, and delete selects that boundary
explicitly. Within it, scope and expiry filters narrow the operation further.

Storage-native isolation does not authorize a caller. A credential with direct
storage access may still choose a tenant deliberately, so Layer 2 cannot replace
Layer 1.

## Why the layers are independent

| Only policy sandbox | Only storage sandbox |
|---|---|
| A missed policy invocation or wrong mapping can reach insufficiently filtered storage. | A direct storage caller may choose the wrong tenant or ignore intra-tenant scopes. |

With both layers, a policy defect still reaches a backend contract that requires
tenant and scopes, while a storage credential alone does not reproduce the
trusted caller's policy decision. Their failure causes differ: application
authorization logic versus storage routing and filtering.

## Capability layout

```text
trust/
  service-credential-verifier
policy/
  tenant-and-scope-policy-compiler
retrieval/
  retrieval-orchestrator
adapters/storage/
  retrieval-backend-contract
  deterministic-reference-backend
  production-backend
adapters/embeddings/
  embeddings-provider-contract
generation/
  generation-registry-and-activation
```

Names and deployment units are illustrative. The boundaries are normative.

## Concrete Weaviate example
Weaviate's tenant facility can implement the storage sandbox: the verified hard
tenant key selects a Weaviate tenant for every operation, while an intra-tenant
filter enforces allowed scopes and expiry. Self-provided vectors keep embedding
text outside the storage vectorizer boundary. Adopters must verify the exact
tenant, filter, lifecycle, backup, and client behavior for their selected
supported release.

## Backend capability variants

| Storage capability | Interpretation |
|---|---|
| Native tenant or partition | Strong independent routing boundary; intra-tenant filters still required |
| Dedicated collection per tenant | Strong boundary with potentially higher lifecycle overhead |
| Shared index with mandatory payload filter | Logical Layer 2; require stronger negative tests and operational controls |
| No enforceable tenant parameter | Insufficient for the pattern; replace or wrap the backend before adoption |

## Non-negotiable invariants
- The hard tenant key is never accepted from untrusted request data.
- Backend data methods cannot omit tenant or allowed scopes.
- The adapter never re-derives a different tenant key.
- Ambiguity fails closed; it never becomes an unfiltered operation.
- Every retrieval mode and availability fallback uses both layers.
- Embeddings are self-provided through a separate capability.
- Multi-tenancy never substitutes for intra-tenant scope filtering.
- Readiness checks do not query tenant data.
- Direct adapter tests prove Layer 2 without relying on Layer 1.

## Common pitfalls
- Calling two checks in the same application layer “double sandboxing.”
- Treating a mandatory payload field as physical isolation.
- Allowing administrative tooling to use ordinary unscoped adapter methods.
- Applying scope filters to dense retrieval but not lexical or fallback modes.
- Assuming tenant selection protects scopes within the tenant.
- Describing product syntax as the portable pattern.

## Related skills
- [rag-double-sandbox-bootstrap](../../skills/rag-double-sandbox-bootstrap.md)
- [rag-multitenancy-leakage-audit](../../skills/rag-multitenancy-leakage-audit.md)

## Related knowledge
- [MULTITENANT_RAG_ARCHITECTURE](MULTITENANT_RAG_ARCHITECTURE.md)
- [rag-tenant-scope-data-model](../domain/rag-tenant-scope-data-model.md)
- [storage-native-multitenancy-over-payload-filtering](../decisions/storage-native-multitenancy-over-payload-filtering.md)
- [self-provided-embeddings](../decisions/self-provided-embeddings.md)
- [fail-closed-security-graceful-retrieval-degradation](../decisions/fail-closed-security-graceful-retrieval-degradation.md)

## Source
Extracted from a validated multi-tenant RAG implementation and normalized into
capability contracts. Weaviate remains the concrete storage-native
multi-tenancy example.
Date: 2026-08-26
