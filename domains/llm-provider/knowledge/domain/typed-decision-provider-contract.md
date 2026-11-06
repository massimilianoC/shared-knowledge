# Domain: Typed-Decision Models in an LLM Provider Platform

## Scope

This package includes language-understanding model providers with different inference contracts. Chat-oriented LLMs generate content from messages; TypeSafe System One models evaluate a state against typed questions and return constrained answers and probabilities. TypeSafe describes System One as **like an LLM in its ability to understand natural-language input**, while distinguishing it from an LLM by its decision output and training objective. Keeping the integration in this package reflects shared provider concerns—catalog, credentials, routing, usage, and fallback—without implying that the model accepts a chat-completion request.

System One is a bounded decision component inside a larger application or agent workflow. It does not itself perform agentic planning, tool use, or generated explanations.

## Separate transport from inference contract

| Concern | Generative chat contract | Typed-decision contract |
| --- | --- | --- |
| Input | Messages and generation settings | `state`, a named `questions` map, and a model ID |
| Output | Generated content, possibly with tool calls or structured output | `answers` keyed by question ID, each with a typed value; some types include probabilities and confidence |
| Application adapter | `chat(request)` | `evaluate(state, questions)` |
| Catalog capability | `chat` | `decision` or `typed-decision` |
| Validation | Generated-output and schema checks | Match each answer to its question type and allowed values; check probability fields where supplied |
| Adoption evidence | Task-specific generation quality and safety checks | Labeled accuracy, hard errors, confusion, calibration, and accuracy after escalation gates |

The provider name, credential mechanism, or an OpenAI-compatible base URL does not determine the inference contract. Route by model capability and request contract before selecting an adapter. The existing [LLM gateway router](../../skills/platform/llm-gateway-router.md) documents a **chat** workflow; it is not a drop-in adapter for typed decisions.

For System One, the [TypeSafe API reference](https://docs.typesafe.ai/api) specifies `POST /v1/systemone` with `state`, `model`, and `questions`. `choice` and `score` answers include probability distributions and a derived `confidence`; `noul` returns a yes-probability without a separate confidence field. The [primitives guide](https://docs.typesafe.ai/primitives) says questions in one request are evaluated independently over the same state. A provider wrapper may add fields such as cost, so adapters must validate the actual response they receive.

## Integration boundary

1. Catalog the model with a decision capability and its request contract. Keep this separate from transport or authentication metadata.
2. Select a typed-decision adapter for `state` and `questions`. Do not pass the request through `chat(messages)` or a chat output normalizer.
3. Normalize provider-specific responses into a domain-owned decision result, retaining the question types, probabilities, model version, usage, and provider metadata needed for audit.
4. Apply deterministic policy and calibrated gates after evaluation. A chat model can serve as a fallback only through an explicit task adapter with its own benchmark; the two response contracts are not interchangeable.
5. Record usage and errors with the `decision` capability so costs and reliability can be analyzed separately from chat traffic.

## Adoption context

Use the [System One integration skill](../../skills/platform/system-one-typed-decisions.md) for the adapter and the [classification benchmark skill](../../skills/platform/classification-benchmark.md) for task evidence. The [portable kit](../../templates/classification-benchmark-kit/README.md) demonstrates the typed contract. Its sample endpoint and model ID are examples, not a timeless provider specification.

### Provider-specific quick start

1. Copy `templates/classification-benchmark-kit/` as a unit. Its scripts require Node 20 or later and no installed packages.
2. For OpenRouter, set `OPENROUTER_API_KEY` and run `node systemone-bench.mjs --task=./task.example.mjs --data=./dataset.example.jsonl --probe` from the copied kit directory.
3. For the direct TypeSafe API, set `TYPESAFE_API_KEY` and use `--task=./task.typesafe.example.mjs` with the same command. The second task changes only the endpoint, credential name, and model ID.
4. Once the probe succeeds, replace the example questions, criteria, labels, state builder, and acceptance gates with domain-owned values. Run with `--dump`, review a failed case, and independently recompute a metric from the CSV.

These commands are examples of the typed-decision contract. The [TypeSafe model list](https://docs.typesafe.ai/models) and provider documentation remain authoritative for available IDs, prices, and limits. The eight supplied records validate wiring only and cannot establish model accuracy or calibration.

## Sources

- [TypeSafe System One concept](https://docs.typesafe.ai/concepts/system-one), [API reference](https://docs.typesafe.ai/api), [primitives guide](https://docs.typesafe.ai/primitives), and [model list](https://docs.typesafe.ai/models), consulted 2026-09-22.
- `inbox/processed/classification-benchmark-kit/SKILL-system-one-models.md`, archived source dated 2026-09-21. Source-project measurements are not portable guarantees.
