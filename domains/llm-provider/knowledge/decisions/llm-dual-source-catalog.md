# Decision: Dual-source catalog — env vs MongoDB

## Problem
In development, teams often want an LLM catalog that is always available even without a database. In production, they want to edit the catalog from an admin UI without rebuilding the service. How can both needs be supported through the same interface?

## Decision
Use two sources with the same output shape, selected through `LLM_CATALOG_SOURCE=env|mongo`.

- `env`: static catalog stored in files such as `defaultXxxCatalog.ts` — zero infrastructure dependency
- `mongo`: MongoDB-backed catalog with automatic fallback to the static catalog when the DB is empty

```typescript
class GetLlmCatalog {
    async execute(): Promise<{ source: "env" | "mongo"; providers: LlmProviderCatalog[] }> {
        const fallback = [buildDefaultSiliconFlowCatalog(...), buildDefaultLmStudioCatalog(...)];
        if (!this.repository) return { source: "env", providers: fallback };

        const mongoProviders = await this.repository.listActiveProviders().catch(() => []);
        if (mongoProviders.length > 0) return { source: "mongo", providers: mongoProviders };

        return { source: "env", providers: fallback }; // Empty MongoDB → env fallback
    }
}
```

Use idempotent bootstrap seeding only when `LLM_CATALOG_SOURCE=mongo`:
```typescript
if (env.LLM_CATALOG_SOURCE === "mongo" && env.llmAutoSeedOnStartup) {
    await seedLlmCatalog.execute(); // use upsert, not insert
}
```

## Why
- `LLM_CATALOG_SOURCE=env` as the default is safe out of the box without requiring a database
- Fallback to the static catalog prevents outages when MongoDB is unavailable
- Idempotent seeding allows the default catalog to evolve without overwriting customizations

## Rejected alternative
A single source only, either env or DB: env cannot be edited at runtime, while a DB-only design adds unnecessary infrastructure requirements during development.

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-04-17
