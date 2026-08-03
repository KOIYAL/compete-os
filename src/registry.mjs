import path from "node:path";
import { HARNESS_ROOT } from "./constants.mjs";
import { readJson } from "./files.mjs";

const COMMIT = /^[0-9a-f]{40}$/;
const SPDX = /^[A-Za-z0-9-.+]+$/;

export async function validateRegistry() {
  const errors = [];
  for (const name of ["approved", "candidates", "rejected"]) {
    const file = path.join(HARNESS_ROOT, "registry", `${name}.json`);
    const registry = await readJson(file);
    if (registry.schemaVersion !== 1 || !Array.isArray(registry.entries)) {
      errors.push(`${name}.json must contain schemaVersion 1 and an entries array`);
      continue;
    }

    for (const entry of registry.entries) {
      if (!entry.id || !entry.sourceUrl) errors.push(`${name}: entry is missing id or sourceUrl`);
      if (name === "approved") {
        if (!COMMIT.test(entry.commit ?? "")) errors.push(`${entry.id}: approved commit must be a 40-character SHA`);
        if (!SPDX.test(entry.license ?? "")) errors.push(`${entry.id}: approved license must be an SPDX identifier`);
        if (!Array.isArray(entry.securityReviews) || entry.securityReviews.length < 2) {
          errors.push(`${entry.id}: approved skill requires at least two security review records`);
        }
        if (!entry.humanApproval?.approvedBy || !entry.humanApproval?.approvedAt) {
          errors.push(`${entry.id}: approved skill requires explicit human approval metadata`);
        }
        if (entry.discoverySource === "github-trending" && entry.reviewStatus !== "approved") {
          errors.push(`${entry.id}: Trending discovery cannot bypass approval`);
        }
      }
    }
  }
  return errors;
}
