# Pattern: Durable Node Workflow Automation

## Problem

A node canvas is easy to draw but difficult to execute correctly. A resilient platform must survive restarts, duplicate deliveries, delayed human input, stale browser state, and parallel routing without changing the meaning of a run.

## Context

Use this pattern when a workflow has multiple executable steps, external effects, asynchronous completion, user approval, or a visual authoring interface. It applies equally to operational automation, business processes, integration flows, and agent-assisted workflows.

## Solution

Keep three representations with one-way authority:

```text
editable draft graph --validate/compile--> immutable published version --instantiate--> durable run state
        |                                       |                                      |
        +-- editor metadata                     +-- executable node/edge plan          +-- node attempts and events
```

The draft owns layout and unsaved authoring changes. Publishing validates and compiles it into an immutable graph version. An execution instance names that version and persists every node attempt, transition, retry, output reference, and human-input wait. The editor receives telemetry from persisted state and does not advance the workflow itself.

### Required invariants

1. A run references exactly one published workflow version for its lifetime.
2. Each node execution is claimed atomically and has a lease/recovery strategy; an effect has an idempotency key.
3. A node can become ready only when its compiled edge conditions and join policy are satisfied from persisted data.
4. Outputs are validated against the declared node schema before they enter downstream context.
5. Missing data, failed connectors, and invalid routing produce explicit failure or pause state, never synthetic success.
6. Human input is an authenticated, auditable event that resumes a specific paused node execution.
7. The runtime state is authoritative; UI events accelerate refresh but cannot replace reconciliation from the service of record.

### Minimal model

| Entity | Responsibility |
| --- | --- |
| Workflow draft | Mutable graph, positions, labels, and unpublished configuration. |
| Published version | Immutable compiled nodes, edges, schemas, policies, and version metadata. |
| Workflow instance | A run, its owner/tenant, start input, version, and aggregate lifecycle. |
| Node execution | One attemptable node occurrence, lease/status, input/output references, and error data. |
| Action adapter | Typed implementation of a node type; exposes configuration, I/O, capability, and UI metadata. |
| Event/audit record | Ordered execution evidence and UI telemetry, redacted where necessary. |

### Lifecycle

```text
draft -> validated -> published -> instance queued -> nodes claimed -> running
                                                  -> waiting for input -> queued
                                                  -> completed | failed | cancelled
```

Define transition ownership and terminal behaviour for the target product. A retry creates or records a new attempt without erasing the earlier failure. Branch fan-out produces independent ready nodes; a join remains pending until its explicit policy is fulfilled.

## Consequences

- Executions are reproducible and debuggable even after a definition evolves.
- The system can recover safely from worker and client failures, at the cost of persistent state and lifecycle design.
- The canvas becomes trustworthy because its controls reflect saving, publishing, and runtime authority clearly.
- The platform must deliberately define retention, encryption, tenancy, authorization, and event redaction.

## Verification cues

- Attempt to run an unsaved draft and a stale published version; both outcomes must be explicit.
- Replay a delivery or crash a worker after the effect boundary; verify no duplicate external effect.
- Exercise a parallel fan-out with a failed branch and a join; verify the configured policy decides the result.
- Disconnect and reconnect the editor; its node states must converge on the persisted instance.
- Submit invalid human input and schema-incompatible node output; verify they cannot advance the graph.

## Related artifacts

- [Node-Graph Workflow Automation](../../skills/node-graph-workflow-automation.md)
- [workflow-automation-platform](../domain/workflow-automation-platform.md)
- Optional companion: **LLM JSON Parsing Guidelines** in the repository's `llm` package.
- Optional companion: **RISK_BASED_VERIFICATION_GAUNTLET** in the repository's `sfad` package.

## Source

Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
