import test from "node:test";
import assert from "node:assert/strict";
import { extractBrief } from "../src/intake.mjs";

test("extractBrief separates requirements, criteria, prohibitions, and unknowns", () => {
  const result = extractBrief(`
- Teams must submit a public repository.
- Judging criteria: implementation 40%.
- Personal data is prohibited.
- Presentation order will be announced on the day.
`);

  assert.equal(result.requirements.length, 1);
  assert.equal(result.judgingCriteria.length, 1);
  assert.equal(result.prohibitions.length, 1);
  assert.equal(result.unknowns.length, 1);
});

test("extractBrief supports Japanese rule language", () => {
  const result = extractBrief(`
- GitHubリポジトリの提出が必須です。
- 既存コードの持ち込みは禁止です。
- 審査基準は当日発表します。
`);

  assert.ok(result.requirements.some((line) => line.includes("必須")));
  assert.ok(result.prohibitions.some((line) => line.includes("禁止")));
  assert.ok(result.unknowns.some((line) => line.includes("当日")));
});
