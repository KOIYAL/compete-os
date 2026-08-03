---
name: validate-entry
description: Audit a competition or application entry for organizer-rule compliance, secret exposure, missing evidence, inconsistent claims, broken artifacts, incomplete URLs, licensing, and submission readiness. Use before feature freeze, rehearsal, publication, or final submission.
---

# Validate an entry

1. Run `pnpm compete -- validate --project <entry> --allow-draft` during development.
2. Run without `--allow-draft` before submission and treat every error as blocking.
3. Compare the current organizer source with the structured brief; do not trust heuristic extraction alone.
4. Inspect Git status, history, environment files, demo fixtures, screenshots, and deck content for secrets or personal data.
5. Verify every claimed feature against the running artifact or preserved evidence.
6. Verify license and attribution obligations for code, models, data, media, fonts, and external services.
7. Open application, repository, deck, demo fallback, and submission URLs from a fresh session.
8. Require the user to make the final submission or explicitly authorize an automated submission action.
9. Preserve a receipt, submitted commit, artifact hashes, and final URLs.

Use [references/release-checklist.md](references/release-checklist.md) for the final pass.
