# CompeteOS

CompeteOS is a local-first production harness by **KOIYAL** for hackathons, competitions, grants, RFPs, and pitch events. It turns a brief into a clean project workspace, a deadline-first plan, a slide deck, a demo plan, a pitch script, and a submission checklist.

The project is designed for people who should be spending time on the problem and the final judgment calls—not on choosing an agent setup, a framework, or a presentation structure.

> Status: public preview (`0.1.0`). The CLI is usable today, but automated PDF/image intake, PPTX export, and demo video capture are not included yet. See [Current limits](#current-limits).

## Safety defaults

- Local-only: the CLI makes no network requests and sends no brief or project data to an AI service.
- Separate output: every entry is created outside the CompeteOS repository.
- Strict by default: unknown event rules are treated as restrictive until confirmed.
- No third-party skills are approved or installed by default.
- GitHub Trending is discovery-only; a trending repository can never become executable through discovery alone.
- Zero runtime dependencies in the CompeteOS CLI.
- Destructive overwrite is refused: `compete new` only accepts a missing or empty directory.

## Quick start

Requirements: Git, Node.js `22.23.1` (or Node 24 LTS), and pnpm `11.9.0`.

```bash
git clone https://github.com/KOIYAL/compete-os.git
cd compete-os
./scripts/setup.sh

pnpm compete -- new ../my-entry \
  --name "My Entry" \
  --type hackathon \
  --deadline "2026-08-08T18:00:00+09:00"

pnpm compete -- ingest ./examples/sample-brief.md --project ../my-entry
pnpm compete -- produce --project ../my-entry
pnpm compete -- validate --project ../my-entry --allow-draft
```

CompeteOS creates `../my-entry` as a separate Git repository. The harness repository remains unchanged and the generated repository contains only entry-specific plans and deliverables.

`validate` also scans the generated repository for common credential and private-key patterns. It is a guardrail, not proof that a repository contains no sensitive information; review files and Git history before publication.

## What is generated

```text
my-entry/
├── AGENTS.md                 # Codex project guidance
├── CLAUDE.md                 # Claude Code project guidance
├── .compete/
│   ├── project.json          # deadline, type, compliance mode, selected stack
│   ├── brief.json            # structured local intake
│   └── submission-manifest.json
├── deliverables/
│   ├── deck.md               # eight-part narrative
│   ├── deck.html             # printable browser deck
│   ├── demo-plan.md
│   ├── pitch.md
│   └── submission-checklist.md
└── evidence/
```

## Claude Code and Codex

The canonical skills live under `skills/core/`. `pnpm sync:skills` creates deterministic copies in both agent-native locations:

```text
skills/core/              canonical source
├─ intake-brief/
├─ plan-competition/
├─ scaffold-project/
├─ build-deliverables/
├─ validate-entry/
└─ review-external-skill/

.agents/skills/           Codex, generated
.claude/skills/           Claude Code, generated
```

Do not edit generated skill copies. CI runs `pnpm sync:skills:check` and fails when either agent directory differs from the canonical source.

Codex reads repository skills from `.agents/skills/` and durable project instructions from `AGENTS.md`. Claude Code reads project skills from `.claude/skills/` and durable instructions from `CLAUDE.md`.

## Default technology stack

When a user has no stack preference, CompeteOS records this default:

- TypeScript, pnpm
- Hono on Cloudflare Workers
- React only when interactive client state is needed
- Zod for validation
- D1 + Drizzle only when persistence is required
- R2 only for files
- Durable Objects only for realtime coordination
- Vitest, Playwright, Biome, GitHub Actions

Unused components are explicitly omitted. See `stacks/default-web.json` and the alternatives in `stacks/`.

## Compliance modes

- `strict` (default): use when rules are unknown or same-day creation may be required. No application starter code is copied.
- `standard`: reusable workflow assets are allowed, but the entry itself starts clean.
- `reuse`: existing components may be used after the user confirms the rules.

CompeteOS cannot determine whether an event permits AI tools, templates, or prior work. The participant remains responsible for confirming the rules. See [DISCLAIMER.md](DISCLAIMER.md).

## External skill registry

The registry starts with an empty approved list. Candidates may be discovered from official catalogs, official vendor repositories, maintained open source projects, and GitHub Trending—in that order.

Promotion to `registry/approved.json` requires a pinned 40-character commit, an identified license, a permission and network review, at least two independent security review records, a reproducible test, and human approval. Candidate records are data only and are never loaded as agent skills.

See [registry/POLICY.md](registry/POLICY.md).

## Current limits

Version `0.1.0` deliberately favors a small, auditable surface:

- Intake supports UTF-8 text, Markdown, and JSON. PDF, image, audio, and URL ingestion are not yet implemented.
- The deck output is Markdown plus printable HTML, not PPTX or Google Slides.
- Demo output is a runbook and fallback checklist; video capture is not yet automated.
- The CLI structures evidence and judgment criteria but does not claim to predict winners or grant decisions.
- No AI provider is bundled. Claude Code or Codex can use the checked-in skills, subject to the user's own account and policies.

## Development

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm public:check
```

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License and terms

CompeteOS is licensed under Apache License 2.0. Use of the software is also subject to the notices in [DISCLAIMER.md](DISCLAIMER.md). Third-party event rules and service terms still apply.
