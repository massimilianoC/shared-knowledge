# Skill: Benchmark a Classifier on Labeled Data

## Description

Evaluate a classification or typed-decision model against a labeled dataset before using its predictions for automation. This procedure applies to structured-output LLMs, System One models, and conventional classifiers. It is a focused adoption spike, not a substitute for a maintained evaluation program.

## Expected inputs

- A JSONL dataset with a stable `id`, an `expected` label map, optional `group`, and task-specific input fields.
- A versioned prompt or question set, a function that builds the model input without exposing `expected`, and a mapping from answers to labels.
- Acceptance criteria fixed before the run: unacceptable error types, minimum accuracy, and any confidence or escalation thresholds.
- A baseline run on the same dataset when claiming an improvement over an existing system.

## Produced outputs

- Case IDs for hard errors; exact accuracy and a confusion matrix for each target; adjacent accuracy only for ordered targets.
- Accuracy by confidence bucket, escalation rate and reasons, accuracy among cases handled without escalation, and per-group results.
- Measured latency, token usage, and cost where the provider reports them.
- Raw requests and responses plus a flat outcome file from which at least one summary metric can be recomputed.

## Steps / Procedure

1. Define each target as nominal or ordinal. For ordinal targets, record the complete ordered level list. Define hard errors as predicates that identify unacceptable cases; one occurrence fails that criterion regardless of mean accuracy.
2. Set the accuracy and automation gates before viewing results. Choose thresholds by the consequence of an incorrect action. An observed failure should trigger a new task version and another run, rather than a retroactive threshold change.
3. Prepare blind labels: pass only task input to the model, never the `expected` object or other answer-bearing fields. Include real and adversarial cases, such as claimed urgency without a real deadline, hostile tone without a critical condition, and irrelevant content that resembles business input. Record whether class balancing differs from production traffic.
4. Use atomic questions and keep untrusted content separate from policy or taxonomy fields. Compute dates, amounts, and counts with deterministic code when their exact values matter. Version the questions and criteria along with the dataset.
5. Run a small connectivity probe, then the full dataset. Preserve raw request state, raw response text, model version, timing, and per-case outcomes. Record call failures separately from incorrect predictions.
6. Read the results in order: hard errors, exact and adjacent accuracy, confusion direction, confidence calibration, escalation rate and reasons, accuracy on non-escalated cases, diagnostic signal separation, groups, cost, and latency. Inspect at least one failed case directly.
7. Recompute at least one summary metric from the flat outcomes without using the benchmark summary code. Compare any baseline on the same labeled cases and under comparable conditions. Report limitations and untested risks beside the favorable results.

The [portable System One kit](../../templates/classification-benchmark-kit/README.md) implements this workflow for a typed-decision API. Its sample data is only a smoke test.

## Interpretation cautions

- Sparse confidence buckets cannot establish calibration. A monotonic trend in a small sample is suggestive, not proof; use enough cases per bucket and inspect uncertainty before automating on confidence.
- Mean accuracy on a deliberately balanced set is not a production traffic estimate. Escalation and cost projections need a representative traffic mix.
- Adjacent accuracy has no meaning for unordered categories. A small-sample p95 can be dominated by one network outlier.
- A directional confusion pattern may suggest unclear criteria, but it does not prove the model is sound. Test revised criteria on fresh cases.
- Keep vendor claims, project measurements, and interpretations separately attributed. Never compare percentages from different datasets as if they were a head-to-head test.
- This benchmark does not test prompt injection or the live escalation pipeline unless those are explicitly included as separate tests.

## Common pitfalls to avoid

- Letting the expected answer leak into the input through a whole-record state builder.
- Averaging a hard error into an overall score or using an average of independent risk signals to suppress one high signal.
- Treating an LLM's self-reported `confidence` as calibrated without testing it.
- Presenting a successful raw example while hiding failed cases or omitting raw artifacts.
- Using a single fixed percentage, such as a source project's threshold, without adapting it to the application's risk and traffic.

## Related skills

- [System One typed decisions](system-one-typed-decisions.md)
- [LLM cost tracking](llm-cost-tracking.md)
- [LLM gateway router](llm-gateway-router.md)

## Source

Normalized from `inbox/processed/classification-benchmark-kit/SKILL-classification-benchmark.md` and its kit README (2026-09-21). Source measurements are not universal acceptance thresholds.
