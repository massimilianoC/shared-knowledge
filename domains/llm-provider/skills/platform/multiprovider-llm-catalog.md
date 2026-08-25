# Skill: Multi-Provider LLM Catalog

## Description
Designs and implements a provider-agnostic LLM catalog in Node.js and TypeScript.
It covers canonical entities, semantic roles, auth routing, Zod config, dual-source env/MongoDB loading,
model deduplication, local LM Studio support, and role-specific prompt templates.

## Expected inputs
- The list of providers to support, such as SiliconFlow, OpenRouter, and LM Studio
- A Node.js/TypeScript stack with optional MongoDB
- The model roles required by the application domain

## Produced outputs
- `domain/entities/LlmCatalog.ts` — types such as `LlmModel`, `LlmProviderCatalog`, and `PipelineModelRole`
- `domain/repositories/LlmCatalogRepository.ts` — pure interface
- `application/llm/defaultXxxCatalog.ts` — one file per provider
- `application/use-cases/GetLlmCatalog.ts` — dual-source env/mongo loader
- `application/use-cases/SeedLlmCatalog.ts` — idempotent seeding logic
- `application/llm/modelRegistryPresets.ts` — `decorateSeedModel()`
- `config.ts` — Zod schema with all LLM environment variables

## Steps / Procedure

### 1. Define canonical entities

```typescript
export type PipelineModelRole =
    | "coding" | "coding_fast"
    | "dialogue" | "dialogue_fast"
    | "vision" | "vision_fast"
    | "quality_check"
    | "image_gen" | "image_gen_fast"
    | "embeddings";

export interface LlmModel {
    id: string;                   // Real provider ID, for example "Qwen/Qwen3-32B"
    provider: string;             // Logical key, for example "siliconflow"
    role: PipelineModelRole;
    capabilities: string[];       // ["chat"] | ["vision","chat"] | ["image_generation"]
    isDefault: boolean;           // Primary model for that role
    isFallback: boolean;          // Backup if the default fails
    isActive: boolean;
    displayName?: string;
    description?: string;
    promptTemplate?: string;
    focusPromptTemplate?: string;
    priceTier?: "free" | "€" | "€€" | "€€€" | "€€€€";
    priceInputUsdPerM?: number;
    priceOutputUsdPerM?: number;
}

export interface LlmProviderCatalog {
    provider: string;
    baseUrl: string;
    apiType?: "openai-compatible" | "anthropic-compatible" | "custom";
    authType?: "api-key" | "bearer" | "none";
    isActive: boolean;
    models: LlmModel[];
    createdAt: Date;
    updatedAt: Date;
}
```

### 2. Centralize auth routing

```typescript
function buildAuthHeaders(
    authType: AuthType | undefined,
    apiKey: string | undefined
): Record<string, string> {
    if (!authType || authType === "none") return {};
    if (!apiKey) throw new Error("API key required but not configured");
    return { Authorization: `Bearer ${apiKey}` };
}
```

Provider notes:
- Local LM Studio → `authType: "none"`
- SiliconFlow and OpenRouter → `authType: "bearer"`
- Direct OpenAI → `authType: "api-key"`
- Anthropic → `authType: "api-key"` plus `x-api-key` in a dedicated adapter

### 3. Validate configuration with Zod at bootstrap

```typescript
const envSchema = z.object({
    LLM_CATALOG_SOURCE: z.enum(["env", "mongo"]).default("env"),
    LLM_DEFAULT_PROVIDER: z.string().default("siliconflow"),
    LLM_DEFAULT_MAX_COMPLETION_TOKENS: z.coerce.number().int().positive().default(24000),
    LMSTUDIO_BASE_URL: z.string().url().default("http://localhost:1234/v1"),
    SILICONFLOW_BASE_URL: z.string().url().default("https://api.siliconflow.com/v1"),
    SILICONFLOW_API_KEY: z.string().optional(),
    OPENROUTER_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
    OPEN_ROUTER_API_KEY: z.string().optional(),
    LLM_PROVIDER_API_KEYS_JSON: z.string().optional(), // JSON for arbitrary providers
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) { console.error(parsed.error.format()); process.exit(1); }
```

Pattern for extra providers without dedicated env vars:
```env
LLM_PROVIDER_API_KEYS_JSON={"myprovider":"sk-abc","anotherprovider":"sk-xyz"}
```

### 4. Support a dual-source catalog (env vs MongoDB)

```typescript
class GetLlmCatalog {
    async execute(): Promise<{ source: "env" | "mongo"; providers: LlmProviderCatalog[] }> {
        const fallback = [
            buildDefaultSiliconFlowCatalog(this.siliconFlowBaseUrl),
            buildDefaultLmStudioCatalog(this.lmStudioBaseUrl),
            buildDefaultOpenRouterCatalog(this.openRouterBaseUrl, this.hasApiKey),
        ];
        if (!this.repository) return { source: "env", providers: fallback };

        const mongoProviders = await this.repository.listActiveProviders().catch(() => []);
        if (mongoProviders.length > 0) return { source: "mongo", providers: mongoProviders };

        return { source: "env", providers: fallback }; // Empty MongoDB → env fallback
    }
}
```

### 5. Resolve role → model

```typescript
function resolveModelForRole(
    providers: LlmProviderCatalog[],
    providerKey: string,
    role: PipelineModelRole
): LlmModel | undefined {
    const provider = providers.find(p => p.provider === providerKey && p.isActive);
    if (!provider) return undefined;
    return provider.models.find(m => m.role === role && m.isDefault && m.isActive)
        ?? provider.models.find(m => m.role === role && m.isActive);
}
```

### 6. Deduplicate models for the frontend

```typescript
function dedupeModelsById(models: LlmModel[]): LlmModel[] {
    const byId = new Map<string, LlmModel>();
    for (const model of models) {
        if (!model.isActive || !model.id) continue;
        if (!byId.has(model.id)) { byId.set(model.id, model); continue; }
        const prev = byId.get(model.id)!;
        if (model.isDefault && !prev.isDefault) byId.set(model.id, model);
    }
    return [...byId.values()];
}
```
Apply this only in the frontend response, such as `/llm/providers`, not inside internal routing logic.

### 7. Support LM Studio as a local provider

```typescript
export function buildDefaultLmStudioCatalog(baseUrl: string): LlmProviderCatalog {
    return {
        provider: "lmstudio",
        baseUrl,
        apiType: "openai-compatible",
        authType: "none",
        isActive: true,
        models: [{ id: "local/default-chat", provider: "lmstudio", role: "dialogue",
                   capabilities: ["chat"], isDefault: true, isFallback: true, isActive: true }],
        createdAt: new Date(), updatedAt: new Date(),
    };
}
// In Docker: LMSTUDIO_BASE_URL=http://host.docker.internal:1234/v1
```

## Key patterns
- Use semantic roles instead of hardcoded model IDs so you can swap models without changing business logic
- Keep `isDefault` and `isFallback` separate so default selection and fallback behavior remain independent
- Centralize auth routing so there is no scattered `if (provider === "x")` logic
- Never expose provider keys or secrets to the frontend before the actual call is made

## Common pitfalls to avoid
- Hardcoding `process.env.SILICONFLOW_API_KEY` directly inside provider calls instead of resolving keys from a central map
- Using model IDs directly in business logic instead of going through semantic roles
- Exposing API keys to the frontend, even indirectly
- Failing to separate `isDefault` from `isFallback`, which breaks automatic fallback logic
- Non-idempotent seeding — always use `upsert`, not `insert`
- Mixing `per_m_tokens` and `per_image` pricing units in the same cost analysis

## Usage examples
```
"Add Groq as a provider with the dialogue_fast role, use the GROQ_API_KEY env var,
 and register it in the provider-agnostic catalog."
```

## Related skills
- [llm-context-budget](llm-context-budget.md)
- [llm-cost-tracking](llm-cost-tracking.md)
- [llm-background-tasks](llm-background-tasks.md)
- [llm-json-parsing](../output/llm-json-parsing.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-04-17
