# Templates

> Copy-ready Markdown templates for a new SFAD project.

## Structure

```
templates/
├── core/                       # stack-agnostic baseline
│   ├── AGENTS.md.template
│   ├── CLAUDE.md.template
│   ├── GEMINI.md.template
│   ├── COPILOT.md.template
│   ├── README.md.template
│   └── docs/
│       ├── INDEX.md.template
│       ├── vision/
│       ├── architecture/
│       ├── requirements/
│       ├── analysis/
│       └── planning/
└── flavors/
    └── frontend-react/         # opinionated overlay for React+TS admin/console
        └── docs/
            └── architecture/, ui-ux/
```

## How to use

1. Copy `core/` into a new repo. Rename `.template` → `.md` (or keep the suffix during interactive replace and rename at the end).
2. Walk every `${PLACEHOLDER}` in order: start with `AGENTS.md`, then top-down through the doc tree.
3. (Optional) Overlay a flavor by copying its contents on top of `core/`. Flavors *replace* core files where they exist with the same path.
4. Run the [Pre-`src/` Checklist](../../skills/bootstrap/pre-src-checklist-runner.md).

## Placeholders convention

- `${PROJECT_NAME}` — the project's canonical name (e.g., "Operations Dashboard").
- `${REPO_SLUG}` — the repository slug (e.g., `operations-dashboard`).
- `${PROJECT_KIND}` — one phrase: "admin frontend", "API service", "mobile app", ...
- `${SSOT_NAME}` — the Single Source of Truth name (e.g., "service API" or "in-repo").
- `${PROJECT_LANGUAGE}` — documentation language for the project (e.g., "Italian", "English"). Code identifiers stay English by convention.
- `${PRIMARY_AUDIENCE}` — primary users (roles, personas, or team names).
- `${NON_AUDIENCE}` — explicit non-audience.
- `${PROJECT_MISSION}` — one-sentence mission.
- `${PROJECT_VISION}` — one-paragraph vision.

A placeholder appearing more than once must be replaced consistently.

## Tip: bootstrap with a script

A simple `sed -i "s/\${PROJECT_NAME}/My Project/g" $(find docs -name '*.template')` covers most placeholders. The Claude Code skill at [`../../skills/bootstrap/spec-first-bootstrap.md`](../../skills/bootstrap/spec-first-bootstrap.md) automates this conversationally.
