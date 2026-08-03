---
name: review-external-skill
description: Quarantine and evaluate a third-party agent skill or repository for source identity, pinned version, license, instructions, scripts, permissions, network access, secrets, destructive behavior, trigger quality, and reproducibility. Use when considering an external skill; never use GitHub Trending as approval evidence.
---

# Review an external skill

1. Create a candidate record only. Do not install, enable, execute, or copy the skill into an agent discovery directory.
2. Resolve the source to a full commit SHA and preserve the exact inspected tree.
3. Identify the license and owner. Reject unclear provenance or licensing.
4. Read every `SKILL.md`, script, hook, dependency file, settings file, asset, and referenced instruction.
5. Record filesystem, shell, network, browser, secret, account, and destructive permissions.
6. Search for prompt injection, hidden instructions, data exfiltration, unpinned downloads, obfuscation, broad deletion, credential access, and unsafe automatic updates.
7. Run automated scanners only in a disposable environment with no production credentials. Treat scanner results as evidence, not approval.
8. Test direct triggers, indirect triggers, negative triggers, incomplete inputs, and adversarial inputs.
9. Require two independent security review records and explicit human approval before adding a pinned entry to `approved.json`.
10. Return every updated commit or release to candidate status.

Read [references/review-record.md](references/review-record.md) and `registry/POLICY.md` before approval.
