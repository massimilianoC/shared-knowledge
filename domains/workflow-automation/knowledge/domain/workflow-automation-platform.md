# Domain: Workflow Automation Platform

## Scope

A workflow automation platform lets an authorized user or system define a directed graph of typed operations, publish a version, start durable executions, and observe or intervene in their progress. It is distinct from a static process diagram, a client-only wizard, and an unbounded autonomous agent.

## Terminology

| Term | Meaning |
| --- | --- |
| Node | A typed executable operation, router, trigger, join, or human-input pause. |
| Edge | A validated transition between node ports, optionally with a route condition. |
| Draft | Editable graph state that is not executable. |
| Published version | Immutable compiled definition from which instances are started. |
| Instance | One execution of a published version. |
| Node execution | The durable record of a node occurrence and its attempts. |
| Adapter | The implementation behind a node type, including schemas and capability requirements. |
| Inspector | The editor panel that exposes a node's configuration, I/O contract, help, and validation state. |

## Appropriate uses

- Event-driven integrations across SaaS, device, or internal systems.
- Long-running processes with retries, timeouts, approval pauses, or multi-step data transformation.
- Agent-assisted flows where model output is constrained by schemas and effects are performed by explicit adapters.
- Operational workflows requiring auditability and live progress.

## Non-goals

- Replacing the source systems that own business data, identity, authorization, or policy.
- Making a graph UI the source of truth for active runs.
- Allowing arbitrary code, secrets, or tool access from an unreviewed node configuration.
- Requiring a specific database, queue, WebSocket implementation, graph library, or CSS framework.

## Incremental adoption

1. Start with a linear published definition, durable node status, typed adapters, and an execution history view.
2. Add retries, authenticated human input, schema validation, and replay-safe external effects.
3. Add a graph editor with explicit save and publish operations; keep UI layout out of the executable plan.
4. Add branches and joins only after their readiness and failure semantics are specified and tested.
5. Add LLM routing only as a schema-constrained, authorized node; retain deterministic fallbacks and audit evidence.

## Adoption questions

- What system owns the workflow definition, run state, and each external business record?
- Which node types may make irreversible effects, and who can publish or run them?
- What idempotency and compensation policy applies to every connector?
- How are secrets, outputs, tenant data, and event streams protected and retained?
- What should an operator see and do when a node is waiting, retrying, or terminally failed?

## Related artifacts

- [Node-Graph Workflow Automation](../../skills/node-graph-workflow-automation.md)
- [DURABLE_NODE_WORKFLOW_AUTOMATION](../patterns/DURABLE_NODE_WORKFLOW_AUTOMATION.md)
- Optional companion: the repository's **SFAD Next Adoption Guide** for project-level governance around adoption.

## Source

Source materials are intentionally excluded from this public repository.
Date: 2026-08-24
