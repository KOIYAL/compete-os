---
name: build-deliverables
description: Generate and keep aligned the slide deck, printable HTML deck, live-demo runbook, fallback plan, timed pitch, and submission checklist for a competition or application. Use after a brief is ingested and whenever implementation evidence changes.
---

# Build judging-facing deliverables

1. Ingest the current official brief before generating materials.
2. Run `pnpm compete -- produce --project <entry>` to create the baseline artifacts.
3. Replace generic statements only with verified facts and implemented behavior.
4. Update the deck in parallel with development: problem and story first, screenshots after the first working flow, technical proof after integration, and final wording after feature freeze.
5. Make the live demo show one input, one core transformation, and one changed outcome.
6. Prepare a local recording or screenshot fallback before optional feature work.
7. Keep the timed pitch synchronized with the deck and demo. Allocate speaking time in proportion to confirmed judging weights.
8. Never describe a mock, cached response, planned integration, or generated placeholder as a completed feature.

Read [references/deliverable-gates.md](references/deliverable-gates.md) before declaring the package complete.
