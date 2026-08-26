#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const EXERCISES_DIR = path.join(ROOT, "exercises");
const OUT = path.join(EXERCISES_DIR, "manifest.json");

const FILE_ORDER = [
  "REVIEW.md",
  "BRIEF.md",
  "REQUIREMENTS.md",
  "index.html",
  "style.css",
  "script.js",
];

function titleCaseSlug(slug) {
  const rest = slug.replace(/^\d+-/, "");
  return rest
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part === "faq") return "FAQ";
      if (part === "qty") return "Quantity";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function sortExerciseFiles(files) {
  return files.sort((a, b) => {
    const ai = FILE_ORDER.indexOf(a);
    const bi = FILE_ORDER.indexOf(b);
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

function listFiles(dir) {
  const files = [];
  function walk(relative = "") {
    const abs = path.join(dir, relative);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "__MACOSX") continue;
      const relPath = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(relPath);
      else if (entry.isFile()) files.push(relPath);
    }
  }
  walk();
  return sortExerciseFiles(files);
}

function isExerciseDir(dirName, absPath) {
  if (!dirName || dirName.startsWith(".")) return false;
  try {
    return fs.statSync(path.join(absPath, "index.html")).isFile();
  } catch {
    return false;
  }
}

function build() {
  if (!fs.existsSync(EXERCISES_DIR)) {
    fs.mkdirSync(EXERCISES_DIR, { recursive: true });
  }

  const exercises = fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => isExerciseDir(name, path.join(EXERCISES_DIR, name)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((dirName) => {
      const match = dirName.match(/^(\d+)-(.+)$/);
      return {
        id: dirName,
        num: match ? match[1].padStart(2, "0").slice(-2) : "--",
        name: match ? titleCaseSlug(dirName) : dirName,
        path: `exercises/${dirName}/`,
        files: listFiles(path.join(EXERCISES_DIR, dirName)),
      };
    });

  const payload = {
    generatedAt: new Date().toISOString(),
    exercises,
  };

  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${exercises.length} exercises)`);
}

build();
