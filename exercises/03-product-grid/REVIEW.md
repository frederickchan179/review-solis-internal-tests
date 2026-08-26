# Review - 03 Product Grid

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Pagination | The slice formula is `page * PAGE_SIZE - page`, so pages overlap instead of advancing by 8. After a few loads the grid shows **Product 8 twice** (and similar duplicates). REQUIREMENTS: the grid must never render duplicate products. | Use `start = page * PAGE_SIZE` (and `end = start + PAGE_SIZE`). A helper like `getPageSlice(page)` makes the contract obvious. |
| Required | Double-click | `loadMore` does not check `isLoading` (or `hasMore`) at the start. The button is disabled only after the fetch is already kicked off, so two quick clicks can fire two same-page requests. That is another path to duplicates under REQUIREMENTS. | Guard at the top of `loadMore` with an early return when `isLoading` or `!hasMore`.<br>A request id or `AbortController` also helps when Reset races an in-flight page. |
| Required | Errors | Page 2 always rejects in `fakeFetchProducts`, but `loadMore` only attaches `.then`. There is no `.catch` / `finally`, so after the failure the button stays disabled forever and there is no retry or error message. REQUIREMENTS: after failure, Load more must be clickable again. | Add `.catch` / `finally` (or try/catch around await): re-enable the button, clear `isLoading`, show an error, and allow retry. |
| Required | Scroll | Near-bottom scroll calls `loadMore` whenever `!isLoading`. Staying in the 200px band (or scroll events while a prior load finishes) triggers load spam. REQUIREMENTS: one scroll gesture reaching the bottom should not load repeatedly. | Latch “already requested for this bottom reach”, or use `IntersectionObserver` once per intersect. |
| Required | Reset | Reset only clears HTML and sets `page = 0`. After a failed load, Reset leaves the button disabled. An in-flight response can still append into the emptied grid. Users who follow the BRIEF’s Reset path still see a broken grid. | On Reset: clear loading state, re-enable the button, and bump a generation/token so late responses are ignored. |
| Optional | HTML | Load more / Reset lack `type="button"` (fragile if the markup is ever wrapped in a form). Cards have no stable product id in the DOM, so duplicates are hard to spot. Decorative thumbs are empty divs that can still be announced oddly. | Set `type="button"` on both buttons.<br>Prefer a list (`<ul>` / `role="list"`) plus `data-product-id` on cards.<br>Mark decorative thumbs `aria-hidden="true"` if needed. |
| Optional | CSS | There are no `:disabled` styles on Load more, so a stuck/disabled button is easy to miss visually. Property order jumps around. The hint color `#9ca3af` on white is roughly ~2.5:1 and fails AA if it carries instruction. | Style `:disabled` on Load more.<br>Normalize property order.<br>Raise hint contrast if the hint carries instruction. |
| Optional | UX | Failures are silent (dead button, no copy). After 40 products there is no `hasMore` / “end of catalog” signal, so empty fetches can continue. | Surface error copy on failure.<br>Stop loading with `hasMore` (or an end-of-catalog message) when the catalog is exhausted. |
| Optional | A11y | Nothing announces that new cards were appended (`aria-busy` / live region), so SR users get little feedback during load. | Announce loading/new cards with `aria-busy` and/or a polite live region. |
| Optional | JS | Naming mixes `gridEl` with `loadMoreBtn` / `resetBtn`. Null-checks after `getElementById` may be missing. | Keep one scheme (`*El` / `*Btn`).<br>Null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Reset | The BRIEF says try Reset after scrolling, but REQUIREMENTS never say what Reset must restore. Graders argue over disabled button / late appends vs “out of scope”. | Spell out in REQUIREMENTS: Reset must re-enable the button, clear loading, and ignore in-flight appends. |
| Required | Fail path | Page-2 reject is silent unless the candidate keeps loading until failure. Many stop after one or two happy loads and miss the stuck-button trap. | BRIEF: keep loading until something fails → can you retry? What should the user see? |
| Required | Scroll | “Must not run excessively” is vague. Graders argue spam vs “one extra load while in the band”. | Define one load per reach-bottom (or require IntersectionObserver) in REQUIREMENTS. |
| Optional | Duplicates | Duplicate Product 8 is hard to spot in review without stable ids on cards, especially in screenshots. | Ask candidates for `data-product-id` (or similar) on each card so duplicates are obvious. |
