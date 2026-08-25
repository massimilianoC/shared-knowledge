# Repository Map

Canonical catalog of self-contained domain packages. Copy a package directory intact to preserve its skills, agents, knowledge, templates, and relative links.

## Package Index

| Package | Scope | Entry point |
| --- | --- | --- |
| `capture/` | 2 skills, 1 agents, 6 knowledge files | [capture/ README](domains/capture/README.md) |
| `llm-provider/` | 9 skills, 2 agents, 11 knowledge files | [llm-provider/ README](domains/llm-provider/README.md) |
| `rag-system/` | 2 skills, 1 agents, 6 knowledge files | [rag-system/ README](domains/rag-system/README.md) |
| `spec-first-agentic-development/` | 15 skills, 2 agents, 19 knowledge files | [spec-first-agentic-development/ README](domains/spec-first-agentic-development/README.md) |
| `workflow-automation/` | 1 skill, 0 agents, 2 knowledge files | [workflow-automation/ README](domains/workflow-automation/README.md) |

## Package: `capture/`

Entry point: [domains/capture/README.md](domains/capture/README.md)

### Skills

| Class | File | Purpose |
| --- | --- | --- |
| `general` | [html-artifact-capture-bootstrap](domains/capture/skills/html-artifact-capture-bootstrap.md) | Skill: HTML Artifact Screenshot/PDF Capture Bootstrap |
| `general` | [pdf-pagination-heuristic](domains/capture/skills/pdf-pagination-heuristic.md) | Skill: PDF Pagination Heuristic for Content Without Print CSS |

### Agents

| File | Role |
| --- | --- |
| [html-artifact-capture-porter](domains/capture/agents/html-artifact-capture-porter.md) | Agent: HTML Artifact Capture Porter |

### Knowledge

| Type | File | Topic |
| --- | --- | --- |
| pattern | [HEADLESS_CHROMIUM_CAPTURE_PIPELINE](domains/capture/knowledge/patterns/HEADLESS_CHROMIUM_CAPTURE_PIPELINE.md) | Pattern: Headless Chromium Capture Pipeline (Screenshot + PDF) |
| pattern | [PDF_PAGINATION_HEURISTIC](domains/capture/knowledge/patterns/PDF_PAGINATION_HEURISTIC.md) | Pattern: Content-Agnostic PDF Pagination Heuristic |
| decision | [headless-chromium-vs-client-side-rendering](domains/capture/knowledge/decisions/headless-chromium-vs-client-side-rendering.md) | Decision: Headless Chromium (Puppeteer) over client-side canvas rendering |
| decision | [one-browser-per-capture-call](domains/capture/knowledge/decisions/one-browser-per-capture-call.md) | Decision: One browser launch per capture call, not a shared pool |
| decision | [os-installed-chromium-over-bundled-download](domains/capture/knowledge/decisions/os-installed-chromium-over-bundled-download.md) | Decision: OS-installed Chromium package over Puppeteer's bundled download |
| domain | [capture-service-storage-and-security-model](domains/capture/knowledge/domain/capture-service-storage-and-security-model.md) | Domain: Capture Service — Storage and Security Model |

## Package: `llm-provider/`

Entry point: [domains/llm-provider/README.md](domains/llm-provider/README.md)

### Skills

| Class | File | Purpose |
| --- | --- | --- |
| `output` | [llm-json-parsing](domains/llm-provider/skills/output/llm-json-parsing.md) | Skill: LLM JSON Parsing (Robust) |
| `output` | [llm-mermaid-diagram-rendering](domains/llm-provider/skills/output/llm-mermaid-diagram-rendering.md) | Skill: LLM-Generated Mermaid Diagram Rendering |
| `output` | [llm-output-repair](domains/llm-provider/skills/output/llm-output-repair.md) | Skill: LLM Output Repair (State Machine) |
| `platform` | [llm-background-tasks](domains/llm-provider/skills/platform/llm-background-tasks.md) | Skill: LLM Background Tasks and Image Generation |
| `platform` | [llm-context-budget](domains/llm-provider/skills/platform/llm-context-budget.md) | Skill: LLM Context Budget Management |
| `platform` | [llm-cost-tracking](domains/llm-provider/skills/platform/llm-cost-tracking.md) | Skill: LLM Cost Tracking |
| `platform` | [llm-credit-engine](domains/llm-provider/skills/platform/llm-credit-engine.md) | Skill: LLM Credit Engine (Abstract Credits) |
| `platform` | [llm-gateway-router](domains/llm-provider/skills/platform/llm-gateway-router.md) | Skill: LLM Gateway Router |
| `platform` | [multiprovider-llm-catalog](domains/llm-provider/skills/platform/multiprovider-llm-catalog.md) | Skill: Multi-Provider LLM Catalog |

### Agents

| File | Role |
| --- | --- |
| [llm-output-processor](domains/llm-provider/agents/llm-output-processor.md) | Agent: LLM Output Processor |
| [multiprovider-llm-architect](domains/llm-provider/agents/multiprovider-llm-architect.md) | Agent: Multi-Provider LLM Architect |

### Knowledge

| Type | File | Topic |
| --- | --- | --- |
| pattern | [LLM_GENERATED_DIAGRAM_RENDERING](domains/llm-provider/knowledge/patterns/LLM_GENERATED_DIAGRAM_RENDERING.md) | LLM-Generated Diagram Rendering — Guidelines and Techniques |
| pattern | [LLM_JSON_PARSING_GUIDELINES](domains/llm-provider/knowledge/patterns/LLM_JSON_PARSING_GUIDELINES.md) | LLM JSON Parsing — Guidelines and Techniques |
| pattern | [LLM_MODEL_DISCOVERY](domains/llm-provider/knowledge/patterns/LLM_MODEL_DISCOVERY.md) | Pattern: LLM Model Discovery (Bootstrap + On-Demand) |
| pattern | [MULTIPROVIDER_LLM_ARCHITECTURE](domains/llm-provider/knowledge/patterns/MULTIPROVIDER_LLM_ARCHITECTURE.md) | Pattern: Multi-Provider LLM Architecture |
| decision | [llm-cost-tracking-dual-source](domains/llm-provider/knowledge/decisions/llm-cost-tracking-dual-source.md) | Decision: Dual-source cost tracking — provider-reported vs flat-rate |
| decision | [llm-dual-source-catalog](domains/llm-provider/knowledge/decisions/llm-dual-source-catalog.md) | Decision: Dual-source catalog — env vs MongoDB |
| decision | [llm-json-score-vs-first-match](domains/llm-provider/knowledge/decisions/llm-json-score-vs-first-match.md) | Decision: Score-based selection vs first-match in LLM repair flows |
| decision | [llm-platform-antiregression](domains/llm-provider/knowledge/decisions/llm-platform-antiregression.md) | Decision: LLM Gateway Platform — Anti-regression Rules |
| decision | [render-into-scratch-node-not-framework-dom](domains/llm-provider/knowledge/decisions/render-into-scratch-node-not-framework-dom.md) | Decision: Render into a detached scratch node, then inject the serialized string |
| decision | [reset-fallback-state-per-streaming-attempt](domains/llm-provider/knowledge/decisions/reset-fallback-state-per-streaming-attempt.md) | Decision: Reset transient fallback state on every attempt, not just on success |
| domain | [llm-platform-data-model](domains/llm-provider/knowledge/domain/llm-platform-data-model.md) | Domain: LLM Gateway Platform — Data Model |

## Package: `rag-system/`

Entry point: [domains/rag-system/README.md](domains/rag-system/README.md)

### Skills

| Class | File | Purpose |
| --- | --- | --- |
| `general` | [rag-multitenancy-leakage-audit](domains/rag-system/skills/rag-multitenancy-leakage-audit.md) | Skill: RAG Multi-Tenancy Leakage Audit |
| `general` | [rag-weaviate-double-sandbox-bootstrap](domains/rag-system/skills/rag-weaviate-double-sandbox-bootstrap.md) | Skill: RAG Weaviate Double-Sandbox Bootstrap |

### Agents

| File | Role |
| --- | --- |
| [rag-bootstrap-architect](domains/rag-system/agents/rag-bootstrap-architect.md) | Agent: RAG Bootstrap Architect |

### Knowledge

| Type | File | Topic |
| --- | --- | --- |
| pattern | [DOUBLE_SANDBOXING](domains/rag-system/knowledge/patterns/DOUBLE_SANDBOXING.md) | Pattern: Double Sandboxing (Two Independent Isolation Layers) |
| pattern | [MULTITENANT_RAG_ARCHITECTURE](domains/rag-system/knowledge/patterns/MULTITENANT_RAG_ARCHITECTURE.md) | Pattern: Multi-Tenant RAG Service Architecture |
| decision | [anti-leakage-test-suite-as-gate](domains/rag-system/knowledge/decisions/anti-leakage-test-suite-as-gate.md) | Decision: Anti-leakage E2E suite is a mandatory merge gate |
| decision | [self-provided-embeddings](domains/rag-system/knowledge/decisions/self-provided-embeddings.md) | Decision: Self-provided embeddings, not server-side vectorization |
| decision | [weaviate-native-multitenancy-vs-qdrant](domains/rag-system/knowledge/decisions/weaviate-native-multitenancy-vs-qdrant.md) | Decision: Weaviate native multi-tenancy over Qdrant payload-partitioning |
| domain | [rag-tenant-scope-data-model](domains/rag-system/knowledge/domain/rag-tenant-scope-data-model.md) | Domain: Multi-Tenant RAG — Token Claims and Chunk Data Model |

## Package: `spec-first-agentic-development/`

Entry point: [domains/spec-first-agentic-development/README.md](domains/spec-first-agentic-development/README.md)

### Skills

| Class | File | Purpose |
| --- | --- | --- |
| `bootstrap` | [agents-md-author](domains/spec-first-agentic-development/skills/bootstrap/agents-md-author.md) | Skill: Author a Binding AGENTS.md (Single Agent Contract) |
| `bootstrap` | [pre-src-checklist-runner](domains/spec-first-agentic-development/skills/bootstrap/pre-src-checklist-runner.md) | Skill: Pre-src/ Checklist Runner |
| `bootstrap` | [spec-first-bootstrap](domains/spec-first-agentic-development/skills/bootstrap/spec-first-bootstrap.md) | Skill: Spec-First Project Bootstrap (SFAD) |
| `coordination` | [external-dependency-enablement](domains/spec-first-agentic-development/skills/coordination/external-dependency-enablement.md) | Skill: External Dependency Enablement |
| `execution` | [doc-driven-task-workflow](domains/spec-first-agentic-development/skills/execution/doc-driven-task-workflow.md) | Skill: Doc-Driven Task Workflow (7-Step Loop) |
| `execution` | [microslice-tracker](domains/spec-first-agentic-development/skills/execution/microslice-tracker.md) | Skill: Micro-Slice Tracker |
| `execution` | [milestone-lifecycle](domains/spec-first-agentic-development/skills/execution/milestone-lifecycle.md) | Skill: Milestone Lifecycle (Open / Execute / Close) |
| `execution` | [pr-dod-enforcer](domains/spec-first-agentic-development/skills/execution/pr-dod-enforcer.md) | Skill: Pull Request & Definition-of-Done Enforcer |
| `execution` | [requirements-to-acceptance-traceability](domains/spec-first-agentic-development/skills/execution/requirements-to-acceptance-traceability.md) | Skill: Requirements-to-Acceptance Traceability |
| `execution` | [risk-based-verification-gauntlet](domains/spec-first-agentic-development/skills/execution/risk-based-verification-gauntlet.md) | Skill: Risk-Based Verification Gauntlet |
| `execution` | [session-handoff-and-recovery](domains/spec-first-agentic-development/skills/execution/session-handoff-and-recovery.md) | Skill: Session Handoff and Recovery |
| `governance` | [adr-writer](domains/spec-first-agentic-development/skills/governance/adr-writer.md) | Skill: ADR Writer (MADR Format) |
| `governance` | [agent-context-architecture](domains/spec-first-agentic-development/skills/governance/agent-context-architecture.md) | Skill: Agent Context Architecture |
| `governance` | [human-decision-gates](domains/spec-first-agentic-development/skills/governance/human-decision-gates.md) | Skill: Human Decision Gates |
| `governance` | [stability-classifier](domains/spec-first-agentic-development/skills/governance/stability-classifier.md) | Skill: Stability Classifier and Tagger |

### Agents

| File | Role |
| --- | --- |
| [sfad-bootstrap-agent](domains/spec-first-agentic-development/agents/sfad-bootstrap-agent.md) | Agent: SFAD Project Bootstrap Agent |
| [sfad-execution-agent](domains/spec-first-agentic-development/agents/sfad-execution-agent.md) | Agent: SFAD Execution Agent |

### Knowledge

| Type | File | Topic |
| --- | --- | --- |
| pattern | [AGENT_CONTRACT_FILE](domains/spec-first-agentic-development/knowledge/patterns/AGENT_CONTRACT_FILE.md) | Pattern: AGENTS.md as Single Agent Contract |
| pattern | [CONTRACT_TO_ACCEPTANCE_TRACEABILITY](domains/spec-first-agentic-development/knowledge/patterns/CONTRACT_TO_ACCEPTANCE_TRACEABILITY.md) | Pattern: Contract-to-Acceptance Traceability |
| pattern | [DOC_DRIVEN_AGENTIC_WORKFLOW](domains/spec-first-agentic-development/knowledge/patterns/DOC_DRIVEN_AGENTIC_WORKFLOW.md) | Pattern: Doc-Driven Agentic Workflow (7 Steps per Task) |
| pattern | [DURABLE_EXECUTION_MEMORY](domains/spec-first-agentic-development/knowledge/patterns/DURABLE_EXECUTION_MEMORY.md) | Pattern: Durable Execution Memory |
| pattern | [RISK_BASED_VERIFICATION_GAUNTLET](domains/spec-first-agentic-development/knowledge/patterns/RISK_BASED_VERIFICATION_GAUNTLET.md) | Pattern: Risk-Based Verification Gauntlet |
| pattern | [SPEC_FIRST_AGENTIC_DEVELOPMENT](domains/spec-first-agentic-development/knowledge/patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md) | Pattern: Spec-First Agentic Development (SFAD) |
| pattern | [SSOT_AND_BOUNDARY](domains/spec-first-agentic-development/knowledge/patterns/SSOT_AND_BOUNDARY.md) | Pattern: Single Source of Truth and Boundary Discipline |
| pattern | [STABILITY_LAYERS](domains/spec-first-agentic-development/knowledge/patterns/STABILITY_LAYERS.md) | Pattern: Stability Layers for Documentation |
| pattern | [THREE_LAYER_AGENT_CONTEXT](domains/spec-first-agentic-development/knowledge/patterns/THREE_LAYER_AGENT_CONTEXT.md) | Pattern: Three-Layer Agent Context |
| pattern | [VERTICAL_MICRO_SLICES](domains/spec-first-agentic-development/knowledge/patterns/VERTICAL_MICRO_SLICES.md) | Pattern: Vertical Micro-Slices with Explicit States |
| decision | [agents-md-single-contract](domains/spec-first-agentic-development/knowledge/decisions/agents-md-single-contract.md) | Decision: One AGENTS.md, Many Thin Aliases (not one file per assistant) |
| decision | [human-approval-by-decision-risk](domains/spec-first-agentic-development/knowledge/decisions/human-approval-by-decision-risk.md) | Decision: Ask for Human Approval by Decision Risk |
| decision | [madr-adr-format](domains/spec-first-agentic-development/knowledge/decisions/madr-adr-format.md) | Decision: Use MADR-Style ADRs Under docs/architecture/decisions/ |
| decision | [pre-src-gate](domains/spec-first-agentic-development/knowledge/decisions/pre-src-gate.md) | Decision: No src/ Until the Pre-src/ Checklist Is Green |
| decision | [risk-based-quality-gates](domains/spec-first-agentic-development/knowledge/decisions/risk-based-quality-gates.md) | Decision: Apply Quality Gates by Change Risk, Not a Universal Tool Threshold |
| decision | [tool-neutral-agent-contract-with-adapters](domains/spec-first-agentic-development/knowledge/decisions/tool-neutral-agent-contract-with-adapters.md) | Decision: Keep One Tool-Neutral Agent Contract and Use Tool Adapters |
| domain | [agentic-development-evidence-review](domains/spec-first-agentic-development/knowledge/domain/agentic-development-evidence-review.md) | Agentic Development Evidence Review |
| domain | [sfad-methodology](domains/spec-first-agentic-development/knowledge/domain/sfad-methodology.md) | Domain: Spec-First Agentic Development (SFAD) |
| domain | [sfad-next-adoption-guide](domains/spec-first-agentic-development/knowledge/domain/sfad-next-adoption-guide.md) | SFAD Next Adoption Guide |

### Templates

Package-specific template assets: [domains/spec-first-agentic-development/templates](domains/spec-first-agentic-development/templates/) (68 files/directories), including [Base and Full adoption profiles](domains/spec-first-agentic-development/templates/adoption-profiles/README.md).

## Package: `workflow-automation/`

Entry point: [domains/workflow-automation/README.md](domains/workflow-automation/README.md)

### Skills

| Class | File | Purpose |
| --- | --- | --- |
| `general` | [node-graph-workflow-automation](domains/workflow-automation/skills/node-graph-workflow-automation.md) | Skill: Node-Graph Workflow Automation |

### Agents

No agent is provided: the package has one atomic skill, so an agent composition would not add a distinct reusable workflow.

### Knowledge

| Type | File | Topic |
| --- | --- | --- |
| pattern | [DURABLE_NODE_WORKFLOW_AUTOMATION](domains/workflow-automation/knowledge/patterns/DURABLE_NODE_WORKFLOW_AUTOMATION.md) | Pattern: Durable Node Workflow Automation |
| domain | [workflow-automation-platform](domains/workflow-automation/knowledge/domain/workflow-automation-platform.md) | Domain: Workflow Automation Platform |
