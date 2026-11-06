# Repository Example Validation

This is repository maintenance infrastructure, separate from the copyable knowledge packages in `domains/`. It validates examples supplied by those packages without adding test-only dependencies to them.

## Run

```sh
npm test
```

Node 20 or later is required. There are no package dependencies, credentials, or external network calls. The suite uses Node's built-in test runner and a local HTTP server.

GitHub Actions runs the same suite on Linux and Windows with Node 20 and 24 for every push and pull request. The workflow is a repository gate; it is not copied with a domain package.

## Coverage contract

- `examples.json` registers every runnable file and dataset under a package `templates/` directory. The inventory test fails when a runnable asset is unregistered or the registration points to a missing file.
- The benchmark behavior tests execute the supplied harness and task against a local provider simulation. They check normal output, hard-error reporting, retry behavior, credential failure, and raw evidence. They do not claim the example model's accuracy or verify a live provider.
- Documentary templates in `domains/**/templates/` and root `templates/` are discovered automatically. The structural gate checks nonempty UTF-8 text, balanced Markdown fences, package-local links, and forbidden source-project names. It materializes the SFAD Base, agentic-project, Full core, and React flavor compositions in memory, substitutes placeholders, and verifies their internal links. A placeholder document is validated as a template, not as a deployed application.
- Inline snippets inside explanatory Markdown are illustrative fragments unless the package provides a linked runnable file. To promise executable behavior for a snippet, extract it into a package template, register it, and add a behavior test.

## Adding an example

1. Put the reusable example inside the relevant `domains/<domain>/templates/` directory, with generic names and data.
2. For runnable assets, add all entrypoints and fixtures to `examples.json`, then add a Given/When/Then test in `validation/tests/`.
3. Run the new test before implementation to confirm it fails for the intended reason; implement and run `npm test` again.
4. Update the package README and `MAP.md`. Keep a live-provider check optional and clearly separate from the offline suite.

See [agent instructions](AGENTS.md) for the review contract.
