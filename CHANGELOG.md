# Changelog

All notable public releases are recorded here. Release identifiers follow the [versioning policy](VERSIONING.md).

## 2026.11.06.2-docs.library — 2026-11-06

### Added

- Public community files: `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `CITATION.cff`, issue forms, and a pull request template.
- `ROADMAP.md` with the planned `agentic-cad-3d-printing` and `audio-transcription` packages.

### Changed

- Rewrote the root README with package contents, artifact model, agent and human quick starts, reuse examples, and quality guarantees.

## 2026.11.06.1-refactor.library — 2026-11-06

### Changed

- Consolidated the former `agentic-knowledge-library` repository into this one; this is now the single public, curated repository.
- `web-renderer` package is now `capture`; RAG guidance is storage-neutral (`rag-double-sandbox-bootstrap`, `storage-native-multitenancy-over-payload-filtering`).
- Added typed-classifier guidance, a classification benchmark kit, and further RAG patterns to `llm-provider` and `rag-system`.

### Security

- Public git history rewritten to remove raw ingestion material (`inbox/`).

## 2026.08.25.1-init.public-library — 2026-08-25

### Added

- First public release of the Agentic Knowledge Library.
- Self-contained packages for spec-first agentic development, LLM providers, RAG systems, web rendering, and workflow automation.
- Reusable skills, agents, patterns, decisions, and starter templates, with public maintenance rules and navigation.

### Changed

- Public package names use explicit, copyable directory names: `llm-provider`, `rag-system`, `spec-first-agentic-development`, `web-renderer`, and `workflow-automation`.

### Security

- Raw source material, private repository instructions, credentials, and ingestion resources are excluded from the public release.
