# Review - 03 Product Grid

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Pagination | Slice math is `page * PAGE_SIZE - page`, so pages overlap.<br>After a few loads, Product 8 (and others) can appear twice.<br>REQUIREMENTS: the grid must never render duplicate products. | Slice with `page * PAGE_SIZE` to `(page + 1) * PAGE_SIZE`.<br>A helper like `getPageSlice(page)` makes the contract obvious. |
| Required | Double-click | `loadMore` starts the fetch, then sets `isLoading` / disables the button.<br>Two quick clicks fire two same-page requests before the guard exists.<br>That is another path to duplicates. | Guard at the top of `loadMore`: return early when `isLoading` or there is no next page. |
| Required | Errors | Page 2 always rejects, but there is only `.then` (no `.catch` / `finally`).<br>After that failure, `isLoading` stays true and the button stays disabled forever.<br>REQUIREMENTS: after a failed load, Load more must be clickable again so the user can retry. | Add `.catch` (or `try/catch`) and always clear loading in `finally`.<br>Show a retryable error; re-enable the button. |
| Required | Scroll | Near-bottom scroll calls `loadMore` whenever `!isLoading`.<br>Staying in the 200px band (or more scroll events as a load finishes) fires extra loads.<br>REQUIREMENTS: one scroll gesture to the bottom should load once, not repeatedly. | Latch "already requested for this bottom reach", or use `IntersectionObserver` once per intersect. |
| Required | Reset | Reset only clears HTML and sets `page = 0`.<br>After a failed load, Reset leaves the button disabled and `isLoading` true.<br>An in-flight response can still append into the emptied grid.<br>BRIEF-critical: BRIEF asks to try Reset after scrolling; REQUIREMENTS never define Reset. | On Reset: clear loading, re-enable the button, and bump a generation/token so late responses are ignored. |
| Optional | HTML | Load more / Reset lack `type="button"` (fragile if wrapped in a form).<br>Cards have no stable product id in the DOM, so duplicates are hard to spot. | Set `type="button"` on both buttons.<br>Put `data-product-id` on each card. |
| Optional | UX | Failures are silent (dead button, no copy).<br>After 40 products there is no `hasMore` / "end of catalog", so empty fetches can continue. | Show an error the user can retry.<br>Stop loading when the catalog is done. |
| Optional | A11y | Nothing announces new cards (`aria-busy` / live region). | Announce loading and new results with a polite live region. |
| Optional | CSS | Load more has no `:disabled` look, so a correct disable is easy to miss. | Add `:disabled` styles. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Reset | BRIEF says try Reset after scrolling, but REQUIREMENTS never say what Reset must restore.<br>Interviewers argue over disabled button / late appends vs "out of scope". | Spell out in REQUIREMENTS: Reset must re-enable the button, clear loading, and ignore in-flight appends. |
| Required | Fail path | Page-2 reject is silent unless the interviewee keeps loading until failure.<br>Many stop after one or two happy loads and miss the stuck-button trap. | BRIEF: keep loading until something fails → can you retry? What should the user see? |
| Required | Scroll | REQUIREMENTS already say one scroll gesture to the bottom should load once, not repeatedly.<br>The remaining gap is what counts as "one gesture" (stay in the 200px band vs a discrete reach). | Keep the one-load rule; add a short definition of "one gesture" (latch until leave the bottom band, or `IntersectionObserver` once per intersect). |
| Optional | Duplicates | Duplicate Product 8 is hard to spot in review without stable ids on cards. | Ask for `data-product-id` (or similar) on each card so duplicates are obvious. |
