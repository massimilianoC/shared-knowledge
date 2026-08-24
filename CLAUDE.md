# CLAUDE.md - Instructions for Claude Code

Read [AI_GUIDELINES.md](AI_GUIDELINES.md) first. This file records command aliases and repository-specific workflow.

## Package model

The reusable unit is `domains/<domain>/`, containing its own skills, agents, knowledge, and optional templates. Read `domains/<domain>/README.md` before working in a package.

## Supported commands

| Italian | English | Action |
| --- | --- | --- |
| `elabora inbox` | `process inbox` | Ingest every unprocessed inbox item. |
| `elabora <file>` | `process <file>` | Ingest one inbox item. |
| `crea skill da <file>` | `create skill from <file>` | Extract skills from one source. |
| `aggiorna agenti` | `update agents` | Reassess agent composition in a package. |
| `trova affinita` | `find affinities` | Find overlap within or across packages. |
| `riepilogo repository` | `repository summary` | Report package inventory and status. |

## Expected behavior

1. Read the source and the target package context.
2. Preserve the package-first layout: `domains/<domain>/{skills,agents,knowledge,templates}`.
3. Use [templates/skill-template.md](templates/skill-template.md) and [templates/agent-template.md](templates/agent-template.md) for new generic artifacts.
4. Update package README, [MAP.md](MAP.md), and links in the same change.
5. Write a concise English processing report and archive processed source.

## Constraints

- Do not create duplicate knowledge.
- Do not create an agent with fewer than two included skills.
- Do not split a domain package across root-level type folders.
- Ask before reorganizing multiple existing files unless the user explicitly authorized the migration.
