import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm";

const EXERCISES_URL = "/hub/exercises.json";
const LANG_KEY = "solis-review-lang";
const VIEWPORT_KEY = "solis-review-viewport";
const REVIEW_W_KEY = "solis-review-width";
const REVIEW_W_DEFAULT = 352;
const REVIEW_W_MIN = 240;
const REVIEW_W_MAX = 720;

const VIEWPORTS = {
  mobile: { label: "390px" },
  tablet: { label: "768px" },
  desktop: { label: "Fluid" },
};

const els = {
  app: document.querySelector(".app"),
  nav: document.getElementById("nav"),
  frame: document.getElementById("fixture"),
  frameWrap: document.getElementById("frame-wrap"),
  stageTitle: document.getElementById("stage-title"),
  stagePath: document.getElementById("stage-path"),
  openTab: document.getElementById("open-tab"),
  reviewBody: document.getElementById("review-body"),
  langTabs: document.getElementById("lang-tabs"),
  viewportTabs: document.getElementById("viewport-tabs"),
  viewportSize: document.getElementById("viewport-size"),
  splitter: document.getElementById("review-splitter"),
};

marked.setOptions({
  gfm: true,
  breaks: false,
});

let exercises = [];
let currentId = null;
let lang = localStorage.getItem(LANG_KEY) === "vi" ? "vi" : "en";
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

function reviewFile(exercise, language) {
  return language === "vi"
    ? `${exercise.path}REVIEW.vi.md`
    : `${exercise.path}REVIEW.md`;
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
  const maxByViewport = Math.floor(window.innerWidth * 0.62);
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

async function loadReview(exercise) {
  els.reviewBody.className = "review-body loading";
  els.reviewBody.textContent = "Loading review…";

  const url = reviewFile(exercise, lang);
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const md = await res.text();
    els.reviewBody.className = "review-body md";
    els.reviewBody.innerHTML = marked.parse(md);
    decoratePriRows(els.reviewBody);
  } catch (err) {
    els.reviewBody.className = "review-body error";
    els.reviewBody.textContent = `Could not load ${url}`;
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
  els.frame.src = exercise.path;

  void loadReview(exercise);
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

  els.nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-id]");
    if (!link) return;
    event.preventDefault();
    selectExercise(link.dataset.id);
  });
}

function syncLangTabs() {
  els.langTabs.querySelectorAll("button").forEach((btn) => {
    btn.setAttribute(
      "aria-selected",
      btn.dataset.lang === lang ? "true" : "false",
    );
  });
}

els.langTabs.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-lang]");
  if (!btn) return;
  lang = btn.dataset.lang;
  localStorage.setItem(LANG_KEY, lang);
  syncLangTabs();
  const exercise = exercises.find((item) => item.id === currentId);
  if (exercise) void loadReview(exercise);
});

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
  syncLangTabs();
  syncViewportTabs();
  setupReviewResize();
  const res = await fetch(EXERCISES_URL, { cache: "no-store" });
  exercises = await res.json();
  renderNav();

  const fromHash = parseHash();
  const start =
    exercises.find((item) => item.id === fromHash)?.id || exercises[0]?.id;
  if (start) selectExercise(start, { pushHash: !fromHash });
}

boot().catch((err) => {
  els.reviewBody.className = "review-body error";
  els.reviewBody.textContent = "Failed to boot hub.";
  console.error(err);
});
