# Decision: Reset transient fallback state on every attempt, not just on success

## Problem
A component that renders LLM-generated content incrementally (SSE streaming into a chat message)
re-runs its render-attempt logic on every chunk. An early, syntactically-incomplete chunk is
virtually guaranteed to fail parsing/rendering. If a "give up, show fallback" flag is set on that
failure and only cleared on a *subsequent success*, what happens when the component's own error
boundary or a manual toggle also holds state across attempts?

## Decision
Reset every transient UI state variable (error message, fallback/"show source" flag, previous
rendered output, error-boundary "has crashed" flag) **unconditionally at the start of every
render attempt**, keyed on the content source changing — not only inside the success branch.

```tsx
useEffect(() => {
  setError(null)
  setOutput('')
  setShowFallback(false)   // reset every time, regardless of what happened last attempt
  // ... proceed with validate → normalize → render for the new `code`
}, [code])
```

For an error boundary wrapping the renderer, reset its crashed state when the content prop
changes:
```tsx
componentDidUpdate(prevProps) {
  if (this.state.hasError && prevProps.code !== this.props.code) {
    this.setState({ hasError: false })
  }
}
```

## Why
- Streaming content is virtually guaranteed to be invalid on its first chunks (the fence/braces
  haven't closed yet). If the fallback flag persists until an explicit "success" branch clears it,
  the first chunk's failure sets it once and nothing in the success path was written to ever flip
  it back — because success was never reached from that flag's perspective, the UI silently
  latches on the fallback view forever, even once later chunks parse and render correctly in the
  background.
- The symptom is easy to miss because there may be no visible error banner (the `error` state
  itself can clear once the code stabilizes) — only a small manual toggle the user has to notice,
  making this bug look intermittent/environment-specific rather than a deterministic state-machine
  gap.
- Keying the reset on "the source changed" (not on "the previous attempt succeeded") is what
  makes it correct for both the streaming case and the simpler static-content case — a static
  diagram only renders once, so the reset is a no-op there, but a streaming one benefits every
  chunk.

## Rejected alternative
Resetting the fallback flag only inside the success branch of the render attempt (i.e., "clear it
when we get a good render"). Rejected because the failure branch of an *earlier* attempt already
wrote `true` before a later attempt's success branch runs — there is no code path that clears it
between attempts unless the reset is unconditional at the top, not conditional on this attempt's
outcome.

## How to apply it
- Apply this to any component that renders progressively-arriving LLM output — not just diagram
  rendering: streamed JSON, streamed markdown-with-embedded-widgets, or any other incrementally
  materializing structured content has the same "early chunk is invalid, must not permanently
  latch a fallback UI" shape.
- Treat "reset transient state at the top of the effect/handler, keyed on the identity of the
  input" as the default for any render-attempt state machine driven by changing props — write the
  reset first, then the attempt logic, rather than scattering resets into individual failure/
  success branches.

## Source
Extracted from: `inbox/mermaid-diagram-rendering/references/IMPLEMENTATION.md`, `inbox/mermaid-diagram-rendering/references/PITFALLS.md`
Date: 2026-07-01
