# Skill: LLM Credit Engine (Abstract Credits)

## Description
Implements an abstract credit system that hides real provider pricing differences
behind one internal metric. It covers the base formula, recommended cost tiers
(economy/standard/premium), model complexity multipliers, and a rate table per provider and model.

## Expected inputs
- `tokensIn: number`, `tokensOut: number` — from the LLM response
- `providerKey: string`, `modelKey: string`, `capability: string`
- A `credit_rates` table containing rates and multipliers per provider, model, and capability

## Produced outputs
- `creditsCharged: number` — internal units charged to the wallet
- A `credit_rates` schema ready for MongoDB or SQL
- Model classification into tiers such as economy, standard, and premium

## Steps / Procedure

### 1. `credit_rates` schema

```ts
interface CreditRate {
  providerKey: string
  modelKey: string          // '*' = fallback for all models of the provider
  capability: string        // 'chat' | 'embedding' | 'image' | 'rerank'
  inputCreditsPer1k: number
  outputCreditsPer1k: number
  cacheReadCreditsPer1k?: number
  cacheWriteCreditsPer1k?: number
  multiplier: number        // 1.0 standard; >1 premium; <1 economy
  active: boolean
}
```

### 2. Base credit formula

```ts
function computeCredits(usage: TokenUsage, rate: CreditRate): number {
  const inputUnits  = usage.tokensIn  / 1000
  const outputUnits = usage.tokensOut / 1000
  const base = inputUnits * rate.inputCreditsPer1k + outputUnits * rate.outputCreditsPer1k
  return base * (rate.multiplier ?? 1)
}
```

### 3. Recommended cost tiers

| Tier | Multiplier | inputCreditsPer1k | outputCreditsPer1k | Example models |
|---|---|---|---|---|
| economy | 0.8 | 0.6 | 1.0 | small or fast models, self-hosted setups |
| standard | 1.0 | 1.0 | 2.0 | balanced models |
| premium | 1.4–1.8 | 1.8 | 3.2 | large models or advanced reasoning models |

### 4. Rate resolution with fallback

```ts
async function resolveActiveRate(
  providerKey: string,
  modelKey: string,
  capability: string,
): Promise<CreditRate> {
  // Look for a model-specific rate first
  const specific = await creditRatesRepo.findActive(providerKey, modelKey, capability)
  if (specific) return specific
  // Fallback: wildcard rate for the provider
  const wildcard = await creditRatesRepo.findActive(providerKey, '*', capability)
  if (wildcard) return wildcard
  // Safety default
  return { inputCreditsPer1k: 1, outputCreditsPer1k: 2, multiplier: 1, active: true } as CreditRate
}
```

### 5. Practical example

```
tokensIn = 1200, tokensOut = 800
inputRate = 1.0, outputRate = 2.0, multiplier = 1.0

input  = (1200/1000) × 1.0 = 1.2
output = (800/1000)  × 2.0 = 1.6
total  = (1.2 + 1.6) × 1.0 = 2.8 credits
```

## Key patterns
- **Tier system** — start with 3 tiers, then refine the rates using real `usage_events` data
- **Separate multiplier** — keep `inputCreditsPer1k` and `outputCreditsPer1k` stable per tier and vary only the multiplier per model
- **Wildcard rate** — use `modelKey: '*'` as a safety net for new models that do not yet have explicit pricing

## Common pitfalls to avoid
- Mixing abstract credits with real USD or EUR pricing in the same unit — keep them separate
- Hardcoding rates in code — keep them in the database so they can be updated without a deploy
- Using zero rates for premium models — this can lead to serious underestimation of internal cost

## Related skills
- [llm-cost-tracking](llm-cost-tracking.md) — tracks real cost in EUR/USD, which is different from abstract credits
- [llm-gateway-router](llm-gateway-router.md) — typical integration point for the credit engine

## Source
Extracted from: MULTIPROVIDER_MULTIMODEL_PLATFORM_PLAYBOOK.md
Date: 2026-04-17
