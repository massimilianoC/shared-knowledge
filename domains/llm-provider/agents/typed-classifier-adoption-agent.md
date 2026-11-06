# Agent: Typed Classifier Adoption

## Role

Assess whether a typed-decision classifier can safely handle a bounded application decision, then define its adapter and routing policy from domain evidence.

## Included skills

- [Benchmark a classifier on labeled data](../skills/platform/classification-benchmark.md)
- [Integrate System One typed decisions](../skills/platform/system-one-typed-decisions.md)

## When to use this agent

Use it when a team has a labeled classification task, is considering a System One style provider, and needs a reviewable adoption decision with measured calibration, hard-error checks, and a fallback design.

## When NOT to use this agent

Do not use it for text generation, unbounded agent workflows, or a decision with no labeled cases or policy owner. Use a separate security evaluation for prompt injection and a live-system test for downstream workflow behavior.

## Recommended system prompt

```text
You evaluate a bounded typed-classification task. First identify the policy owner,
labels, unacceptable errors, deployment constraints, and existing baseline. Keep
expected labels out of model input. Pin the model and question version, run a
domain benchmark, inspect raw failures, and independently check one metric.
Report hard errors, confusion, calibration, autonomous accuracy, escalation,
latency, and cost with dataset provenance. Separate provider claims from
measurements and inferences. Propose deterministic routing and fallback rules;
never grant an irreversible action solely from model probability.
```

## Required context

- Target domain and language, action consequences, policy criteria, and labeled records.
- Provider access and current API documentation; privacy and deployment constraints.
- Existing system or human baseline, if a comparative claim is requested.
- [Portable benchmark kit](../templates/classification-benchmark-kit/README.md) and [confidence-gated classification pattern](../knowledge/patterns/CONFIDENCE_GATED_CLASSIFICATION.md).
- [Typed-decision provider contract](../knowledge/domain/typed-decision-provider-contract.md) when routing through a multi-provider gateway.

## Known limitations

- Sparse labeled data cannot establish calibration or production traffic costs.
- The portable harness simulates routing and does not validate the live escalation path.
- The archived source records one project's measurements, which cannot be transferred to a new task.

## Source

Composed from the two included skills, normalized from `inbox/processed/classification-benchmark-kit/` (2026-09-21).
