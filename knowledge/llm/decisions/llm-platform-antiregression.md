# Decision: LLM Gateway Platform — Anti-regression Rules

## Context
These operational rules were derived from real bugs and regressions encountered while implementing a multi-provider LLM platform. Each rule exists for a concrete reason.

## Rules

### 1. Use `0` as the explicit “no limit” value

**Rule:** `GATEWAY_MODELS_LIMIT_PER_PROVIDER=0` means no limit.
Do not use low hardcoded values such as `10`.

**Why:** A limit of 10 silently excludes legitimate models. SiliconFlow alone exposes dozens of models, so a low cap breaks the second combo box without obvious errors.

### 2. Pre-warm the model cache at BFF startup

**Rule:** The BFF must load the provider/model catalog at startup, not on the first request.

**Why:** The first user request should not wait for a round-trip to the database or provider just to populate model selectors.

### 3. Fall back to the DB catalog if the provider is down

**Rule:** If a provider does not respond during discovery sync, use the existing DB catalog. Do not clear the collection.

**Why:** A temporary provider outage must not make the models unavailable to users.

### 4. Keep a manual sync script

**Rule:** Always keep a manually runnable script such as `devops:providers:init`.

**Why:** It is essential for emergency operations, onboarding new providers in staging, and recovery after incidents — do not depend only on auto-discovery at boot.

### 5. Do not delete missing models immediately

**Rule:** Mark a missing model as `deprecated` first and disable it only after it stays missing for N days.

**Why:** A model may temporarily disappear from a provider’s `/models` list during maintenance without being permanently removed.

### 6. Always include both `provider` and `model` in the payload

**Rule:** The chat API request must always include both `provider` and `model`. Do not perform implicit routing by `model` alone.

**Why:** The same `modelKey` can exist on different providers, for example a Qwen model on local LM Studio and on SiliconFlow. Without `provider`, routing becomes ambiguous.

## Quick implementation checklist (15 min)

- [ ] `providers_registry` seeded with at least one provider
- [ ] `provider_models_catalog` populated through startup sync or a manual script
- [ ] `GET /v1/providers` and `GET /v1/providers/:key/models` exposed
- [ ] `POST /v1/chat/completions` routes by provider + model
- [ ] `usage_events` are persisted
- [ ] `credit_rates` contains at least one wildcard fallback rate
- [ ] `GATEWAY_MODELS_LIMIT_PER_PROVIDER=0` is set in the environment

## Source
Extracted from: MULTIPROVIDER_MULTIMODEL_PLATFORM_PLAYBOOK.md
Date: 2026-04-17
