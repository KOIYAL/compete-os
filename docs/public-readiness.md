# Public release gates

A release is ready only when all gates pass:

- Required community, license, security, changelog, and disclaimer files exist.
- The repository owner is `KOIYAL` in package metadata and documentation.
- The package has no runtime dependency.
- The lockfile is current and frozen installation succeeds offline.
- Canonical skills validate and match both generated agent directories.
- Registry policy and data validate; no candidate is executable.
- Unit, integration, CLI, secret, and public-readiness checks pass.
- GitHub Actions are pinned to immutable commits and use least-privilege permissions.
- A fresh sample project can be created, ingested, produced, and draft-validated.
- Git history and the final tree contain no secrets or confidential source material.
