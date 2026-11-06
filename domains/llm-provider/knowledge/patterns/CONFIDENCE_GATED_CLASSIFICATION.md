# Pattern: Confidence-Gated Classification with an Auditable Benchmark

## Context

A classifier may be cheap and accurate on average yet unsafe for specific errors. A single aggregate accuracy number does not show whether confidence predicts correctness or whether the cases handled without review are reliable.

## Mechanism

1. Build a blind, labeled dataset with hard cases and record any class balancing.
2. Fix hard-error definitions and action thresholds before the first scored run.
3. Ask small independent questions and retain the underlying answer distributions where available.
4. In application code, route each outcome to terminal handling, autonomous action, review, or fallback. Apply the highest applicable risk signal; do not average a high risk signal away.
5. Evaluate hard errors, per-class confusion, confidence calibration, escalation reasons, and accuracy within the autonomous subset.
6. Preserve raw request and response evidence, then independently recompute a reported metric.
7. Rebenchmark when the task, model, or routing policy changes.

Confidence gating is justified only when the target population supports the calibration estimate. Sparse or non-monotonic buckets call for more evidence or a different routing signal. Each action can have a different gate because the consequences of error differ.

## Consequences

- Business policy remains versioned and testable outside the model.
- A successful overall accuracy can still fail on one prohibited error or an unsafe autonomous subset.
- More cases and representative traffic are needed before projecting production escalation, cost, or latency.
- The live pipeline and adversarial-input safety remain separate evaluation subjects.

## Related artifacts

- [Classification benchmark skill](../../skills/platform/classification-benchmark.md)
- [System One typed decisions skill](../../skills/platform/system-one-typed-decisions.md)
- [Portable benchmark kit](../../templates/classification-benchmark-kit/README.md)

## Source

Derived from `inbox/processed/classification-benchmark-kit/` (2026-09-21). The source's single-project percentages and vendor claims are not portable guarantees.
