# Domain: LLM Gateway Platform — Data Model

## Context
Canonical data schema for a multi-provider LLM platform with cost governance.
Validated on MongoDB collection design, but portable to SQL as well.

## Collections / Tables

### providers_registry
Configuration of the LLM providers: endpoints, auth mode, and status.

| Field | Type | Notes |
|---|---|---|
| providerKey | string | for example `siliconflow`, `lmstudio` — unique key |
| displayName | string | UI label |
| baseUrl | string | resolved from env vars at runtime |
| apiType | enum | `openai-compatible` \| `anthropic-compatible` \| `custom` |
| authType | enum | `api-key` \| `bearer` \| `none` |
| enabled | bool | primary routing gate |
| timeoutMs | number | timeout for provider calls |
| retryPolicy | object | max retries and backoff |

### provider_models_catalog
Catalog of enabled models per provider.

| Field | Type | Notes |
|---|---|---|
| providerKey | string | FK → providers_registry |
| modelKey | string | real provider ID, for example `Qwen/Qwen3-32B` |
| displayName | string | UI label |
| capability | enum | `chat` \| `embedding` \| `image` \| `rerank` |
| contextWindow | number | maximum input tokens |
| maxOutputTokens | number | maximum output tokens |
| enabled | bool | routing gate |
| pricingProfileKey | string | logical tier key such as economy/standard/premium |
| discoveredAt | date | last auto-sync timestamp |
| source | enum | `seed` \| `auto_discovery` \| `manual` |

### credit_rates
Rates used to compute abstract credits per provider, model, and capability.

| Field | Type | Notes |
|---|---|---|
| providerKey | string | `*` = wildcard for all providers |
| modelKey | string | `*` = wildcard for all models of the provider |
| capability | string | `chat` \| `embedding` \| ... |
| inputCreditsPer1k | number | credits per 1k input tokens |
| outputCreditsPer1k | number | credits per 1k output tokens |
| cacheReadCreditsPer1k | number | optional |
| cacheWriteCreditsPer1k | number | optional |
| multiplier | number | 1.0 = standard; use it for premium/economy tiers |
| active | bool | only one active rate per provider/model/capability combination |

### usage_events
Immutable log of every LLM call, serving as the primary source for analytics and billing.

| Field | Type | Notes |
|---|---|---|
| organizationId | string | |
| userId | string | optional |
| providerKey | string | |
| modelKey | string | |
| capability | string | |
| tokensIn | number | |
| tokensOut | number | |
| creditsCharged | number | charged in abstract credit units |
| latencyMs | number | |
| status | enum | `ok` \| `error` \| `timeout` |
| createdAt | date | |

### org_provider_access
Access policy determining which providers are enabled for each organization.

| Field | Type | Notes |
|---|---|---|
| organizationId | string | |
| providerKey | string | |
| enabled | bool | |

## Common operational queries (MongoDB)

```js
// Active providers
db.providers_registry.find({ enabled: true }, { providerKey: 1, displayName: 1, apiType: 1 })

// Models for a combo box based on selected provider
db.provider_models_catalog.find(
  { providerKey: 'siliconflow', enabled: true, capability: 'chat' },
  { modelKey: 1, displayName: 1 }
).sort({ modelKey: 1 })

// Active credit rates
db.credit_rates.find({ active: true }).sort({ providerKey: 1, modelKey: 1 })

// Providers accessible to one organization
db.org_provider_access.find({ organizationId: '<orgId>', enabled: true }, { providerKey: 1 })
```

## Real snapshot (2026-04-17)
- `providers_registry`: 4 documents (`lmstudio`, `siliconflow`, `comfyui`, `rag-service`)
- `provider_models_catalog`: 84 documents
- `org_provider_access`: 2 documents
- `credit_rates`: 6 documents

## Source
Extracted from: MULTIPROVIDER_MULTIMODEL_PLATFORM_PLAYBOOK.md
Date: 2026-04-17
