# Agent prompts - 07 Tabs

Copy one block into an AI / agent / LLM. Point it at `exercises/07-tabs/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 07 Tabs (`exercises/07-tabs/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | The API marks Sizing as default (`isDefault: true`), but `init` always calls `selectTab` with `activeIndex = 0` (Description).<br>The first tab in the list opens, not the one the backend designated.<br>REQUIREMENTS: the backend-designated default must open first. | After `fakeFetchTabs()`, set the initial index with `findIndex(t => t.isDefault)`.<br>Fall back to `0` only when no tab has `isDefault`. |
| Required | Cache | `contentCache` exists and is never read or written.<br>Every tab visit refetches via `fakeFetchTabContent`.<br>The 60s TTL in REQUIREMENTS is not implemented.<br>Leaving an unused cache object suggests caching already works when it does not. | Store `{ content, fetchedAt }` per tab id and reuse within 60s.<br>Or delete the unused cache and implement the TTL properly. |
| Required | Keyboard | Tabs respond to clicks only; Left and Right arrows do nothing.<br>Every tab stays in the Tab order (`tabIndex` never uses a roving pattern).<br>REQUIREMENTS: standard tab-widget keyboard behavior with arrow keys. | Implement roving `tabindex` and Left/Right on the tablist.<br>Home/End is nice-to-have / strong signal (Pass+). |
| Required | Mobile | Tabs use `flex: 1` with `white-space: nowrap`, so the default `min-width: auto` stops labels from shrinking below their text width; nothing actually squishes.<br>The 4 tabs need about 347px total width, so at 320px and 375px the row overflows and `.tabs`'s `overflow: hidden` clips the excess on the right.<br>Live check at 320px and 375px (`getBoundingClientRect`, screenshot): "Reviews", the last tab, is fully clipped out of view and clicking its former on-screen spot does not change the panel. "Shipping & Returns" stays fully visible at both widths.<br>REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Give `.tabs__list` `overflow-x: auto` (plus `-webkit-overflow-scrolling: touch`) so every tab, including the last one, can be reached by scrolling.<br>Or drop the equal `flex: 1` on small screens and let tabs size to content instead of overflowing silently. |
| Optional | A11y wiring | Tablist/tabs exist, but the panel is a plain div: no `tabpanel`, no ids, no `aria-controls` / `aria-labelledby`.<br>Not named in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Wire `tabpanel` + ids + `aria-controls` / `aria-labelledby`. |
| Optional | Race | Fast tab hopping starts overlapping fetches with no request token.<br>An older response can update the panel after a newer tab was selected. | Use a request id or `AbortController` and ignore out of date content. |
| Optional | Focus / JS | Re-rendering the whole tab list steals focus from the active tab.<br>Generated buttons need `type="button"`. `"Loading..."` is not exposed as busy. | Flip classes / `aria-selected` in place instead of rebuilding the list.<br>Set `type="button"`; expose loading with `aria-busy`. |
| Optional | CSS | Inactive `#6b7280` on white is about ~4.6:1 (borderline AA).<br>No `:focus-visible`. | Raise inactive contrast if needed.<br>Add `:focus-visible`. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 07 Tabs (`exercises/07-tabs/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | BRIEF task 1 already says: check which tab opens, then look at what `fakeFetchTabs()` returns.<br>People still see Description and move on, so the `isDefault` trap is easy to skip in a live interview. | Keep BRIEF task 1; add a score checklist line: Fail if the first paint ignores `isDefault: true`. |
| Required | TTL | Nobody waits a full minute in a ~40-minute exercise, so a 60s TTL is hard to prove.<br>Interviewers cannot fairly check cache reuse without a shorter window. | Add a test hook, or comment / set TTL = 5s in the harness for the exercise. |
| Required | Keyboard | REQUIREMENTS already require arrow keys to move between tabs.<br>Interviewers still argue Enter/Space-only "activation" vs real Left/Right movement, and whether Home/End counts. | Under the existing arrow-keys rule, name Left/Right as required.<br>Mark Home/End as nice-to-have / strong signal (Pass+). |
| Required | Mobile | "Narrow viewport" varies by laptop, and REQUIREMENTS just says "remain usable" without naming which tab breaks, so interviewers watch for the wrong symptom.<br>At realistic mobile widths (320px-375px) the tabs do not squish; `white-space: nowrap` blocks that. Instead the last tab, "Reviews", gets clipped out of view by `.tabs`'s `overflow: hidden` and becomes unclickable, while "Shipping & Returns" stays fully visible. | BRIEF: resize to 320px and confirm all four tabs, including "Reviews" at the end of the row, stay visible and clickable, not just readable. |
```

