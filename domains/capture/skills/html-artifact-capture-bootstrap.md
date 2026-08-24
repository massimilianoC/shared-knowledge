# Skill: HTML Artifact Screenshot/PDF Capture Bootstrap

## Description
Adds server-side screenshot/PDF export of an HTML/CSS/JS artifact (or a live URL, or an
iframe's content) to a Node.js backend, using headless Chromium via Puppeteer. Covers
synchronous on-demand capture, fire-and-forget background thumbnail generation, and
export-embedded capture. Use when asked to add "download as image/PDF," thumbnail generation,
or artifact-capture features to a web app.

## Expected inputs
- Confirmation the backend is Node.js (or willingness to run a small dedicated Node capture
  microservice if not).
- Whether the deployment controls the container image (Docker/K8s) or is serverless
  (Lambda/Vercel functions) — determines the Chromium install approach.
- The content source: an HTML/CSS/JS string already in memory, or a URL the app already serves.
- Confirmation of the existing file storage abstraction (local disk, S3/MinIO, etc.) to reuse —
  never invent a new one for this feature.
- Whether captures need to be synchronous, backgrounded, or both.

## Produced outputs
- A dependency-free capture service (`captureHtml`, `captureUrl`, `buildFullDoc`) taking
  `(html | url, format, options)` and returning a `Buffer`.
- One HTTP route for on-demand capture, behind the same auth/ownership middleware as every
  other route.
- (If needed) a fire-and-forget background thumbnail scheduler with in-flight de-duplication.
- Docker image changes (OS Chromium package, correct env vars) applied to every stage that runs
  capture code.
- A verification script proving Chromium launches inside the built container image.
- Passing smoke tests per the porting checklist (see Steps below).

## Steps / Procedure

### 0. Confirm the target environment before writing code
Ask/verify, don't assume:
1. Node.js backend? If not, either shell out to a headless-Chromium CLI or run a small dedicated
   Node microservice for capture.
2. Container with OS package control, or serverless (Lambda/Vercel)? Serverless needs
   `@sparticuz/chromium` + `puppeteer-core` instead of an OS package install — see
   [os-installed-chromium-over-bundled-download](../knowledge/decisions/os-installed-chromium-over-bundled-download.md).
3. Content source: in-memory HTML/CSS/JS string, or an already-served URL? Decides
   `page.setContent()` vs `page.goto()`.
4. Existing file storage abstraction to reuse? The capture service only returns a `Buffer` —
   storage is the caller's concern (see
   [capture-service-storage-and-security-model](../knowledge/domain/capture-service-storage-and-security-model.md)).
5. Sync-only, or is a background job flow needed? If captures take 10–30s and users won't
   tolerate a blocked request, plan the background flow from day one.

### 1. Verify Chromium launches in the actual container first
Install Puppeteer, add the OS Chromium package to every Dockerfile stage (dev + prod) per
[os-installed-chromium-over-bundled-download](../knowledge/decisions/os-installed-chromium-over-bundled-download.md).
Run a throwaway verification script **inside the built container image** before writing any
feature code — Chromium launch failures are a container/OS problem, far easier to debug in
isolation than inside a half-built feature.

### 2. Copy in the capture service
Bring in a `captureHtml`/`captureUrl`/`buildFullDoc` implementation following
[HEADLESS_CHROMIUM_CAPTURE_PIPELINE](../knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md).
Keep it dependency-free from the rest of the app — no imports from the domain/entity layer. This
is what makes it reusable across flows and across projects.

### 3. Wire the on-demand capture route (Flow B)
One HTTP endpoint, auth-protected the same way every other mutating/reading route is. Do not add
a separate, weaker auth path just because "it just returns a file."

### 4. Add the background thumbnail flow (Flow A), only if needed
Fire-and-forget from the create/save handler — never `await` it inline. De-duplicate concurrent
jobs for the same content id (in-memory `Set` keyed by content id) so a rapid re-save doesn't
spawn N parallel Chromium instances. Errors are caught and logged, never bubbled into the
already-returned HTTP response.

### 5. Add PDF pagination only if multi-page PDFs are actually needed
For a single full-page screenshot exported as PDF, skip the pagination heuristic entirely and
call `page.pdf({ printBackground: true })`. Only pull in
[pdf-pagination-heuristic](pdf-pagination-heuristic.md) for long-form content (articles, reports,
slide decks) that needs sane page breaks.

### 6. Verify against the porting checklist
Minimum smoke test:
1. `format=jpg` request → 200, valid JPEG bytes, non-trivial file size (not a blank white image).
2. `format=pdf` request → 200, valid PDF, correct page count for multi-page content.
3. Trigger the background thumbnail flow twice in rapid succession for the same content id →
   only one Chromium launch happens (verify via logs).
4. Kill the request mid-capture (or force an error in `page.pdf()`) → confirm no orphaned
   Chromium process remains (`ps aux | grep chrome` in the container).
5. Requesting an unknown/nonexistent content id → 404, not a Puppeteer crash.
6. No route accepts an arbitrary external URL into `captureUrl()` without an explicit SSRF
   review.

## Key patterns
- **Shared core function** — all capture flows (on-demand, background, export-embedded) call one
  `captureHtml`/`captureUrl`, never flow-specific duplicated logic.
- **Storage-agnostic capture service** — returns only a `Buffer`; storage is always the caller's
  concern, never invented inside the capture service.
- **Fire-and-forget with de-dupe** — background jobs are scheduled, not awaited, and de-duplicated
  per content id via an in-memory `Set`.

## Common pitfalls to avoid
- Passing native JS function references (not strings) to `page.evaluate()`/`page.waitForFunction()`
  under an esbuild/tsx build — causes `ReferenceError` inside the browser context.
- Skipping the wait-until-settled sequence (readyState → images → fonts → auto-scroll → settle
  delay) to "optimize" latency — produces blank/half-rendered captures in production.
- Not closing the browser in a `finally` block — leaked Chromium processes are a leading cause of
  container OOM.
- Building a shared long-lived browser pool before measuring that launch overhead
  (~200–500ms) actually matters — see
  [one-browser-per-capture-call](../knowledge/decisions/one-browser-per-capture-call.md).
- Building a bespoke queueing system for captures when fire-and-forget + in-memory de-dupe is
  sufficient for the project's actual traffic volume.
- Pointing the capture service at arbitrary externally-supplied URLs without an SSRF review.
- Storage paths derived from raw request input instead of server-verified IDs — same
  path-traversal discipline as any file-serving feature.

## Usage examples
```
Example prompt: "Add a 'Download as PDF' button for our generated landing pages. Content is an
HTML/CSS/JS string stored per page. Backend is NestJS on Docker."
```
```
Example prompt: "We need automatic thumbnail generation whenever a user saves a document, plus
an on-demand full-page screenshot download. Deployed on AWS Lambda."
```

## Related skills
- [pdf-pagination-heuristic](pdf-pagination-heuristic.md)

## Related knowledge
- [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](../knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md)
- [PDF_PAGINATION_HEURISTIC](../knowledge/patterns/PDF_PAGINATION_HEURISTIC.md)
- [capture-service-storage-and-security-model](../knowledge/domain/capture-service-storage-and-security-model.md)
- [headless-chromium-vs-client-side-rendering](../knowledge/decisions/headless-chromium-vs-client-side-rendering.md)
- [one-browser-per-capture-call](../knowledge/decisions/one-browser-per-capture-call.md)
- [os-installed-chromium-over-bundled-download](../knowledge/decisions/os-installed-chromium-over-bundled-download.md)

## Source
Extracted from: `inbox/screenshot-pdf-export/SKILL.md`, `inbox/screenshot-pdf-export/AGENTS.md`, `inbox/screenshot-pdf-export/docs/PORTING_CHECKLIST.md`, `inbox/screenshot-pdf-export/docs/CODE_TEMPLATES/`
Date: 2026-07-01
