# Classification Benchmark Kit

A small, portable benchmark for a System One style typed-decision API. Copy this entire directory into a project. The harness has no package dependencies and runs with Node 20 or later. Adapt `task.example.mjs`; replace the eight smoke-test records with your own labeled data before drawing conclusions.

## Run

Choose a provider task and set its credential in your shell. `task.example.mjs` uses OpenRouter with `OPENROUTER_API_KEY`; `task.typesafe.example.mjs` uses the direct TypeSafe API with `TYPESAFE_API_KEY`. Both carry the same questions and labels, so the provider contract can be compared on identical cases. Confirm the current endpoint and model ID before sending data; the examples pin model IDs observed on 2026-09-22.

```sh
node systemone-bench.mjs --task=./task.example.mjs --data=./dataset.example.jsonl --probe
node systemone-bench.mjs --task=./task.example.mjs --data=./dataset.example.jsonl --limit=8 --dump --out=./reports/example
node systemone-bench.mjs --task=./task.typesafe.example.mjs --data=./dataset.example.jsonl --probe
```

Run from this directory or pass paths relative to the current working directory. `--probe` sends the first record and prints the response. `--limit=N` selects the first N records; `--model=ID` and `--endpoint=URL` override the task provider settings. `--dump` writes `raw-responses.jsonl` and `outcomes.csv`. A missing credential or call failure exits with an error so an empty run cannot look successful.

## Adaptation contract

Each JSONL record needs `id` and `expected`; `group` is optional. `buildState(record)` must select only input fields and must not include `expected`. Set `questions`, `targets`, confidence `gates`, any `signalGates` or `alwaysEscalate` rule, and `hardErrors` before the scored run. Use ordered `levels` only for ordinal targets. The first target is the summary target for autonomous accuracy and signal separation.

The harness reports hard errors, exact and adjacent accuracy, confusion counts, confidence buckets, escalation reasons, diagnostic signal separation, latency, token usage, and cost when returned by the provider. The response dump includes input state and raw response text, which may contain sensitive data; store it under the project's data handling rules. The harness measures model decisions and simulates routing. It does not call the downstream reviewer or test the live pipeline.

The [typed-decision contract note](../../knowledge/domain/typed-decision-provider-contract.md) explains why these tasks use `state` and `questions` instead of a chat `messages` payload. This repository's offline validation suite tests both tasks with a local mock provider. That suite is maintenance infrastructure and is not required when copying this package.

Independently recalculate a summary metric from `outcomes.csv`. For example, inspect `ok_band` values to count exact matches. Compare a baseline only after running it on the same cases. Confidence buckets from this eight-record example are too small for calibration conclusions.

## Provenance

Adapted and translated from `inbox/processed/classification-benchmark-kit/` (2026-09-21). The original source remains archived outside the copyable package. This kit uses Node's native JavaScript runtime and avoids a hard-coded price fallback. The repository validation suite tests its behavior against a local mock provider; live provider behavior requires a separate integration check.

Related guidance: [classification benchmark](../../skills/platform/classification-benchmark.md) and [System One typed decisions](../../skills/platform/system-one-typed-decisions.md).
