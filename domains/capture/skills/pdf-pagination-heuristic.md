# Skill: PDF Pagination Heuristic for Content Without Print CSS

## Description
Adds sane page breaks to a headless-Chromium PDF export for long-form HTML content that has no
explicit `@page`/`@media print` rules — without needing to know the specific HTML structure
ahead of time. Use this on top of an existing capture pipeline (see
[html-artifact-capture-bootstrap](html-artifact-capture-bootstrap.md)) whenever multi-page PDF
output currently slices images or text mid-element.

## Expected inputs
- An existing Puppeteer-based capture function that already produces single-shot PDFs (e.g.
  `page.pdf({ printBackground: true })`) but with poor/naive page breaks.
- Knowledge of whether the target content types ever declare their own print layout (explicit
  `@page`, `.slide`/`.page` classes, `data-pdf-page`/`data-pdf-section` markers) — if they always
  do, this heuristic is unnecessary.

## Produced outputs
- A `resolvePdfCapturePolicy`-equivalent function that chooses between "respect existing print
  layout" and "apply the section-aware heuristic" per document.
- A `SECTION_AWARE_PRINT_STYLES`-equivalent `@media print` CSS block, injected only when no
  explicit print layout exists.
- An `annotatePdfSections`-equivalent browser-context function that auto-marks top-level sections
  when no explicit markers are present.
- PDFs whose page breaks land between logical sections instead of mid-image or mid-paragraph.

## Steps / Procedure
1. **Detect explicit intent first.** Before applying any heuristic, check whether the document
   already declares `@page`/`@media print` rules or explicit markers (`.slide`, `.page`,
   `.pdf-page-break`, `data-pdf-page`, `data-pdf-section`). If so, respect it as-is
   (`preferCSSPageSize: true`) and skip the rest of this skill entirely.
2. **Inject section-aware print CSS** only for documents without explicit print intent — zero
   body margin/padding, force color-adjust to preserve backgrounds, `break-inside: avoid-page` on
   `img`/`svg`/`canvas`/`table`/`pre`/`blockquote`/`[data-pdf-section]`, force a page break before
   each subsequent `[data-pdf-section]`, and keep headings attached to their following content.
   See [PDF_PAGINATION_HEURISTIC](../knowledge/patterns/PDF_PAGINATION_HEURISTIC.md)
   for the exact CSS.
3. **Auto-annotate sections**, injected as browser-context JS (a **string**, not a function
   reference, if the build uses esbuild/tsx):
   - Mark direct semantic children of `<body>` (`header`, `section`, `article`, `footer`; not
     `main`) as sections.
   - Inside `<main>`, mark children that are semantic tags or "big enough" (height ≥ 260px, or
     containing a heading); if none qualify, mark `<main>` itself as one section.
   - Skip hidden/collapsed elements via a visibility check (`rect.height >= 120` and not
     `display:none`/`visibility:hidden`).
4. **Set the fallback page format** (`A4` typically) for content without explicit page-size
   intent; respect the content's own CSS page size (`preferCSSPageSize: true`) when explicit
   intent was detected in step 1.
5. **Verify visually**, not just structurally — check that page breaks land between sections, not
   mid-image or mid-paragraph, on a real multi-section document. A correct page *count* is not
   sufficient evidence the heuristic worked.

## Key patterns
- **Detect-then-heuristic** — always prefer the content's own explicit print intent over the
  generic heuristic; the heuristic is a fallback for content that has no intent expressed at all.
- **Content-agnostic markers** — the heuristic works from generic semantic tags and size
  thresholds, not project-specific HTML knowledge, so it ports across content types with only
  minor threshold retuning.

## Common pitfalls to avoid
- Applying the section-aware CSS even when the content already declares its own print layout —
  the two can conflict and produce worse pagination than either alone.
- Passing the annotation function as a native reference instead of a string under esbuild/tsx —
  causes a `ReferenceError` inside the browser context.
- Treating "the PDF has multiple pages" as sufficient verification without checking that breaks
  fall between sections rather than through them.
- Not retuning the "big enough" height threshold (260px) or the semantic-tag list for content
  shapes that differ significantly from generic long-form articles (e.g. dense dashboards, image
  galleries).

## Usage examples
```
Example prompt: "Our PDF export for long articles currently cuts images in half at page
boundaries. Add the section-aware pagination heuristic to our existing Puppeteer capture
service."
```

## Related skills
- [html-artifact-capture-bootstrap](html-artifact-capture-bootstrap.md)

## Related knowledge
- [PDF_PAGINATION_HEURISTIC](../knowledge/patterns/PDF_PAGINATION_HEURISTIC.md)
- [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](../knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-07-01
