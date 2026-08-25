# Decision: One browser launch per capture call, not a shared pool

## Problem
Launching a fresh headless Chromium instance per capture costs ~200–500ms of overhead. A shared,
long-lived browser instance would avoid that cost — should capture calls share one browser?

## Decision
Launch and close a dedicated browser instance per `captureHtml`/`captureUrl` call by default
(`withBrowserPage` wraps launch → use → `browser.close()` in a `finally` block). Do not introduce
a shared long-lived browser unless launch overhead has been measured to actually matter at the
project's real traffic volume, and proper page-pool lifecycle management is built alongside it.

## Why
- Simpler and safer: no leaked-page accumulation, no risk of one capture's page state (cookies,
  viewport, injected styles) bleeding into another's.
- A shared browser instance that accumulates open pages/tabs will leak memory silently unless
  someone builds and maintains explicit pool lifecycle management (page reuse limits, idle
  eviction, crash recovery) — real engineering cost that most projects don't need.
- At the traffic volumes this pattern targets (10–30s per on-demand capture, background jobs
  measured in single digits per minute), the ~200–500ms launch overhead is a rounding error
  compared to the capture's own wait-until-settled sequence (readyState + fonts + auto-scroll +
  settle delay, itself ~1–2s minimum).

## Rejected alternative
A shared, long-lived browser instance reused across calls. Rejected as the default because the
memory-leak and page-isolation risks are real and ongoing, while the performance gain is
speculative until actually measured — premature optimization for a cost that is usually
negligible relative to the rest of the capture pipeline.

## How to apply it
- Keep `withBrowserPage`-style launch/close-per-call as the default in any new port of this
  pattern.
- Only build a shared browser pool after profiling shows launch overhead is a measured
  bottleneck at your actual capture volume — and when you do, budget for explicit page-pool
  lifecycle management (reuse limits, idle eviction, crash/hang recovery), not just "keep the
  browser object around."

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
