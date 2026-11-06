# Versioning Policy

This repository uses **calendar versioning with a semantic release suffix**. It is designed for a knowledge library: the date tells readers when a published snapshot was made, while the suffix explains the meaningful kind and scope of the change.

Current release: [`2026.11.06.2-docs.library`](VERSION).

## Release identifier

```text
YYYY.MM.DD.N-<kind>.<scope>
```

- `YYYY.MM.DD` is the publication date in the Europe/Rome time zone.
- `N` starts at `1` and increments for every published release on that date.
- `kind` classifies the highest-impact change in the release.
- `scope` identifies the affected package, or `library` / `multi` when it spans the repository.

Examples:

- `2026.08.25.1-init.public-library` — first public snapshot.
- `2026.08.25.2-docs.library` — navigation or editorial update only.
- `2026.08.26.1-feat.rag-system` — new reusable RAG capability.
- `2026.08.26.2-fix.capture` — corrected guidance in the capture package.
- `2026.08.27.1-breaking.multi` — package paths or import assumptions changed and consumers must adapt.

## Semantic suffixes

| Kind | Meaning for consumers |
| --- | --- |
| `init` | First baseline for a newly published library. |
| `feat` | New reusable capability or materially expanded guidance. |
| `fix` | Corrected guidance, link, template, or defect without changing the intended import boundary. |
| `docs` | Editorial, catalog, or navigation change only. |
| `refactor` | Reorganized content with no intended change to the imported capability. |
| `breaking` | A package, artifact path, required dependency, or instruction changed in a way that requires consumers to adapt. |
| `security` | Security-relevant correction or strengthened mandatory guidance. |

Use lowercase kebab-case for a package scope, such as `llm-provider` or `capture`. Use `multi` when more than one package has the same highest-impact change. Do not combine kinds in a release identifier; record the additional details in the changelog.

The suffix is semantic classification, not a claim of runtime API compatibility. For this knowledge repository, compatibility means whether a consumer can continue copying or applying an artifact without changing its import path, linked dependencies, or required practices.

## Release procedure

1. Classify the change using the table above and choose the narrowest scope.
2. Allocate the next `N` for the local release date.
3. Replace the single value in [`VERSION`](VERSION).
4. Add a dated entry at the top of [`CHANGELOG.md`](CHANGELOG.md), including `Added`, `Changed`, `Fixed`, `Security`, or `Breaking` sections as applicable.
5. Validate links, package catalogs, and the affected package README.
6. Commit the release and create an annotated Git tag named `v<release identifier>` after the release commit is on `main`.

Every public release must update both `VERSION` and `CHANGELOG.md`. Unreleased pull-request commits do not receive an independent release identifier.
