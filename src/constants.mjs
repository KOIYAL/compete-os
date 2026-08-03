import { fileURLToPath } from "node:url";

export const HARNESS_ROOT = fileURLToPath(new URL("..", import.meta.url));
export const PROJECT_TYPES = new Set(["hackathon", "competition", "grant", "rfp", "pitch"]);
export const COMPLIANCE_MODES = new Set(["strict", "standard", "reuse"]);
export const MAX_BRIEF_BYTES = 5 * 1024 * 1024;
export const CORE_SKILLS = [
  "intake-brief",
  "plan-competition",
  "scaffold-project",
  "build-deliverables",
  "validate-entry",
];

export const DEFAULT_STACK = {
  id: "default-web",
  language: "TypeScript",
  packageManager: "pnpm",
  runtime: "Cloudflare Workers",
  backend: "Hono",
  frontend: "React when client-side state is required",
  validation: "Zod",
  persistence: "D1 + Drizzle when persistence is required",
  storage: "R2 when file storage is required",
  realtime: "Durable Objects when coordination is required",
  test: ["Vitest", "Playwright"],
  lintFormat: "Biome",
  ci: "GitHub Actions",
  omitByDefault: ["authentication", "billing", "admin UI", "database", "realtime"],
};
