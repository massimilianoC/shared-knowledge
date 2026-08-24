# AI Agent Guidelines - Shared Knowledge Repository

This is the binding guide for people and AI agents that maintain this repository.

## Purpose

The repository turns validated project experience into reusable, copyable domain packages. A package contains its skills, agents, knowledge, and any domain-specific templates together.

## Language

All created or updated structured content is written in English. Inbox material may be in any language; extract and normalize its concepts into English.

## Canonical layout

```text
inbox/                         raw source material
  processed/                   archived source material after ingestion

domains/
  <domain>/
    README.md                  package entry point and adoption instructions
    skills/<class>/            atomic reusable capabilities
    agents/                    compositions of related skills
    knowledge/
      patterns/                reusable technical or architectural patterns
      decisions/               ADR-style choices and rationale
      domain/                  domain context and adoption guidance
    templates/                 optional domain-specific starter assets

templates/                     repository-wide skill and agent templates
```

Current packages are `sfad/`, `llm/`, `rag/`, and `capture/`. Read `domains/<domain>/README.md` before using or changing a package.

## Ingestion workflow

1. Read the inbox source completely.
2. Identify the target domain. Reuse an existing domain unless the content cannot fit it.
3. Check related package files for overlap before creating anything.
4. Create patterns, decisions, and domain notes under `domains/<domain>/knowledge/`.
5. Create atomic skills under `domains/<domain>/skills/<class>/`. A class groups at least two clearly related skills; otherwise keep the skill directly under `skills/`.
6. Create or update an agent under `domains/<domain>/agents/` only when at least two skills form a coherent workflow.
7. Add or update templates when the domain needs reusable starter assets.
8. Update `domains/<domain>/README.md` and `MAP.md`.
9. Move the raw source to `inbox/processed/`.
10. Validate links, naming, English language, and package copyability.

## Quality rules

### Skills

Every skill must contain: Description, Expected inputs, Produced outputs, Steps / Procedure, Common pitfalls to avoid, Related skills, and Source. It must be reusable beyond one project.

### Agents

Every agent must contain: Role, Included skills, When to use, When NOT to use, Recommended system prompt, Required context, Known limitations, and Source. Include at least two linked skills.

### Knowledge

Patterns explain repeatable mechanisms. Decisions state the choice, context, options, consequences, and application. Domain notes provide scope, terminology, and adoption context. Cross-link rather than duplicate.

## Package rules

- Internal links must be relative and resolve after copying the whole `domains/<domain>/` folder.
- A domain package is the unit of reuse. Do not distribute only an agent without its linked skills and knowledge.
- Domain-specific templates live inside the package. Generic authoring templates remain in root `templates/`.
- Add a new domain only when it has at least one reusable skill and one supporting knowledge artifact.
- Use kebab-case for skills, agents, decisions, and domain notes; use SCREAMING_SNAKE_CASE for patterns.

## Operating constraints

- Consolidate instead of duplicating.
- Do not modify or delete existing artifacts without explicit user authorization.
- Ask before a large reorganization; once approved, preserve link integrity and update all navigation documents.
- Keep `MAP.md` and the relevant package README accurate after every change.

## Processing report

```text
## Processing: <source>

Package: domains/<domain>/
Classification: pattern | decision | domain | skill | mixed

### Created
- <path> - <description>

### Updated
- <path> - <change>

### Affinities found
- <new artifact> <-> <existing artifact> - <reason>

### Archived source
- inbox/<source> -> inbox/processed/<source>
```
