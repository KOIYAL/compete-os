#!/usr/bin/env sh
set -eu

node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 22 ] || [ "$node_major" -ge 27 ]; then
  echo "CompeteOS requires Node.js 22 through 26." >&2
  exit 1
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile --offline
elif command -v corepack >/dev/null 2>&1; then
  corepack pnpm install --frozen-lockfile --offline
else
  echo "pnpm 11.9.0 is required. Install it, then rerun this script." >&2
  exit 1
fi

pnpm sync:skills
pnpm verify
echo "CompeteOS is ready. Run: pnpm compete -- help"
