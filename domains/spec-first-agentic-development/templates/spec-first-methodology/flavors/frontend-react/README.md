# Flavor — Frontend React (Admin / Console)

> Opinionated overlay for a **React 18 + TypeScript + Zod** admin/console project.
> Use on top of [`../../core/`](../../core/) by copying files of the same path: flavor files **replace** core files where present.

## What this flavor adds / specializes

- A concrete Tech Stack pre-filled with React, Vite, TanStack Query, Zustand, Zod, Tailwind, shadcn/ui, MapLibre, Playwright, Vitest, MSW.
- An Architecture Overview adapted to SPA + (optional) Fastify BFF.
- An Integration Contract specialized for REST + `problem+json` + SSE.
- A Security & Auth specialized for cookie httpOnly + CSRF *or* in-memory tokens.
- Design Principles for dense admin consoles (power users).
- Information Architecture template (routes, navigation, hierarchy).

## What this flavor does NOT add

- It does not lock product domain — that is yours.
- It does not pick MapLibre vs Leaflet, Recharts vs visx — leaves an explicit choice point.
- It does not include a CSS framework alternative (Tailwind is opinionated here).

## How to use

1. Copy `core/` into your new repo.
2. Overlay this flavor: copy this folder's `docs/` on top, replacing files where they exist.
3. Fill the React-specific placeholders inside the templates.
4. Run the [Pre-`src/` Checklist](../../../../skills/bootstrap/pre-src-checklist-runner.md).
