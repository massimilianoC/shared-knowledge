# Contributing to the Shared Knowledge Repository

Welcome. This repository is a curated library of reusable AI skills, agents, and reference knowledge. Both **humans** and **AI agents** can contribute, but the contract is the same: each contribution must be **stable, English, well-classified, and cross-linked**.

---

## TL;DR

1. Pick a **domain** (`llm/`, `sfad/`, or a new one you'll create).
2. Decide whether your content is a **pattern**, a **decision**, a **domain note**, or a **skill** (or several of these).
3. Use the **templates** in [`templates/`](templates/).
4. File names: `kebab-case.md` for skills/agents/decisions; `SCREAMING_SNAKE_CASE.md` for patterns.
5. Output language is **English**, always. Inbox notes can be in any language.
6. Update [`MAP.md`](MAP.md) — the navigable index — every time you add or move a file.
7. Open a PR with a description that lists what was created, updated, or moved.

---

## 1. Decide what you're contributing

| Artifact | Lives in | When to use |
| --- | --- | --- |
| **Skill** | `skills/<domain>/<class>/skill-name.md` | A reusable, atomic capability with clear inputs/outputs/steps. |
| **Agent** | `agents/<domain>/agent-name.md` | A composition of 2+ related skills with a recommended system prompt. |
| **Pattern** | `knowledge/<domain>/patterns/PATTERN_NAME.md` | A recurring technical/architectural pattern that justifies one or more skills. |
| **Decision** | `knowledge/<domain>/decisions/decision-name.md` | A specific choice with rationale, alternatives considered, and consequences. |
| **Domain note** | `knowledge/<domain>/domain/topic-name.md` | Big-picture context for a domain: origin, calibration knobs, glossary, links. |
| **Inbox raw note** | `inbox/file.md` | Anything not yet classified. Will be processed into the above by an agent or by you. |

A single PR can introduce multiple artifacts as long as they belong to the same logical unit (e.g. one pattern + the skills it justifies + a new agent).

---

## 2. Pick a domain

Look at the **Current domains** table in [README.md](README.md#current-domains). If your content fits an existing domain, use it.

### Creating a new domain

Only create a new domain folder if you have **at least one pattern + one skill** ready to populate it. A domain with a lonely README is noise — wait until you have substance.

Steps:

1. Create `skills/<new-domain>/`, `agents/<new-domain>/`, `knowledge/<new-domain>/{patterns,decisions,domain}/`.
2. Add a row to the "Current domains" table in [README.md](README.md).
3. Add an entry to "Index by domain" in [MAP.md](MAP.md).

---

## 3. Pick a competence class (for skills only)

Inside a domain, skills are grouped by **competence class** (`output/`, `platform/`, `bootstrap/`, `governance/`, `execution/`, `coordination/`, …). A class folder is created only when at least 2 sibling skills share the same scope.

If your skill doesn't yet have peers, place it in the **closest existing class**; the next contributor can either accept the grouping or split it into a new class.

---

## 4. Use the templates

- Skills: [`templates/skill-template.md`](templates/skill-template.md). Mandatory sections: Description, Expected inputs, Produced outputs, Steps/Procedure, Key patterns, **Common pitfalls to avoid**, Usage examples, Related skills, Source.
- Agents: [`templates/agent-template.md`](templates/agent-template.md). Mandatory sections: Role, Included skills, When to use, When NOT to use, **Recommended system prompt**, Required context, Known limitations, Source.

Knowledge files (patterns, decisions, domain notes) don't have a strict template, but follow the shape used by existing files in the same folder.

---

## 5. Language and writing style

- **Output language**: English. Code identifiers, file names, commit messages: English.
- **Inbox notes**: any language. The agent translates concepts during extraction.
- **Voice**: imperative for skills ("Do X.", "Never Y."), explanatory for knowledge ("This pattern solves …").
- **No marketing**: avoid superlatives ("clearly the best choice", "industry-leading"); state trade-offs honestly.
- **Code blocks**: always specify a language hint (` ```bash`, ` ```text`, ` ```markdown`, …) so renderers and lint tools handle them correctly.

---

## 6. Linking and cross-references

- Use **relative paths** for every internal link. Example: `[milestone-lifecycle](../execution/milestone-lifecycle.md)` from inside `skills/sfad/coordination/`.
- Every skill links to: related patterns, related decisions, related skills.
- Every agent links to: included skills, the patterns and decisions that justify it.
- Every pattern links to: derived skills, the decision that records the choice (if applicable).
- Every move/rename must update **every** link to the file. Run a link check before opening the PR (see §9).

---

## 7. Affinity check (before creating a new file)

Always inspect the current state of the domain before adding:

```bash
ls skills/<domain>/
ls agents/<domain>/
ls knowledge/<domain>/patterns/
ls knowledge/<domain>/decisions/
ls knowledge/<domain>/domain/
```

If a sibling file already covers ≥ 50% of your topic, **extend it** instead of duplicating. Cross-link instead of repeating content.

---

## 8. Update MAP.md

Every contribution updates the catalog. In `MAP.md`:

1. Add a row to "Index by domain" for the new file.
2. Update the dependency graph if the file introduces new links.
3. Adjust "Skills per class" tables if you created a new class.

---

## 9. Quality gate before opening a PR

- [ ] Every new/moved file has a `Stability:` line at the top (where applicable — see [`knowledge/sfad/patterns/STABILITY_LAYERS.md`](knowledge/sfad/patterns/STABILITY_LAYERS.md)).
- [ ] No leftover `${PLACEHOLDER}` tokens.
- [ ] All relative links resolve. Quick check:

  ```bash
  python -c "
  import os, re
  LINK = re.compile(r'\]\(([^)#]+)(?:#[^)]*)?\)')
  for dp, _, fs in os.walk('.'):
      if '.git' in dp or 'inbox' in dp: continue
      for fn in fs:
          if not fn.endswith('.md'): continue
          fp = os.path.join(dp, fn)
          with open(fp, encoding='utf-8') as f:
              for ln, line in enumerate(f, 1):
                  for m in LINK.finditer(line):
                      t = m.group(1)
                      if t.startswith(('http','#','mailto:')): continue
                      r = os.path.normpath(os.path.join(os.path.dirname(fp), t))
                      if not os.path.exists(r):
                          print(f'{fp}:{ln} broken -> {t}')
  "
  ```

- [ ] Output is in English; no untranslated Italian/other-language tokens outside `inbox/` (run a manual scan or `grep -E ' (la |gli |delle |questo |che ) ' --include='*.md' -r skills agents knowledge`).
- [ ] `MAP.md` updated.
- [ ] `README.md` and `AI_GUIDELINES.md` updated if you changed the taxonomy or naming convention.

---

## 10. Commit and PR conventions

- Commits follow **Conventional Commits**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
  - `feat(llm/output): add llm-token-streaming skill`
  - `docs: clarify domain creation in CONTRIBUTING`
  - `chore(map): refresh dependency graph after sfad/coordination split`
- PR title mirrors the lead commit.
- PR description lists: **Created**, **Updated**, **Moved/Renamed**, **Affinity links**, **Open questions**.
- A PR that moves files must include the link-check output (or at least state "ran the link check, all green").

---

## 11. Special: contributing as an AI agent

If you are an AI assistant processing this repository:

1. Read [CLAUDE.md](CLAUDE.md) and [AI_GUIDELINES.md](AI_GUIDELINES.md) **first** — they encode the operational rules.
2. The supported commands (`elabora inbox`, `process inbox`, etc.) are listed in [CLAUDE.md](CLAUDE.md). Either Italian or English form is accepted.
3. Never invent paths. If a folder doesn't exist yet, create it explicitly and announce it in the summary.
4. Always produce a processing summary (Created / Updated / Moved / Affinities).
5. Never delete an existing file without explicit user confirmation.

---

## 12. Code of conduct

Standard expectations: be respectful, be specific in critique, prefer concrete evidence over taste arguments. Disagreements about classification (which domain? which class?) are resolved via a short ADR-style note in `knowledge/<domain>/decisions/`.
