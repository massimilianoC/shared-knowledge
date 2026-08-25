# Pattern: Single Source of Truth and Boundary Discipline

## Summary
For every concern in a system, **one** party owns the truth. The Architecture Overview names that SSoT explicitly per concern. Any other repo consumes truth from there: it never duplicates, never recomputes, never silently caches, never patches.

Stability: **stable**.

## The question every project must answer
> **For each concern in the system, who owns the truth?**

If the answer is "well, both" → you have a bug waiting to happen.

## Concerns that always need an SSoT

| Concern | Typical SSoT | Anti-pattern |
| :--- | :--- | :--- |
| Domain data | A backend service / DB | Frontend re-derives from local cache |
| Authorization (RBAC/ABAC) | Backend `/me` endpoint | Frontend hardcodes role → page mapping |
| Policy / configuration | Versioned `ConfigEntry` table | Hardcoded constants in repo |
| Feature flags | Flag evaluator service | Boolean env vars sprinkled in code |
| Schemas | OpenAPI / Protobuf / Zod (one canonical) | Type definitions duplicated by hand |
| Time | UTC at the server | Client converts and persists local time |
| Identifiers | Server-generated UUIDs | Client invents IDs that may collide |
| Audit trail | Append-only log on SSoT | Frontend records its own audit |
| Job orchestration | Backend job queue | Frontend simulates "in progress" with timers |

## Boundary patterns

Once SSoT is named, the relationship between the SSoT and this repo is a **boundary**. Boundaries have rules:

### Pattern A — Typed HTTP boundary (most common)
- **One** HTTP client per SSoT. No ad-hoc `fetch`/`axios` in feature code.
- Every request/response validated by a schema (Zod / JSON Schema / Protobuf / OpenAPI). Failed validation = bug to fix, not runtime error to swallow.
- Errors mapped to a structured `ApiError` with stable shape.
- `Idempotency-Key` on every mutation.
- Forward-compatible: tolerate unknown fields; never break on additive changes.

### Pattern B — Read-only mirror (slowly-changing inputs)
- E.g., partner's product catalog, static atlas package.
- The repo holds a mirror under `docs/guidelines/` or `data/`, read-only.
- Sync is explicit (a script with a date). Never silently re-fetched in code.

### Pattern C — Eventual consistency (queue / SSE / webhook)
- The boundary is asynchronous. Same idempotency rules: every event has a key; processing is at-least-once + idempotent.

## Things the repo NEVER does across an SSoT boundary
- ❌ Re-implement RBAC logic ("this user looks like an admin, so show the button").
- ❌ Recompute pricing / quota / retention rules ("backend hasn't shipped this yet, let's do it client-side").
- ❌ Decide what is allowed (UI may hide cosmetically, but the SSoT must still reject).
- ❌ Generate primary keys that must be globally unique.
- ❌ Cache derived data the SSoT hasn't blessed (e.g., "user count" by iterating the user list).
- ❌ Patch around missing endpoints with simulated logic in production.

## Things the repo ALWAYS does at boundaries
- ✅ Validate inbound payloads with the canonical schema.
- ✅ Surface SSoT errors with their `correlationId` for support.
- ✅ Carry `traceparent` headers across the boundary.
- ✅ Use feature flags exposed by the SSoT, not local toggles.
- ✅ Open a proposal in `docs/architecture/proposals/` when a missing endpoint blocks a slice (do not fake it).

## "What if the SSoT is wrong?"

When the SSoT returns surprising results, the repo must:
1. Surface the result faithfully (do not silently correct it).
2. File a bug against the SSoT.
3. Open a proposal if the issue is contractual.

It must **not**:
- monkey-patch the response in transit;
- add a special case that hides the wrong value;
- accumulate "compensations" that grow into a parallel domain model.

## How to identify the SSoT in your project
1. List the project's concerns (the table above is a starter).
2. For each, ask: *if two copies disagreed, which one is authoritative?*
3. Write the answer in the Architecture Overview's "Responsibilities" section.
4. Make the SSoT name visible in the `AGENTS.md` identity section.

If you cannot answer for a given concern, the concern is **not implemented yet** — even if code exists for it.

## Related
- [SPEC_FIRST_AGENTIC_DEVELOPMENT](SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- Skill: [external-dependency-enablement](../../skills/coordination/external-dependency-enablement.md)
- Skill: [spec-first-bootstrap](../../skills/bootstrap/spec-first-bootstrap.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-05-21
