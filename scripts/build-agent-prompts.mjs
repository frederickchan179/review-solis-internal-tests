#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const EXERCISES_DIR = path.join(ROOT, "exercises");

function extractSection(src, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `###\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=\\n###\\s+|$)`,
  );
  const match = src.match(re);
  if (!match) throw new Error(`Missing section: ${heading}`);
  return match[1].trim();
}

function buildAgentMd(dirName, review) {
  const title = (review.match(/^#\s+(.+)$/m) || [, dirName])[1].trim();
  const shortName = title.replace(/^Review\s*-\s*/i, "").trim();
  const folder = `exercises/${dirName}/`;
  const dev = extractSection(review, "Dev: Findings");
  const author = extractSection(review, "Author: improve the test");

  return `# Agent prompts - ${shortName}

Copy one block into an AI / agent / LLM. Point it at \`${folder}\`.

### Dev: Findings

\`\`\`text
You are fixing the interviewee fixture for ${title} (\`${folder}\`).

Work only in this folder's fixture files: \`index.html\`, \`style.css\`, \`script.js\` (and any other fixture assets already there). Do not edit \`BRIEF.md\`, \`REQUIREMENTS.md\`, \`REVIEW.md\`, or \`AGENT.md\`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

${dev}
\`\`\`

### Author: improve the test

\`\`\`text
You are improving the interview materials for ${title} (\`${folder}\`).

Edit \`BRIEF.md\`, \`REQUIREMENTS.md\`, and/or the buggy fixture (\`index.html\`, \`style.css\`, \`script.js\`) so probing and scoring stay fair. Do not edit \`REVIEW.md\` or \`AGENT.md\`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

${author}
\`\`\`
`;
}

function main() {
  const dirs = fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(EXERCISES_DIR, name, "REVIEW.md")))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const dirName of dirs) {
    const reviewPath = path.join(EXERCISES_DIR, dirName, "REVIEW.md");
    const review = fs.readFileSync(reviewPath, "utf8");
    const outPath = path.join(EXERCISES_DIR, dirName, "AGENT.md");
    fs.writeFileSync(outPath, `${buildAgentMd(dirName, review)}\n`);
    console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  }
}

main();
