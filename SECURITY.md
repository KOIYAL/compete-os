# Security policy

## Supported versions

Until `1.0.0`, only the latest release and the `main` branch receive security fixes.

## Report a vulnerability

Do not open a public issue for a suspected vulnerability or exposed secret.

Use GitHub's private vulnerability reporting flow on the repository's **Security** tab. Include:

- affected version or commit;
- a minimal reproduction;
- expected impact;
- whether credentials or personal data may be involved;
- any proposed mitigation.

Maintainers will acknowledge a complete report within five business days when possible. Timelines for validation, remediation, and disclosure depend on severity and reproducibility.

If private vulnerability reporting is unavailable, contact the KOIYAL organization owner through GitHub without including exploit details, and request a private reporting channel.

## Security model

CompeteOS is local-first and has no built-in telemetry or network client. It treats briefs, evidence, and generated submissions as potentially sensitive local files.

The following are security invariants:

- Candidate third-party skills are never executable.
- Approved skills must be commit-pinned and reviewed under `registry/POLICY.md`.
- `compete new` does not overwrite a non-empty directory.
- The CLI does not evaluate brief contents as code.
- Shell commands are invoked with argument arrays, not interpolated command strings.
- Secret scanning runs during local verification and CI.

## Secrets

Do not commit `.env` files, API keys, access tokens, private keys, event credentials, or confidential briefs. Store sensitive source material outside the repository or in `.compete/private/`, which is ignored by Git.

If a secret is committed, revoke it first. Removing it from the latest commit is not sufficient because Git history and forks may retain it.
