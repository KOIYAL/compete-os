# CompeteOS repository guidance

## Product boundary

CompeteOS is a local-first production harness. Keep the harness repository separate from every generated entry repository. Never copy application starter code in `strict` compliance mode.

## Working agreements

- Treat `skills/core/` as the only editable skill source.
- Do not edit `.agents/skills/` or `.claude/skills/` directly; run `pnpm sync:skills`.
- Keep the CLI free of runtime dependencies unless a reviewed change proves one is necessary.
- Do not add network calls, telemetry, automatic skill installation, or secret access by default.
- Refuse destructive overwrite of user directories.
- Keep documentation honest about implemented capabilities and limitations.
- Run `pnpm verify` and `pnpm public:check` after changes.

## Code review rules

- Flag any path traversal, shell interpolation, unbounded file read, silent network request, or secret persistence.
- Flag any external skill that can move from candidate to approved without a pinned commit, clear license, two security reviews, and explicit human approval.
- Flag generated skill drift and edits that weaken `strict` mode.
