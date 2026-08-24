# LLM-Generated Diagram Rendering — Guidelines and Techniques

Practical, reusable guidance for rendering Mermaid (or similar textual-DSL) diagrams that an LLM
generates inside a chat/markdown UI. Extracted and generalized from a production React + Vite
Mermaid renderer.

---

## Index

1. [The problem](#the-problem)
2. [Overall architecture](#overall-architecture)
3. [Stage 1 — Validate, don't guess](#stage-1--validate-dont-guess)
4. [Stage 2 — Normalize, then re-validate](#stage-2--normalize-then-re-validate)
5. [Stage 3 — Render into an isolated scratch node](#stage-3--render-into-an-isolated-scratch-node)
6. [Stage 4 — Reset all state per attempt](#stage-4--reset-all-state-per-attempt)
7. [Covered bug table](#covered-bug-table)
8. [Common pitfalls](#common-pitfalls)
9. [Debugging workflow](#debugging-workflow)

---

## The problem

Nearly every Mermaid diagram type (flowchart, sequence, class, state, ER, gantt, mindmap,
timeline, journey, gitGraph, quadrant, C4, sankey, block) renders correctly in a real browser
once given syntactically valid input. Almost all real-world "Mermaid doesn't render" bugs come
from the **integration layer** — how the diagram source is fed into the UI framework — not from
Mermaid itself. Two distinct failure sources compound this in an LLM/chat context:

- The diagram *source* comes from an LLM, which writes Mermaid with predictable, mechanical
  syntax mistakes (the model treats it like SQL/JS habits carried over).
- The diagram *source* may arrive incrementally (SSE streaming into a chat message), so the
  render logic re-runs on every partial chunk, not just once on complete input.

---

## Overall architecture

Build the renderer as a small state machine with four stages, each guarding a specific failure
mode:

```
rawDiagramSource (possibly incomplete, mid-stream)
    │
    ▼
[1] Validate            → mermaid.parse(code, { suppressErrors: true })
    │  (fails)
    ▼
[2] Normalize + re-validate → cheap regex fixups for known LLM mistakes, parse() again
    │  (still fails)
    ▼
[2b] Fall back to source view — only after BOTH raw and normalized fail
    │  (succeeds, at either stage)
    ▼
[3] Render into a detached scratch node → extract serialized SVG string
    │
    ▼
[4] Reset all transient state at the START of this attempt (not just on success)
    │
    ▼
Inject SVG string via the framework's raw-HTML primitive
```

## Stage 1 — Validate, don't guess

Call `mermaid.parse(code, { suppressErrors: true })` before ever calling `mermaid.render()`.
`suppressErrors: true` makes `parse()` resolve to `false` on a syntax error instead of throwing,
which is what makes it cheap to try multiple candidates. Never attempt to render code that
hasn't been validated — a failed render wastes a render cycle and produces a worse error message
than a failed parse.

## Stage 2 — Normalize, then re-validate

LLM-generated Mermaid has recurring, mechanical mistakes. Fix the common ones with regex — don't
build a full parser:

- Trailing semicolons (not valid Mermaid syntax, a carry-over habit from other languages).
- Unquoted square-bracket/curly-brace labels containing `(` `)` `:` `/` `?` — these get
  mis-parsed as shape selectors; auto-quote them.
- Unquoted multi-word `subgraph` titles — convert `subgraph Foo Bar` into
  `subgraph FooBar["Foo Bar"]`.

Only fall back to a source view if **both** the raw and the normalized version fail `parse()`.
Extend the regex list as new recurring patterns are found, but always re-validate after adding a
new fixup — never trust a regex fix blindly.

## Stage 3 — Render into an isolated scratch node

Never point `mermaid.render()` at a DOM node the UI framework owns/reconciles. `mermaid.render(id,
text, container)` does `container.innerHTML = ''` and then builds the diagram by direct DOM/d3
manipulation, synchronously, entirely outside the framework's knowledge. If `container` is a
framework-managed node, the framework's next reconciliation pass encounters a subtree it no
longer recognizes — undefined behavior.

Instead:
1. Create a detached `document.createElement('div')`, positioned off-screen, appended to
   `document.body`.
2. Render into that scratch node.
3. Extract the resulting SVG string (already sanitized if `securityLevel: 'strict'`).
4. Hand the **string** to the framework's own "trust me, this is safe HTML" primitive
   (`dangerouslySetInnerHTML` in React, `v-html` in Vue, `{@html ...}` in Svelte).
5. Remove the scratch node when done (including on the error path — wrap in `try/finally`).

Use a random suffix on the render id (e.g. `crypto.randomUUID()`) so rapid re-renders (streaming,
or React StrictMode's dev-mode double-invoke) never collide on the same element id.

## Stage 4 — Reset all state per attempt

If the diagram source can change after first mount — most commonly because it's arriving via SSE
token-by-token as part of a streaming chat message — the render-attempt logic re-runs on every
change. Any "give up, show source/error" flag set by an earlier, syntactically-incomplete chunk
**must be reset to false at the start of the next attempt**, keyed on the source changing.
Without this reset, the very first incomplete streaming chunk (virtually guaranteed to fail
`parse()`, since the fence hasn't closed yet) permanently latches the UI onto the source/error
view — even after the final, complete chunk parses and renders successfully in the background.

This applies to error-boundary state too: an error boundary wrapping the renderer must reset
itself when the diagram source prop changes, or a crash on one (possibly incomplete) version
disables the renderer forever, even for later valid input.

---

## Covered bug table

| Bug | Symptom | Fix |
|---|---|---|
| Container has both `children` and a raw-HTML-injection prop on the same element | 100% of diagrams fail; minified React error #60 (`Can only set one of children or props.dangerouslySetInnerHTML`) | Split into two mutually exclusive branches/elements — see [render-into-scratch-node-not-framework-dom](../decisions/render-into-scratch-node-not-framework-dom.md) |
| Fallback flag never reset on new streaming chunk | Diagram permanently stuck on source view even after content becomes valid | Reset transient state unconditionally at the top of every attempt — see [reset-fallback-state-per-streaming-attempt](../decisions/reset-fallback-state-per-streaming-attempt.md) |
| Unquoted labels with `()`/`:`/`/`/`?` | `parse()` fails on otherwise-reasonable LLM output | Regex auto-quote fixup (Stage 2) |
| Unquoted multi-word `subgraph` titles | `parse()` fails | Regex fixup converting to `subgraph Id["Title"]` |
| `jsdom`-based unit tests fail on real `mermaid.render()` calls | `getBBox is not a function` for nearly every diagram type except `pie` | jsdom doesn't implement SVG layout — mock `mermaid` for unit tests, verify real rendering in an actual browser engine |
| LLM emits ` ```graph ` fence instead of ` ```mermaid ` | Diagram silently renders as plain code text, no error | Decide explicitly whether to also route `graph` (and other diagram-keyword fences) to the renderer |
| Markdown sanitizer strips the `language-mermaid` class | Code-block interceptor never detects the Mermaid block | Verify the sanitizer schema explicitly allows `className` matching `/^language-/` |

## Common pitfalls

- Trusting `jsdom`/Vitest/Jest to prove real Mermaid rendering works or fails — it does neither
  reliably; `getBBox` is undefined in `jsdom`, independent of code correctness.
- Decoding a minified React error by grepping `node_modules/react-dom` source and guessing from
  context — the code → message mapping is a separately generated table, not source order. Fetch
  the authoritative `codes.json` instead.
- Assuming a redeploy picked up a fix without confirming the served bundle's content hash
  actually changed — a stale built image reproduces the "same" bug for an unrelated reason.
- Stripping steps from the render-readiness wait sequence (readyState → images → fonts.ready →
  auto-scroll → settle delay) to reduce latency without testing against real content — each step
  exists because skipping it produced blank/partial captures in production.

## Debugging workflow

1. **Never trust jsdom for real rendering.** Unit-test `parse()`-level logic and mocked-component
   behavior in jsdom; verify actual rendering in a real browser engine.
2. **Build a throwaway, app-independent HTML harness.** A static HTML file loading the Mermaid
   UMD bundle directly, calling `mermaid.initialize()` with the exact production config, run
   through a battery of realistic diagrams via `parse()`/`render()`. Serve with a simple HTTP
   server and drive with real-browser automation (not `file://` — most browsers block scripted
   access to it). Isolates "is it Mermaid/config" from "is it my framework integration" in
   minutes.
3. **Decode minified errors from the authoritative source**, not by guessing from source
   ordering: `https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json`.
   Cross-check against a non-minified dev build's component stack.
4. **"Still broken after redeploy" often means it wasn't actually redeployed.** Compare the
   served JS bundle's content-hash filename before/after the rebuild to confirm the fix shipped.

## Related skills
- [llm-mermaid-diagram-rendering](../../skills/output/llm-mermaid-diagram-rendering.md)

## Related knowledge
- [render-into-scratch-node-not-framework-dom](../decisions/render-into-scratch-node-not-framework-dom.md)
- [reset-fallback-state-per-streaming-attempt](../decisions/reset-fallback-state-per-streaming-attempt.md)
- [LLM_JSON_PARSING_GUIDELINES](LLM_JSON_PARSING_GUIDELINES.md) — sibling pattern for the same
  "validate → normalize → re-validate → fall back" shape, applied to JSON instead of a diagram DSL

## Source
Extracted from: `inbox/mermaid-diagram-rendering/SKILL.md`, `inbox/mermaid-diagram-rendering/references/IMPLEMENTATION.md`, `inbox/mermaid-diagram-rendering/references/PITFALLS.md`
Date: 2026-07-01
