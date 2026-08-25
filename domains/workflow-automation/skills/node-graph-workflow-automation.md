# Skill: Node-Graph Workflow Automation

## Description

Designs and evolves an automatable workflow platform in which users author a graph of typed nodes, publish an immutable executable version, and monitor durable executions in real time. It keeps the visual graph, the compiled definition, and the runtime state separate so that a canvas never becomes the source of execution truth.

## When to invoke

- Building or extending a workflow builder, automation engine, integration hub, or agentic task runner.
- Adding node types, conditional routes, parallel branches, joins, human-input pauses, retries, or execution monitoring.
- Auditing a node-graph system for duplicate execution, stale drafts, hidden background jobs, or misleading UI state.

Do not invoke for a one-off synchronous form wizard or a static diagram with no durable execution semantics.

## Expected inputs

- The user outcome, triggers, actions, failure and retry policy, and any required human approvals.
- Node contracts: typed input schema, output schema, configuration schema, permissions, and side-effect/idempotency behaviour.
- Execution constraints: expected volume, ordering, latency, retention, tenancy, audit, and security requirements.
- UI needs: authoring roles, draft/publish permissions, editor interactions, and observability requirements.

## Produced outputs

- A versioned workflow-definition contract and a graph validation/compilation plan.
- A durable execution model with explicit state transitions, idempotency boundaries, and failure handling.
- Node and connector contracts suitable for both the runtime and the editor inspector.
- A UI interaction model that distinguishes local edits, persisted drafts, published versions, and running instances.
- Test and operational evidence covering graph validity, routing, retries, fan-out/join, human input, and telemetry.

## Steps / Procedure

1. **Establish the vocabulary and boundary.** Separate a workflow *definition* (the authored graph), a published *version*, an *instance* (one run), a *node execution*, and an *action adapter*. Define the authorizing tenant and the systems of record.
2. **Model typed nodes and edges.** Give every node a stable ID, type, configuration schema, input/output schemas, and declared error behaviour. Give each edge a source port, target port, and optional validated route condition. Do not infer a runtime edge from the screen position.
3. **Validate and compile before publishing.** Reject missing references, invalid schemas, unreachable required nodes, unsupported cycles, incompatible ports, and incomplete joins. Resolve the draft into a versioned, immutable execution plan; retain the graph metadata separately for rendering.
4. **Make execution durable.** Persist the instance and each node execution before side effects. Use an atomic claim/lease or equivalent coordination primitive, an idempotency key per effect, bounded retry/backoff, and a terminal failure record with a safe diagnostic. Resume a paused node only through an authenticated input event.
5. **Implement graph semantics explicitly.** Route only through the compiled outgoing edges. On fan-out, create one execution per selected branch. On join, store the join policy (all, any, quorum, or keyed correlation) and evaluate it from persisted branch results. Never conclude an instance merely because one node has no outgoing edge.
6. **Expose an action registry.** Each node type declares its schemas, capabilities, authorization requirements, UI manual, and telemetry fields. Keep external services behind adapters; do not embed their business rules in the scheduler or UI.
7. **Build the editor as a client of the contract.** Keep graph edits local until an explicit save; show validation errors before publish. Run only a persisted published version. Use node schemas to render the inspector and published execution events to update live status; polling or a stream is an implementation choice, not a substitute for authoritative state.
8. **Verify the failure paths.** Test malformed graphs, stale-version runs, duplicate delivery, worker recovery, timeout, retry exhaustion, a branch that fails, a paused approval, join correlation, unauthorized edits, and a disconnected UI that later resynchronizes.

## Common pitfalls to avoid

- Treating the browser graph as executable truth; unsaved edits must not alter a running instance.
- Publishing mutable definitions; executions must retain the exact version they started with.
- Using an in-memory queue or boolean lock as the only protection against duplicate work.
- Replacing missing variables, unavailable connectors, or failed actions with fabricated successful output.
- Treating a parallel fan-out as complete when its first branch finishes, or joining unrelated branch results.
- Letting free-form LLM text select tools or edges without schema validation and authorization checks.
- Showing mock data or optimistic "completed" states when the service has no authoritative result.
- Coupling an action implementation directly to React components, canvas positions, or a particular graph library.

## Usage examples

```text
Design a customer-onboarding workflow builder. It starts from a webhook, validates the account,
branches to CRM and billing setup in parallel, waits for both, requests approval for an exception,
and shows the live run on a node canvas. Define the graph contract, publication rules, and failure tests.
```

```text
Audit this existing automation runner: workers are restarted frequently, some nodes call third-party
APIs, and the editor can save while a workflow is running. Identify the required versioning,
idempotency, and UI-state changes.
```

## Related skills

- [DURABLE_NODE_WORKFLOW_AUTOMATION](../knowledge/patterns/DURABLE_NODE_WORKFLOW_AUTOMATION.md) and [workflow-automation-platform](../knowledge/domain/workflow-automation-platform.md).
- Optional companion: **LLM JSON Parsing (Robust)** in the repository's `llm` package, for structured model output used by intent or routing nodes.
- Optional companion: **Risk-Based Verification Gauntlet** and **Human Decision Gates** in the repository's `sfad` package, for risk-proportionate verification and material approval nodes.

## Source

Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
