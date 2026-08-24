# Domain: Capture Service — Storage and Security Model

## Context
Reference storage layout, security model, and performance characteristics for a headless-Chromium
capture service (see [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](../patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md)),
as implemented in a production project. Field/path names are illustrative — adapt to the target
project's own storage and auth conventions.

## Storage layout
```
/data/
├── thumbnails/{projectId}/{snapshotId}.jpg     ← background thumbnail flow output
├── exports/{userId}/{projectId}/{exportId}.zip ← export-embedded flow output (includes jpg+pdf inside)
```
Behind an `IFileStorage` interface with two implementations (local disk bind mount,
S3/MinIO-compatible object storage), selected via an env var. **The capture service itself has
zero knowledge of storage** — it only returns a `Buffer`; storage is entirely the caller's
responsibility. This separation is what makes the capture service portable — replicate it rather
than letting the capture function write files directly.

## Security model
- **Auth**: every capture/export route sits behind the same auth + tenant-ownership middleware as
  every other mutating/reading route in the app. The capture endpoint is not a special "just
  returns a file" exception to authorization.
- **No SSRF surface by default**: the content rendered is always the caller's own stored artifact
  (HTML/CSS/JS strings), never an arbitrary externally-supplied URL. Puppeteer fetching an
  attacker-controlled URL is a classic SSRF vector (it can reach internal network services) — if
  the pattern is extended to accept URLs, that introduces an SSRF vector needing its own review
  (allowlisting, network isolation).
- **Download tokens**: the export flow signs a short-lived JWT (separate secret from the app's
  main auth JWT) so the download endpoint can verify without a DB round-trip. The storage path is
  derived entirely from the verified JWT payload (`exportId`, `userId`, `projectId`) — never from
  raw request input, preventing path traversal.

## Performance characteristics (reference baseline)
| Parameter | Value | Rationale |
|---|---|---|
| Viewport | 1280×800 | Standard desktop preview size |
| JPEG quality | 92 | Good size/quality tradeoff for previews |
| `waitForFunction` timeout | 15s | Images/fonts readiness |
| `setContent` timeout | 30s | Hard ceiling on total load wait |
| Settle delay | 800ms | Sticky elements, scroll-triggered reveals |
| Thumbnail job latency | ~5–10s | Background, non-blocking |
| On-demand capture latency | 10–30s | Foreground, user waits |
| Export (jpg+pdf parallel) | 20–60s | Part of a larger ZIP-build job |

No shared browser pool in the reference implementation — every call launches and closes its own
Chromium instance (see
[one-browser-per-capture-call](../decisions/one-browser-per-capture-call.md)). Recalibrate all
timings for the target project's typical content size/complexity; treat the above as a starting
baseline, not a hard requirement.

## Related knowledge
- [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](../patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md)
- [one-browser-per-capture-call](../decisions/one-browser-per-capture-call.md)

## Related skills
- [html-artifact-capture-bootstrap](../../skills/html-artifact-capture-bootstrap.md)

## Source
Extracted from: `inbox/screenshot-pdf-export/docs/ARCHITECTURE.md`
Date: 2026-07-01
