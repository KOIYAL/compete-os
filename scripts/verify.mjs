import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateRegistry } from "../src/registry.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) process.exitCode = 1;
}

function runTests() {
  const result = spawnSync(process.execPath, ["--test"], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) process.exitCode = 1;
}

async function validateSkills() {
  const skillRoot = path.join(root, "skills/core");
  const errors = [];
  for (const entry of await readdir(skillRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const content = await readFile(path.join(skillRoot, entry.name, "SKILL.md"), "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) {
      errors.push(`${entry.name}: missing YAML frontmatter`);
      continue;
    }
    const name = match[1].match(/^name:\s*(.+)$/m)?.[1]?.replaceAll('"', "").trim();
    const description = match[1].match(/^description:\s*(.+)$/m)?.[1]?.replaceAll('"', "").trim();
    if (name !== entry.name) errors.push(`${entry.name}: frontmatter name mismatch`);
    if (!description || description.length < 30) errors.push(`${entry.name}: description is too short`);
    if (/TODO|\[TODO/.test(content)) errors.push(`${entry.name}: unresolved TODO`);
  }
  return errors;
}

const skillErrors = await validateSkills();
const registryErrors = await validateRegistry();
for (const error of [...skillErrors, ...registryErrors]) process.stderr.write(`ERROR ${error}\n`);
if (skillErrors.length || registryErrors.length) process.exitCode = 1;

run("scripts/sync-skills.mjs", ["--check"]);
run("scripts/scan-secrets.mjs");
runTests();

if (!process.exitCode) process.stdout.write("Verification passed\n");
