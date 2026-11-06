# Agent Instructions: Example Validation

This directory owns repository validation. Domain guidance and copyable examples remain under `domains/`; do not put test fixtures, mocks, or test-only helpers inside a domain package. Read the root `AI_GUIDELINES.md` and the target package README before changing an example.

## Contract for agents

1. Classify each new or changed example as **runnable** or **documentary**. Runnable scripts, datasets, and task definitions belong in the relevant package's `templates/` directory and must be registered in `validation/examples.json`. Documentary templates are discovered automatically. Code fragments in prose are illustrative unless extracted into a registered runnable asset.
2. Write a failing behavior test before changing a runnable example (red), implement the example (green), then refactor while the whole suite remains green. Use `describe`/`it` and names in Given/When/Then form so the scenario and expected behavior are clear.
3. Test success and meaningful failure paths. For provider examples, use a local mock server for deterministic tests. Assert the request and response contract, no labeled-answer leakage, exit status, and independently recomputed output from saved artifacts. Never require a live credential or paid API for the repository gate.
4. For documentary templates, test inventory completeness, nonempty UTF-8 content, portable links, and absence of source-project identifiers. Do not claim a Markdown skeleton has runtime behavior.
5. Keep provider installation instructions scoped to the provider specialization. Keep cross-provider patterns and adoption criteria independent of a specific product, customer, or source project.
6. Run `npm test` (or `node --test`) before handing off any change to a package example. A failed gate is work to resolve or report; do not silently exclude a file. A live provider smoke test may be added separately and must be marked as optional and credential-dependent.

## Definition of done

- Every runnable file in package templates is registered and covered by a behavior test.
- Every documentary template is discovered by the structural gate.
- All package-local Markdown links resolve after copying the package alone.
- The validation suite is green on a clean installation with Node 20 or later and no network access.
- The package README and `MAP.md` describe any new example or capability.
