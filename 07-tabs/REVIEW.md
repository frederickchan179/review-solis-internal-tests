# Review - 07 Tabs

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Default | - API says Sizing is default (`isDefault: true`)<br>- Init always opens index `0` (Description)<br>- Fix: start from `findIndex(t => t.isDefault)` |
| Required | Cache | - `contentCache` exists and is never used<br>- Every tab visit refetches<br>- 60s TTL in req not implemented<br>- Dead object = Speculative Generality → store `{ content, fetchedAt }` or delete it |
| Required | Keyboard | - Clicks only; arrows do nothing<br>- Every tab stays `tabIndex=0`<br>- Fix: roving tabindex + Left/Right on tablist (Home/End nice-to-have) |
| Required | A11y wiring | - Tablist/tabs exist<br>- Panel is a plain div: no `tabpanel`, no ids, no `aria-controls` / `aria-labelledby` |
| Required | Mobile | - Equal `flex: 1` + `nowrap` + parent `overflow: hidden`<br>- “Shipping & Returns” squishes on narrow widths<br>- Fix: horizontal scroll; drop equal flex on small screens |
| Optional | Race | - Fast tab hopping → overlapping fetches, no token<br>- Older response can paint into wrong tab<br>- Fix: request id or `AbortController` |
| Optional | Focus / JS | - Re-rendering whole tab list steals focus<br>- Flip classes / `aria-selected` in place<br>- Generated buttons need `type="button"`<br>- `"Loading..."` not exposed as busy to AT<br>- Keep `tabListEl` / `tabPanelEl` naming; null-check before use |
| Optional | CSS | - Inactive `#6b7280` on white ≈ ~4.6:1 (borderline AA)<br>- No `:focus-visible`<br>- Property order uneven between tab and panel rules |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Default easy to miss | - People see Description and move on<br>- BRIEF: look at `fakeFetchTabs()` → which tab should open first? |
| 60s TTL hard to prove | - Nobody waits a minute in a 40-minute exercise<br>- Test hook or comment TTL = 5s in harness |
| “Standard keyboard” fuzzy | - Name required keys: Left/Right (Home/End optional)<br>- Stops Enter/Space-only arguments |
| Mobile needs a width | - “Narrow viewport” varies by laptop<br>- BRIEF: resize to 320px → can you reach Shipping & Returns? |
