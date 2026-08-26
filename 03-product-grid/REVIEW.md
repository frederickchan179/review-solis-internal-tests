# Review - 03 Product Grid

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Pagination | - Slice formula is `page * SIZE - page` → pages overlap<br>- After a few loads: **Product 8 twice**<br>- Fix: `page * PAGE_SIZE`; helper like `getPageSlice` makes the contract obvious |
| Required | Double-click | - `loadMore` does not check `isLoading` at the start<br>- Button disabled only after fetch starts → two quick clicks = two same-page requests<br>- Fix: guard with `isLoading` / `!hasMore`<br>- Request id or `AbortController` also helps when Reset races an in-flight page |
| Required | Errors | - Page 2 always rejects, but only `.then` exists<br>- No `.catch` / `finally` → button stays disabled forever<br>- No retry, no error message |
| Required | Scroll | - Near-bottom scroll keeps calling `loadMore` whenever `!isLoading`<br>- Stay in the 200px band → load spam<br>- Fix: latch, or IntersectionObserver once per intersect |
| Required | Reset | - Reset clears HTML and `page` only<br>- After failed load, Reset leaves button disabled<br>- In-flight response can append into empty grid<br>- Fix: clear loading, re-enable button, bump generation so late responses are ignored |
| Optional | HTML | - Buttons should set `type="button"` even outside forms<br>- Prefer list (`<ul>` / `role="list"`) + `data-product-id` for duplicates<br>- Decorative thumbs can be `aria-hidden` |
| Optional | CSS | - No `:disabled` styles on Load more<br>- Property order jumps around<br>- Hint `#9ca3af` on white ≈ ~2.5:1 → fails AA if it carries instruction |
| Optional | UX | - Failures are silent (dead button, no copy)<br>- After 40 products: no “end of catalog” / `hasMore` → empty fetches can continue |
| Optional | A11y | - Nothing announces new cards (`aria-busy` / live region) |
| Optional | JS | - Mix of `gridEl` and `loadMoreBtn` / `resetBtn` → keep one scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Reset underspec’d | - BRIEF says try Reset after scrolling<br>- REQUIREMENTS never say what Reset must restore<br>- Spell out: re-enable button, clear loading, ignore in-flight appends |
| Fail is easy to miss | - Page-2 reject is silent unless you keep clicking<br>- BRIEF: keep loading until something fails → can you retry? |
| Scroll rule fuzzy | - “Must not run excessively” is vague<br>- Define one load per reach-bottom, or require IntersectionObserver |
| Catching duplicates | - Ask for `data-product-id` (or similar) on cards so duplicate Product 8 is obvious in review |
