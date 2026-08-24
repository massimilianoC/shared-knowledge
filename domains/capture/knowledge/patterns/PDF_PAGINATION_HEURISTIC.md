# Pattern: Content-Agnostic PDF Pagination Heuristic

## Problem
Long-form HTML content (an AI-generated landing page, a CMS article) usually has no
`@page`/`@media print` rules and no natural page breaks. Printed naively via headless Chromium,
it produces PDFs that slice images and text boxes mid-element at arbitrary points. How do you
get sane page breaks without knowing anything about the specific HTML structure ahead of time?

## Solution

### Three-way policy decision
```
if pageModel is "slide_deck" or "print_a4", OR the content already declares
  @page / @media print / a "slide"/"page"/"pdf-page-break" class / data-pdf-page(-section):
    → respect the content's own print layout as-is
    → emulateMedia: "print", preferCssPageSize: true
    → (an explicit "print_a4" intent also sets a hard "A4" fallback format)

else (no explicit print intent):
    → emulateMedia: "print", preferCssPageSize: false, fallbackFormat: "A4"
    → inject SECTION_AWARE_PRINT_STYLES (see below)
    → auto-annotate top-level sections with data-pdf-section (see below)
```

### Section-aware print CSS (`SECTION_AWARE_PRINT_STYLES`)
A `@media print` block that:
- Zeroes body margin/padding and forces `print-color-adjust: exact` so backgrounds/colors
  survive printing.
- Sets `break-inside: avoid-page` on `img`, `svg`, `canvas`, `table`, `pre`, `blockquote`, and
  any `[data-pdf-section]` — prevents mid-element page splits.
- Forces a page break **before** each `[data-pdf-section]` that follows another one — roughly
  one section per page.
- Keeps headings (`h1`/`h2`/`h3`) attached to the content that follows them
  (`break-after: avoid-page`).

### Auto-annotation (`annotatePdfSections`)
Injected browser-context JS — **passed as a string, not a function reference** (esbuild/tsx can
inject helper closures that don't exist in the browser context; see
[HEADLESS_CHROMIUM_CAPTURE_PIPELINE](HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md) pitfalls) — that,
only if no explicit markers already exist:
1. Marks direct semantic children of `<body>` (`header`, `section`, `article`, `footer` — not
   `main`) as sections.
2. Inside `<main>`, marks children that are either semantic tags or "big enough" (height ≥
   260px or containing a heading) as sections; if none qualify, marks `<main>` itself as one
   section.
3. Uses a visibility check (`rect.height >= 120`, not `display:none`/`visibility:hidden`) so
   hidden/collapsed elements aren't marked.

This heuristic is content-agnostic — it works without knowing anything about the specific HTML
structure beyond generic semantic tags and size thresholds.

## Recommended structure
Keep the policy resolution (`resolvePdfCapturePolicy`), the CSS constant, and the annotation
function as three separate, independently testable pieces inside the capture service — do not
inline the decision tree into the main `shoot()`/capture function, so the heuristic can be
retuned per project without touching the capture lifecycle.

## Variants
| Scenario | Approach |
|---|---|
| Content is a slide deck with its own page-per-slide CSS | Respect `preferCSSPageSize`, skip the heuristic entirely |
| Content already declares `@page`/`@media print` | Respect as-is, skip auto-annotation |
| Single full-page screenshot exported as PDF (no multi-page need) | Skip this heuristic entirely — just `page.pdf({ printBackground: true })` |
| Content shape differs significantly from generic articles (e.g. dense dashboards) | Retune the "big enough" height threshold (260px) and the semantic-tag list — this is the piece most likely to need adjustment per project |

## Quick checklist for a new project
- [ ] Explicit print-layout content is detected and left untouched (no heuristic override)
- [ ] Section-aware print CSS applied only when no explicit markers exist
- [ ] Auto-annotation uses a visibility check, not just tag presence
- [ ] Page breaks land between sections, not mid-image or mid-paragraph (verify visually on a
      real multi-section document, not just that the PDF has multiple pages)

## Common pitfalls to avoid
- Applying the section-aware CSS even when the content already has explicit print rules —
  double pagination logic can conflict and produce worse output than either alone.
- Passing `annotatePdfSections` as a function reference instead of a string under an
  esbuild/tsx-based build.
- Treating "PDF has correct page count" as sufficient verification without checking that breaks
  don't land mid-element.

## Related skills
- [pdf-pagination-heuristic](../../skills/pdf-pagination-heuristic.md)
- [html-artifact-capture-bootstrap](../../skills/html-artifact-capture-bootstrap.md)

## Related knowledge
- [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md)

## Source
Extracted from: `inbox/screenshot-pdf-export/docs/ARCHITECTURE.md`, `inbox/screenshot-pdf-export/docs/CODE_TEMPLATES/capture-service.ts`
Date: 2026-07-01
