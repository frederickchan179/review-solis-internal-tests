# Review - 07 Tabs

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | The API marks Sizing as default (`isDefault: true`), but `init` always calls `selectTab` with `activeIndex = 0` (Description). REQUIREMENTS: the backend-designated default must open first, not simply the first tab in the list. | After `fakeFetchTabs()`, set the initial index with `findIndex(t => t.isDefault)` (fallback to 0 only if none). |
| Required | Cache | `contentCache` exists and is never read or written. Every tab visit refetches via `fakeFetchTabContent`. The 60s TTL in REQUIREMENTS is not implemented. A dead cache object is Speculative Generality that misleads readers. | Store `{ content, fetchedAt }` per tab id and reuse within 60s, or delete the unused cache and implement TTL properly. |
| Required | Keyboard | Tabs respond to clicks only; Left/Right arrows do nothing. Every tab stays in the tab order (`tabIndex` never set to a roving pattern). REQUIREMENTS: standard tab-widget keyboard behavior with arrow keys. | Implement roving `tabindex` and Left/Right on the tablist (Home/End nice-to-have). |
| Required | A11y wiring | The tablist/tabs use `role="tab"` / `aria-selected`, but the panel is a plain div: no `role="tabpanel"`, no ids, no `aria-controls` / `aria-labelledby`. AT cannot reliably associate tab and panel. | Wire `role="tabpanel"`, stable ids, `aria-controls` on tabs, and `aria-labelledby` on the panel. |
| Required | Mobile | Tabs use equal `flex: 1`, `white-space: nowrap`, and the parent has `overflow: hidden`. “Shipping & Returns” squishes or becomes unreachable on narrow widths. REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Allow horizontal scroll on the tab list, and drop equal flex on small screens so labels stay readable. |
| Optional | Race | Fast tab hopping starts overlapping fetches with no request token. An older response can paint into the panel after a newer tab was selected. | Use a request id or `AbortController` and ignore stale content responses. |
| Optional | Focus / JS | Re-rendering the whole tab list on every select steals focus from the active tab. Generated buttons lack `type="button"`. `"Loading..."` is plain text with no busy exposure to AT. Naming / null-checks are uneven. | Flip classes / `aria-selected` in place instead of full innerHTML rebuilds.<br>Set `type="button"` on generated tabs.<br>Expose loading as busy to AT (`aria-busy`).<br>Keep `tabListEl` / `tabPanelEl` naming; null-check before use. |
| Optional | CSS | Inactive tab color `#6b7280` on white is about ~4.6:1 (borderline AA). There is no `:focus-visible`. Property order is uneven between tab and panel rules. | Raise inactive contrast if needed.<br>Add `:focus-visible`.<br>Normalize property order. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | People see Description open and move on. The `isDefault` trap is easy to miss unless they read `fakeFetchTabs()` carefully. | BRIEF: look at `fakeFetchTabs()` → which tab should open first? |
| Required | TTL | Nobody waits a full minute in a 40-minute exercise, so a 60s TTL is hard to prove in grading. | Add a test hook, or comment / set TTL = 5s in the harness for the exercise. |
| Required | Keyboard | “Standard keyboard” is fuzzy. Graders argue whether Enter/Space-only activation counts without arrows. | Name required keys in REQUIREMENTS: Left/Right (Home/End optional). |
| Required | Mobile | “Narrow viewport” varies by laptop. Shipping & Returns checks are inconsistent across graders. | BRIEF: resize to 320px → can you reach and activate Shipping & Returns? |
