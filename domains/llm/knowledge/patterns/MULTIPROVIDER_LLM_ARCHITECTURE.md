# Pattern: Multi-Provider LLM Architecture

## Problem
How do you integrate multiple LLM providers — OpenAI-compatible, Anthropic, or local ones — without writing provider-specific business logic, while still preserving the ability to swap models without touching application code?

## Solution

**All OpenAI-compatible providers share the same API shape:**

```
POST {baseUrl}/chat/completions
Authorization: Bearer {apiKey}     ← or no header if authType === "none"
Content-Type: application/json

{ "model": "{model_id}", "messages": [...], "max_tokens": 8000, "stream": true }
```

Compatible providers include OpenAI, SiliconFlow, OpenRouter, LM Studio, Ollama, Together.ai,
Groq, Azure OpenAI, and many others.

## Recommended structure

```
domain/
  entities/LlmCatalog.ts               ← LlmModel, LlmProviderCatalog, PipelineModelRole
  repositories/LlmCatalogRepository.ts ← pure interface, no infrastructure details

application/
  use-cases/GetLlmCatalog.ts           ← env source or mongo source, same output shape
  use-cases/SeedLlmCatalog.ts          ← populates MongoDB from the static catalog
  llm/defaultSiliconFlowCatalog.ts
  llm/defaultLmStudioCatalog.ts
  llm/defaultOpenRouterCatalog.ts
  llm/modelRegistryPresets.ts          ← decorateModel (displayName, description, promptTemplate)
  llm/costPolicy.ts                    ← dual-source estimateCost()
  llm/siliconflowPricing.ts            ← pricing lookup table

infra/
  repositories/MongoLlmCatalogRepository.ts  ← concrete implementation
```

**Architectural principles:**
- The presentation layer sees only `LlmProviderCatalog[]` and knows nothing about endpoints or secrets
- Use semantic roles (`PipelineModelRole`) instead of hardcoded model IDs
- Centralize auth routing in `buildAuthHeaders()` so there is no scattered provider branching
- Resolve API keys only at call time and never expose them to the frontend

## Variants

| Scenario | Approach |
|---|---|
| Local dev without cloud access | `LLM_CATALOG_SOURCE=env` + local LM Studio |
| Editable production catalog | `LLM_CATALOG_SOURCE=mongo` + idempotent seeding |
| Arbitrary additional providers | `LLM_PROVIDER_API_KEYS_JSON={"x":"sk-..."}` |
| Slow outputs (> 3s) | Background task + client polling |
| Real-time chat | SSE streaming |

## Quick checklist for a new project

- [ ] Canonical entities in `domain/` (`LlmModel`, `LlmProviderCatalog`, `PipelineModelRole`)
- [ ] Centralized auth routing with `buildAuthHeaders`
- [ ] Zod config validated at bootstrap with fail-fast behavior
- [ ] Dual-source catalog with env fallback
- [ ] Provider key map derived at bootstrap
- [ ] Context budget stored in env (`MAX_CONTEXT_CHARS`, etc.)
- [ ] Output budget policy added to the system prompt
- [ ] Model deduplication before sending data to the frontend
- [ ] Structured logging: `{ provider, model, durationMs, tokenUsage, costEstimate, error? }`
- [ ] Normalized error codes such as `LLM_PROVIDER_AUTH_FAILED` and `LLM_PROVIDER_RATE_LIMIT`

## Related skills
- [multiprovider-llm-catalog](../../skills/platform/multiprovider-llm-catalog.md)
- [llm-context-budget](../../skills/platform/llm-context-budget.md)
- [llm-cost-tracking](../../skills/platform/llm-cost-tracking.md)
- [llm-background-tasks](../../skills/platform/llm-background-tasks.md)

## Source
Extracted from: `inbox/MULTIPROVIDER_LLM_BEST_PRACTICES.md`
Date: 2026-04-17
