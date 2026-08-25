# Pattern: LLM Model Discovery (Bootstrap + On-Demand)

## Problem
The catalog of models offered by an LLM provider changes over time.
Hardcoding it is fragile, while querying the provider on every request adds latency.
A better strategy is needed to keep the catalog fresh without hurting runtime performance.

## Solution

**Use two idempotent sync triggers:**

1. **Startup sync** — when the gateway boots, every enabled provider calls `listModels()` and upserts the results into `provider_models_catalog`
2. **On-demand sync** — provide an admin endpoint such as `POST /admin/providers/:providerKey/sync` to force a manual refresh for operations, incidents, or onboarding

**Fallback:** if the provider does not respond during sync, keep the existing DB catalog and continue serving requests.

## Idempotent sync structure

```ts
async function syncProviderModels(providerKey: string): Promise<SyncResult> {
  const provider = await providersRepo.findEnabled(providerKey)
  const discovered = await providerAdapter.listModels(provider)

  for (const model of discovered) {
    await providerModelsRepo.upsert({
      providerKey,
      modelKey: model.id,
      displayName: model.id,
      capability: 'chat',
      enabled: true,
      discoveredAt: new Date(),
      source: 'auto_discovery',
    })
  }
  return { synced: discovered.length, provider: providerKey }
}
```

## Model deprecation policy

Do not immediately delete models that disappear from discovery — they may only be temporarily unavailable:

```
missing from discovery → status: 'deprecated' → (after N days with no return) → enabled: false
```

Keep the fields `discoveredAt` and `source: 'seed' | 'auto_discovery' | 'manual'` so the origin of each entry remains traceable.

## Control environment variables

```env
PROVIDERS_AUTO_MODEL_DISCOVERY_ENABLED=true
PROVIDERS_AUTO_MODEL_DISCOVERY_ON_STARTUP=true
GATEWAY_MODELS_LIMIT_PER_PROVIDER=0   # 0 = no limit
```

## On-demand sync scripts (npm)

```bash
npm run devops:providers:init -- siliconflow lmstudio
# or a single provider:
npm run devops:providers:init:siliconflow
```

## When to use
- Bootstrapping a new provider
- Refreshing the catalog after new models are released
- Recovering from an incident such as a corrupted or emptied catalog
- Pre-warming models when the BFF or frontend starts up

## Common pitfalls to avoid
- Deleting missing models immediately — this can disable still-needed models during a temporary provider outage
- Ignoring fallback behavior — the DB catalog should always remain a usable source of truth
- Using low numeric limits for the number of models per provider, such as `GATEWAY_MODELS_LIMIT_PER_PROVIDER=10`, which silently excludes valid models

## Related patterns
- [MULTIPROVIDER_LLM_ARCHITECTURE](MULTIPROVIDER_LLM_ARCHITECTURE.md)

## Source
Extracted from: MULTIPROVIDER_MULTIMODEL_PLATFORM_PLAYBOOK.md
Date: 2026-04-17
