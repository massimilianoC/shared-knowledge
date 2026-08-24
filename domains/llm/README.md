# LLM Engineering

Reusable package for reliable LLM output processing and multi-provider LLM platform design.

## Start here

- Use [`skills/output/llm-json-parsing.md`](skills/output/llm-json-parsing.md) and [`skills/output/llm-output-repair.md`](skills/output/llm-output-repair.md) for structured-output handling.
- Use [`skills/output/llm-mermaid-diagram-rendering.md`](skills/output/llm-mermaid-diagram-rendering.md) for streamed Mermaid output in application UIs.
- Use [`agents/multiprovider-llm-architect.md`](agents/multiprovider-llm-architect.md) for catalog, routing, cost, credits, context, and background-work design.

## Package layout

| Directory | Contents |
| --- | --- |
| [`skills/output/`](skills/output/) | Parsing, repair, and safe rendering of model output. |
| [`skills/platform/`](skills/platform/) | Provider catalog, routing, costs, credits, context budget, and background tasks. |
| [`agents/`](agents/) | Output-processing and multi-provider architecture agents. |
| [`knowledge/`](knowledge/) | Supporting patterns, decisions, and platform data model. |

## Selective import

Import the selected skill or agent with its linked knowledge and included skills. Copy the full `llm/` package only when adopting multiple platform capabilities. Select only artifacts that match the target architecture; this package does not prescribe a specific vendor or SDK.
