import path from "node:path";
import { exists, readJson, requireProject, writeJson, writeText } from "./files.mjs";

function bullets(values, fallback) {
  const items = values?.length ? values : [fallback];
  return items.slice(0, 6).map((value) => `- ${safeMarkdown(value)}`).join("\n");
}

function safeMarkdown(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function listHtml(values, fallback) {
  const items = values?.length ? values : [fallback];
  return `<ul>${items.slice(0, 6).map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function deckMarkdown(project, brief) {
  return `# ${safeMarkdown(project.name)}

> ${safeMarkdown(project.type)} entry · Deadline: ${safeMarkdown(project.deadline)}

---

## 1. The problem

${bullets(brief.knownFacts, "State the user, moment, and costly problem in one sentence.")}

---

## 2. Why now

${bullets(brief.requirements, "Connect the problem to the event theme or required technology.")}

---

## 3. Proposed experience

- Show one input, one meaningful transformation, and one actionable result.
- Make the value understandable within 30 seconds.

---

## 4. Live demo

- Moment 1: establish the problem.
- Moment 2: trigger the core transformation.
- Moment 3: show evidence of a changed outcome.

---

## 5. What was built

- Core experience: record implementation evidence in \`evidence/\`.
- Deliberately omitted: authentication, billing, admin UI, and speculative features unless required.

---

## 6. Technical approach

- Default: ${project.stack.language}, ${project.stack.backend}, ${project.stack.runtime}.
- Add persistence, storage, or realtime components only when the brief requires them.

---

## 7. Judging evidence

${bullets(brief.judgingCriteria, "Map every confirmed judging criterion to a visible feature or evidence item.")}

---

## 8. Close

- Restate the user outcome in one sentence.
- Show the working URL or submission artifact.
- Ask judges to remember one concrete change the product creates.
`;
}

function deckHtml(project, brief) {
  const slides = [
    [project.name, `<p>${escapeHtml(project.type)} entry</p><p>Deadline: ${escapeHtml(project.deadline)}</p>`],
    ["The problem", listHtml(brief.knownFacts, "State the user, moment, and costly problem in one sentence.")],
    ["Why now", listHtml(brief.requirements, "Connect the problem to the event theme or required technology.")],
    ["Proposed experience", "<ul><li>One input</li><li>One meaningful transformation</li><li>One actionable result</li></ul>"],
    ["Live demo", "<ol><li>Establish the problem</li><li>Trigger the core transformation</li><li>Show the changed outcome</li></ol>"],
    ["Technical approach", `<p>${escapeHtml(project.stack.language)} · ${escapeHtml(project.stack.backend)} · ${escapeHtml(project.stack.runtime)}</p>`],
    ["Judging evidence", listHtml(brief.judgingCriteria, "Map each confirmed criterion to visible evidence.")],
    ["Close", "<p>Restate the user outcome. Show the working artifact. Leave one memorable proof point.</p>"],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(project.name)} deck</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    body { margin: 0; background: #111827; }
    .slide { box-sizing: border-box; width: 100vw; min-height: 100vh; padding: 8vh 9vw; display: grid; align-content: center; background: #f8fafc; color: #0f172a; border-bottom: 1px solid #cbd5e1; }
    h1 { font-size: clamp(2.5rem, 7vw, 6rem); margin: 0 0 0.4em; line-height: 1; }
    p, li { font-size: clamp(1.25rem, 2.5vw, 2.25rem); line-height: 1.45; }
    @media print { .slide { width: 13.333in; min-height: 7.5in; break-after: page; } }
  </style>
</head>
<body>
${slides.map(([title, body]) => `<section class="slide"><h1>${escapeHtml(title)}</h1>${body}</section>`).join("\n")}
</body>
</html>`;
}

function demoPlan(project, brief) {
  return `# Demo plan — ${safeMarkdown(project.name)}

## Success path

1. Open the application and establish the user problem in under 15 seconds.
2. Use fixed, non-sensitive demo data.
3. Trigger the smallest end-to-end core flow.
4. Pause on the changed outcome and connect it to judging criteria.
5. End on the submission URL or artifact.

## Required evidence

${bullets(brief.judgingCriteria, "Confirm judging criteria and add one visible proof item per criterion.")}

## Fallback ladder

- Live application checked on the presentation network.
- Recorded screen capture stored locally.
- Screenshot sequence stored in \`evidence/\`.
- Static output with the same fixed demo data.

## Rehearsal gates

- [ ] First complete run before optional feature work.
- [ ] Feature freeze at least 90 minutes before ${safeMarkdown(project.deadline)}.
- [ ] Two timed rehearsals.
- [ ] Offline fallback opened successfully.
- [ ] No personal data, secrets, or organizer credentials in the demo.
`;
}

function pitch(project, brief) {
  return `# Pitch — ${safeMarkdown(project.name)}

Target length: 3 minutes. Replace generic wording only with verified facts and implemented behavior.

## 0:00–0:20 — Problem

${safeMarkdown(brief.knownFacts?.[0] ?? "Describe who encounters the problem, at what moment, and why the current outcome is costly.")}

## 0:20–0:40 — Proposal

We built ${safeMarkdown(project.name)}: one focused experience that turns the critical input into a visible, actionable outcome.

## 0:40–1:40 — Demo

Narrate only what the judges can see. Show the input, the core transformation, and the changed result.

## 1:40–2:10 — Technical proof

Explain why the required technology is necessary. Distinguish implemented behavior from mocks and future work.

## 2:10–2:40 — Value

Connect the result to the confirmed evaluation criteria and identify who adopts or pays for it when relevant.

## 2:40–3:00 — Close

Repeat the outcome in one sentence and point to the working artifact.

## Questions to prepare

- Why does this need to exist now?
- Why is the required technology essential rather than decorative?
- What was built during the allowed period?
- What fails when the network or external API is unavailable?
- What evidence supports the claimed impact?
`;
}

function checklist(project, brief) {
  return `# Submission checklist — ${safeMarkdown(project.name)}

## Rules

${bullets(brief.prohibitions, "No explicit prohibitions extracted; confirm with the organizer.")}

## Unknowns

${bullets(brief.unknowns, "No unknowns extracted; manually verify the official channel for updates.")}

## Artifacts

- [ ] Application or primary artifact opens without maintainer-only access.
- [ ] Repository visibility matches the rules.
- [ ] Deck opens from a fresh browser or device.
- [ ] Demo fallback exists locally.
- [ ] Description and team details meet character and format limits.
- [ ] Required technology use is visible and explained.
- [ ] License and third-party attributions are complete.
- [ ] Secret scan passes.
- [ ] Submission is completed before ${safeMarkdown(project.deadline)}.
- [ ] Submitted URLs are reopened and verified.
`;
}

export async function produceDeliverables(projectRoot) {
  const { paths, project } = await requireProject(projectRoot);
  if (!(await exists(paths.brief))) throw new Error("Ingest a brief before producing deliverables");
  const brief = await readJson(paths.brief);

  await writeText(path.join(paths.deliverables, "deck.md"), deckMarkdown(project, brief));
  await writeText(path.join(paths.deliverables, "deck.html"), deckHtml(project, brief));
  await writeText(path.join(paths.deliverables, "demo-plan.md"), demoPlan(project, brief));
  await writeText(path.join(paths.deliverables, "pitch.md"), pitch(project, brief));
  await writeText(path.join(paths.deliverables, "submission-checklist.md"), checklist(project, brief));

  const manifest = {
    schemaVersion: 1,
    projectName: project.name,
    deadline: project.deadline,
    status: "draft",
    applicationUrl: "",
    repositoryUrl: "",
    deck: "deliverables/deck.html",
    demoFallback: "",
    submissionReceipt: "",
    checks: {
      rulesConfirmed: false,
      secretScanPassed: false,
      rehearsalCount: 0,
      urlsReopened: false,
    },
  };
  await writeJson(paths.manifest, manifest);
  return { paths, manifest };
}
