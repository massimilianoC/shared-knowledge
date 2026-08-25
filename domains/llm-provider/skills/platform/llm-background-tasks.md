# Skill: LLM Background Tasks and Image Generation

## Description
Pattern for LLM operations that take more than 2–3 seconds, such as image generation or slow pipelines.
It returns a task ID immediately, runs the work in the background, and updates the stored task record.
It also covers client polling, timeouts with `AbortController`, and image generation through SiliconFlow.

## Expected inputs
- A slow operation to run, such as image generation, a pipeline, or an analysis task
- `conversationId` — used to attach the task to the current conversation
- Config values such as `timeoutMs`, `pollIntervalMs`, and the LLM provider

## Produced outputs
- An API endpoint that immediately returns `{ taskId, status: "pending" }`
- A `BackgroundTask` record updated in the background
- For image generation: a downloaded and stored image buffer, not just a temporary URL

## Steps / Procedure

### 1. BackgroundTask entity

```typescript
interface BackgroundTask {
    id: string;
    type: string;                // "image_gen" | "pipeline" | "analysis" | ...
    status: "pending" | "running" | "completed" | "failed";
    pipelineProfile?: string;
    input?: unknown;
    output?: unknown;
    error?: string;
    startedAt: Date;
    completedAt?: Date;
    tokenUsage?: TokenUsage;
    costEstimate?: CostEstimate;
}
```

### 2. Request handler flow

```typescript
// 1. Create the task and respond immediately
const task = await conversationRepo.addBackgroundTask(conversationId, {
    type: "image_gen",
    status: "pending",
    input: { prompt, model, size },
});
res.json({ taskId: task.id, status: "pending" });

// 2. Run in the background (DO NOT await in the response chain)
setImmediate(async () => {
    try {
        await conversationRepo.updateBackgroundTask(conversationId, task.id, { status: "running" });
        const result = await generateImage(prompt, model);
        await conversationRepo.updateBackgroundTask(conversationId, task.id, {
            status: "completed", output: result, completedAt: new Date(),
        });
    } catch (err) {
        await conversationRepo.updateBackgroundTask(conversationId, task.id, {
            status: "failed", error: String(err), completedAt: new Date(),
        });
    }
});
```

### 3. Client polling

```typescript
async function pollTaskStatus(taskId: string, maxMs = 30_000): Promise<TaskResult> {
    const deadline = Date.now() + maxMs;
    while (Date.now() < deadline) {
        const task = await api.getTask(taskId);
        if (task.status === "completed") return task.output;
        if (task.status === "failed") throw new Error(task.error);
        await sleep(2000); // 2s, not 1s — SiliconFlow FLUX.1 often needs 4–6s
    }
    throw new Error("Task polling timeout");
}
```

### 4. Image generation with timeout (SiliconFlow)

```typescript
async function generateImageWithSiliconFlow(opts: {
    prompt: string; model: string; size: string; steps: number;
    apiKey: string; baseUrl: string; timeoutMs: number;
}): Promise<SiliconFlowImageGenerationResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs);

    try {
        const response = await fetch(`${opts.baseUrl}/images/generations`, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
            body: JSON.stringify({
                model: opts.model,
                prompt: opts.prompt,
                image_size: opts.size,
                num_inference_steps: opts.steps,
            }),
        });

        if (!response.ok) {
            const body = await response.text().catch(() => "");
            throw new Error(`Provider error ${response.status}: ${body}`);
        }

        const json = await response.json();
        const imageUrl = json.data?.[0]?.url;

        // Download immediately — the provider URL is temporary and will expire
        const imageBuffer = await fetchBufferFromUrl(imageUrl, opts.apiKey);
        return { provider: "siliconflow", model: opts.model, buffer: imageBuffer };
    } finally {
        clearTimeout(timer);
    }
}
```

### 5. SSE streaming (for chat completions)

```typescript
router.get("/llm/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sendSse = (payload: unknown) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

    sendSse({ type: "start", provider: context.providerCatalog.provider });

    const stream = await callProviderStream(context, messages);
    for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content ?? "";
        if (delta) sendSse({ type: "chunk", content: delta });
    }

    sendSse({ type: "done", usage: stream.usage });
    res.end();
});
```

## Key patterns
- **Always respond immediately** with a `taskId` — do not keep the HTTP connection open
- Use `setImmediate` for background execution, not `Promise.resolve().then(...)`
- Apply `AbortController` to **all** provider calls to prevent resource leaks on timeout
- Download and buffer image URLs immediately — SiliconFlow URLs expire quickly

## Common pitfalls to avoid
- Awaiting the slow operation before `res.json()` — this blocks the HTTP response
- Polling every 1 second for tasks that typically take 4–6 seconds — this wastes resources and creates noisy logs
- Saving only the image URL instead of the buffer — the URL expires after a few minutes
- Not handling `status: "failed"` in the polling loop — the client waits forever
- Using the default `num_inference_steps = 20` for FLUX.1-schnell — use `4` for better speed
- Forgetting `clearTimeout(timer)` in `finally` — this causes memory leaks in long-lived processes

## Usage examples
```
"Implement SiliconFlow FLUX.1-schnell image generation as a background task:
 the client should receive a taskId immediately, poll every 2 seconds,
 and the server should download and store the image buffer."
```

## Related skills
- [multiprovider-llm-catalog](multiprovider-llm-catalog.md)
- [llm-cost-tracking](llm-cost-tracking.md)

## Source
Source materials are intentionally excluded from this public repository.
Date: 2026-04-17
