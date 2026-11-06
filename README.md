# Shared Knowledge

**A curated, copyable library of reusable skills, agents, architectural patterns, decisions, and starter templates for building reliable AI-enabled systems.**

[![Validate examples](https://github.com/massimilianoC/shared-knowledge/actions/workflows/validate-examples.yml/badge.svg)](https://github.com/massimilianoC/shared-knowledge/actions/workflows/validate-examples.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/badge/release-see%20VERSION-informational.svg)](VERSION)

Everything here was extracted from real engineering work and rewritten to be project-neutral. Each **domain package** is self-contained: take only the package, skill, or agent that fits your project, keep its relative structure, and adapt the guidance to your own architecture, stack, and security policy.

Current release: see [`VERSION`](VERSION) · [Changelog](CHANGELOG.md) · [Versioning policy](VERSIONING.md) · [Roadmap](ROADMAP.md)

## Contents

- [What is in the library](#what-is-in-the-library)
- [How the library is organized](#how-the-library-is-organized)
- [Quick start for people](#quick-start-for-people)
- [Quick start for AI agents](#quick-start-for-ai-agents)
- [Adopt in a project](#adopt-in-a-project)
- [Reuse examples](#reuse-examples)
- [Quality and validation](#quality-and-validation)
- [Roadmap](#roadmap)
- [Contributing, security, and license](#contributing-security-and-license)

## What is in the library

| Package | Use it for | Contents | Start here |
| --- | --- | --- | --- |
| [`spec-first-agentic-development/`](domains/spec-first-agentic-development/README.md) | Specification-first delivery: durable agent context, ADRs, quality gates, session handoff, and project bootstrap templates. | 15 skills, 2 agents, 19 knowledge files, templates | [Package README](domains/spec-first-agentic-development/README.md) |
| [`llm-provider/`](domains/llm-provider/README.md) | Reliable LLM platforms: structured output parsing and repair, multi-provider routing and catalogs, cost and credit tracking, context budgets, background tasks, and typed-decision classifiers with an auditable benchmark. | 11 skills, 3 agents, 13 knowledge files, benchmark kit | [Package README](domains/llm-provider/README.md) |
| [`rag-system/`](domains/rag-system/README.md) | Multi-tenant retrieval-augmented generation: double sandboxing, tenant-leakage audits, versioned embedding generations, hybrid retrieval, and quality benchmarks. | 3 skills, 1 agent, 11 knowledge files | [Package README](domains/rag-system/README.md) |
| [`capture/`](domains/capture/README.md) | Server-side HTML rendering into screenshots and PDFs with headless Chromium, including pagination heuristics. | 2 skills, 1 agent, 6 knowledge files | [Package README](domains/capture/README.md) |
| [`workflow-automation/`](domains/workflow-automation/README.md) | Durable typed node-graph workflows, execution runtime, and visual orchestration. | 1 skill, 2 knowledge files | [Package README](domains/workflow-automation/README.md) |

The complete inventory, file by file, is in the [package catalog](MAP.md). Planned packages are listed in the [roadmap](ROADMAP.md).

## How the library is organized

```text
domains/<domain>/
  README.md        entry point: scope, included artifacts, how to import
  skills/          one bounded, reusable capability per file
  agents/          end-to-end workflows composed of two or more skills
  knowledge/
    patterns/      reusable architectural patterns
    decisions/     ADR-style decisions with context and trade-offs
    domain/        domain models and background notes
  templates/       optional starter files for the matching project artifact
templates/         generic authoring templates for new skills and agents
validation/        repository-only tests for the supplied examples
```

| Artifact | What it is | When to choose it |
| --- | --- | --- |
| **Skill** | One focused procedure with inputs, steps, and checks. | You need a single capability. |
| **Agent** | A composition of skills with a testable system prompt. | You need an end-to-end workflow. |
| **Pattern / Decision / Domain note** | The rationale, constraints, and trade-offs behind skills. | A skill links to it, or you need to justify a design choice. |
| **Template** | Starter files to copy into a project. | You are creating the matching artifact. |

## Quick start for people

1. Pick the package that matches the problem; do not load unrelated packages.
2. Read its `README.md` and begin with the named skill, agent, or pattern.
3. Copy the selected artifact together with its direct dependencies, or copy the full package when the boundaries are unclear.
4. Adapt the material to your application, stack, security policy, and delivery constraints.

Example: to design a multi-tenant knowledge assistant, begin with the [multi-tenant RAG architecture pattern](domains/rag-system/knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md), then use the [bootstrap architect](domains/rag-system/agents/rag-bootstrap-architect.md) when implementation and audit are both needed.

## Quick start for AI agents

Use this procedure when you have this repository's public URL or local path and need guidance for another project.

1. Read this file, then [`domains/README.md`](domains/README.md).
2. Match the request to one package: `spec-first-agentic-development` for project methodology, `llm-provider` for generative or typed-decision model integration, `rag-system` for multi-tenant retrieval, `workflow-automation` for durable workflow platforms, or `capture` for screenshot/PDF generation.
3. Read only that package's `README.md`; do not load unrelated packages.
4. Select the smallest suitable artifact:
   - choose an **agent** for an end-to-end workflow;
   - choose a **skill** for one focused capability;
   - read linked **knowledge** only when the skill or agent needs its rationale or constraints;
   - use **templates** only when creating the matching project artifact.
5. For a selected agent, import the agent, every skill in its **Included skills** list, and the linked knowledge those skills require. For a selected skill, import that skill plus its directly linked patterns, decisions, and templates. Preserve their relative structure.
6. Import only the selected package material and its linked dependencies; the root-level documents are navigation aids, not project requirements.
7. Reconcile imported guidance with the target project's existing instructions, architecture, security policy, and stack. Never overwrite those files blindly.
8. State assumptions, dependencies, and any project-specific deviations. Keep generated documentation in English unless the target project requires another language.

**Selection rule:** start from one artifact and follow only its dependencies. Copy the whole package only when you need broad adoption, such as a complete SFAD project bootstrap.

Example task for an agent:

```text
Task: Design a multi-tenant RAG service for a SaaS application.

1. Read domains/rag-system/README.md.
2. Read the multi-tenant architecture pattern and the included skills.
3. Preserve the application and storage isolation boundaries in the proposed design.
4. Produce an implementation plan and an anti-leakage verification plan.
5. Do not import unrelated packages or overwrite the target project's existing rules.
```

## Adopt in a project

### New project

1. Copy the required package, usually [`domains/spec-first-agentic-development/`](domains/spec-first-agentic-development/README.md), into the new repository.
2. Read its README, then use [`sfad-bootstrap-agent.md`](domains/spec-first-agentic-development/agents/sfad-bootstrap-agent.md).
3. Copy [`templates/spec-first-methodology/core/`](domains/spec-first-agentic-development/templates/spec-first-methodology/core/) to the target repository root and apply an optional flavor only when relevant.
4. Complete [`pre-src-checklist-runner.md`](domains/spec-first-agentic-development/skills/bootstrap/pre-src-checklist-runner.md) before creating `src/`.
5. After bootstrap, use [`sfad-execution-agent.md`](domains/spec-first-agentic-development/agents/sfad-execution-agent.md) for milestones, slices, and pull requests.

### Existing project

1. Copy the relevant complete `domains/<domain>/` package into the repository without overwriting its existing instructions or architecture documents.
2. Start with [`agents-md-author.md`](domains/spec-first-agentic-development/skills/bootstrap/agents-md-author.md) and the architecture overview template; reconcile them with the codebase and existing team rules.
3. Backfill requirements, roadmap, and execution documents incrementally. Do not block a safe, shippable change solely to complete historical documentation.
4. Use the package skills selectively, and preserve their linked knowledge and decisions as context.

## Reuse examples

| Goal | Start with |
| --- | --- |
| Turn model responses into trustworthy structured data | [`llm-json-parsing`](domains/llm-provider/skills/output/llm-json-parsing.md) and [`llm-output-repair`](domains/llm-provider/skills/output/llm-output-repair.md) |
| Route calls across providers with a maintained model catalog | [`llm-gateway-router`](domains/llm-provider/skills/platform/llm-gateway-router.md) and [`multiprovider-llm-catalog`](domains/llm-provider/skills/platform/multiprovider-llm-catalog.md) |
| Evaluate a classifier on labeled data before adopting it | [`classification-benchmark`](domains/llm-provider/skills/platform/classification-benchmark.md) and the [benchmark kit](domains/llm-provider/templates/classification-benchmark-kit/README.md) |
| Establish specifications, decisions, and handoff before substantial implementation | [`sfad-bootstrap-agent`](domains/spec-first-agentic-development/agents/sfad-bootstrap-agent.md) |
| Prove tenant isolation in a retrieval system | [`rag-multitenancy-leakage-audit`](domains/rag-system/skills/rag-multitenancy-leakage-audit.md) |
| Render HTML into screenshots and PDFs on a server | [`html-artifact-capture-bootstrap`](domains/capture/skills/html-artifact-capture-bootstrap.md) |
| Design a durable node-graph automation engine | [`node-graph-workflow-automation`](domains/workflow-automation/skills/node-graph-workflow-automation.md) |

## Quality and validation

- **Project-neutral by rule.** Guidance is rewritten so it does not carry the source project's names, measurements, or credentials.
- **Traceable.** Skills and decisions record their evidence status and rationale.
- **Link-checked and example-tested.** `npm test` (Node 20 or later) runs an offline suite that executes registered runnable examples against local mocks and checks documentary templates, package links, and source-project neutrality. No live provider credential is needed. The same suite runs in [CI](.github/workflows/validate-examples.yml) on Linux and Windows. See the [validation guide](validation/README.md) and its [agent instructions](validation/AGENTS.md).
- **Versioned.** Releases use calendar versioning with a semantic suffix; see [`VERSIONING.md`](VERSIONING.md) and the [changelog](CHANGELOG.md).

## Roadmap

New packages are added as the underlying practice is proven in real work. Next in line:

- **Agentic CAD for 3D printing**: parametric modeling with agents, printability checks, slicing, and printer handoff.
- **Audio transcription**: speech-to-text pipelines, diarization, post-processing, and quality evaluation.

Details, status, and how to propose a package are in [`ROADMAP.md`](ROADMAP.md).

## Contributing, security, and license

- Contributions are welcome: read [`CONTRIBUTING.md`](CONTRIBUTING.md) and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- To report a vulnerability or an accidentally published secret, see [`SECURITY.md`](SECURITY.md). Please do not open a public issue for it.
- To cite this library, use [`CITATION.cff`](CITATION.cff).
- Released under the [MIT License](LICENSE).
