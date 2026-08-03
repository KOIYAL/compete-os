import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { scanDirectory } from "../src/secret-scan.mjs";

test("secret scanner detects a token-like value in a generated project", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "compete-os-secret-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const token = `${"ghp"}_${"a".repeat(36)}`;
  await writeFile(path.join(root, "unsafe.env"), `TOKEN=${token}\n`);
  const findings = await scanDirectory(root);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /GitHub token/);
});
