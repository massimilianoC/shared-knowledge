# Shared Knowledge Repository

A curated library of reusable AI-agent skills, agent definitions, architectural knowledge, and starter templates extracted from real projects.

## Agent Quick Start

Use this procedure when you have this repository's public URL or local path and need guidance for another project.

1. Read this file, then [`domains/README.md`](domains/README.md).
2. Match the request to one package: `sfad` for project methodology, `llm` for LLM engineering, `rag` for multi-tenant retrieval, or `capture` for screenshot/PDF generation.
3. Read only that package's `README.md`; do not load unrelated packages.
4. Select the smallest suitable artifact:
   - choose an **agent** for an end-to-end workflow;
   - choose a **skill** for one focused capability;
   - read linked **knowledge** only when the skill or agent needs its rationale or constraints;
   - use **templates** only when creating the matching project artifact.
5. For a selected agent, import the agent, every skill in its **Included skills** list, and the linked knowledge those skills require. For a selected skill, import that skill plus its directly linked patterns, decisions, and templates. Preserve their relative structure.
6. Do not import `inbox/` or repository-maintenance files (`AI_GUIDELINES.md`, `CONTRIBUTING.md`) into the target project unless you explicitly want to adopt this repository's maintenance model.
7. Reconcile imported guidance with the target project's existing instructions, architecture, security policy, and stack. Never overwrite those files blindly.

**Selection rule:** start from one artifact and follow only its dependencies. Copy the whole package only when you need broad adoption, such as a complete SFAD project bootstrap.

## Adopt in a project

### New project

1. Copy the required package, usually [`domains/sfad/`](domains/sfad/README.md), into the new repository.
2. Read [`domains/sfad/README.md`](domains/sfad/README.md), then use [`sfad-bootstrap-agent.md`](domains/sfad/agents/sfad-bootstrap-agent.md).
3. Copy [`templates/spec-first-methodology/core/`](domains/sfad/templates/spec-first-methodology/core/) to the target repository root and apply an optional flavor only when relevant.
4. Complete [`pre-src-checklist-runner.md`](domains/sfad/skills/bootstrap/pre-src-checklist-runner.md) before creating `src/`.
5. After bootstrap, use [`sfad-execution-agent.md`](domains/sfad/agents/sfad-execution-agent.md) for milestones, slices, and pull requests.

### Existing project

1. Copy the relevant complete `domains/<domain>/` package into the repository without overwriting its existing instructions or architecture documents.
2. Start with [`agents-md-author.md`](domains/sfad/skills/bootstrap/agents-md-author.md) and the architecture overview template; reconcile them with the codebase and existing team rules.
3. Backfill requirements, roadmap, and execution documents incrementally. Do not block a safe, shippable change solely to complete historical documentation.
4. Use the package skills selectively, and preserve their linked knowledge and decisions as context.

## Use a domain package

The reusable unit is a complete package under [`domains/`](domains/README.md):

| Package | Use it for |
| --- | --- |
| [`domains/sfad/`](domains/sfad/README.md) | Bootstrapping and operating spec-first agentic projects. |
| [`domains/llm/`](domains/llm/README.md) | Reliable LLM outputs and multi-provider platform engineering. |
| [`domains/rag/`](domains/rag/README.md) | Multi-tenant RAG architecture and anti-leakage controls. |
| [`domains/capture/`](domains/capture/README.md) | Server-side screenshot and PDF capture. |

To reuse a package, copy its entire directory into the target repository, read its `README.md`, and preserve the internal structure. Do not copy an isolated agent or skill without its linked knowledge.

## For humans

1. Start at [domains/README.md](domains/README.md).
2. Copy the relevant `domains/<domain>/` directory into your project.
3. Follow the package README and use its skills, agents, and templates selectively.
4. Contribute new material through [CONTRIBUTING.md](CONTRIBUTING.md).

## For AI agents

1. Read [AI_GUIDELINES.md](AI_GUIDELINES.md).
2. Read [MAP.md](MAP.md) and the target package README.
3. Store all new artifacts under `domains/<domain>/`.
4. Keep package links valid and update the package README plus MAP.
5. Write generated structured content in English.

## Ingesting new knowledge

Put raw notes in `inbox/` and request `process inbox` or `elabora inbox`. The source is classified, extracted into a domain package, and archived in `inbox/processed/`.

## Repository structure

```text
domains/             copyable domain packages
inbox/               raw project notes awaiting ingestion
inbox/processed/     archived source material
templates/           generic authoring templates
```

## License

This repository is available under the [MIT License](LICENSE).
