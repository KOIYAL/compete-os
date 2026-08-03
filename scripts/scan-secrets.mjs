import { fileURLToPath } from "node:url";
import { scanDirectory } from "../src/secret-scan.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const findings = await scanDirectory(root);

if (findings.length) {
  process.stderr.write(`Potential secrets found:\n${findings.map((item) => `- ${item}`).join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Secret scan passed\n");
}
