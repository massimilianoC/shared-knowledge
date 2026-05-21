# Repository Map

Map of the connections between knowledge files, skills, and agents.
Update it whenever a file is added or changed.

---

## Folder taxonomy (domain-first)

```text
skills/
  llm/
    output/         JSON parsing, output repair, sanitization
    platform/       multi-provider catalog, gateway, cost, credits, context, background tasks
  sfad/
    bootstrap/      empty-repo → ready-to-open-M0 (AGENTS.md, vision, architecture, pre-src gate)
    governance/     stability tagging, ADRs (MADR)
    execution/      milestone lifecycle, slice tracking, 7-step workflow, PR DoD
    coordination/   external dependencies / parallel-team contracts

agents/
  llm/              LLM-platform agents (output processing, multi-provider architect)
  sfad/             SFAD agents (bootstrap, execution)

knowledge/
  llm/
    patterns/  decisions/  domain/
  sfad/
    patterns/  decisions/  domain/
```

A domain folder groups everything (skills, agents, patterns, decisions, domain notes) needed to think about that competence area. Inside a domain, file-type subfolders preserve the original knowledge classification (patterns / decisions / domain), and skills are grouped further by competence class (output, platform, bootstrap, governance, execution, coordination).

---

## Index by domain — LLM Engineering

### LLM — Knowledge

| Type | File | Description |
| --- | --- | --- |
| Pattern | [LLM_JSON_PARSING_GUIDELINES](knowledge/llm/patterns/LLM_JSON_PARSING_GUIDELINES.md) | Complete guide for parsing JSON from LLMs (stages, known bugs). |
| Pattern | [LLM_MODEL_DISCOVERY](knowledge/llm/patterns/LLM_MODEL_DISCOVERY.md) | Model discovery / catalog patterns across providers. |
| Pattern | [MULTIPROVIDER_LLM_ARCHITECTURE](knowledge/llm/patterns/MULTIPROVIDER_LLM_ARCHITECTURE.md) | Architecture of a multi-provider LLM platform. |
| Decision | [llm-cost-tracking-dual-source](knowledge/llm/decisions/llm-cost-tracking-dual-source.md) | Dual-source cost tracking rationale. |
| Decision | [llm-dual-source-catalog](knowledge/llm/decisions/llm-dual-source-catalog.md) | Dual-source model catalog rationale. |
| Decision | [llm-json-score-vs-first-match](knowledge/llm/decisions/llm-json-score-vs-first-match.md) | Score-based selection vs first-successful-parse. |
| Decision | [llm-platform-antiregression](knowledge/llm/decisions/llm-platform-antiregression.md) | Anti-regression strategy for the LLM platform. |
| Domain | [llm-platform-data-model](knowledge/llm/domain/llm-platform-data-model.md) | Data model for the multi-provider LLM platform. |

### LLM — Skills (class: output)

| File | Purpose |
| --- | --- |
| [llm-json-parsing](skills/llm/output/llm-json-parsing.md) | 5-stage pipeline: cleanup → candidates → repair → scoring → normalization. |
| [llm-output-repair](skills/llm/output/llm-output-repair.md) | Reusable state machine + individual repair functions. |

### LLM — Skills (class: platform)

| File | Purpose |
| --- | --- |
| [multiprovider-llm-catalog](skills/llm/platform/multiprovider-llm-catalog.md) | Manage a multi-provider model catalog. |
| [llm-gateway-router](skills/llm/platform/llm-gateway-router.md) | Provider routing / fallback at the gateway. |
| [llm-cost-tracking](skills/llm/platform/llm-cost-tracking.md) | Usage and cost accounting. |
| [llm-credit-engine](skills/llm/platform/llm-credit-engine.md) | Credits / quota engine. |
| [llm-context-budget](skills/llm/platform/llm-context-budget.md) | Context window budgeting. |
| [llm-background-tasks](skills/llm/platform/llm-background-tasks.md) | Background / long-running LLM tasks. |

### LLM — Agents

| File | Included skills | Purpose |
| --- | --- | --- |
| [llm-output-processor](agents/llm/llm-output-processor.md) | llm-json-parsing, llm-output-repair | Orchestrates JSON parsing + repair with model-specific behavior. |
| [multiprovider-llm-architect](agents/llm/multiprovider-llm-architect.md) | catalog, gateway, cost, credits, context, background | Designs and operates a multi-provider LLM platform. |

---

## Index by domain — Spec-First Agentic Development (SFAD)

### SFAD — Knowledge

| Type | File | Description |
| --- | --- | --- |
| Domain | [sfad-methodology](knowledge/sfad/domain/sfad-methodology.md) | SFAD overview, origin (Beehouse), canonical artifacts, calibration knobs. |
| Pattern | [SPEC_FIRST_AGENTIC_DEVELOPMENT](knowledge/sfad/patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md) | Meta-pattern: 5 pillars, 12 non-negotiables, document stack. |
| Pattern | [AGENT_CONTRACT_FILE](knowledge/sfad/patterns/AGENT_CONTRACT_FILE.md) | Single AGENTS.md + thin assistant aliases. |
| Pattern | [STABILITY_LAYERS](knowledge/sfad/patterns/STABILITY_LAYERS.md) | `stable` / `evolving` / `draft` tagging + promotion rules. |
| Pattern | [SSOT_AND_BOUNDARY](knowledge/sfad/patterns/SSOT_AND_BOUNDARY.md) | Naming SSoT per concern; boundary patterns A/B/C. |
| Pattern | [VERTICAL_MICRO_SLICES](knowledge/sfad/patterns/VERTICAL_MICRO_SLICES.md) | Slice state machine + 3 gates + tracker tables. |
| Pattern | [DOC_DRIVEN_AGENTIC_WORKFLOW](knowledge/sfad/patterns/DOC_DRIVEN_AGENTIC_WORKFLOW.md) | 7-step task loop (Plan → Read → Schema → Implement → Test → Verify → Document). |
| Decision | [agents-md-single-contract](knowledge/sfad/decisions/agents-md-single-contract.md) | Why one AGENTS.md beats per-assistant files. |
| Decision | [pre-src-gate](knowledge/sfad/decisions/pre-src-gate.md) | Why no `src/` until the Pre-`src/` Checklist is green. |
| Decision | [madr-adr-format](knowledge/sfad/decisions/madr-adr-format.md) | Why MADR-style ADRs under `docs/architecture/decisions/`. |

### SFAD — Skills (class: bootstrap)

| File | Purpose |
| --- | --- |
| [spec-first-bootstrap](skills/sfad/bootstrap/spec-first-bootstrap.md) | Empty repo → ready-to-open-M0 (full SFAD bootstrap). |
| [agents-md-author](skills/sfad/bootstrap/agents-md-author.md) | Author the binding AGENTS.md + thin assistant aliases. |
| [pre-src-checklist-runner](skills/sfad/bootstrap/pre-src-checklist-runner.md) | Verify the Pre-`src/` gate is green. |

### SFAD — Skills (class: governance)

| File | Purpose |
| --- | --- |
| [stability-classifier](skills/sfad/governance/stability-classifier.md) | Apply and audit `Stability:` tags; manage promotion/demotion. |
| [adr-writer](skills/sfad/governance/adr-writer.md) | Author MADR-style ADRs with coherence checks. |

### SFAD — Skills (class: execution)

| File | Purpose |
| --- | --- |
| [milestone-lifecycle](skills/sfad/execution/milestone-lifecycle.md) | Open / execute / close a milestone with checklists. |
| [microslice-tracker](skills/sfad/execution/microslice-tracker.md) | Manage micro-slice states + tracker tables. |
| [doc-driven-task-workflow](skills/sfad/execution/doc-driven-task-workflow.md) | Run the 7-step loop per task. |
| [pr-dod-enforcer](skills/sfad/execution/pr-dod-enforcer.md) | Generate compliant PR descriptions + verify Definition of Done. |

### SFAD — Skills (class: coordination)

| File | Purpose |
| --- | --- |
| [external-dependency-enablement](skills/sfad/coordination/external-dependency-enablement.md) | Co-own the Enablement Spec with the upstream owner. |

### SFAD — Agents

| File | Included skills | Purpose |
| --- | --- | --- |
| [sfad-bootstrap-agent](agents/sfad/sfad-bootstrap-agent.md) | spec-first-bootstrap, agents-md-author, stability-classifier, adr-writer, pre-src-checklist-runner, external-dependency-enablement | Drives new-project / retrofit bootstrap. |
| [sfad-execution-agent](agents/sfad/sfad-execution-agent.md) | milestone-lifecycle, microslice-tracker, doc-driven-task-workflow, pr-dod-enforcer, adr-writer, external-dependency-enablement, stability-classifier | Drives ongoing milestone/slice/PR execution. |

---

## Dependency graph — LLM Engineering

```text
knowledge/llm/patterns/LLM_JSON_PARSING_GUIDELINES.md
    │
    ├──► skills/llm/output/llm-output-repair.md
    │        └──► agents/llm/llm-output-processor.md
    │
    ├──► skills/llm/output/llm-json-parsing.md
    │        └──► agents/llm/llm-output-processor.md
    │
    └──► knowledge/llm/decisions/llm-json-score-vs-first-match.md
             └──► agents/llm/llm-output-processor.md
```

---

## Dependency graph — SFAD

```text
knowledge/sfad/domain/sfad-methodology.md
    │
    ├──► knowledge/sfad/patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md
    │        ├──► skills/sfad/bootstrap/spec-first-bootstrap.md
    │        ├──► skills/sfad/bootstrap/pre-src-checklist-runner.md
    │        └──► skills/sfad/execution/doc-driven-task-workflow.md
    │
    ├──► knowledge/sfad/patterns/AGENT_CONTRACT_FILE.md
    │        └──► skills/sfad/bootstrap/agents-md-author.md
    │
    ├──► knowledge/sfad/patterns/STABILITY_LAYERS.md
    │        └──► skills/sfad/governance/stability-classifier.md
    │
    ├──► knowledge/sfad/patterns/SSOT_AND_BOUNDARY.md
    │        └──► skills/sfad/coordination/external-dependency-enablement.md
    │
    ├──► knowledge/sfad/patterns/VERTICAL_MICRO_SLICES.md
    │        ├──► skills/sfad/execution/microslice-tracker.md
    │        └──► skills/sfad/execution/milestone-lifecycle.md
    │
    ├──► knowledge/sfad/patterns/DOC_DRIVEN_AGENTIC_WORKFLOW.md
    │        └──► skills/sfad/execution/pr-dod-enforcer.md
    │
    ├──► knowledge/sfad/decisions/agents-md-single-contract.md
    ├──► knowledge/sfad/decisions/pre-src-gate.md
    └──► knowledge/sfad/decisions/madr-adr-format.md
             └──► skills/sfad/governance/adr-writer.md

All SFAD skills above are wired into one of:
- agents/sfad/sfad-bootstrap-agent.md
- agents/sfad/sfad-execution-agent.md
```

---

## How to update this map

When you add a new file to the repository:

1. Place the file in the right domain folder (`llm/` or `sfad/`, or create a new domain).
2. Within the domain, choose the right subfolder:
   - `skills/<domain>/<class>/` — pick or create the competence class (output, platform, bootstrap, governance, execution, coordination, ...).
   - `knowledge/<domain>/patterns|decisions|domain/` — preserve the original knowledge classification.
   - `agents/<domain>/` — agents live at the domain root.
3. Add a row to the relevant table under "Index by domain".
4. Update the dependency graph if the file creates new links.
5. Run a link check (every relative link must resolve).

---

## Cross-domain affinity ideas

| New knowledge about... | Possible affinity with... |
| --- | --- |
| Other LLM parsing patterns (not JSON) | `llm/output/` → extend llm-json-parsing or create llm-text-parsing |
| Retry / fallback on LLM errors | `llm/platform/` → add llm-retry-strategy |
| Output schema validation | `llm/output/` → stage 6 validation phase |
| LLM response caching | New class under `llm/` (e.g., `llm/infra/`) |
| Prompt engineering | New class under `llm/` (e.g., `llm/prompting/`) or new domain `prompting/` |
| Retrospective patterns / milestone close anti-patterns | `sfad/execution/` → expand retro patterns |
| Stack-specific SFAD flavors (mobile, CLI, library) | `sfad/bootstrap/` → flavor catalog |
| ADR coherence checking across `decisions/` | `sfad/governance/` → extend adr-writer with coherence-audit |
| Cross-team release coordination | `sfad/coordination/` → add release-train-coordination |
| New domain altogether (e.g., security review, data pipelines) | Create `skills/<new-domain>/`, `agents/<new-domain>/`, `knowledge/<new-domain>/` |
