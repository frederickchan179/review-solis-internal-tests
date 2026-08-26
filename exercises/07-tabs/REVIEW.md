# Review - 07 Tabs

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | The API marks Sizing as default (`isDefault: true`), but `init` always calls `selectTab` with `activeIndex = 0` (Description).<br>The first tab in the list opens, not the one the backend designated.<br>REQUIREMENTS: the backend-designated default must open first. | After `fakeFetchTabs()`, set the initial index with `findIndex(t => t.isDefault)`.<br>Fall back to `0` only when no tab has `isDefault`. |
| Required | Cache | `contentCache` exists and is never read or written.<br>Every tab visit refetches via `fakeFetchTabContent`.<br>The 60s TTL in REQUIREMENTS is not implemented.<br>Leaving an unused cache object suggests caching already works when it does not. | Store `{ content, fetchedAt }` per tab id and reuse within 60s.<br>Or delete the unused cache and implement the TTL properly. |
| Required | Keyboard | Tabs respond to clicks only; Left and Right arrows do nothing.<br>Every tab stays in the Tab order (`tabIndex` never uses a roving pattern).<br>REQUIREMENTS: standard tab-widget keyboard behavior with arrow keys. | Implement roving `tabindex` and Left/Right on the tablist.<br>Home/End is nice-to-have / strong signal (Pass+). |
| Required | Mobile | Tabs use equal `flex: 1`, `white-space: nowrap`, and the parent has `overflow: hidden`.<br>On a narrow width, "Shipping & Returns" squishes or becomes unreachable.<br>REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Allow horizontal scroll on the tab list.<br>Drop equal flex on small screens so labels stay readable. |
| Optional | A11y wiring | Tablist/tabs exist, but the panel is a plain div: no `tabpanel`, no ids, no `aria-controls` / `aria-labelledby`.<br>Not named in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Wire `tabpanel` + ids + `aria-controls` / `aria-labelledby`. |
| Optional | Race | Fast tab hopping starts overlapping fetches with no request token.<br>An older response can update the panel after a newer tab was selected. | Use a request id or `AbortController` and ignore out of date content. |
| Optional | Focus / JS | Re-rendering the whole tab list steals focus from the active tab.<br>Generated buttons need `type="button"`. `"Loading..."` is not exposed as busy. | Flip classes / `aria-selected` in place instead of rebuilding the list.<br>Set `type="button"`; expose loading with `aria-busy`. |
| Optional | CSS | Inactive `#6b7280` on white is about ~4.6:1 (borderline AA).<br>No `:focus-visible`. | Raise inactive contrast if needed.<br>Add `:focus-visible`. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | BRIEF task 1 already says: check which tab opens, then look at what `fakeFetchTabs()` returns.<br>People still see Description and move on, so the `isDefault` trap is easy to skip in a live interview. | Keep BRIEF task 1; add a score checklist line: Fail if the first paint ignores `isDefault: true`. |
| Required | TTL | Nobody waits a full minute in a ~40-minute exercise, so a 60s TTL is hard to prove.<br>Interviewers cannot fairly check cache reuse without a shorter window. | Add a test hook, or comment / set TTL = 5s in the harness for the exercise. |
| Required | Keyboard | REQUIREMENTS already require arrow keys to move between tabs.<br>Interviewers still argue Enter/Space-only "activation" vs real Left/Right movement, and whether Home/End counts. | Under the existing arrow-keys rule, name Left/Right as required.<br>Mark Home/End as nice-to-have / strong signal (Pass+). |
| Required | Mobile | "Narrow viewport" varies by laptop.<br>Checks for Shipping & Returns are inconsistent across interviewers. | BRIEF: resize to 320px → can you reach and activate Shipping & Returns? |
