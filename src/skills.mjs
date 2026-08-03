import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { CORE_SKILLS, HARNESS_ROOT } from "./constants.mjs";

export async function copyProjectSkills(projectRoot, mode) {
  if (mode === "strict") return [];
  const names = mode === "reuse" ? [...CORE_SKILLS, "review-external-skill"] : CORE_SKILLS;

  for (const agentRoot of [".agents/skills", ".claude/skills"]) {
    const destination = path.join(projectRoot, agentRoot);
    await rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });
    for (const name of names) {
      await cp(path.join(HARNESS_ROOT, "skills/core", name), path.join(destination, name), {
        recursive: true,
      });
    }
  }

  return names;
}

export async function listCanonicalSkills() {
  return (await readdir(path.join(HARNESS_ROOT, "skills/core"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
