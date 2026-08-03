import { mkdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { COMPLIANCE_MODES, DEFAULT_STACK, PROJECT_TYPES } from "./constants.mjs";
import { assertMissingOrEmpty, projectPaths, writeJson, writeText } from "./files.mjs";
import { copyProjectSkills } from "./skills.mjs";

function instructions(agent, project) {
  const invocation = agent === "Codex" ? "$" : "/";
  return `# ${project.name} project guidance

This repository is a generated, entry-specific workspace. ${agent} must optimize for a complete, demonstrable, rule-compliant submission before optional features.

## Non-negotiable rules

- Compliance mode is \`${project.complianceMode}\`. Do not broaden reuse without explicit confirmation from the user or organizer.
- Treat unknown event rules as restrictive.
- Do not commit secrets, personal data, confidential briefs, or organizer credentials.
- Keep the application, deck, demo, pitch, evidence, and submission manifest consistent.
- Freeze features early enough to rehearse and submit before the deadline.
- Never claim a feature is implemented when only a mock or plan exists.

## Workflow

1. Structure the brief and preserve unknowns.
2. Map judging criteria to claims and evidence.
3. Build the smallest end-to-end demo.
4. Update all deliverables as implementation changes.
5. Run submission validation and resolve every blocker.

${project.complianceMode === "strict" ? "No project skills were copied because strict mode avoids bringing reusable workflow files into the entry repository. Use the external CompeteOS harness only if event rules permit it." : `Relevant project skills are available. Invoke them with the ${invocation} prefix when useful.`}
`;
}

function safeScalar(value, label) {
  const normalized = String(value).replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim();
  if (!normalized) throw new Error(`${label} must not be empty`);
  if (normalized.length > 160) throw new Error(`${label} must be 160 characters or fewer`);
  return normalized;
}

export async function createProject({ target, name, type, deadline, complianceMode, initializeGit = true }) {
  if (!PROJECT_TYPES.has(type)) throw new Error(`Unsupported project type: ${type}`);
  if (!COMPLIANCE_MODES.has(complianceMode)) {
    throw new Error(`Unsupported compliance mode: ${complianceMode}`);
  }

  const safeName = safeScalar(name, "Project name");
  const safeDeadline = safeScalar(deadline, "Deadline");
  const root = path.resolve(target);
  await assertMissingOrEmpty(root);
  const paths = projectPaths(root);
  await mkdir(paths.root, { recursive: true });
  await mkdir(paths.compete, { recursive: true });
  await mkdir(paths.deliverables, { recursive: true });
  await mkdir(paths.evidence, { recursive: true });

  const project = {
    schemaVersion: 1,
    name: safeName,
    type,
    deadline: safeDeadline,
    complianceMode,
    createdAt: new Date().toISOString(),
    status: "draft",
    stack: DEFAULT_STACK,
    decisions: [],
  };

  await writeJson(paths.project, project);
  await writeText(path.join(root, "AGENTS.md"), instructions("Codex", project));
  await writeText(path.join(root, "CLAUDE.md"), instructions("Claude Code", project));
  await writeText(
    path.join(root, ".gitignore"),
    ".DS_Store\n.env\n.env.*\n!.env.example\nnode_modules/\n.compete/private/\n",
  );
  await writeText(
    path.join(root, "README.md"),
    `# ${name}\n\nGenerated as a separate ${type} workspace with CompeteOS.\n\n- Deadline: ${deadline}\n- Compliance mode: ${complianceMode}\n- Status: draft\n`,
  );

  const skills = await copyProjectSkills(root, complianceMode);

  if (initializeGit) {
    const result = spawnSync("git", ["init", "-b", "main", root], { encoding: "utf8" });
    if (result.error && result.error.code !== "ENOENT") throw result.error;
  }

  return { project, root, skills };
}
