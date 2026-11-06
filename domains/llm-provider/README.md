# LLM Provider

Reusable package for language-model provider integration: generative LLM output, multi-provider platform design, and a typed-decision specialization for bounded classification and verification.

## Model contracts

The package contains more than one inference contract. A chat LLM takes messages and produces generated content. A System One model takes `state` plus typed `questions` and returns decision `answers` and probabilities. TypeSafe describes System One as language-understanding like an LLM, while distinguishing its output from generated text. See [typed-decision provider contract](knowledge/domain/typed-decision-provider-contract.md) before adding one to a chat-oriented gateway. Provider identity and API compatibility do not make the two request and response shapes interchangeable.

## Start here

- Use [`skills/output/llm-json-parsing.md`](skills/output/llm-json-parsing.md) and [`skills/output/llm-output-repair.md`](skills/output/llm-output-repair.md) for structured-output handling.
- Use [`skills/output/llm-mermaid-diagram-rendering.md`](skills/output/llm-mermaid-diagram-rendering.md) for streamed Mermaid output in application UIs.
- Use [`agents/multiprovider-llm-architect.md`](agents/multiprovider-llm-architect.md) for catalog, routing, cost, credits, context, and background-work design.
- Use [`skills/platform/classification-benchmark.md`](skills/platform/classification-benchmark.md) to evaluate labeled classification tasks, and [`agents/typed-classifier-adoption-agent.md`](agents/typed-classifier-adoption-agent.md) when assessment and integration form one workflow.
- Use [`skills/platform/system-one-typed-decisions.md`](skills/platform/system-one-typed-decisions.md) for the distinct typed-decision adapter and routing contract.
- Copy [`templates/classification-benchmark-kit/`](templates/classification-benchmark-kit/README.md) for a runnable System One style benchmark starter.

## Package layout

| Directory | Contents |
| --- | --- |
| [`skills/output/`](skills/output/) | Parsing, repair, and safe rendering of model output. |
| [`skills/platform/`](skills/platform/) | Provider catalog, routing, costs, credits, context budget, background tasks, and typed-classifier assessment. |
| [`agents/`](agents/) | Output-processing, multi-provider architecture, and typed-classifier adoption agents. |
| [`knowledge/`](knowledge/) | Supporting patterns, decisions, and platform data model. |
| [`templates/`](templates/) | Portable classification benchmark starter. |

## Selective import

Import the selected skill or agent with its linked knowledge and included skills. Copy the full `llm-provider/` package only when adopting multiple platform capabilities. The platform patterns are provider-neutral; the System One adapter and its quick-start tasks are an optional provider specialization with a distinct request contract. Choose only artifacts that match the target architecture.
