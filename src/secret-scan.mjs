import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", "coverage", "dist"]);
const ignoredFiles = new Set(["pnpm-lock.yaml"]);
const maxFileBytes = 1024 * 1024;
const secretPatterns = [
  ["private key", new RegExp(`BEGIN ${"PRIVATE"} KEY`)],
  ["GitHub token", new RegExp(`${"ghp"}_[A-Za-z0-9]{30,}`)],
  ["GitHub fine-grained token", new RegExp(`${"github"}_pat_[A-Za-z0-9_]{40,}`)],
  ["AWS access key", new RegExp(`${"AKIA"}[A-Z0-9]{16}`)],
  ["OpenAI-style key", /sk-[A-Za-z0-9_-]{20,}/],
  ["Anthropic key", new RegExp(`${"sk"}-ant-[A-Za-z0-9_-]{20,}`)],
  ["assigned secret", /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][^"']{16,}["']/i],
];

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(absolute);
    if (entry.isFile() && !ignoredFiles.has(entry.name)) yield absolute;
  }
}

export async function scanDirectory(root) {
  const findings = [];
  for await (const file of files(root)) {
    if ((await stat(file)).size > maxFileBytes) continue;
    const buffer = await readFile(file);
    if (buffer.includes(0)) continue;
    const content = buffer.toString("utf8");
    for (const [label, pattern] of secretPatterns) {
      if (pattern.test(content)) findings.push(`${path.relative(root, file)}: ${label}`);
    }
  }
  return findings;
}
