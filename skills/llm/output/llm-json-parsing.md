# Skill: LLM JSON Parsing (Robust)

## Description
Parses JSON produced by LLMs in a robust way, handling known model failures such as
Markdown fences, invalid escapes, truncation, double-encoded HTML, and stray tokens.
It is suitable for any pipeline that consumes structured output from an LLM.

## Expected inputs
- `rawLlmOutput: string` — the raw model response, with no preprocessing applied
- The expected JSON schema for post-parse validation

## Produced outputs
- A parsed and validated JSON object, or `null` if recovery is impossible
- A `valid: boolean` flag indicating whether the result is complete or only partially repaired

## Five-stage architecture

```
rawLlmOutput
    │
    ▼
[1] Pre-parse cleanup       → strip fences, pre-repair escapes
    │
    ▼
[2] Candidate generation    → stripped, fenceMatch, brace-scan on raw/preRepaired/stripped
    │
    ▼
[3] Repair strategies       → per candidate: direct → escapes → triple-pass → truncation → jsonrepair
    │
    ▼
[4] Score-based selection   → not the first success, but the best score
    │
    ▼
[5] Post-parse              → unescape HTML, normalize tags/headings, extract inline css/js
    │
    ▼
Validated canonical result
```

## Critical rules

### Phase 1 — Cleanup
- Always strip Markdown fences before any other repair step
- Apply pre-repair (`repairInvalidJsonEscapes` → `repairPrematureStringTermination` → `repairInvalidJsonEscapes`)
  before `extractFirstJsonObject`, otherwise a `{` inside truncated HTML may incorrectly count toward depth

### Phase 2 — Candidates
- Generate multiple candidates and deduplicate them while preserving order
- `extractFirstJsonObject` must use an `inString + escaped` state machine — never plain `indexOf`/`lastIndexOf` logic

### Phase 3 — Repair order (least invasive to most invasive)
1. `JSON.parse(candidate)` — direct parse
2. `JSON.parse(repairInvalidJsonEscapes(candidate))`
3. Triple-pass for Gemma-like patterns: `repairInvalidJsonEscapes(repairPrematureStringTermination(repairInvalidJsonEscapes(c)))`
4. `JSON.parse(repairTruncatedJson(repairInvalidJsonEscapes(candidate)))` — for `max_tokens` truncation
5. `JSON.parse(jsonrepair(candidate))` — last resort

### Phase 4 — Selection
- Score should be based on completeness: HTML length, presence of `<!doctype>`, `</html>`, and required fields
- A truncated parse should always have a lower score than a complete parse and be rejected automatically

### Phase 5 — Post-parse
- Run `unescapeDoubleEncodedHtml` only when the `=\"` pattern is present
- Use `normalizeHtmlArtifact` for duplicated heading tags such as `<h11>` and empty closing tags such as `</>`
- Use `normalizeArtifactCssJs` to remove `<style>` and `<script>` wrappers
- Use `extractArtifactsFromHtml` as a fallback if CSS or JS fields are empty

## Prompt engineering — prevention at the source
```
// In the system prompt sent to the LLM:
Use single quotes for ALL HTML attributes.
WRONG: <html lang="it">
RIGHT:  <html lang='it'>
```
This removes most HTML-in-JSON escaping problems before they happen.

## Common pitfalls to avoid
- ❌ Global regex replacement on raw JSON for escaping → this damages HTML values and other string content
- ❌ `repairPrematureStringTermination` without the `":"` case → this corrupts every JSON key
- ❌ Returning the first successful parse → `repairTruncatedJson` may beat a better complete candidate
- ❌ Always running `unescapeDoubleEncodedHtml` → this can alter normal HTML unnecessarily
- ❌ Duplicating result assembly logic in every branch → centralize it in `assembleResult()`

## Component naming conventions
| Prefix | Contract |
|---|---|
| `repair*` | Never throws, always returns a string |
| `normalize*` | Cleans an already parsed value |
| `extract*` | Extracts a subset and returns `null` or `undefined` |
| `assemble*` | Builds the canonical result and returns `null` if required fields are missing |
| `score*` | Computes a quality score |
| `tryParse*` | Public entry point that catches exceptions and returns `null` or `{ valid: false }` |

## Covered LLM bugs
| Bug | Models | Repair |
|---|---|---|
| Markdown fence `` ```json `` | almost all models | phase 1 fence stripping |
| Invalid escapes (`\>`, `\ `) | various | `repairInvalidJsonEscapes` |
| Literal newlines or tabs inside strings | various | `repairInvalidJsonEscapes` |
| Premature `"` termination | gemma, phi | `repairPrematureStringTermination` |
| `max_tokens` truncation | all models | `repairTruncatedJson` |
| Double encoding such as `lang=\"it\"` | qwen, mistral | `unescapeDoubleEncodedHtml` |
| Duplicated headings such as `<h11>` | various | `normalizeHtmlArtifact` |
| Empty tags such as `</>` | various | `normalizeHtmlArtifact` |
| CSS or JS wrapped in tags | various | `normalizeArtifactCssJs` |
| Empty CSS or JS fields but inline content in HTML | various | `extractArtifactsFromHtml` |
| Stray token `>",` between JSON fields | Hunyuan-A13B | `repairStrayGtBetweenFields` |

## Related skills
- [llm-output-repair](llm-output-repair.md)

## Source
Extracted from: `knowledge/patterns/LLM_JSON_PARSING_GUIDELINES.md`
Original implementation: `apps/api/src/application/llm/llmParser.ts`
