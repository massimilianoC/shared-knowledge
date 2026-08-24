# Screenshot and PDF Capture

Reusable package for server-side HTML, screenshot, and PDF artifact generation with headless Chromium.

## Start here

1. Read [`knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md`](knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md).
2. Apply [`skills/html-artifact-capture-bootstrap.md`](skills/html-artifact-capture-bootstrap.md) to add the shared capture pipeline.
3. Add [`skills/pdf-pagination-heuristic.md`](skills/pdf-pagination-heuristic.md) only when long-form PDF content needs automatic pagination.
4. Use [`agents/html-artifact-capture-porter.md`](agents/html-artifact-capture-porter.md) to port the feature end-to-end.

## Package contents

- Capture pipeline and pagination patterns.
- Browser lifecycle, rendering, and container deployment decisions.
- Storage, SSRF, authorization, and download-token guidance.
- Two implementation skills and one porting agent.

## Selective import

Import the selected skill with its linked capture pattern and decisions. Use the agent only when porting the full capture feature. Copy the complete `capture/` package when the target needs both screenshot/PDF capture and pagination guidance. Re-evaluate browser binary, container, storage, SSRF, and authentication controls for the target deployment.
