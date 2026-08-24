# GitHub Copilot Instructions

Read [../AI_GUIDELINES.md](../AI_GUIDELINES.md) before suggesting repository changes.

## Repository model

This is a Markdown knowledge base organized as copyable domain packages:

```text
domains/<domain>/{skills,agents,knowledge,templates}
```

## Required behavior

- Write generated documentation in English.
- Put new artifacts inside the appropriate `domains/<domain>/` package.
- Use [../templates/skill-template.md](../templates/skill-template.md) and [../templates/agent-template.md](../templates/agent-template.md) for generic files.
- Preserve relative links so copying the complete package keeps it functional.
- Check existing package artifacts before creating new ones.
- Update the package README and [../MAP.md](../MAP.md).
- Do not add application source code or create agents with fewer than two included skills.
