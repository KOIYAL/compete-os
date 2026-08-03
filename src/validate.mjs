import path from "node:path";
import { exists, readJson, requireProject } from "./files.mjs";
import { scanDirectory } from "./secret-scan.mjs";

const REQUIRED_DELIVERABLES = [
  "deck.md",
  "deck.html",
  "demo-plan.md",
  "pitch.md",
  "submission-checklist.md",
];

export async function validateEntry(projectRoot, { allowDraft = false } = {}) {
  const { paths, project } = await requireProject(projectRoot);
  const errors = [];
  const warnings = [];

  const secretFindings = await scanDirectory(paths.root);
  for (const finding of secretFindings) errors.push(`Potential secret: ${finding}`);

  if (!project.name || !project.type || !project.deadline || !project.complianceMode) {
    errors.push("project.json is missing required project metadata");
  }
  if (!(await exists(paths.brief))) errors.push("Brief has not been ingested");
  if (!(await exists(paths.manifest))) errors.push("Submission manifest has not been generated");

  for (const file of REQUIRED_DELIVERABLES) {
    if (!(await exists(path.join(paths.deliverables, file)))) errors.push(`Missing deliverable: ${file}`);
  }

  if (await exists(paths.brief)) {
    const brief = await readJson(paths.brief);
    if (brief.unknowns?.length) warnings.push(`${brief.unknowns.length} brief unknown(s) remain`);
    if (!brief.judgingCriteria?.length) warnings.push("No judging criteria were extracted; verify manually");
    if (!brief.prohibitions?.length) warnings.push("No prohibitions were extracted; verify manually");
  }

  if (await exists(paths.manifest)) {
    const manifest = await readJson(paths.manifest);
    const missing = [];
    if (["hackathon", "competition", "pitch"].includes(project.type) && !manifest.applicationUrl) {
      missing.push("applicationUrl");
    }
    if (!manifest.repositoryUrl) missing.push("repositoryUrl");
    if (!manifest.demoFallback && ["hackathon", "competition", "pitch"].includes(project.type)) {
      missing.push("demoFallback");
    }
    if (!manifest.checks?.rulesConfirmed) missing.push("checks.rulesConfirmed");
    if (!manifest.checks?.secretScanPassed) missing.push("checks.secretScanPassed");
    if (!manifest.checks?.urlsReopened) missing.push("checks.urlsReopened");
    if ((manifest.checks?.rehearsalCount ?? 0) < 1) missing.push("checks.rehearsalCount");

    const message = `Submission manifest is incomplete: ${missing.join(", ")}`;
    if (missing.length && allowDraft) warnings.push(message);
    if (missing.length && !allowDraft) errors.push(message);
  }

  return { ok: errors.length === 0, errors, warnings };
}
