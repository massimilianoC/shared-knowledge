# Decision: OS-installed Chromium package over Puppeteer's bundled download

## Problem
Puppeteer can download and manage its own bundled Chromium binary automatically. That binary is
large and has known sandboxing friction in constrained containers (permission errors, launch
hangs). Should a project rely on the bundled download, or install Chromium as an OS package and
point Puppeteer at it?

## Decision
Skip Puppeteer's bundled Chromium download (`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`) and install
an OS Chromium package instead, pointing Puppeteer at it via `PUPPETEER_EXECUTABLE_PATH`. Apply
this identically in **every** Dockerfile stage that runs capture code (dev and prod), not just
production.

```dockerfile
# Alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

Set the `ENV` lines before `npm install`/`npm ci` — the skip flag must be active during
Puppeteer's postinstall step, not just at runtime.

## Why
- Shrinks the image: the OS package is typically smaller than Puppeteer's bundled download plus
  its dependencies.
- Avoids known sandboxing friction with the bundled binary in constrained/CI containers —
  Chromium launch failures are frequently a container/OS permissions problem that is easier to
  diagnose and fix at the package level than by debugging Puppeteer's own binary.
- Applying it in the dev stage too (not just prod) means the same failure mode is caught during
  local/CI development instead of surfacing for the first time in production.

## Rejected alternative
Relying on Puppeteer's default bundled Chromium download. Rejected as the default for
container-based deployments because of the sandboxing friction and image-size cost; still
acceptable for quick local prototyping outside a container where these constraints don't apply.

## How to apply it
- For container-based deployments (Docker, Kubernetes) with control over the base image: use the
  OS-package approach above (Alpine: `apk add chromium ...`; Debian/Ubuntu: `apt-get install
  chromium ...`).
- For serverless/no-OS-package-control runtimes (AWS Lambda, Vercel functions): neither approach
  applies as-is — use `puppeteer-core` + `@sparticuz/chromium` instead, which ships a
  Lambda-compatible prebuilt binary; the rest of the capture service code is unchanged, only the
  browser-launch call differs.
- Always verify the setup **inside the actual built container image** with a throwaway script
  before wiring any capture routes — a Chromium launch failure at that point is a container/OS
  problem, not a code problem, and is far easier to isolate before it's buried inside a full
  feature.

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
