# Skill: Integrate System One Typed Decisions

## Description

Integrate a language-understanding typed-decision model that evaluates independent `choice`, `score`, and `noul` questions over shared state. Use it for bounded classification or verification where the application needs inspectable probabilities and deterministic routing. Its `state`/`questions` request and `answers` response are a separate inference contract from generative chat, even when both models are accessed through the same provider platform. It does not generate explanations or replace a chat LLM for generative work. See the [provider-contract domain note](../../knowledge/domain/typed-decision-provider-contract.md).

## Expected inputs

- A task taxonomy, policy criteria, and a minimal structured state with untrusted input isolated in its own field.
- A provider endpoint, credential, and versioned model identifier, verified against the provider's current documentation.
- Labeled domain data and action-specific acceptance gates, evaluated with [classification benchmarking](classification-benchmark.md).
- A fallback or human review route for uncertainty, provider failure, and deployments that cannot use the API.

## Produced outputs

- A typed request and adapter that validates `choice`, `score`, and `noul` answers, usage fields, and provider errors.
- Application-owned routing rules for automatic action, review, fallback, and terminal decisions.
- A benchmark report with calibration and failure evidence from the target domain.

## Steps / Procedure

1. Register this as a decision capability and select an `evaluate(state, questions)` adapter. Do not route it through the chat `messages` payload or normalize its result as generated text. Verify the currently supported endpoint, model ID, limits, pricing, and response schema. The archived source observed two OpenRouter routes and a direct TypeSafe route on 2026-09-21; those observations are dated, not a live service contract.
2. Express each bounded judgment as a small typed question. Use `choice` for a closed set, `score` for ordered levels, and `noul` for a binary signal. Give neighboring options explicit boundaries and examples. Keep calculations and temporal comparisons in deterministic code.
3. Send a minimal structured state. Separate policy from third-party content and refer to fields by path. Treat hostile content as untrusted; the decision model is not an injection defense.
4. Validate answers by type. For `score`, select the winning discrete level with the maximum returned class probability, retaining the continuous score only as a diagnostic. A `noul` answer is itself a probability and may have no separate `confidence`. Optional wrapper fields such as `usage.cost` must be checked before use.
5. Combine independent answers in application code. Use action-specific confidence gates and explicit risk rules. A probabilistic result may block automation, but it cannot authorize an action outside deterministic policy. Test any assumed cross-question consistency rather than relying on it.
6. Handle malformed requests and credentials as configuration failures; retry only transient rate or overload responses with bounded backoff. Route persistent failures to the documented fallback or review path.
7. Benchmark the pinned model and question version on the target language and domain. Re-run after question, criteria, model, or provider changes, and monitor calibration drift after deployment.

The [portable kit](../../templates/classification-benchmark-kit/README.md) contains a minimal adapter and benchmark harness. Its endpoint and model defaults are examples that require current verification.

## Common pitfalls to avoid

- Rounding a continuous `score` to choose a class instead of using `argmax(probabilities)`.
- Inventing a `confidence` field for `noul` or assuming a wrapper-specific `usage.cost` always exists.
- Using the model to perform exact arithmetic, dates, entity extraction from scratch, text generation, or agentic control flow.
- Treating multiple answers as mutually consistent just because they were submitted in one request.
- Reusing thresholds or accuracy measured on another domain, language, model version, or class mix.
- Sending third-party content into a required route without a privacy and deployment review.

## Related skills

- [Classification benchmark](classification-benchmark.md)
- [LLM gateway router](llm-gateway-router.md)
- [Multi-provider catalog](multiprovider-llm-catalog.md)
- [Typed-decision provider contract](../../knowledge/domain/typed-decision-provider-contract.md)

## Source

Normalized from `inbox/processed/classification-benchmark-kit/SKILL-system-one-models.md` and its source kit (2026-09-21). API observations and source measurements are attributed to that date; verify live service details before use.
