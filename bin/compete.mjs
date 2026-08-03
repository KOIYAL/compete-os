#!/usr/bin/env node

import { runCli } from "../src/cli.mjs";

try {
  const code = await runCli(process.argv.slice(2));
  process.exitCode = code;
} catch (error) {
  process.stderr.write(`compete: ${error.message}\n`);
  process.exitCode = 1;
}
