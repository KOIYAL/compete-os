import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = path.join(root, "skills/core");
const destinations = [path.join(root, ".agents/skills"), path.join(root, ".claude/skills")];

async function fileMap(directory, prefix = "") {
  const map = new Map();
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      for (const [key, value] of await fileMap(absolute, relative)) map.set(key, value);
    } else if (entry.isFile()) {
      const hash = createHash("sha256").update(await readFile(absolute)).digest("hex");
      map.set(relative, hash);
    }
  }
  return map;
}

function equalMaps(left, right) {
  return left.size === right.size && [...left].every(([key, value]) => right.get(key) === value);
}

const check = process.argv.includes("--check");
const canonical = await fileMap(source);

for (const destination of destinations) {
  if (check) {
    let generated;
    try {
      generated = await fileMap(destination);
    } catch {
      generated = new Map();
    }
    if (!equalMaps(canonical, generated)) {
      process.stderr.write(`Skill drift detected: ${path.relative(root, destination)}\n`);
      process.exitCode = 1;
    }
    continue;
  }

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true });
  process.stdout.write(`Synced ${path.relative(root, destination)}\n`);
}
