import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm";

const MANIFEST_URL = new URL("../exercises/manifest.json", import.meta.url);
const AGENTS_URL = new URL("../exercises/AGENTS.md", import.meta.url);
const REVIEWS_URL = new URL("../exercises/REVIEWS.md", import.meta.url);
const LIBRARY_HASH = "library";
const LIBRARY_TABS = {
  reviews: {
    label: "All Reviews",
    path: "exercises/REVIEWS.md",
    url: REVIEWS_URL,
  },
  agents: {
    label: "All Agents",
    path: "exercises/AGENTS.md",
    url: AGENTS_URL,
  },
};
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
  fileList: document.getElementById("file-list"),
  viewportTabs: document.getElementById("viewport-tabs"),
  viewportSize: document.getElementById("viewport-size"),
  splitter: document.getElementById("review-splitter"),
  openLibrary: document.getElementById("open-library"),
  openLibrarySide: document.getElementById("open-library-side"),
  fileBar: document.getElementById("file-bar"),
  libraryBar: document.getElementById("library-bar"),
  libraryTabs: document.getElementById("library-tabs"),
  libraryOpenTab: document.getElementById("library-open-tab"),
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

let exercises = [];
let currentId = null;
let currentFiles = [];
let currentFile = null;
let libraryTab = "reviews";
let viewport = normalizeViewport(localStorage.getItem(VIEWPORT_KEY));

function normalizeViewport(value) {
  return VIEWPORTS[value] ? value : "desktop";
}

function normalizeLibraryTab(value) {
  return LIBRARY_TABS[value] ? value : "reviews";
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "").trim();
  if (!raw) return { kind: "empty" };

  if (raw === "agents" || raw === "library/agents") {
    return { kind: "library", tab: "agents" };
  }
  if (raw === "reviews" || raw === "library" || raw === "library/reviews") {
    return { kind: "library", tab: "reviews" };
  }
  if (raw.startsWith("library/")) {
    return { kind: "library", tab: normalizeLibraryTab(raw.slice("library/".length)) };
  }

  return { kind: "exercise", id: raw };
}

function setExerciseHash(id) {
  const next = `#/${id}`;
  if (location.hash !== next) location.hash = next;
}

function setLibraryHash(tab) {
  const next = `#/${LIBRARY_HASH}/${normalizeLibraryTab(tab)}`;
  if (location.hash !== next) location.hash = next;
}

function fileExt(name) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

function isMarkdown(name) {
  return fileExt(name) === "md";
}

function exerciseUrl(exercise, fileName = "") {
  const base = new URL(exercise.path, document.baseURI);
  if (!fileName) return base;
  const parts = fileName.split("/").map(encodeURIComponent).join("/");
  return new URL(parts, base);
}

function decoratePriRows(root) {
  root.querySelectorAll("tbody tr").forEach((tr) => {
    const pri = tr.querySelector("td")?.textContent?.trim();
    if (pri === "Required") tr.classList.add("pri-required");
    if (pri === "Optional") tr.classList.add("pri-optional");
  });
}

function enhanceCopyableCodeBlocks(root) {
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.closest(".code-block-wrap")) return;

    const wrap = document.createElement("div");
    wrap.className = "code-block-wrap";
    pre.replaceWith(wrap);
    wrap.appendChild(pre);
    if (!pre.classList.contains("code-block")) pre.classList.add("code-block");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-code-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code block");
    wrap.appendChild(btn);

    btn.addEventListener("click", async () => {
      const code = pre.querySelector("code") || pre;
      const text = code.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        window.setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("is-copied");
        }, 1600);
      } catch (err) {
        btn.textContent = "Failed";
        console.error(err);
        window.setTimeout(() => {
          btn.textContent = "Copy";
        }, 1600);
      }
    });
  });
}

function cellPlainText(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || "").trim();
}

/** Turn <br>-split Issue/Suggestion cells into spaced stacks or real lists. */
function formatReviewTableCells(root) {
  root.querySelectorAll("tbody td").forEach((td) => {
    if (td.cellIndex < 2) return;
    const raw = td.innerHTML;
    if (!/<br\s*\/?>/i.test(raw)) return;

    const parts = raw
      .split(/<br\s*\/?>/i)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length < 2) return;

    const plainParts = parts.map(cellPlainText);
    const allBullets = plainParts.every((text) => /^[-•*]\s+/.test(text));

    if (allBullets) {
      const ul = document.createElement("ul");
      ul.className = "cell-list";
      parts.forEach((part, index) => {
        const li = document.createElement("li");
        li.innerHTML = part.replace(/^\s*[-•*]\s+/, "");
        if (!cellPlainText(li.innerHTML) && plainParts[index]) {
          li.textContent = plainParts[index].replace(/^[-•*]\s+/, "");
        }
        ul.appendChild(li);
      });
      td.replaceChildren(ul);
      return;
    }

    const stack = document.createElement("div");
    stack.className = "cell-stack";
    parts.forEach((part) => {
      const line = document.createElement("div");
      line.className = "cell-line";
      line.innerHTML = part;
      stack.appendChild(line);
    });
    td.replaceChildren(stack);
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

function loadExerciseFiles(exercise) {
  currentFiles = Array.isArray(exercise.files) ? [...exercise.files] : [];
  currentFile = currentFiles[0] || null;
  renderFileList();
}

async function loadFileContent(exercise, fileName) {
  if (!fileName) {
    els.sourceBody.className = "source-body empty";
    els.sourceBody.textContent = "This exercise has no files yet.";
    return;
  }

  currentFile = fileName;
  renderFileList();
  els.sourceBody.className = "source-body loading";
  els.sourceBody.textContent = "Loading…";

  const url = exerciseUrl(exercise, fileName);
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();

    if (isMarkdown(fileName)) {
      els.sourceBody.className = "source-body md";
      els.sourceBody.innerHTML = marked.parse(text);
      if (/^REVIEW\.md$/i.test(fileName.split("/").pop())) {
        decoratePriRows(els.sourceBody);
        formatReviewTableCells(els.sourceBody);
      }
      enhanceCopyableCodeBlocks(els.sourceBody);
      return;
    }

    const ext = fileExt(fileName);
    const lang = LANG_BY_EXT[ext] || "plaintext";
    const highlighted = hljs.highlight(text, { language: lang }).value;
    els.sourceBody.className = "source-body code-view";
    els.sourceBody.innerHTML = `<pre class="code-block"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    enhanceCopyableCodeBlocks(els.sourceBody);
  } catch (err) {
    els.sourceBody.className = "source-body error";
    els.sourceBody.textContent = `Could not open ${fileName}.`;
    console.error(err);
  }
}

async function loadSourcePanel(exercise) {
  try {
    loadExerciseFiles(exercise);
    await loadFileContent(exercise, currentFile);
  } catch (err) {
    els.fileList.innerHTML = "";
    els.sourceBody.className = "source-body error";
    els.sourceBody.textContent = "Could not load files for this exercise.";
    console.error(err);
  }
}

function clearNavCurrent() {
  els.nav.querySelectorAll("a").forEach((a) => {
    a.setAttribute("aria-current", "false");
  });
}

function markLibraryNav(active) {
  [els.openLibrary, els.openLibrarySide].forEach((link) => {
    if (!link) return;
    link.setAttribute("aria-current", active ? "page" : "false");
  });
}

function syncLibraryTabs() {
  if (!els.libraryTabs) return;
  els.libraryTabs.querySelectorAll("button[data-library]").forEach((btn) => {
    btn.setAttribute(
      "aria-selected",
      btn.dataset.library === libraryTab ? "true" : "false",
    );
  });
}

function enterLibraryMode() {
  els.app.classList.add("library-mode");
  if (els.fileBar) els.fileBar.hidden = true;
  if (els.libraryBar) els.libraryBar.hidden = false;
}

function exitLibraryMode() {
  els.app.classList.remove("library-mode");
  if (els.fileBar) els.fileBar.hidden = false;
  if (els.libraryBar) els.libraryBar.hidden = true;
  markLibraryNav(false);
}

async function loadLibraryDocument(tab) {
  const meta = LIBRARY_TABS[normalizeLibraryTab(tab)];
  els.stageTitle.textContent = meta.label;
  els.stagePath.textContent = meta.path;
  els.openTab.href = meta.url.href;
  if (els.libraryOpenTab) els.libraryOpenTab.href = meta.url.href;
  els.frame.removeAttribute("src");
  els.fileList.innerHTML = "";
  els.sourceBody.className = "source-body loading";
  els.sourceBody.textContent = "Loading…";

  try {
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status}`);
    const text = await res.text();
    els.sourceBody.className = "source-body md";
    els.sourceBody.innerHTML = marked.parse(text);
    if (tab === "reviews") {
      decoratePriRows(els.sourceBody);
      formatReviewTableCells(els.sourceBody);
    }
    enhanceCopyableCodeBlocks(els.sourceBody);
  } catch (err) {
    els.sourceBody.className = "source-body error";
    els.sourceBody.textContent = `Could not open ${meta.path}.`;
    console.error(err);
  }
}

async function openLibrary({ tab = "reviews", pushHash = true } = {}) {
  libraryTab = normalizeLibraryTab(tab);
  currentId = `${LIBRARY_HASH}/${libraryTab}`;
  currentFiles = [];
  currentFile = null;
  if (pushHash) setLibraryHash(libraryTab);

  clearNavCurrent();
  markLibraryNav(true);
  enterLibraryMode();
  syncLibraryTabs();
  await loadLibraryDocument(libraryTab);
}

function selectExercise(id, { pushHash = true } = {}) {
  const exercise = exercises.find((item) => item.id === id) || exercises[0];
  if (!exercise) return;

  currentId = exercise.id;
  if (pushHash) setExerciseHash(exercise.id);

  exitLibraryMode();

  els.nav.querySelectorAll("a").forEach((a) => {
    a.setAttribute(
      "aria-current",
      a.dataset.id === exercise.id ? "page" : "false",
    );
  });

  const href = exerciseUrl(exercise).href;
  els.stageTitle.textContent = `${exercise.num} ${exercise.name}`;
  els.stagePath.textContent = exercise.path;
  els.openTab.href = href;
  els.frame.src = `${href}?t=${Date.now()}`;

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
  const res = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load exercises (${res.status})`);
  const data = await res.json();
  exercises = Array.isArray(data.exercises) ? data.exercises : [];
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

els.viewportTabs.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-viewport]");
  if (!btn) return;
  setViewport(btn.dataset.viewport);
});

els.libraryTabs?.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-library]");
  if (!btn) return;
  void openLibrary({ tab: btn.dataset.library });
});

window.addEventListener("hashchange", () => {
  const route = parseHash();
  if (route.kind === "library") {
    const nextId = `${LIBRARY_HASH}/${route.tab}`;
    if (nextId === currentId) return;
    void openLibrary({ tab: route.tab, pushHash: false });
    return;
  }
  if (route.kind === "exercise" && route.id !== currentId) {
    selectExercise(route.id, { pushHash: false });
  }
});

async function boot() {
  syncViewportTabs();
  setupReviewResize();
  setupNavClicks();
  setupFileList();
  await refreshExercises();

  const route = parseHash();
  if (route.kind === "library") {
    await openLibrary({ tab: route.tab, pushHash: false });
    return;
  }

  const start =
    (route.kind === "exercise" &&
      exercises.find((item) => item.id === route.id)?.id) ||
    exercises[0]?.id;
  if (start) selectExercise(start, { pushHash: route.kind === "empty" });
}

boot().catch((err) => {
  els.sourceBody.className = "source-body error";
  els.sourceBody.textContent = "Could not load the hub. Refresh and try again.";
  console.error(err);
});
