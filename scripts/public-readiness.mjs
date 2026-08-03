import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exists } from "../src/files.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const required = [
  "README.md",
  "LICENSE",
  "NOTICE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "CHANGELOG.md",
  "DISCLAIMER.md",
  "pnpm-lock.yaml",
  ".github/workflows/ci.yml",
];
const errors = [];

for (const file of required) {
  if (!(await exists(path.join(root, file)))) errors.push(`Missing public file: ${file}`);
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (packageJson.private !== false) errors.push("package.json must explicitly set private to false");
if (packageJson.license !== "Apache-2.0") errors.push("package.json license must match LICENSE");
if (!packageJson.repository?.url?.includes("github.com/KOIYAL/compete-os")) {
  errors.push("package.json repository must point to KOIYAL/compete-os");
}
if (Object.keys(packageJson.dependencies ?? {}).length) errors.push("Unexpected runtime dependencies");

for (const file of ["README.md", "CHANGELOG.md", "package.json"]) {
  const content = await readFile(path.join(root, file), "utf8");
  if (content.includes("github.com/alancodvo/compete-os")) errors.push(`${file} points to the wrong owner`);
}

if (await exists(path.join(root, ".github/workflows/ci.yml"))) {
  const workflow = await readFile(path.join(root, ".github/workflows/ci.yml"), "utf8");
  const actionUses = [...workflow.matchAll(/uses:\s*([^\s]+)/g)].map((match) => match[1]);
  for (const action of actionUses) {
    if (!/@[0-9a-f]{40}$/.test(action)) errors.push(`GitHub Action is not commit-pinned: ${action}`);
  }
  if (!/permissions:\s*\n\s+contents:\s+read/.test(workflow)) errors.push("CI must declare read-only contents permission");
}

if (errors.length) {
  process.stderr.write(`${errors.map((error) => `ERROR ${error}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Public readiness checks passed\n");
}
