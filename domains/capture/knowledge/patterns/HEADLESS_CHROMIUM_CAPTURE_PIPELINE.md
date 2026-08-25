# Pattern: Headless Chromium Capture Pipeline (Screenshot + PDF)

## Problem
How do you turn an HTML/CSS/JS artifact (or a live URL, or an iframe's content) into a
pixel-accurate JPEG screenshot and/or a PDF, server-side, without reimplementing a CSS
renderer in JS and without duplicating capture logic across the on-demand,
background-thumbnail, and export-bundling use cases that all eventually need it?

## Solution

### Why a real browser, not client-side canvas tricks
`html2canvas`/`dom-to-image` reimplement a CSS renderer in JS and can't reliably handle CSS
transforms, web fonts, canvas/WebGL, iframes, or cross-origin images. A real headless browser
(Puppeteer + Chromium) renders **exactly** what the user sees — JS-driven animations,
lazy-loaded content, and print CSS (`@media print`, `@page`) included — and runs server-side,
so there's no client memory/CPU cost and the output is identical regardless of the requesting
client.

### One shared core function, three callers
```
Artifact created/saved (HTML/CSS/JS in memory or DB)
  │
  ├─[A]─→ Background thumbnail job (fire-and-forget, non-blocking)
  │         captureHtml(doc, "jpg") → store JPEG → update record.thumbnailPath
  │
  ├─[B]─→ On-demand capture (user clicks "Download JPG/PDF")
  │         GET .../capture?format=jpg|pdf → captureHtml(doc, format) → stream buffer
  │
  └─[C]─→ Export-embedded capture (bundling a ZIP with source + preview)
            Promise.all([captureHtml(doc,"jpg"), captureHtml(doc,"pdf")]) → add to ZIP
```
All three flows call **one** function, `captureHtml(html, format, options)` — this
single-source-of-truth design is the main thing worth preserving when porting: don't let each
flow grow its own Puppeteer launch/wait/capture logic.

### The capture sequence (in order)
1. **Launch** headless Chromium with `{ headless: true, args: ["--no-sandbox",
   "--disable-setuid-sandbox"] }`; honor `PUPPETEER_EXECUTABLE_PATH` to point at an
   OS-installed Chromium (see
   [os-installed-chromium-over-bundled-download](../decisions/os-installed-chromium-over-bundled-download.md)).
2. **New page**, fixed viewport (`1280×800` is a reasonable desktop default).
3. **Media emulation**: `"print"` for PDF captures so `@media print` rules apply, `"screen"`
   for JPEG.
4. **Load content**: `page.setContent(html, { waitUntil: "networkidle0", timeout: 30_000 })`
   (or `page.goto(url, ...)` for the URL variant).
5. **PDF-only pre-processing**: inject section-aware print CSS and annotate sections if the
   content has no explicit print layout — see
   [PDF_PAGINATION_HEURISTIC](PDF_PAGINATION_HEURISTIC.md).
6. **Wait for real readiness** — `networkidle0` resolving does not mean images are decoded,
   fonts are painted, or lazy-load/`IntersectionObserver` content has fired:
   - `document.readyState === "complete"` **and** no broken/pending images
     (`waitForFunction`, 15s timeout).
   - `document.fonts.ready`.
   - **Auto-scroll**: step through the page in half-viewport increments with a 300ms pause per
     step, then scroll back to top — triggers lazy-load and lets CSS transitions settle.
   - A final flat **~800ms settle delay** for sticky elements and scroll-triggered reveals.
7. **Capture**: `page.screenshot({ type: "jpeg", quality: 92, fullPage: true })` or
   `page.pdf({ printBackground: true, format: <policy>, preferCSSPageSize: <policy> })`.
8. **Always `browser.close()` in a `finally` block**, even on error.

Every step in the wait sequence exists because skipping it produced blank or half-rendered
captures in production — don't strip steps to "optimize" latency without testing against real
content.

## Recommended structure
```
infra/capture/
  capture-service.ts        ← captureHtml(), captureUrl(), buildFullDoc() — zero app deps,
                                takes (html|url, format, options), returns Buffer
routes/
  capture.routes.ts          ← Flow B: on-demand capture endpoint, same auth as every other route
jobs/
  schedule-thumbnail.ts       ← Flow A: fire-and-forget scheduler with in-flight de-dupe Set
export/
  capture-for-export.ts       ← Flow C: Promise.all([jpg, pdf]) with per-format failure isolation
```
The capture service has **zero knowledge of storage** — it only returns a `Buffer`; storage is
entirely the caller's responsibility (see
[capture-service-storage-and-security-model](../domain/capture-service-storage-and-security-model.md)).
This is what makes it portable across projects.

## Variants
| Flow | Trigger | Blocking? | Use for |
|---|---|---|---|
| On-demand capture | User clicks "Download JPG/PDF" | Sync HTTP request (10–30s) | Single-shot export |
| Background thumbnail | Content saved/activated | Fire-and-forget, polled/pushed later | Card previews, lists |
| Export-embedded capture | ZIP/bundle export | Parallel `Promise.all([jpg, pdf])` inside a larger job | Bundling a static preview alongside source files |

| Content source | Approach |
|---|---|
| Inline artifact (HTML/CSS/JS strings) | `buildFullDoc(html, css, js)` then `captureHtml(doc, format)` |
| Live URL already served | `captureUrl(url, format)` — `page.goto` instead of `setContent`, avoids duplicating server-rendered data client-side |
| Iframe's content specifically | Prefer serving the iframe's `src` directly and using the URL mode; only fall back to `page.frames().find(...)` + clipped screenshot if the content is genuinely inseparable from parent-page state |

## Quick checklist for a new project
- [ ] `capture-service.ts` has zero imports from the app's domain/DB/auth layers
- [ ] `browser.close()` happens in a `finally` block (verified by forcing a mid-capture error)
- [ ] Functions passed to `page.evaluate()`/`page.waitForFunction()` are strings, not native
      function references, if the build uses esbuild/tsx/similar dev-mode transpilers
- [ ] Full wait-until-settled sequence implemented (readyState → images → fonts → auto-scroll →
      settle delay), not trimmed
- [ ] One browser launch per capture call by default (see
      [one-browser-per-capture-call](../decisions/one-browser-per-capture-call.md))
- [ ] Background flow de-duplicates concurrent triggers for the same content id
- [ ] Export flow isolates per-format failures (`Promise.all` + `.catch(() => null)` per branch)

## Common pitfalls to avoid
- Passing native JS function references into `page.evaluate()`/`page.waitForFunction()` when the
  build uses esbuild/tsx — they can inject helper functions (e.g. `__name()`) into the closure
  that only exist in Node's module scope, throwing `ReferenceError` inside the browser context.
  Pass the function body as a string instead.
- Trusting `networkidle0` alone as "content is ready" — it does not account for image decode,
  font painting, or lazy-load triggers.
- Letting each of the three flows grow its own launch/wait/capture logic instead of sharing one
  core function.
- Not closing the browser on the error path — leaked Chromium processes are a leading cause of
  container OOM in capture-heavy services.

## Related skills
- [html-artifact-capture-bootstrap](../../skills/html-artifact-capture-bootstrap.md)
- [pdf-pagination-heuristic](../../skills/pdf-pagination-heuristic.md)

## Related knowledge
- [PDF_PAGINATION_HEURISTIC](PDF_PAGINATION_HEURISTIC.md)
- [capture-service-storage-and-security-model](../domain/capture-service-storage-and-security-model.md)
- [headless-chromium-vs-client-side-rendering](../decisions/headless-chromium-vs-client-side-rendering.md)
- [one-browser-per-capture-call](../decisions/one-browser-per-capture-call.md)
- [os-installed-chromium-over-bundled-download](../decisions/os-installed-chromium-over-bundled-download.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
