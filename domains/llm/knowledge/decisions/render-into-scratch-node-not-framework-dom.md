# Decision: Render into a detached scratch node, then inject the serialized string

## Problem
`mermaid.render(id, text, container)` mutates `container` directly — `container.innerHTML = ''`
followed by direct DOM/d3 manipulation, synchronously, entirely outside any UI framework's
reconciliation. Should `container` be a real DOM node the framework (React/Vue/Svelte) already
renders and owns, or a node created and discarded purely for this call?

## Decision
Always render into a detached scratch node created just for the call
(`document.createElement('div')`, positioned off-screen, appended to `document.body`), extract the
resulting SVG as a **string**, remove the scratch node (in a `finally` block), and only then hand
the string to the framework's own "trust me, this is safe HTML" primitive
(`dangerouslySetInnerHTML` in React, `v-html` in Vue, `{@html ...}` in Svelte).

```ts
const scratch = document.createElement('div')
scratch.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px'
document.body.appendChild(scratch)
try {
  const { svg } = await mermaid.render(`mermaid-${crypto.randomUUID()}`, code, scratch)
  // hand `svg` (a string) to the framework's raw-HTML primitive
} finally {
  scratch.remove()
}
```

## Why
- A framework-owned container gets reconciled by the framework on its own schedule. If Mermaid
  has already replaced that node's children via direct DOM manipulation, the framework's next
  render pass diffs against a subtree it no longer recognizes — undefined behavior, not a
  cosmetic glitch.
- Extracting a plain string and injecting it through the framework's own raw-HTML primitive keeps
  exactly one system (the framework) responsible for that DOM subtree at any given time.
- This is also what surfaces the framework's own invariant checks correctly — e.g. React's
  hard rule against an element having both `children` and `dangerouslySetInnerHTML` at once is
  only relevant once you're using the framework's own injection primitive on a string, not when
  something else has already mutated the DOM underneath it.

## Rejected alternative
Passing a framework-rendered `ref`'d DOM node directly to `mermaid.render()`. Rejected because it
produces intermittent, hard-to-reproduce bugs the moment the framework's reconciliation and
Mermaid's direct DOM writes touch the same subtree — the failure mode depends on render timing,
not on anything visible in the component's own code, making it disproportionately expensive to
debug compared to the one extra scratch-node allocation this decision costs.

## How to apply it
- Apply this for any library (not just Mermaid) that mutates a container element via direct
  DOM/d3/canvas manipulation outside the framework's virtual-DOM model — the same reasoning
  extends to any imperative-rendering library embedded in a declarative UI framework.
- Always pair the scratch-node creation with a `try/finally` cleanup, including on the error path
  — an abandoned scratch node is a small leak per failed render, not catastrophic, but avoidable.
- Give the render id a random suffix (`crypto.randomUUID()` or equivalent) so rapid repeated
  renders (streaming content, or React StrictMode's dev-mode double-invoke) never collide on the
  same element id inside the library being called.

## Source
Extracted from: `inbox/mermaid-diagram-rendering/references/IMPLEMENTATION.md`, `inbox/mermaid-diagram-rendering/references/PITFALLS.md`
Date: 2026-07-01
