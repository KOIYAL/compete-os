import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(target) {
  return JSON.parse(await readFile(target, "utf8"));
}

export async function writeJson(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function assertMissingOrEmpty(target) {
  if (!(await exists(target))) return;
  const info = await stat(target);
  if (!info.isDirectory()) throw new Error(`Target exists and is not a directory: ${target}`);
  if ((await readdir(target)).length > 0) {
    throw new Error(`Refusing to overwrite non-empty directory: ${target}`);
  }
}

export function projectPaths(root) {
  const projectRoot = path.resolve(root);
  return {
    root: projectRoot,
    compete: path.join(projectRoot, ".compete"),
    project: path.join(projectRoot, ".compete", "project.json"),
    brief: path.join(projectRoot, ".compete", "brief.json"),
    manifest: path.join(projectRoot, ".compete", "submission-manifest.json"),
    deliverables: path.join(projectRoot, "deliverables"),
    evidence: path.join(projectRoot, "evidence"),
  };
}

export async function requireProject(root) {
  const paths = projectPaths(root);
  if (!(await exists(paths.project))) {
    throw new Error(`No CompeteOS project found at ${paths.root}`);
  }
  return { paths, project: await readJson(paths.project) };
}
