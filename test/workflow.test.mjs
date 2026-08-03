import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createProject } from "../src/project.mjs";
import { ingestBrief } from "../src/intake.mjs";
import { produceDeliverables } from "../src/deliverables.mjs";
import { validateEntry } from "../src/validate.mjs";

test("complete local draft workflow generates safe deliverables", async (t) => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "compete-os-flow-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const target = path.join(parent, "entry");
  const briefPath = path.join(parent, "brief.md");
  await writeFile(
    briefPath,
    "- Judges evaluate user value.\n- Teams must submit a repository.\n- A resident sees <script>alert('x')</script> in a portal.\n",
  );

  await createProject({
    target,
    name: "Demo Entry",
    type: "hackathon",
    deadline: "2026-08-08T18:00:00+09:00",
    complianceMode: "strict",
    initializeGit: false,
  });
  await ingestBrief({ projectRoot: target, briefPath });
  await produceDeliverables(target);

  const draft = await validateEntry(target, { allowDraft: true });
  const final = await validateEntry(target);
  assert.equal(draft.ok, true);
  assert.equal(final.ok, false);

  const html = await readFile(path.join(target, "deliverables/deck.html"), "utf8");
  const markdown = await readFile(path.join(target, "deliverables/deck.md"), "utf8");
  assert.equal(html.includes("<script>alert"), false);
  assert.equal(markdown.includes("<script>alert"), false);
  assert.ok(html.includes("&lt;script&gt;"));
});
