# Shared Knowledge Repository

A curated library of reusable AI-agent skills, agent definitions, architectural knowledge, and starter templates extracted from real projects.

## Agent Quick Start

Use this procedure when you have this repository's public URL or local path and need guidance for another project.

1. Read this file, then [`domains/README.md`](domains/README.md).
2. Match the request to one package: `spec-first-agentic-development` for project methodology, `llm-provider` for LLM-provider engineering, `rag-system` for multi-tenant retrieval, `workflow-automation` for durable workflow platforms, or `capture` for screenshot/PDF generation.
3. Read only that package's `README.md`; do not load unrelated packages.
4. Select the smallest suitable artifact:
   - choose an **agent** for an end-to-end workflow;
   - choose a **skill** for one focused capability;
   - read linked **knowledge** only when the skill or agent needs its rationale or constraints;
   - use **templates** only when creating the matching project artifact.
5. For a selected agent, import the agent, every skill in its **Included skills** list, and the linked knowledge those skills require. For a selected skill, import that skill plus its directly linked patterns, decisions, and templates. Preserve their relative structure.
6. Import only the selected package material and its linked dependencies; the root-level documents are navigation aids, not project requirements.
7. Reconcile imported guidance with the target project's existing instructions, architecture, security policy, and stack. Never overwrite those files blindly.

**Selection rule:** start from one artifact and follow only its dependencies. Copy the whole package only when you need broad adoption, such as a complete SFAD project bootstrap.

## Adopt in a project

### New project

1. Copy the required package, usually [`domains/spec-first-agentic-development/`](domains/spec-first-agentic-development/README.md), into the new repository.
2. Read [`domains/spec-first-agentic-development/README.md`](domains/spec-first-agentic-development/README.md), then use [`sfad-bootstrap-agent.md`](domains/spec-first-agentic-development/agents/sfad-bootstrap-agent.md).
3. Copy [`templates/spec-first-methodology/core/`](domains/spec-first-agentic-development/templates/spec-first-methodology/core/) to the target repository root and apply an optional flavor only when relevant.
4. Complete [`pre-src-checklist-runner.md`](domains/spec-first-agentic-development/skills/bootstrap/pre-src-checklist-runner.md) before creating `src/`.
5. After bootstrap, use [`sfad-execution-agent.md`](domains/spec-first-agentic-development/agents/sfad-execution-agent.md) for milestones, slices, and pull requests.

### Existing project

1. Copy the relevant complete `domains/<domain>/` package into the repository without overwriting its existing instructions or architecture documents.
2. Start with [`agents-md-author.md`](domains/spec-first-agentic-development/skills/bootstrap/agents-md-author.md) and the architecture overview template; reconcile them with the codebase and existing team rules.
3. Backfill requirements, roadmap, and execution documents incrementally. Do not block a safe, shippable change solely to complete historical documentation.
4. Use the package skills selectively, and preserve their linked knowledge and decisions as context.

## Use a domain package

The reusable unit is a complete package under [`domains/`](domains/README.md):

| Package | Use it for |
| --- | --- |
| [`domains/spec-first-agentic-development/`](domains/spec-first-agentic-development/README.md) | Bootstrapping and operating spec-first agentic projects. |
| [`domains/llm-provider/`](domains/llm-provider/README.md) | Reliable LLM outputs and multi-provider platform engineering. |
| [`domains/rag-system/`](domains/rag-system/README.md) | Multi-tenant RAG architecture and anti-leakage controls. |
| [`domains/capture/`](domains/capture/README.md) | Server-side screenshot and PDF capture. |
| [`domains/workflow-automation/`](domains/workflow-automation/README.md) | Durable workflow automation with a typed node graph and visual runtime UI. |

To reuse a package, copy its entire directory into the target repository, read its `README.md`, and preserve the internal structure. Do not copy an isolated agent or skill without its linked knowledge.

## For humans

1. Start at [domains/README.md](domains/README.md).
2. Copy the relevant `domains/<domain>/` directory into your project.
3. Follow the package README and use its skills, agents, and templates selectively.

## Repository structure

```text
domains/             copyable domain packages
templates/           generic authoring templates
```

## License

This repository is available under the [MIT License](LICENSE).
