# Skill: LLM Context Budget Management

## Description
Manages context budget for LLM calls explicitly through artifact truncation,
history pruning, and an output budget policy appended to the system prompt.
It prevents `context_length_exceeded` errors in production without relying on model-specific tokenizers.

## Expected inputs
- `messages: HistoryMessage[]` — conversation history
- `artifact: string` — HTML or text content to include as context
- Budget constants from env, not hardcoded, such as `MAX_CONTEXT_CHARS` and `MAX_HISTORY_MESSAGES`
- `maxTokens: number` — maximum output token limit for the model

## Produced outputs
- `prunedHistory: LlmMessage[]` — safe, trimmed history
- `truncatedArtifact: string` — truncated artifact content
- `outputBudgetPolicy: string` — a section to append to the system prompt
- An estimated remaining budget for the current message

## Steps / Procedure

### 1. Define environment-based constants

```typescript
const MAX_CONTEXT_CHARS = env.LLM_CONTEXT_MAX_CHARS;            // default 64000
const MAX_ARTIFACT_CHARS = env.LLM_ARTIFACT_CONTEXT_MAX_CHARS;  // default 16000
const MAX_HISTORY_MESSAGES = env.LLM_MAX_HISTORY_MESSAGES;      // default 12
const MAX_HISTORY_MESSAGE_CHARS = env.LLM_HISTORY_MESSAGE_MAX_CHARS; // default 2000
const MAX_HISTORY_CHARS = env.LLM_HISTORY_MAX_CHARS;            // default 7000
```

### 2. Truncate the artifact

```typescript
function truncateArtifact(html: string, maxChars: number): string {
    if (html.length <= maxChars) return html;
    return html.slice(0, maxChars) + "\n<!-- [TRUNCATED FOR CONTEXT BUDGET] -->";
}
```

### 3. Prune history safely

```typescript
function pruneHistory(
    history: HistoryMessage[],
    maxMessages: number,
    maxCharsPerMessage: number,
    maxTotalChars: number
): LlmMessage[] {
    const recent = history.slice(-maxMessages);
    let totalChars = 0;
    const result: LlmMessage[] = [];

    for (const msg of recent) {
        const truncated = msg.content.length > maxCharsPerMessage
            ? msg.content.slice(0, maxCharsPerMessage) + " [...]"
            : msg.content;
        if (totalChars + truncated.length > maxTotalChars) break;
        totalChars += truncated.length;
        result.push({ role: msg.role, content: truncated });
    }
    return result;
}
```

### 4. Focus-edit history mode

```typescript
// LLM_FOCUS_HISTORY_MODE=none      → no history (maximum savings)
// LLM_FOCUS_HISTORY_MODE=user_only → user messages only (removes assistant HTML artifacts)
// LLM_FOCUS_HISTORY_MODE=full      → full history (default chat mode)
```

### 5. Add an output budget policy to the system prompt

```typescript
function buildOutputBudgetPolicy(maxTokens: number): string {
    return [
        "## OUTPUT BUDGET POLICY",
        "- Return ONLY one raw JSON object — no markdown fences, no prose before or after.",
        `- TOTAL OUTPUT MUST stay under ${maxTokens.toLocaleString()} tokens.`,
        "- Target 8000–32000 tokens for typical requests. Never repeat the entire artifact for small changes.",
        "- artifacts.css and artifacts.js must be plain strings without <style> or <script> wrappers.",
        "- Use standard JSON escaping: \\\" for quotes inside HTML, \\n for newlines.",
        "",
        "## REASONING BUDGET (critical)",
        "- Keep internal reasoning under 2000 tokens.",
        "- Skip exploratory analysis and rejected-alternative lists.",
        "- Plan briefly (< 300 words), then produce output immediately.",
    ].join("\n");
}
```

## Key patterns
- Use **characters, not tokens**, for budget estimation ($1$ token is roughly $3$–$4$ characters in mixed text) to avoid tokenizer dependencies
- Keep all constants in env so they remain tunable without rebuild or redeploy
- Truncation happens **before** sending the request to the model, never after receiving an error
- In `focus-edit` mode, reduce history aggressively when the user is editing a specific artifact

## Common pitfalls to avoid
- Hardcoding `MAX_CONTEXT_CHARS = 64000` in code instead of env
- Truncating only the total size without truncating individual messages — one huge message can still overflow the budget
- Forgetting to append `buildOutputBudgetPolicy()` to the system prompt — models may exceed the output budget without explicit guidance
- Omitting the `<!-- [TRUNCATED] -->` marker — this makes debugging much harder because the partial artifact becomes invisible

## Usage examples
```
"Build the message builder for SiliconFlow calls: it must apply
 a 64k-character context budget, prune the last 12 history messages,
 and append the output budget policy to the system prompt."
```

## Related skills
- [multiprovider-llm-catalog](multiprovider-llm-catalog.md)
- [llm-json-parsing](../output/llm-json-parsing.md)
- [llm-output-repair](../output/llm-output-repair.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-04-17
