# Agentic Development Evidence Review

## Executive summary

AI coding agents increase implementation throughput, but reliable delivery still depends on clear intent, focused context, mechanical evidence, and accountable human decisions. This repository adopts a portable Spec-First Agentic Development approach: requirements and acceptance evidence guide agents; CI and hooks enforce deterministic controls; humans own product and material-risk choices.

## What the inbox evidence supports

- **Spec-first workflows are useful operational structure.** GitHub Spec Kit formalizes an intent-driven flow from specification to plan, tasks, and implementation, while allowing integrations and workflow customization.
- **Context design matters.** Current Claude Code guidance recommends a useful `CLAUDE.md`, explicit ways for an agent to verify work, targeted context management, and hooks for deterministic actions.
- **Verification must be stronger than “the agent said it works.”** Security evaluation of LLM-produced samples demonstrates that unspecific code generation can introduce material vulnerabilities.
- **Human oversight should shift upward.** Review user-visible behaviour, acceptance evidence, risk, and irreversible choices rather than relying only on line-by-line inspection of generated code.

## Claims calibrated during ingestion

The raw notes include useful ideas but combine primary sources with secondary commentary and fixed prescriptions. SFAD Next therefore adopts the underlying practices with the following calibration:

| Raw claim | Adopted position |
| --- | --- |
| No manual code review for AI code | Reject this as universal policy. Select review depth by risk; require independent human review for high and critical changes. |
| Mutation testing and a fixed score for all work | Use it for meaningful logic/invariants and set thresholds per project/component. |
| Root instruction files have a fixed maximum size | Keep them concise and focused, but measure usefulness and conflicts rather than treating one number as a universal limit. |
| A temporary `dev/` note solves context loss | Use a handoff record, but keep decisions and delivery truth in versioned canonical documents. |
| A single tool/framework is required | Keep the method tool-neutral; use Spec Kit, Kiro, Claude Code, Codex, or other tools as adapters. |

## Evidence and references

- GitHub describes Spec Kit as an extensible, intent-driven harness with a default spec → plan → tasks → implement workflow: <https://github.github.com/spec-kit/>.
- Anthropic’s official guidance emphasizes verification, exploration before coding, effective project instructions, context management, and hooks: <https://code.claude.com/docs/en/best-practices> and <https://code.claude.com/docs/en/hooks-guide>.
- OpenAI recommends maintaining `AGENTS.md` as persistent repository context for Codex: <https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf>.
- METR’s 2025 randomized study found a 19% slowdown in one specific setting—experienced maintainers working in familiar mature repositories with early-2025 tools. It is a caution against overgeneralization, not a universal productivity estimate: <https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/>.
- Veracode reported security failures in 45% of its 2025 LLM-generated code samples under its evaluation setup; use this as a case for security constraints and verification, not as a defect rate for every real codebase: <https://www.veracode.com/blog/genai-code-security-report/>.

## Public-use recommendation

Publish this repository’s SFAD assets in English, retain raw source notes in their original language for provenance, and label synthesized recommendations as repository methodology rather than universal industry rules. Keep a retrieval date with any claim about agent-tool capabilities or performance.

## Related assets

- [SFAD Next Adoption Guide](sfad-next-adoption-guide.md)
- [Spec-First Agentic Development](../patterns/SPEC_FIRST_AGENTIC_DEVELOPMENT.md)
- [Risk-Based Verification Gauntlet](../patterns/RISK_BASED_VERIFICATION_GAUNTLET.md)

## Source
Primary documentation and research links above; synthesized with `inbox/Best Practice Programmazione Con LLM.md` and `inbox/Guidelines.md`.
Retrieved: 2026-08-24
