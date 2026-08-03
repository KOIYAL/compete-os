---
name: intake-brief
description: Structure a hackathon, competition, grant, RFP, or pitch brief into confirmed rules, deadlines, deliverables, judging criteria, prohibitions, assumptions, and unresolved questions. Use when starting or updating an entry from organizer-provided text, Markdown, or JSON.
---

# Intake a brief

1. Read the organizer's source before proposing an idea or plan.
2. Preserve exact source meaning. Separate confirmed facts, assumptions, and unknowns.
3. Run `pnpm compete -- ingest <brief> --project <entry>` when using the CompeteOS harness.
4. Review `.compete/brief.json` against the source. Correct false classifications manually; the extractor is heuristic.
5. Treat conflicting statements and missing eligibility, IP, reuse, AI-tool, privacy, deadline, or submission rules as unresolved.
6. Use the restrictive interpretation temporarily when an unresolved rule can cause disqualification.
7. Never upload a confidential brief or personal data to an external service without explicit authorization.

Read [references/intake-checklist.md](references/intake-checklist.md) when checking completeness.
