# External skill registry policy

The registry exists to reduce supply-chain risk, not to create an app store. CompeteOS ships with **no approved external skills**.

## Discovery is not installation

GitHub Trending, community lists, search results, and social recommendations may create candidate records only. Candidate files are inert JSON. They must never be copied to `.agents/skills/`, `.claude/skills/`, executed, imported, or granted credentials.

## Promotion requirements

An external skill may enter `approved.json` only after all of the following are documented:

1. Source owner and repository are identifiable.
2. The exact source is pinned to a full 40-character commit SHA.
3. License is identified with an SPDX expression and is compatible with the intended use.
4. Every instruction, script, reference, asset, dependency, hook, and network endpoint is reviewed.
5. Required filesystem, shell, network, secret, browser, and account permissions are minimized and recorded.
6. At least two independent security review records are attached. Automated scanners may contribute evidence but do not replace human review.
7. The skill is tested in a disposable environment with no production credentials.
8. Triggering, negative-trigger, incomplete-input, and adversarial tests pass.
9. A named human approver records the decision and date.

Approval is scoped to the pinned commit. A new release or commit returns to candidate status.

## Rejection conditions

Reject a skill that has an unclear license, concealed or unnecessary network access, obfuscated code, broad credential access, destructive defaults, unverifiable installation, unpinned executable downloads, weak maintenance ownership, or behavior that substantially duplicates a safer core capability.

## Incident response

When an approved skill is suspected of unsafe behavior:

1. Remove it from approved status immediately.
2. Record the pinned commit and reason in `rejected.json`.
3. Notify affected users without publishing live credentials or exploit details.
4. Revoke exposed credentials and preserve evidence.
5. Require a fresh review before any future approval.
