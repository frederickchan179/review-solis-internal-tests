#!/usr/bin/env node
import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const EXERCISES_DIR = path.join(ROOT, "exercises");
const PORT = Number(process.env.PORT) || 8765;
const HOST = process.env.HOST || "127.0.0.1";
const MAX_ZIP_BYTES = 20 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ZIP_BYTES, files: 1 },
  fileFilter(_req, file, cb) {
    const ok =
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      file.originalname.toLowerCase().endsWith(".zip");
    cb(ok ? null : new Error("Only .zip files are allowed."), ok);
  },
});

const app = express();

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

function toExercise(dirName) {
  const match = dirName.match(/^(\d+)-(.+)$/);
  return {
    id: dirName,
    num: match ? match[1].padStart(2, "0").slice(-2) : "--",
    name: match ? titleCaseSlug(dirName) : dirName,
    path: `/exercises/${dirName}/`,
  };
}

function isExerciseDir(dirName, absPath) {
  if (!dirName || dirName.startsWith(".")) return false;
  try {
    return fs.statSync(path.join(absPath, "index.html")).isFile();
  } catch {
    return false;
  }
}

function listExercises() {
  if (!fs.existsSync(EXERCISES_DIR)) return [];
  return fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => isExerciseDir(name, path.join(EXERCISES_DIR, name)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(toExercise);
}

function handleizeName(raw) {
  return String(raw || "")
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^\d+[\s._-]*/, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function baseSlug(dirName) {
  return String(dirName || "").replace(/^\d+-/, "");
}

function nextExerciseNum() {
  const nums = listExercises()
    .map((item) => Number.parseInt(item.num, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

function resolveExerciseSlug(name, { overwrite = false } = {}) {
  const base = handleizeName(name);
  if (!base) {
    throw Object.assign(new Error("Exercise name is required."), { status: 400 });
  }
  if (base === "exercises") {
    throw Object.assign(new Error(`Name "${base}" is reserved.`), { status: 400 });
  }
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(base)) {
    throw Object.assign(
      new Error("Use a simple name: letters, numbers, and hyphens only."),
      { status: 400 },
    );
  }

  const existing = listExercises().find((item) => baseSlug(item.id) === base);
  if (existing) {
    if (!overwrite) {
      const err = new Error(
        `An exercise named "${existing.id}" already exists.`,
      );
      err.status = 409;
      err.conflict = {
        existing: existing,
        slug: existing.id,
      };
      throw err;
    }
    return existing.id;
  }

  const num = String(nextExerciseNum()).padStart(2, "0");
  return `${num}-${base}`;
}

function assertValidSlug(slug) {
  if (!slug) throw Object.assign(new Error("Exercise name is required."), { status: 400 });
  if (slug === "exercises") {
    throw Object.assign(new Error(`Name "${slug}" is reserved.`), { status: 400 });
  }
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(slug)) {
    throw Object.assign(
      new Error(
        "Name must be lowercase letters, numbers, hyphens (max 63 chars).",
      ),
      { status: 400 },
    );
  }
}

async function emptyDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map((entry) =>
      fsp.rm(path.join(dir, entry.name), { recursive: true, force: true }),
    ),
  );
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".DS_Store" || entry.name === "__MACOSX") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fsp.copyFile(from, to);
  }
}

function findPayloadRoot(extractDir) {
  const entries = fs
    .readdirSync(extractDir, { withFileTypes: true })
    .filter((entry) => entry.name !== "__MACOSX" && entry.name !== ".DS_Store");

  if (fs.existsSync(path.join(extractDir, "index.html"))) return extractDir;

  const dirs = entries.filter((entry) => entry.isDirectory());
  if (dirs.length === 1) {
    const nested = path.join(extractDir, dirs[0].name);
    if (fs.existsSync(path.join(nested, "index.html"))) return nested;
  }

  throw Object.assign(
    new Error(
      "ZIP must contain index.html at the root, or one top-level folder with index.html.",
    ),
    { status: 400 },
  );
}

function extractZipBuffer(zipBuffer, extractDir) {
  const zip = new AdmZip(zipBuffer);
  for (const entry of zip.getEntries()) {
    const name = entry.entryName.replace(/\\/g, "/");
    if (
      name.includes("..") ||
      name.startsWith("/") ||
      name.includes("__MACOSX/") ||
      name.endsWith(".DS_Store")
    ) {
      continue;
    }
  }
  zip.extractAllTo(extractDir, true);
}

async function installExerciseFromZip(zipBuffer, { slug, overwrite = false }) {
  assertValidSlug(slug);
  await fsp.mkdir(EXERCISES_DIR, { recursive: true });
  const targetDir = path.join(EXERCISES_DIR, slug);
  const exists = fs.existsSync(targetDir);

  if (overwrite && !exists) {
    throw Object.assign(
      new Error(`Exercise "${slug}" does not exist to replace.`),
      { status: 400 },
    );
  }
  if (!overwrite && exists) {
    throw Object.assign(
      new Error(`Exercise "${slug}" already exists.`),
      { status: 409 },
    );
  }

  const tmpRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "solis-zip-"));
  const extractDir = path.join(tmpRoot, "extract");

  try {
    await fsp.mkdir(extractDir, { recursive: true });
    extractZipBuffer(zipBuffer, extractDir);
    const payloadRoot = findPayloadRoot(extractDir);

    if (overwrite) await emptyDir(targetDir);
    else await fsp.mkdir(targetDir, { recursive: true });

    await copyDir(payloadRoot, targetDir);

    if (!fs.existsSync(path.join(targetDir, "index.html"))) {
      throw Object.assign(
        new Error("Install failed: index.html missing after extract."),
        { status: 400 },
      );
    }

    return toExercise(slug);
  } finally {
    await fsp.rm(tmpRoot, { recursive: true, force: true });
  }
}

const FILE_ORDER = [
  "REVIEW.md",
  "REVIEW.vi.md",
  "BRIEF.md",
  "REQUIREMENTS.md",
  "index.html",
  "style.css",
  "script.js",
];

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

function listExerciseFiles(slug) {
  assertValidSlug(slug);
  const dir = path.join(EXERCISES_DIR, slug);
  if (!fs.existsSync(dir)) {
    throw Object.assign(new Error(`Exercise "${slug}" not found.`), { status: 404 });
  }

  const files = [];
  function walk(relative = "") {
    const abs = path.join(dir, relative);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "__MACOSX") continue;
      const relPath = relative ? `${relative}/${entry.name}` : entry.name;
      const full = path.join(dir, relPath);
      if (entry.isDirectory()) walk(relPath);
      else if (entry.isFile()) files.push(relPath);
    }
  }
  walk();
  return sortExerciseFiles(files);
}

app.get("/api/exercises", (_req, res) => {
  res.json(listExercises());
});

app.get("/api/exercises/:id/files", (req, res) => {
  try {
    const files = listExerciseFiles(req.params.id);
    res.json({ id: req.params.id, files });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Could not list files",
    });
  }
});

app.post("/api/exercises", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      const status = err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
        ? 413
        : 400;
      return res.status(status).json({ error: err.message });
    }

    try {
      if (!req.file?.buffer?.length) {
        return res.status(400).json({ error: "Choose a ZIP file." });
      }

      const overwrite =
        req.body.overwrite === "1" ||
        req.body.overwrite === "true" ||
        req.body.overwrite === true;
      const slug = resolveExerciseSlug(req.body.name, { overwrite });
      const exercise = await installExerciseFromZip(req.file.buffer, {
        slug,
        overwrite,
      });
      res.json({ ok: true, exercise, exercises: listExercises() });
    } catch (error) {
      const payload = {
        error: error.message || "Upload failed",
      };
      if (error.conflict) {
        payload.conflict = true;
        payload.existing = error.conflict.existing;
        payload.slug = error.conflict.slug;
      }
      res.status(error.status || 500).json(payload);
    }
  });
});

app.use(express.static(ROOT, { etag: false, maxAge: 0 }));

app.listen(PORT, HOST, () => {
  console.log(`SOLIS tests → http://${HOST}:${PORT}/`);
});
