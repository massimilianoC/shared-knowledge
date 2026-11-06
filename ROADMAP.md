# Roadmap

This library grows by extracting practices that were proven in real work, rewriting them to be project-neutral, and packaging them as self-contained domains. This page lists what is planned. Nothing here is released until it appears in [`MAP.md`](MAP.md) and the [changelog](CHANGELOG.md).

## Planned packages

| Planned package | Scope | Status |
| --- | --- | --- |
| `agentic-cad-3d-printing` | Agent-driven parametric CAD for 3D printers: turning requirements into parametric models, printability and tolerance checks, slicing profiles, printer handoff, and iteration from print feedback. | Planned, next |
| `audio-transcription` | Speech-to-text pipelines: ingestion and chunking, model and provider choice, diarization, post-processing and correction, evaluation of transcript quality, and long-running job handling. | Planned, next |

## Improvements to existing packages

- Add more runnable, offline-tested examples to `validation/` as packages grow.
- Extend `capture`, `workflow-automation`, and `rag-system` with additional skills where real usage reveals gaps.

## How a package is added

1. The practice is exercised in a real project and the source material is reviewed.
2. A package is created under `domains/<domain>/` with its README, skills, agents (two or more skills each), knowledge, and optional templates.
3. Package README, [`MAP.md`](MAP.md), and the root README are updated in the same change.
4. `npm test` passes, a release entry is added to the changelog, and `VERSION` is updated.

## Propose a package

Open a [skill or package proposal](https://github.com/massimilianoC/shared-knowledge/issues/new?template=skill-proposal.yml). Include the problem, why it is reusable, and the evidence it works.
