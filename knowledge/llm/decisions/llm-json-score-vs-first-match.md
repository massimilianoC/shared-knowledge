# Decision: Score-based selection vs first-match in LLM repair flows

## Decision
When multiple JSON candidates parse successfully after repair strategies,
select the one with the **highest score** — not the first one that succeeds.

## Why
`repairTruncatedJson` can make a partial JSON parse successfully after `max_tokens` truncation.
If the system returns the first success, that degraded candidate can beat a direct parse
of a more complete candidate, causing silent loss of information even when the better result was available.

## How to apply it
The scoring function should penalize truncated parses automatically:
- HTML length should contribute proportionally to the score → truncated output is shorter and scores lower
- Presence of `</html>` can add +60 points → truncated output typically misses it
- Presence of `<!doctype>` can add +100 points → a complete document should always beat a partial one

Score comparison is therefore a form of automatic qualitative selection,
without needing special-case logic that explicitly discards truncated results.

## Rejected alternative
First-match is easier to implement but silently returns degraded output whenever models truncate their responses, which can happen to any model when the token limit is too low.

## Source
`knowledge/patterns/LLM_JSON_PARSING_GUIDELINES.md` — Phase 4
