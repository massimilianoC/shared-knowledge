# Decision: Dual-source cost tracking — provider-reported vs flat-rate

## Problem
Different LLM providers expose cost information in different ways:
- OpenRouter returns `usage.cost` directly in the response as real USD cost
- SiliconFlow does not expose `usage.cost` and requires manual calculation
- Local providers such as LM Studio effectively cost zero

How can cost estimation be unified without losing accuracy?

## Decision
Use a dual-source strategy that prioritizes provider-reported cost:

```typescript
function estimateCost(input: CostPolicyInput, cfg: CostPolicyConfig): CostEstimate {
    // 1. Provider-reported cost takes precedence because it is more accurate
    if (input.providerCostUsd !== undefined && input.providerCostUsd > 0) {
        return { source: "provider", amount: input.providerCostUsd * cfg.usdToEurRate * cfg.markupFactor, ... };
    }
    // 2. Fallback: flat-rate estimate from tokens × lookup-table prices
    return { source: "flat-rate", amount: ... };
}
```

For SiliconFlow, use a lookup table such as `Record<modelId, { input: number; output: number; priceUnit }>`
and calculate the cost as `(promptTokens / 1M) * priceInputUsdPerM + (completionTokens / 1M) * priceOutputUsdPerM`.

## Why
- Provider-reported cost is always more accurate than an estimate because it reflects discounts, promotions, and pricing nuances
- A SiliconFlow lookup table is required because the API does not expose raw cost values
- The flat-rate fallback guarantees that a cost can still be produced even for unknown providers

## Operating rules
- Update the lookup table periodically and record the source date and URL
- Do not mix `per_m_tokens` and `per_image` data in the same statistical aggregation
- Apply a `markupFactor` of at least $1.0$ to cover operational overhead

## Source
`inbox/MULTIPROVIDER_LLM_BEST_PRACTICES.md` (sections 12 and 19)
Date: 2026-04-17
