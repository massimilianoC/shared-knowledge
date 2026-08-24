# SFAD Next Adoption Guide

## Purpose

SFAD Next integrates structured specifications, agent context architecture, durable handoffs, risk-based verification, and focused human decision gates into the existing Spec-First Agentic Development method. It is a reusable project method, not a requirement to install a particular AI IDE or framework.

## Is copying the template enough?

No. Copying files is appropriate only for a new repository after tailoring project identity, boundaries, owners, commands, and risk controls. The template supplies structure; it cannot supply product decisions, architecture, security policy, or proof that a command actually protects the project.

| Project state | Adoption path |
| --- | --- |
| New long-lived project | Copy the template, complete placeholders, write the first feature spec, and pass the Pre-`src/` gate before implementation. |
| Existing project | Retrofit: map current architecture and SSoTs, identify contradictions, add the contract and canonical docs incrementally, then adopt the new workflow slice by slice. Do not overwrite established files. |
| Prototype | Use the reduced shape: `AGENTS.md`, one roadmap, one feature spec, and baseline checks. Declare the intentional postponement of full SFAD. |

## Minimal integration order

1. Agree on project identity, audience, non-goals, sources of truth, and decision owners.
2. Create or audit `AGENTS.md`; make it the tool-neutral contract.
3. Add a constitution and the canonical documentation index.
4. Define the first feature using requirement-to-acceptance traceability.
5. Classify its risk and configure only the relevant deterministic gates.
6. Run one vertical slice end-to-end, including a user-facing demonstration and documentation updates.
7. Add thin tool adapters only for the coding agents the team actually uses.

## Tooling position

GitHub Spec Kit, Kiro specifications, Claude Code rules/hooks, and Codex `AGENTS.md` conventions can accelerate this workflow. Treat them as adapters. The project contract and canonical documents stay portable if an IDE, model, or CLI changes.

## Documentation language

All reusable repository assets and public reports are English, which makes the method accessible to external contributors and suitable for publication. A target project may choose another operating/documentation language when it records that decision in `AGENTS.md`; code, identifiers, paths, test names, and commit messages remain English for interoperability.

## Human participation model

The agent asks for a decision only when it changes intended outcome, material risk, or an irreversible commitment. It should not ask for permission to perform every routine action inside an approved slice. Human review focuses on acceptance examples, evidence, risk classification, and material decisions.

## Public-release checklist

- Remove project-specific names, credentials, customer examples, and internal links.
- Verify external references and label inference versus primary evidence.
- State tool versions or retrieval date for time-sensitive claims.
- Make every template placeholder and adoption decision comprehensible without private context.
- Run a Markdown/link check before publishing.

## Related assets

- [Agentic Development Evidence Review](agentic-development-evidence-review.md)
- [CONTRACT_TO_ACCEPTANCE_TRACEABILITY](../patterns/CONTRACT_TO_ACCEPTANCE_TRACEABILITY.md)
- [THREE_LAYER_AGENT_CONTEXT](../patterns/THREE_LAYER_AGENT_CONTEXT.md)
- [RISK_BASED_VERIFICATION_GAUNTLET](../patterns/RISK_BASED_VERIFICATION_GAUNTLET.md)
- [Template pack](../../templates/agentic-project/README.md)

## Source
Synthesized from `inbox/Best Practice Programmazione Con LLM.md`, `inbox/Guidelines.md`, and current primary documentation.
Date: 2026-08-24
