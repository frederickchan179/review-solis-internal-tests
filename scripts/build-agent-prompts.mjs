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

function buildDevPrompt({ title, folder, findings }) {
  return `You are fixing the interviewee fixture for ${title} (\`${folder}\`).

Work only in this folder's fixture files: \`index.html\`, \`style.css\`, \`script.js\` (and any other fixture assets already there). Do not edit \`BRIEF.md\`, \`REQUIREMENTS.md\`, \`REVIEW.md\`, or \`AGENT.md\`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

${findings}`;
}

function buildAuthorPrompt({ title, folder, notes }) {
  return `You are improving the interview materials for ${title} (\`${folder}\`).

Edit \`BRIEF.md\`, \`REQUIREMENTS.md\`, and/or the buggy fixture (\`index.html\`, \`style.css\`, \`script.js\`) so probing and scoring stay fair. Do not edit \`REVIEW.md\` or \`AGENT.md\`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

${notes}`;
}

function buildAgentMd(dirName, review) {
  const title = (review.match(/^#\s+(.+)$/m) || [, dirName])[1].trim();
  const shortName = title.replace(/^Review\s*-\s*/i, "").trim();
  const folder = `exercises/${dirName}/`;
  const findings = extractSection(review, "Dev: Findings");
  const notes = extractSection(review, "Author: improve the test");
  const devPrompt = buildDevPrompt({ title, folder, findings });
  const authorPrompt = buildAuthorPrompt({ title, folder, notes });

  return {
    dirName,
    shortName,
    title,
    folder,
    devPrompt,
    authorPrompt,
    body: `# Agent prompts - ${shortName}

Copy one block into an AI / agent / LLM. Point it at \`${folder}\`.

### Dev: Findings

\`\`\`text
${devPrompt}
\`\`\`

### Author: improve the test

\`\`\`text
${authorPrompt}
\`\`\`
`,
  };
}

function joinAllPrompts(entries, kind) {
  const key = kind === "dev" ? "devPrompt" : "authorPrompt";
  const label = kind === "dev" ? "Dev: Findings" : "Author: improve the test";

  return entries
    .map((entry, index) => {
      const n = index + 1;
      return [
        `========== ${n}/${entries.length} · ${entry.shortName} · ${label} ==========`,
        `Folder: ${entry.folder}`,
        ``,
        entry[key],
      ].join("\n");
    })
    .join("\n\n");
}

function buildAgentsBundle(entries) {
  const allDev = joinAllPrompts(entries, "dev");
  const allAuthor = joinAllPrompts(entries, "author");

  const parts = [
    `# All agent prompts`,
    ``,
    `Use the **Copy** button on a code block.`,
    ``,
    `- **Copy all · Dev** = every exercise fixture-fix prompt in one paste.`,
    `- **Copy all · Author** = every exercise materials-improve prompt in one paste.`,
    `- Per-exercise blocks are below if you only need one test.`,
    ``,
    `### Copy all · Dev`,
    ``,
    `\`\`\`text`,
    allDev,
    `\`\`\``,
    ``,
    `### Copy all · Author`,
    ``,
    `\`\`\`text`,
    allAuthor,
    `\`\`\``,
    ``,
    `---`,
    ``,
    `## Per exercise`,
    ``,
  ];

  for (const { dirName, shortName, body } of entries) {
    const withoutH1 = body.replace(/^#\s+.+\n+/, "").trim();
    parts.push(`### ${shortName}`);
    parts.push(``);
    parts.push(`Folder: \`exercises/${dirName}/\``);
    parts.push(``);
    parts.push(withoutH1);
    parts.push(``);
    parts.push(`---`);
    parts.push(``);
  }

  return `${parts.join("\n").replace(/\n---\n\s*$/, "\n")}\n`;
}

function main() {
  const dirs = fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(EXERCISES_DIR, name, "REVIEW.md")))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const entries = [];

  for (const dirName of dirs) {
    const reviewPath = path.join(EXERCISES_DIR, dirName, "REVIEW.md");
    const review = fs.readFileSync(reviewPath, "utf8");
    const entry = buildAgentMd(dirName, review);
    const outPath = path.join(EXERCISES_DIR, dirName, "AGENT.md");
    fs.writeFileSync(outPath, `${entry.body}\n`);
    console.log(`Wrote ${path.relative(ROOT, outPath)}`);
    entries.push(entry);
  }

  const bundlePath = path.join(EXERCISES_DIR, "AGENTS.md");
  fs.writeFileSync(bundlePath, buildAgentsBundle(entries));
  console.log(`Wrote ${path.relative(ROOT, bundlePath)}`);
}

main();
