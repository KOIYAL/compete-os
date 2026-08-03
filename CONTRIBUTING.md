# Contributing

Thank you for improving CompeteOS.

## Before you start

- Use a focused issue or proposal for behavior changes.
- Do not submit confidential briefs, real secrets, or unlicensed event materials as fixtures.
- Discuss new runtime dependencies and network behavior before implementation.
- External skill candidates must follow `registry/POLICY.md`; a pull request may not install or enable a candidate.

## Local setup

```bash
git clone https://github.com/KOIYAL/compete-os.git
cd compete-os
./scripts/setup.sh
```

The setup script verifies the Node version, installs from the frozen lockfile, synchronizes skills, and runs the test suite.

## Pull requests

1. Create a branch from `main`.
2. Make the smallest coherent change.
3. Add or update tests and user-facing documentation.
4. Run `pnpm verify` and `pnpm public:check`.
5. Explain security, compliance, compatibility, and migration impact in the pull request.

Generated copies under `.agents/skills/` and `.claude/skills/` must be committed and must exactly match `skills/core/`.

## Commit style

Use an imperative summary, for example: `Add deadline validation`. Keep unrelated changes in separate commits.

## License

By contributing, you agree that your contribution is licensed under Apache License 2.0.
