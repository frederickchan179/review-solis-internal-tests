#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const EXERCISES_DIR = path.join(ROOT, "exercises");

function listExerciseDirs() {
  return fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) =>
      fs.existsSync(path.join(EXERCISES_DIR, name, "REVIEW.md")),
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function shortNameFromReview(review, dirName) {
  const title = (review.match(/^#\s+(.+)$/m) || [, dirName])[1].trim();
  return title.replace(/^Review\s*-\s*/i, "").trim();
}

function buildReviewsBundle(dirs) {
  const parts = [
    `# All reviews`,
    ``,
    `Every exercise \`REVIEW.md\` in one place. Open an exercise from the sidebar to try the live fixture.`,
    ``,
  ];

  for (const dirName of dirs) {
    const review = fs.readFileSync(
      path.join(EXERCISES_DIR, dirName, "REVIEW.md"),
      "utf8",
    );
    const shortName = shortNameFromReview(review, dirName);
    const body = review.replace(/^#\s+.+\n+/, "").trim();
    parts.push(`## ${shortName}`);
    parts.push(``);
    parts.push(`Folder: \`exercises/${dirName}/\``);
    parts.push(``);
    parts.push(body);
    parts.push(``);
    parts.push(`---`);
    parts.push(``);
  }

  return `${parts.join("\n").replace(/\n---\n\s*$/, "\n")}\n`;
}

function main() {
  const dirs = listExerciseDirs();
  const outPath = path.join(EXERCISES_DIR, "REVIEWS.md");
  fs.writeFileSync(outPath, buildReviewsBundle(dirs));
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
}

main();
