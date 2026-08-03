# CompeteOS repository guidance

CompeteOS is a local-first production harness. Keep this repository separate from every generated entry repository.

- Edit canonical skills only in `skills/core/`.
- Run `pnpm sync:skills`; do not edit `.claude/skills/` or `.agents/skills/` directly.
- Keep the CLI free of runtime dependencies unless a reviewed change proves one is necessary.
- Do not add network calls, telemetry, automatic skill installation, or secret access by default.
- Never overwrite a non-empty user directory.
- Preserve the restrictive behavior of `strict` compliance mode.
- Run `pnpm verify` and `pnpm public:check` after changes.
