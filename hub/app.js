import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm";

const EXERCISES_URL = "/api/exercises";
const VIEWPORT_KEY = "solis-review-viewport";
const REVIEW_W_KEY = "solis-review-width";
const REVIEW_W_DEFAULT = 420;
const REVIEW_W_MIN = 280;
const REVIEW_W_MAX = 1400;

const VIEWPORTS = {
  mobile: { label: "390px" },
  tablet: { label: "768px" },
  desktop: { label: "Fluid" },
};

const LANG_BY_EXT = {
  html: "html",
  htm: "html",
  css: "css",
  js: "javascript",
  mjs: "javascript",
  json: "json",
  md: "markdown",
};

const els = {
  app: document.querySelector(".app"),
  nav: document.getElementById("nav"),
  frame: document.getElementById("fixture"),
  frameWrap: document.getElementById("frame-wrap"),
  stageTitle: document.getElementById("stage-title"),
  stagePath: document.getElementById("stage-path"),
  openTab: document.getElementById("open-tab"),
  sourceBody: document.getElementById("source-body"),
  sourceFileName: document.getElementById("source-file-name"),
  fileList: document.getElementById("file-list"),
  viewportTabs: document.getElementById("viewport-tabs"),
  viewportSize: document.getElementById("viewport-size"),
  splitter: document.getElementById("review-splitter"),
  openUpload: document.getElementById("open-upload"),
  uploadDialog: document.getElementById("upload-dialog"),
  uploadForm: document.getElementById("upload-form"),
  uploadFile: document.getElementById("upload-file"),
  uploadName: document.getElementById("upload-name"),
  uploadSlugPreview: document.getElementById("upload-slug-preview"),
  uploadSubmit: document.getElementById("upload-submit"),
  uploadCancel: document.getElementById("upload-cancel"),
  uploadClose: document.getElementById("upload-close"),
  uploadStatus: document.getElementById("upload-status"),
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

let exercises = [];
let currentId = null;
let currentFiles = [];
let currentFile = null;
let viewport = normalizeViewport(localStorage.getItem(VIEWPORT_KEY));

function normalizeViewport(value) {
  return VIEWPORTS[value] ? value : "desktop";
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "").trim();
  return raw || null;
}

function setHash(id) {
  const next = `#/${id}`;
  if (location.hash !== next) location.hash = next;
}

function fileExt(name) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

function isMarkdown(name) {
  return fileExt(name) === "md";
}

function decoratePriRows(root) {
  root.querySelectorAll("tbody tr").forEach((tr) => {
    const pri = tr.querySelector("td")?.textContent?.trim();
    if (pri === "Required") tr.classList.add("pri-required");
    if (pri === "Optional") tr.classList.add("pri-optional");
  });
}

function syncViewportTabs() {
  els.viewportTabs.querySelectorAll("button").forEach((btn) => {
    btn.setAttribute(
      "aria-selected",
      btn.dataset.viewport === viewport ? "true" : "false",
    );
  });
  els.frameWrap.dataset.viewport = viewport;
  els.viewportSize.textContent = VIEWPORTS[viewport].label;
}

function setViewport(next) {
  viewport = normalizeViewport(next);
  localStorage.setItem(VIEWPORT_KEY, viewport);
  syncViewportTabs();
}

function clampReviewWidth(px) {
  const maxByViewport = Math.floor(window.innerWidth * 0.8);
  const max = Math.max(REVIEW_W_MIN, Math.min(REVIEW_W_MAX, maxByViewport));
  return Math.round(Math.min(max, Math.max(REVIEW_W_MIN, px)));
}

function applyReviewWidth(px, { persist = true } = {}) {
  const width = clampReviewWidth(px);
  document.documentElement.style.setProperty("--review-w", `${width}px`);
  els.splitter.setAttribute("aria-valuenow", String(width));
  if (persist) localStorage.setItem(REVIEW_W_KEY, String(width));
  return width;
}

function readStoredReviewWidth() {
  const raw = Number(localStorage.getItem(REVIEW_W_KEY));
  return Number.isFinite(raw) && raw > 0 ? raw : REVIEW_W_DEFAULT;
}

function setupReviewResize() {
  els.splitter.setAttribute("aria-valuemin", String(REVIEW_W_MIN));
  els.splitter.setAttribute("aria-valuemax", String(REVIEW_W_MAX));
  applyReviewWidth(readStoredReviewWidth());

  let drag = null;

  const onPointerMove = (event) => {
    if (!drag) return;
    const delta = drag.startX - event.clientX;
    applyReviewWidth(drag.startWidth + delta, { persist: false });
  };

  const endDrag = (event) => {
    if (!drag) return;
    const width = clampReviewWidth(
      drag.startWidth + (drag.startX - event.clientX),
    );
    applyReviewWidth(width);
    drag = null;
    els.app.classList.remove("is-resizing");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
  };

  els.splitter.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const current = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--review-w"),
    );
    drag = {
      startX: event.clientX,
      startWidth: Number.isFinite(current) ? current : REVIEW_W_DEFAULT,
    };
    els.app.classList.add("is-resizing");
    els.splitter.setPointerCapture?.(event.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  });

  els.splitter.addEventListener("dblclick", () => {
    applyReviewWidth(REVIEW_W_DEFAULT);
  });

  els.splitter.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 40 : 16;
    const current = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--review-w"),
    );
    const base = Number.isFinite(current) ? current : REVIEW_W_DEFAULT;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      applyReviewWidth(base + step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      applyReviewWidth(base - step);
    } else if (event.key === "Home") {
      event.preventDefault();
      applyReviewWidth(REVIEW_W_MAX);
    } else if (event.key === "End") {
      event.preventDefault();
      applyReviewWidth(REVIEW_W_MIN);
    }
  });

  window.addEventListener("resize", () => {
    const current = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--review-w"),
    );
    if (Number.isFinite(current)) applyReviewWidth(current);
  });
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
  const nums = exercises
    .map((item) => Number.parseInt(item.num, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

function previewUploadSlug(name) {
  const base = handleizeName(name);
  if (!base) {
    els.uploadSlugPreview.textContent = "";
    els.uploadSlugPreview.classList.remove("is-conflict");
    return null;
  }

  const existing = exercises.find((item) => baseSlug(item.id) === base);
  if (existing) {
    els.uploadSlugPreview.textContent = `Folder: ${existing.id} (already exists)`;
    els.uploadSlugPreview.classList.add("is-conflict");
    return existing.id;
  }

  const slug = `${String(nextExerciseNum()).padStart(2, "0")}-${base}`;
  els.uploadSlugPreview.textContent = `Folder: ${slug}`;
  els.uploadSlugPreview.classList.remove("is-conflict");
  return slug;
}

function suggestNameFromFile(file) {
  if (!file?.name) return "";
  return file.name
    .replace(/\.zip$/i, "")
    .replace(/^\d+[\s._-]*/, "")
    .trim();
}

function setUploadStatus(message, kind = "") {
  els.uploadStatus.textContent = message;
  els.uploadStatus.className = `upload-status${kind ? ` is-${kind}` : ""}`;
}

function renderFileList() {
  els.fileList.innerHTML = currentFiles
    .map(
      (name) => `
      <li>
        <button
          type="button"
          role="tab"
          data-file="${name}"
          aria-selected="${name === currentFile ? "true" : "false"}"
        >${name}</button>
      </li>`,
    )
    .join("");
}

async function loadExerciseFiles(exercise) {
  const res = await fetch(`${EXERCISES_URL}/${exercise.id}/files`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Could not load files (${res.status})`);
  const data = await res.json();
  currentFiles = data.files || [];
  currentFile = currentFiles[0] || null;
  renderFileList();
}

async function loadFileContent(exercise, fileName) {
  if (!fileName) {
    els.sourceFileName.textContent = "";
    els.sourceBody.className = "source-body empty";
    els.sourceBody.textContent = "This exercise has no files yet.";
    return;
  }

  currentFile = fileName;
  els.sourceFileName.textContent = fileName;
  renderFileList();
  els.sourceBody.className = "source-body loading";
  els.sourceBody.textContent = "Loading…";

  const url = `${exercise.path}${fileName.split("/").map(encodeURIComponent).join("/")}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();

    if (isMarkdown(fileName)) {
      els.sourceBody.className = "source-body md";
      els.sourceBody.innerHTML = marked.parse(text);
      if (/^REVIEW(\.vi)?\.md$/i.test(fileName.split("/").pop())) {
        decoratePriRows(els.sourceBody);
      }
      return;
    }

    const ext = fileExt(fileName);
    const lang = LANG_BY_EXT[ext] || "plaintext";
    const highlighted = hljs.highlight(text, { language: lang }).value;
    els.sourceBody.className = "source-body code-view";
    els.sourceBody.innerHTML = `<pre class="code-block"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
  } catch (err) {
    els.sourceBody.className = "source-body error";
    els.sourceBody.textContent = `Could not open ${fileName}.`;
    console.error(err);
  }
}

async function loadSourcePanel(exercise) {
  try {
    await loadExerciseFiles(exercise);
    await loadFileContent(exercise, currentFile);
  } catch (err) {
    els.sourceFileName.textContent = "";
    els.fileList.innerHTML = "";
    els.sourceBody.className = "source-body error";
    els.sourceBody.textContent = "Could not load files for this exercise.";
    console.error(err);
  }
}

function selectExercise(id, { pushHash = true } = {}) {
  const exercise = exercises.find((item) => item.id === id) || exercises[0];
  if (!exercise) return;

  currentId = exercise.id;
  if (pushHash) setHash(exercise.id);

  els.nav.querySelectorAll("a").forEach((a) => {
    a.setAttribute(
      "aria-current",
      a.dataset.id === exercise.id ? "page" : "false",
    );
  });

  els.stageTitle.textContent = `${exercise.num} ${exercise.name}`;
  els.stagePath.textContent = exercise.path;
  els.openTab.href = exercise.path;
  els.frame.src = `${exercise.path}?t=${Date.now()}`;

  void loadSourcePanel(exercise);
}

function renderNav() {
  els.nav.innerHTML = exercises
    .map(
      (item) => `
      <li>
        <a href="#/${item.id}" data-id="${item.id}">
          <span class="num">${item.num}</span>
          <span class="name">${item.name}</span>
        </a>
      </li>`,
    )
    .join("");
}

async function refreshExercises() {
  const res = await fetch(EXERCISES_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load exercises (${res.status})`);
  exercises = await res.json();
  renderNav();
}

function setupNavClicks() {
  els.nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-id]");
    if (!link) return;
    event.preventDefault();
    selectExercise(link.dataset.id);
  });
}

function setupFileList() {
  els.fileList.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-file]");
    if (!btn) return;
    const exercise = exercises.find((item) => item.id === currentId);
    if (!exercise) return;
    void loadFileContent(exercise, btn.dataset.file);
  });
}

function openUploadDialog() {
  els.uploadForm.reset();
  setUploadStatus("");
  previewUploadSlug("");
  els.uploadDialog.showModal();
  queueMicrotask(() => els.uploadName.focus());
}

function closeUploadDialog() {
  if (els.uploadDialog.open) els.uploadDialog.close();
}

async function postExerciseUpload(file, name, { overwrite = false } = {}) {
  const body = new FormData();
  body.set("name", name);
  if (overwrite) body.set("overwrite", "1");
  body.set("file", file, file.name);

  const res = await fetch(EXERCISES_URL, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

function setupUpload() {
  els.openUpload.addEventListener("click", openUploadDialog);
  els.uploadCancel.addEventListener("click", closeUploadDialog);
  els.uploadClose.addEventListener("click", closeUploadDialog);

  els.uploadDialog.addEventListener("click", (event) => {
    if (event.target === els.uploadDialog) closeUploadDialog();
  });

  els.uploadDialog.addEventListener("close", () => {
    els.uploadForm.reset();
    setUploadStatus("");
    previewUploadSlug("");
    els.openUpload.focus();
  });

  els.uploadName.addEventListener("input", () => {
    previewUploadSlug(els.uploadName.value);
  });

  els.uploadForm.addEventListener("change", (event) => {
    if (event.target === els.uploadFile && !els.uploadName.value.trim()) {
      const suggested = suggestNameFromFile(els.uploadFile.files?.[0]);
      if (suggested) {
        els.uploadName.value = suggested;
        previewUploadSlug(suggested);
      }
    }
  });

  els.uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = els.uploadFile.files?.[0];
    if (!file) {
      setUploadStatus("Please choose a ZIP file first.", "error");
      return;
    }

    const name = els.uploadName.value.trim();
    if (!name) {
      setUploadStatus("Give this exercise a name.", "error");
      return;
    }
    if (!handleizeName(name)) {
      setUploadStatus("Use a simple name: letters and numbers.", "error");
      return;
    }

    els.uploadSubmit.disabled = true;
    setUploadStatus("Uploading…");

    try {
      let { res, data } = await postExerciseUpload(file, name);

      if (res.status === 409 && data.conflict && data.slug) {
        const ok = window.confirm(
          `"${data.slug}" already exists.\n\nReplace it with this ZIP?`,
        );
        if (!ok) {
          setUploadStatus("Upload cancelled. That name is already in use.", "error");
          return;
        }
        setUploadStatus("Replacing…");
        ({ res, data } = await postExerciseUpload(file, name, { overwrite: true }));
      }

      if (!res.ok) {
        throw new Error(friendlyUploadError(data.error) || "Upload failed.");
      }

      exercises = data.exercises || [];
      renderNav();
      closeUploadDialog();
      selectExercise(data.exercise.id);
    } catch (err) {
      setUploadStatus(err.message || "Upload failed. Please try again.", "error");
    } finally {
      els.uploadSubmit.disabled = false;
    }
  });
}

function friendlyUploadError(message) {
  if (!message) return "";
  const text = String(message);
  if (/already exists/i.test(text)) {
    return "That name is already used. Pick another name.";
  }
  if (/does not exist/i.test(text)) {
    return "That exercise is not in the list anymore. Refresh and try again.";
  }
  if (/index\.html/i.test(text)) {
    return "This ZIP needs an index.html inside (at the top level or in one folder).";
  }
  if (/only \.zip/i.test(text) || /zip files are allowed/i.test(text)) {
    return "Please upload a .zip file.";
  }
  if (/required/i.test(text) && /name/i.test(text)) {
    return "Give this exercise a name.";
  }
  if (/simple name|letters, numbers|hyphens/i.test(text)) {
    return "Use a simple name: letters, numbers, and hyphens only.";
  }
  if (/exceeds|LIMIT_FILE_SIZE|too large/i.test(text)) {
    return "That ZIP is too large. Try a smaller file.";
  }
  return text;
}

els.viewportTabs.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-viewport]");
  if (!btn) return;
  setViewport(btn.dataset.viewport);
});

window.addEventListener("hashchange", () => {
  const id = parseHash();
  if (id && id !== currentId) selectExercise(id, { pushHash: false });
});

async function boot() {
  syncViewportTabs();
  setupReviewResize();
  setupNavClicks();
  setupFileList();
  setupUpload();
  await refreshExercises();

  const fromHash = parseHash();
  const start =
    exercises.find((item) => item.id === fromHash)?.id || exercises[0]?.id;
  if (start) selectExercise(start, { pushHash: !fromHash });
}

boot().catch((err) => {
  els.sourceBody.className = "source-body error";
  els.sourceBody.textContent = "Could not load the hub. Refresh and try again.";
  console.error(err);
});
