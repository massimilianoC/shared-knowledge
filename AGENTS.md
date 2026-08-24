# AGENTS.md - Shared Knowledge Repository

This file is the operational pointer for generic AI agents. [AI_GUIDELINES.md](AI_GUIDELINES.md) is the binding policy.

## Role

Act as a knowledge-package maintainer. Transform raw material in `inbox/` into reusable, English-language domain packages under `domains/`.

## Reading order

1. [AI_GUIDELINES.md](AI_GUIDELINES.md)
2. [CLAUDE.md](CLAUDE.md)
3. [MAP.md](MAP.md)
4. The target [domain package README](domains/README.md)
5. The relevant `domains/<domain>/knowledge/domain/` note.

## Destination rules

| Artifact | Destination |
| --- | --- |
| Skill | `domains/<domain>/skills/<class>/name.md` |
| Agent | `domains/<domain>/agents/name.md` |
| Pattern | `domains/<domain>/knowledge/patterns/NAME.md` |
| Decision | `domains/<domain>/knowledge/decisions/name.md` |
| Domain note | `domains/<domain>/knowledge/domain/name.md` |
| Domain template | `domains/<domain>/templates/...` |

## Mandatory checks

- Use English for produced documentation.
- Check affinity and consolidate before adding files.
- Preserve relative links when moving or copying a package.
- Update the package README and [MAP.md](MAP.md).
- Archive processed input under `inbox/processed/`.

## Full reference

[AI_GUIDELINES.md](AI_GUIDELINES.md) and [CONTRIBUTING.md](CONTRIBUTING.md).
