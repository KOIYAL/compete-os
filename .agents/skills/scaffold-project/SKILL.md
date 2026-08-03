---
name: scaffold-project
description: Create a separate, rule-compliant repository for a hackathon, competition, grant, RFP, or pitch entry and select the smallest suitable default technology stack. Use when beginning implementation or when the harness and submission work must remain isolated.
---

# Scaffold an entry repository

1. Determine the compliance mode from organizer rules. Choose `strict` whenever reuse permission is unknown.
2. Create a new, empty target with `pnpm compete -- new <directory>`. Never point the command at an existing non-empty project.
3. Keep the CompeteOS harness and entry repository separate.
4. Use the user's established stack when it fits. Otherwise select `stacks/default-web.json`.
5. Remove every unused component. Do not add React, a database, storage, realtime, authentication, billing, or an admin UI without a demonstrated requirement.
6. Switch stacks only for a core constraint: Python for heavy data/ML, Expo for native device features, or a simpler HTML/Hono path for forms and reports.
7. Pin dependencies and record licenses after the application stack is instantiated.
8. Report the selected stack, reasons, omissions, and remaining risks.

Read [references/selection-rules.md](references/selection-rules.md) before deviating from the default.
