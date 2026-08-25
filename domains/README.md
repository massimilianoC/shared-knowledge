# Domain Packages

Each directory in this folder is a self-contained knowledge package. It can be copied whole, or mined selectively by an AI agent that follows an artifact's linked dependencies.

## Packages

| Package | Purpose | Entry point |
| --- | --- | --- |
| [`spec-first-agentic-development/`](spec-first-agentic-development/README.md) | Spec-First Agentic Development: bootstrap and operate a project with durable agent context. | [`spec-first-agentic-development/README.md`](spec-first-agentic-development/README.md) |
| [`llm-provider/`](llm-provider/README.md) | LLM output processing and multi-provider platform engineering. | [`llm-provider/README.md`](llm-provider/README.md) |
| [`rag-system/`](rag-system/README.md) | Multi-tenant retrieval-augmented generation architecture and leakage controls. | [`rag-system/README.md`](rag-system/README.md) |
| [`capture/`](capture/README.md) | Server-side HTML, screenshot, and PDF artifact capture. | [`capture/README.md`](capture/README.md) |
| [`workflow-automation/`](workflow-automation/README.md) | Durable automated workflows with a typed node graph and visual runtime UI. | [`workflow-automation/README.md`](workflow-automation/README.md) |

## Agent selection and import

1. Read the chosen package `README.md` before opening its artifacts.
2. Select an agent for a complete workflow, or a skill for one bounded capability.
3. Import the selected artifact and its direct linked dependencies: included skills, patterns, decisions, and required templates.
4. Preserve the relative directory structure of imported files. Do not import unrelated skills merely because they share a domain.
5. Copy the full `domains/<domain>/` directory only for comprehensive adoption or when dependency boundaries are unclear.
6. Treat imported material as guidance; reconcile it with the target repository rather than overwriting existing rules.

## Repository-wide assets

[`../templates/`](../templates/) contains generic skill and agent authoring templates. The root README and [`../MAP.md`](../MAP.md) are navigation aids and are not required by a copied domain package.
