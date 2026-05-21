# Skill: LLM Gateway Router

## Description
Implements runtime routing for LLM calls inside a multi-provider API gateway:
it validates the provider and model, resolves the correct adapter, applies token policy,
calls the provider, normalizes the response, and records usage plus charged credits.

## Expected inputs
- `provider: string` — provider key such as `siliconflow` or `lmstudio`
- `model: string` — the real provider model key
- `messages: Message[]` — chat payload
- `organizationId: string` — used for policy checks and credit charging

## Produced outputs
- A chat response in a unified schema
- A persisted `usage_event` with tokens, latency, charged credits, and status
- Credits charged to the organization wallet

## Steps / Procedure

### 1. Validate the provider and model

```ts
const provider = await providersRegistryRepository.findEnabledByKey(input.provider)
if (!provider) throw new GatewayError('PROVIDER_NOT_AVAILABLE')

const model = await providerModelsRepository.findEnabledModel(input.provider, input.model)
if (!model) throw new GatewayError('MODEL_NOT_AVAILABLE')
```

### 2. Resolve the adapter from a factory

```ts
const adapter = providerAdapterFactory.create(provider.apiType)
// apiType: 'openai-compatible' | 'anthropic-compatible' | 'custom'
```

### 3. Apply token policy

```ts
const bounded = tokenPolicy.apply(model, request)
// Clamp max_tokens to model.maxOutputTokens and respect TOKEN_POLICY_MAX_COMPLETION_TOKENS
```

### 4. Call the provider and normalize the response

```ts
const t0 = Date.now()
const response = await adapter.chat({ provider, model, payload: bounded })
const latencyMs = Date.now() - t0
const normalized = responseNormalizer.toUnified(response)
```

### 5. Compute and charge credits

```ts
const usage = usageExtractor.from(response)
const rate = await creditRatesRepository.resolveActiveRate({
  providerKey: input.provider,
  modelKey: input.model,
  capability: 'chat',
})
const inputCredits  = (usage.tokensIn  / 1000) * (rate.inputPer1kCredits ?? 1)
const outputCredits = (usage.tokensOut / 1000) * (rate.outputPer1kCredits ?? 1)
const totalCredits  = (inputCredits + outputCredits) * (rate.multiplier ?? 1)

await walletService.chargeCredits({ organizationId: input.organizationId, amount: totalCredits })
```

### 6. Persist the `usage_event`

```ts
await usageRepo.insert({
  organizationId: input.organizationId,
  providerKey: input.provider,
  modelKey: input.model,
  capability: 'chat',
  tokensIn: usage.tokensIn,
  tokensOut: usage.tokensOut,
  creditsCharged: totalCredits,
  latencyMs,
  status: 'ok',
  createdAt: new Date(),
})
```

## Key patterns
- **Adapter Factory** — isolates provider-call logic by protocol such as OpenAI-compatible or Anthropic-compatible
- **Unified schema** — callers never see the raw provider response
- **Charge-after-call** — charge credits only after a successful response and handle rollback paths on failure

## Standard error map

| Cause | Gateway error code |
|---|---|
| Provider timeout | `PROVIDER_TIMEOUT` |
| Auth failure | `PROVIDER_AUTH_FAILED` |
| Model not found or disabled | `MODEL_NOT_AVAILABLE` |
| Insufficient credits | `INSUFFICIENT_CREDITS` |

All errors should include: `{ code, message, provider, model, correlationId }`

## Common pitfalls to avoid
- Applying low hardcoded token limits such as `max_tokens: 10`; use `0` as the explicit no-limit value where appropriate
- Exposing the raw provider endpoint to the frontend instead of routing everything through the gateway
- Charging credits before receiving a successful provider response — the provider may fail
- Forgetting to include `correlationId` in error logs, which makes debugging much harder

## Related skills
- [multiprovider-llm-catalog](multiprovider-llm-catalog.md)
- [llm-credit-engine](llm-credit-engine.md)
- [llm-context-budget](llm-context-budget.md)

## Source
Extracted from: MULTIPROVIDER_MULTIMODEL_PLATFORM_PLAYBOOK.md
Date: 2026-04-17
