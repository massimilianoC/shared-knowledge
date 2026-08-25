# Decision: Headless Chromium (Puppeteer) over client-side canvas rendering

## Problem
Turning an HTML/CSS/JS artifact into a downloadable image/PDF can be done either client-side
(`html2canvas`, `dom-to-image`, printing via the browser's own print dialog) or server-side with
a real browser engine. Which approach actually produces correct output for arbitrary,
JS-driven content?

## Decision
Render server-side with headless Chromium via Puppeteer, for both screenshots and PDFs, using
one engine for both output formats.

## Why
- `html2canvas`/`dom-to-image` reimplement a CSS renderer in JS and can't reliably rasterize CSS
  transforms, web fonts, canvas/WebGL, iframes, or cross-origin images — they approximate
  rendering, they don't reproduce it.
- A real browser renders **exactly** what the user sees: JS-driven animations, lazy-loaded
  content, and print CSS (`@media print`, `@page`) all behave identically to what a human would
  see in that same browser.
- Running server-side means no client memory/CPU cost, works uniformly for background jobs (no
  user's browser tab needs to stay open), and produces output that is identical regardless of
  the requesting client's own browser/OS/zoom level.
- Puppeteer covers both screenshot and PDF needs through one engine, avoiding the maintenance
  cost of two separate rendering pipelines (e.g. `html2canvas` for images + `wkhtmltopdf`/
  `weasyprint` for PDFs) with potentially different CSS support and different bugs.

## Rejected alternative
Client-side canvas libraries (`html2canvas`, `dom-to-image`) or a separate non-browser PDF
renderer (`wkhtmltopdf`, `weasyprint`). Rejected because both approaches under-render complex
CSS/JS content and because using two different engines for image vs. PDF output means chasing
two different sets of rendering bugs and CSS-support gaps instead of one.

## How to apply it
- Default to Puppeteer + headless Chromium whenever the content to capture involves non-trivial
  CSS (transforms, web fonts, canvas/WebGL) or client-side JS rendering (SPA content,
  animations, lazy-load).
- If the target runtime has no OS package control (serverless: Lambda, Vercel functions), keep
  the same engine choice but swap the launch mechanism to `puppeteer-core` +
  `@sparticuz/chromium` rather than switching rendering approach entirely.
- Reconsider only if the content being captured is simple, static markup with no dynamic
  rendering needs and the project has a hard constraint against running a browser engine
  server-side (e.g. no container/OS package control and no serverless-Chromium option
  available) — in that narrow case, a lighter static-HTML-to-PDF library may be acceptable, but
  document the CSS/JS feature gap explicitly.

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
