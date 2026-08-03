import test from "node:test";
import assert from "node:assert/strict";
import { runCli } from "../src/cli.mjs";

test("CLI accepts pnpm's leading argument separator", async () => {
  assert.equal(await runCli(["--", "help"]), 0);
});
