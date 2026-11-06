# Security Policy

This repository is a library of Markdown guidance, templates, and small offline example harnesses. It does not run a service, but it can still contain security-relevant mistakes: guidance that weakens isolation or authentication, an unsafe code example, or an accidentally published secret or private document.

## Reporting

Please report privately instead of opening a public issue:

1. Use the GitHub form [Report a vulnerability](https://github.com/massimilianoC/shared-knowledge/security/advisories/new) (Security tab, "Report a vulnerability").
2. Describe the artifact (file path), what is wrong, and the realistic impact if someone follows the guidance.
3. Do not include live credentials in the report. If you found one, state where it is, and rotate it if it is yours.

You can expect an acknowledgement within a few days. Confirmed problems are corrected in `main` and recorded in the [changelog](CHANGELOG.md) under **Security**, using the `security` release kind described in [`VERSIONING.md`](VERSIONING.md).

## In scope

- Guidance or templates that would lead a consumer to an insecure design (for example weakened tenant isolation, missing authorization, SSRF-prone fetching, unsafe deserialization).
- Example code in `domains/` or `validation/` with an exploitable flaw.
- Secrets, personal data, client data, or private/proprietary material committed to the repository or its history.
- Vulnerable or malicious dependencies, or an insecure GitHub Actions workflow in `.github/`.

## Out of scope

- General disagreements about architecture choices that are not security defects.
- Vulnerabilities in third-party products that the guidance merely mentions.

## For contributors

Never commit credentials, tokens, customer data, or raw private source material. Keep examples project-neutral and runnable offline. See [`CONTRIBUTING.md`](CONTRIBUTING.md).
