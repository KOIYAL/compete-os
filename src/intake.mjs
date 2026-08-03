import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { MAX_BRIEF_BYTES } from "./constants.mjs";
import { requireProject, sha256, writeJson } from "./files.mjs";

const patterns = {
  unknowns: /(tbd|unknown|to be announced|will be announced|not announced|on the day|当日|未定|後日|不明|未発表|確認中)/i,
  prohibitions: /(must not|prohibited|forbidden|not allowed|禁止|不可|認められない|持ち込み.*禁止)/i,
  deliverables: /(submit|submission|deliverable|repository|demo url|slide|deck|video|提出|納品|リポジトリ|スライド|動画|デモ)/i,
  judgingCriteria: /(judge|judging|criteria|evaluation|score|weight|審査|評価|配点|採点)/i,
  schedule: /(deadline|due|schedule|date|time|締切|期限|日程|日時|タイムテーブル)/i,
  requirements: /(must|required|mandatory|shall|requirement|必須|要件|使用すること|参加条件)/i,
};

function cleanLine(line) {
  return line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+|#+\s*)/, "").trim();
}

function unique(values, limit = 80) {
  return [...new Set(values.filter(Boolean))].slice(0, limit);
}

export function extractBrief(text) {
  const lines = text.split(/\r?\n/).map(cleanLine).filter((line) => line.length >= 3);
  const result = {};
  for (const [category, pattern] of Object.entries(patterns)) {
    result[category] = unique(lines.filter((line) => pattern.test(line)));
  }

  const categorized = new Set(Object.values(result).flat());
  result.knownFacts = unique(lines.filter((line) => !categorized.has(line) && line.length <= 240), 60);
  return result;
}

export async function ingestBrief({ projectRoot, briefPath }) {
  const extension = path.extname(briefPath).toLowerCase();
  if (![".md", ".txt", ".json"].includes(extension)) {
    throw new Error("Brief intake supports only .md, .txt, and .json in version 0.1.0");
  }

  const info = await stat(briefPath);
  if (info.size > MAX_BRIEF_BYTES) throw new Error("Brief exceeds the 5 MiB local intake limit");

  const source = await readFile(briefPath, "utf8");
  if (source.includes("\u0000")) throw new Error("Brief must be UTF-8 text, not a binary file");
  if (extension === ".json") JSON.parse(source);

  const { paths } = await requireProject(projectRoot);
  const extracted = extractBrief(source);
  const brief = {
    schemaVersion: 1,
    sourceName: path.basename(briefPath),
    sourceSha256: sha256(source),
    ingestedAt: new Date().toISOString(),
    ...extracted,
  };
  await writeJson(paths.brief, brief);
  return brief;
}
