import path from "node:path";
import { readJson, requireProject } from "./files.mjs";
import { createProject } from "./project.mjs";
import { ingestBrief } from "./intake.mjs";
import { produceDeliverables } from "./deliverables.mjs";
import { validateEntry } from "./validate.mjs";

const HELP = `CompeteOS 0.1.0

Usage:
  compete new <directory> --name <name> [--type hackathon] [--deadline value]
  compete ingest <brief.md> [--project directory]
  compete produce [--project directory]
  compete validate [--project directory] [--allow-draft]
  compete status [--project directory]

Options for new:
  --type           hackathon | competition | grant | rfp | pitch
  --compliance     strict | standard | reuse (default: strict)
  --deadline       ISO date-time or organizer-provided label (default: unknown)
  --no-git         Do not initialize the generated repository
`;

function parseArgs(args) {
  const positionals = [];
  const flags = {};
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) {
      positionals.push(value);
      continue;
    }
    const key = value.slice(2);
    if (["allow-draft", "no-git"].includes(key)) {
      flags[key] = true;
      continue;
    }
    const next = args[index + 1];
    if (!next || next.startsWith("--")) throw new Error(`Missing value for --${key}`);
    flags[key] = next;
    index += 1;
  }
  return { positionals, flags };
}

function printValidation(result) {
  for (const warning of result.warnings) process.stdout.write(`WARN  ${warning}\n`);
  for (const error of result.errors) process.stderr.write(`ERROR ${error}\n`);
  process.stdout.write(result.ok ? "PASS  entry structure is valid\n" : "FAIL  entry is not ready\n");
}

export async function runCli(argv) {
  const normalizedArgv = argv[0] === "--" ? argv.slice(1) : argv;
  const [command = "help", ...rest] = normalizedArgv;
  const { positionals, flags } = parseArgs(rest);

  if (["help", "--help", "-h"].includes(command)) {
    process.stdout.write(HELP);
    return 0;
  }

  if (command === "new") {
    if (!positionals[0]) throw new Error("new requires a target directory");
    const target = path.resolve(positionals[0]);
    const result = await createProject({
      target,
      name: flags.name ?? path.basename(target),
      type: flags.type ?? "hackathon",
      deadline: flags.deadline ?? "unknown",
      complianceMode: flags.compliance ?? "strict",
      initializeGit: !flags["no-git"],
    });
    process.stdout.write(`Created ${result.root}\n`);
    process.stdout.write(`Compliance: ${result.project.complianceMode}\n`);
    process.stdout.write(`Project skills copied: ${result.skills.length}\n`);
    return 0;
  }

  const projectRoot = path.resolve(flags.project ?? process.cwd());

  if (command === "ingest") {
    if (!positionals[0]) throw new Error("ingest requires a .md, .txt, or .json brief");
    const brief = await ingestBrief({ projectRoot, briefPath: path.resolve(positionals[0]) });
    process.stdout.write(`Ingested ${brief.sourceName}\n`);
    process.stdout.write(`Unknowns: ${brief.unknowns.length}; prohibitions: ${brief.prohibitions.length}; criteria: ${brief.judgingCriteria.length}\n`);
    return 0;
  }

  if (command === "produce") {
    const result = await produceDeliverables(projectRoot);
    process.stdout.write(`Generated deliverables in ${result.paths.deliverables}\n`);
    return 0;
  }

  if (command === "validate") {
    const result = await validateEntry(projectRoot, { allowDraft: Boolean(flags["allow-draft"]) });
    printValidation(result);
    return result.ok ? 0 : 1;
  }

  if (command === "status") {
    const { paths, project } = await requireProject(projectRoot);
    const manifest = await readJson(paths.manifest).catch(() => null);
    process.stdout.write(`${project.name}\n`);
    process.stdout.write(`Type: ${project.type}\nDeadline: ${project.deadline}\nCompliance: ${project.complianceMode}\n`);
    process.stdout.write(`Submission: ${manifest?.status ?? "not generated"}\n`);
    return 0;
  }

  throw new Error(`Unknown command: ${command}\n\n${HELP}`);
}
