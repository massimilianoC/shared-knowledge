# Workflow Automation

Reusable package for designing durable, automatable workflows represented as a node graph and operated through a visual editor and real-time execution view.

## Start here

1. Read [workflow-automation-platform](knowledge/domain/workflow-automation-platform.md) to decide whether the package fits the product and to establish the vocabulary.
2. Apply [node-graph-workflow-automation](skills/node-graph-workflow-automation.md) when designing or extending an execution engine, its graph contract, and the accompanying UI.
3. Use [DURABLE_NODE_WORKFLOW_AUTOMATION](knowledge/patterns/DURABLE_NODE_WORKFLOW_AUTOMATION.md) for the invariants that keep drafts, published definitions, and executions coherent.

## Package layout

| Directory | Contents |
| --- | --- |
| [skills/](skills/) | A reusable design-and-implementation capability for node-graph workflow automation. |
| [knowledge/patterns/](knowledge/patterns/) | Durable orchestration mechanics and graph/runtime invariants. |
| [knowledge/domain/](knowledge/domain/) | Scope, terminology, and an incremental adoption path. |

## Adoption boundary

This package specifies behaviour and interfaces, not a required framework, queue, database, transport, or design system. Choose those technologies in the target repository and record material choices there. The UI may use any graph library as long as it remains a client of the published graph contract and execution telemetry.

## Selective import

Import the skill with its two linked knowledge notes. Copy the whole `workflow-automation/` package when establishing a new workflow platform or when the boundaries between editor, compiler, and runtime are still unclear.
