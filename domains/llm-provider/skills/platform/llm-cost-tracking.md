# Skill: LLM Cost Tracking

## Description
Estimates and tracks the cost of LLM calls using a dual-source strategy:
priority goes to provider-reported cost, such as OpenRouter `usage.cost`,
with a fallback to a flat-rate estimate based on tokens and per-provider price tables.
It also includes model price-tier classification for the UI.

## Expected inputs
- `usage: { promptTokens, completionTokens, totalTokens }` — from the LLM response
- `providerCostUsd?: number` — from `usage.cost` for OpenRouter or calculated for SiliconFlow
- `model: LlmModel` — with `priceInputUsdPerM` and `priceOutputUsdPerM`
- Config values such as `usdToEurRate`, `markupFactor`, `textEurPer1kTokens`, and `imageEurPerAsset`

## Produced outputs
- `CostEstimate: { currency, amount, source: "provider" | "flat-rate", ... }`
- Provider pricing lookup tables, such as `siliconflowPricing.ts`
- `priceTier: "free" | "€" | "€€" | "€€€" | "€€€€"` for the UI

## Steps / Procedure

### 1. Dual-source cost estimate

```typescript
function estimateCost(input: CostPolicyInput, cfg: CostPolicyConfig): CostEstimate {
    // Provider-reported cost takes precedence because it is more accurate
    if (input.providerCostUsd !== undefined && input.providerCostUsd > 0) {
        const amount = input.providerCostUsd * cfg.usdToEurRate * cfg.markupFactor;
        return { currency: "EUR", amount, source: "provider",
                 providerCostUsd: input.providerCostUsd };
    }
    // Fallback: flat-rate estimate from tokens
    const tokenCost = (input.tokenUsage?.totalTokens ?? 0) / 1000 * cfg.textEurPer1kTokens;
    const imageCost = (input.imageCount ?? 0) * cfg.imageEurPerAsset;
    return { currency: "EUR", amount: tokenCost + imageCost, source: "flat-rate" };
}
```

### 2. Compute provider cost from a lookup table (SiliconFlow)

SiliconFlow does not return `usage.cost`, so the cost must be derived from the model price:

```typescript
function resolveProviderCostUsd(
    model: LlmModel,
    usage: { promptTokens: number; completionTokens: number }
): number | undefined {
    if (!model.priceInputUsdPerM || !model.priceOutputUsdPerM) return undefined;
    return (usage.promptTokens / 1_000_000) * model.priceInputUsdPerM
         + (usage.completionTokens / 1_000_000) * model.priceOutputUsdPerM;
}
```

### 3. Provider pricing lookup table

```typescript
// siliconflowPricing.ts — update periodically with source date and pricing URL
// Updated: 2026-01 — https://siliconflow.cn/pricing
export const SILICONFLOW_MODEL_PRICES: Readonly<Record<string, SfModelPrice>> = {
    "Qwen/Qwen3-32B":                       { input: 0.14, output: 0.57, priceUnit: "per_m_tokens" },
    "deepseek-ai/DeepSeek-V3":              { input: 0.25, output: 1.00, priceUnit: "per_m_tokens" },
    "BAAI/bge-m3":                          { input: 0.00, output: 0.00, priceUnit: "free" },
    "black-forest-labs/FLUX.1-dev":         { input: 0.014, output: 0, priceUnit: "per_image" },
    "black-forest-labs/FLUX.1-schnell":     { input: 0.0014, output: 0, priceUnit: "per_image" },
};
```

### 4. UI price tier classification

Classify models into `free/€/€€/€€€/€€€€` tiers based on percentiles in the catalog price distribution.
Exclude models with `priceUnit: "per_image"` from the distribution because they use a different billing unit.

```typescript
function derivePriceTier(pricePerMTokens: number): LlmModel["priceTier"] {
    if (pricePerMTokens === 0) return "free";
    if (pricePerMTokens < 0.1) return "€";
    if (pricePerMTokens < 0.5) return "€€";
    if (pricePerMTokens < 2.0) return "€€€";
    return "€€€€";
}
```

## Key patterns
- **Provider-reported cost** always has priority over a flat-rate estimate because it is more accurate
- **OpenRouter** returns `usage.cost` directly in the response — use it whenever present
- **SiliconFlow** requires a lookup table plus manual calculation — keep the table updated
- Do not mix `per_m_tokens` and `per_image` units in the same statistical tier distribution

## Common pitfalls to avoid
- Ignoring `usage.cost` and always using flat-rate — this is less accurate, especially with variable pricing
- Storing a lookup table without an update date — prices change over time
- Calculating tiers on mixed units (`per_m_tokens` + `per_image`) — this produces misleading tiers
- Forgetting `markupFactor` — provider cost is the raw provider expense, not the end-user cost

## Usage examples
```
"Implement cost tracking for SiliconFlow and OpenRouter calls:
 OpenRouter should use usage.cost, while SiliconFlow should use a lookup table based on model pricing."
```

## Related skills
- [multiprovider-llm-catalog](multiprovider-llm-catalog.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-04-17
