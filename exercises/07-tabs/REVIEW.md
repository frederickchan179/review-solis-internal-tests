# Review - 07 Tabs

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | The API marks Sizing as default (`isDefault: true`), but `init` always calls `selectTab` with `activeIndex = 0` (Description). The first tab in the list opens, not the one the backend designated. REQUIREMENTS: the backend-designated default must open first. | After `fakeFetchTabs()`, set the initial index with `findIndex(t => t.isDefault)`.<br>Fall back to `0` only when no tab has `isDefault`. |
| Required | Cache | `contentCache` exists and is never read or written. Every tab visit refetches via `fakeFetchTabContent`. The 60s TTL in REQUIREMENTS is not implemented. Leaving an unused cache object suggests caching already works when it does not. | Store `{ content, fetchedAt }` per tab id and reuse within 60s.<br>Or delete the unused cache and implement the TTL properly. |
| Required | Keyboard | Tabs respond to clicks only; Left and Right arrows do nothing. Every tab stays in the Tab order (`tabIndex` never uses a roving pattern). Keyboard users cannot move between tabs the way a standard tab widget expects. REQUIREMENTS: standard tab-widget keyboard behavior with arrow keys. | Implement roving `tabindex` and Left/Right on the tablist.<br>Home/End is a nice-to-have / strong signal (Pass+). |
| Required | A11y wiring | The tablist and tabs use `role="tab"` and `aria-selected`, but the panel is a plain div: no `role="tabpanel"`, no ids, no `aria-controls` / `aria-labelledby`. Screen readers cannot reliably connect a tab to its panel. | Wire `role="tabpanel"`, stable ids, `aria-controls` on tabs, and `aria-labelledby` on the panel. |
| Required | Mobile | Tabs use equal `flex: 1`, `white-space: nowrap`, and the parent has `overflow: hidden`. On a narrow width, “Shipping & Returns” squishes or becomes unreachable. REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Allow horizontal scroll on the tab list.<br>Drop equal flex on small screens so labels stay readable. |
| Optional | Race | Fast tab hopping starts overlapping fetches with no request token. An older response can update the panel after a newer tab was selected (out of date content). Nice-to-have / strong signal (Pass+) for handling races cleanly. | Use a request id or `AbortController` and ignore out of date content responses. |
| Optional | Focus / JS | Re-rendering the whole tab list on every select steals focus from the active tab. Generated buttons lack `type="button"`. `"Loading..."` is plain text with no busy state for screen readers. Naming and null-checks are uneven. | Flip classes / `aria-selected` in place instead of full `innerHTML` rebuilds.<br>Set `type="button"` on generated tabs.<br>Expose loading as busy (`aria-busy`).<br>Keep `tabListEl` / `tabPanelEl` naming; null-check before use. |
| Optional | CSS | Inactive tab color `#6b7280` on white is about ~4.6:1 (borderline AA). There is no `:focus-visible`, so keyboard focus is hard to see. Property order is uneven between tab and panel rules. | Raise inactive contrast if needed.<br>Add `:focus-visible`.<br>Normalize property order. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | People see Description open and move on. The `isDefault` trap is easy to miss unless they read `fakeFetchTabs()` carefully. Someone who only clicks tabs can look “done” while ignoring the backend default. | BRIEF: look at `fakeFetchTabs()` → which tab should open first? |
| Required | TTL | Nobody waits a full minute in a ~40-minute exercise, so a 60s TTL is hard to prove in interviewing. Interviewers cannot fairly check cache reuse without a shorter window. | Add a test hook, or comment / set TTL = 5s in the harness for the exercise. |
| Required | Keyboard | “Standard keyboard” is fuzzy. Interviewers argue whether Enter/Space-only activation counts without arrow keys. Score calls then diverge. | Name required keys in REQUIREMENTS: Left/Right (Home/End optional). |
| Required | Mobile | “Narrow viewport” varies by laptop. Checks for Shipping & Returns are inconsistent across interviewers. | BRIEF: resize to 320px → can you reach and activate Shipping & Returns? |
