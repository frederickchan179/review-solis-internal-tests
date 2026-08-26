# All agent prompts

Use the **Copy** button on a code block.

- **Copy all · Dev** = every exercise fixture-fix prompt in one paste.
- **Copy all · Author** = every exercise materials-improve prompt in one paste.
- Per-exercise blocks are below if you only need one test.

### Copy all · Dev

```text
========== 1/10 · 01 Accordion · Dev: Findings ==========
Folder: exercises/01-accordion/

You are fixing the interviewee fixture for Review - 01 Accordion (`exercises/01-accordion/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | State | Open state is stored as `openIndex` on the *filtered* list, not by FAQ `id`.<br>Repro: open "What is your return policy?" (index 1), type `How` → "How do I find my size?" becomes index 1 and looks open even though the user never opened it.<br>REQUIREMENTS: if the open FAQ is still in the filtered list, it must stay open; if it was filtered out, no other item should appear open. | Track open state by FAQ `id` (e.g. `openId`, or `null`).<br>In render, expand only when `item.id === openId`.<br>Do not re-map "what is open" through the filtered list's indexes. |
| Required | A11y | Closed panels only use `max-height: 0` and `overflow: hidden`. They look hidden, but the content stays in the page.<br>The sizing answer still has `<a href="#">`. Tab can land on that link while the panel looks closed.<br>REQUIREMENTS: closed content, including links, must not be reachable with Tab. | Take closed panels out of keyboard focus (`hidden` / `inert`, or disable/remove focusable nodes while closed).<br>CSS height clipping alone is not enough. |
| Required | Layout | Open panels are capped at `max-height: 200px`.<br>The shipping answer often still fits under that cap on a tall screen, so the bug is easy to miss on the happy path.<br>Zoom, a narrow window, or a longer answer cuts the text off with no scroll inside the panel.<br>REQUIREMENTS: long answers must be fully readable when open. | When open, let the panel grow with the content, or scroll inside the panel.<br>Drop the hard `200px` cap. |
| Optional | HTML | The filter only has a placeholder, so it has no reliable accessible name.<br>It is `type="text"` instead of `type="search"`.<br>The FAQ is a bare `<div id="accordion">`, not a named section. | Add a visible `<label>` or `aria-label` on the filter.<br>Prefer `type="search"`.<br>Wrap the FAQ in a named `<section>`. |
| Optional | A11y | Buttons already have `aria-expanded`, but panels have no stable `id` / `aria-controls`, so a screen reader cannot reliably pair header and content.<br>The decorative `+` is read aloud as text.<br>Filter and buttons have no `:focus-visible` style. | Give each panel an `id` and point the button at it with `aria-controls`.<br>Hide the `+` with `aria-hidden="true"`.<br>Add `:focus-visible` on the filter and accordion buttons. |
| Optional | UX | The filter is case-sensitive and only searches `question`, not `answer`.<br>When nothing matches, the list goes blank with no "No results" message.<br>The sizing support link uses `href="#"`, which jumps to the top of the page.<br>These are not in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Make the filter ignore case and search question + answer.<br>Show a clear empty message when nothing matches.<br>Use a real URL, or `preventDefault` on the support link. |
| Optional | JS | Every toggle and filter rebuilds the whole list with `innerHTML` and rebinds click listeners.<br>The filter also re-renders when the trimmed query did not change. | Prefer one delegated click on `#accordion`.<br>Skip re-render when the trimmed query is unchanged. |
| Optional | CSS | The icon rotate always runs and ignores `prefers-reduced-motion`. | Turn off or shorten the rotate when `prefers-reduced-motion: reduce`. |

========== 2/10 · 02 FAQ Search · Dev: Findings ==========
Folder: exercises/02-faq-search/

You are fixing the interviewee fixture for Review - 02 FAQ Search (`exercises/02-faq-search/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Search | Matching uses raw `includes(query)` with no case fold.<br>Type `Security` and you get hits; type `security` and you get "No results found."<br>BRIEF already points at mixed case (`password` vs `Password`), but an answer already contains lowercase "password", so that probe can look fine even when matching is still case-sensitive.<br>REQUIREMENTS: search must not be case-sensitive. | Lowercase (or otherwise normalize) both the query and the article fields before `includes`. |
| Required | Race | Every keystroke starts a new `fakeSearchAPI` call. There is no request id or `AbortController`.<br>Delays are random (100-800ms), so a slow older response can overwrite results for a newer query.<br>REQUIREMENTS: shown results must match the most recently typed query. | Tag each request with a rising id, or use `AbortController`.<br>Ignore out of date `.then` so only the latest query can update the UI. |
| Required | Clear | Clearing the box empties the DOM and returns early, but in-flight requests are not cancelled or ignored.<br>When those promises finish, `renderResults` can bring old hits back after the field is empty.<br>REQUIREMENTS: after clear, no results (old or newly arriving) until the user types again. | On clear, cancel or mark pending work as out of date (same token/abort as the race fix).<br>Emptying the UI alone is not enough. |
| Required | XSS | Results are built with `innerHTML`.<br>Article HTML such as `<em>support@example.com</em>` becomes real markup.<br>The query is dropped raw into `` <mark>${query}</mark> ``, so typed HTML can run.<br>REQUIREMENTS: article text must never execute as unintended live markup. | Escape text, or use `textContent` / safe DOM nodes, before display.<br>Build highlights with DOM nodes; never paste untrusted strings into HTML. |
| Optional | Highlight | `String.replace(query, ...)` only replaces the first match and stays case-sensitive even after search matching is fixed.<br>A query with several hits still looks half-highlighted. | If keeping highlight: global, case-insensitive, regex-escaped replace on already-escaped text (or an equivalent DOM walk). |
| Optional | CSS | `mark` is styled only under `.faq-search__answer`, so title highlights look plain.<br>The search input has no `:focus-visible`. | Style `mark` under the item (or stop highlighting titles).<br>Add `:focus-visible` on the input. |
| Optional | HTML / a11y | The search field only has a placeholder, so it lacks a durable accessible name.<br>`#status` updates "Searching..." / counts but is not a live region, so screen readers can miss it. | Add a visible label (or `aria-label`); `type="search"` is fine.<br>Make `#status` an `aria-live` region (`polite`). |
| Optional | Perf / UX | There is no debounce, so every key fires a request and the status flickers.<br>Not in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Debounce input before calling the API.<br>Keep status and results on the same "latest request" check. |

========== 3/10 · 03 Product Grid · Dev: Findings ==========
Folder: exercises/03-product-grid/

You are fixing the interviewee fixture for Review - 03 Product Grid (`exercises/03-product-grid/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

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

========== 4/10 · 04 Variant Selector · Dev: Findings ==========
Folder: exercises/04-variant-selector/

You are fixing the interviewee fixture for Review - 04 Variant Selector (`exercises/04-variant-selector/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text says "Out of stock", but `addToCartBtn.disabled = false` on every render.<br>White/L and Navy/M stay clickable and can still be added.<br>REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when `variant.available` is false.<br>Optionally disable or hide out-of-stock sizes as well (see Author). |
| Required | Price crash | Prices arrive as cent strings (`'2199'`).<br>The price label uses `formatPrice` and shows `$21.99` (correct).<br>Add to cart calls `.toFixed` on that string and throws.<br>REQUIREMENTS: Add to cart must not crash for any combination the UI lets the user select; prices must display correctly. | One money path end to end.<br>Add to cart should reuse `formatPrice` (or integer cents), not call number methods on a raw string. |
| Required | Color → size | Changing color does not rethink size.<br>White/M → Navy keeps M, which is out of stock, instead of the first in-stock size (Navy/S).<br>REQUIREMENTS: if the current size is still available for the new color, keep it; otherwise select the first available size for that color. | After a color change, run a small `reconcileSize(color)` helper against `available: true`. |
| Optional | Wrong "fix" | `Number(price).toFixed(2)` stops the crash but skips `/100`, so the UI can print `$2199.00`.<br>That still fails "correctly formatted". | Score this as Fail unless cents are divided by 100.<br>Integer cents in state; format only at the edge. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to a group.<br>Stock and "Added..." are not live.<br>Option buttons in templates should set `type="button"`. | Use a labelled group (`aria-labelledby` / radiogroup + pressed/checked).<br>Make stock and success live.<br>Set `type="button"` on generated options. |
| Optional | CSS / UX | Add to cart has no `:disabled` look, so a correct disable is easy to miss.<br>Out-of-stock copy is quiet gray while the CTA still looks primary. | Add `:disabled` styles.<br>Give out-of-stock sizes a clear disabled or hidden treatment. |
| Optional | JS | Clicks use `event.target === addToCartBtn`, which misses clicks on child nodes.<br>The success message is not cleared when the selection changes. | Prefer `closest('#addToCartBtn')` (or a dedicated listener).<br>Clear the success message when color/size changes. |

========== 5/10 · 05 Cart Quantity · Dev: Findings ==========
Folder: exercises/05-cart-qty/

You are fixing the interviewee fixture for Review - 05 Cart Quantity (`exercises/05-cart-qty/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove | `changeQuantity` uses `Math.max(1, ...)`, so pressing `-` at quantity 1 does nothing and the line never leaves the cart.<br>REQUIREMENTS: going below 1 must remove the line, not quietly keep it at 1. | When quantity would go below 1 (button or typing), remove the line from the cart instead of forcing it back to 1. |
| Required | Bad input | The typing handler uses raw `parseInt` with no checks.<br>Type `abc` then press `+` → the field can show `NaN`.<br>`0` and negatives can also enter state.<br>REQUIREMENTS: while the line exists, quantity must stay a positive whole number. | Reject or clean up invalid input.<br>While the line exists, keep quantity as a positive integer; treat below-1 as remove. |
| Required | Desync | Type `2.9` → the input can still show `2.9` while state becomes `2` via `parseInt`.<br>What the user sees and what the app uses no longer match, so the total can drift from the field.<br>REQUIREMENTS: quantity must stay a whole number, and the total must match the quantity currently shown. | After every change path, write the cleaned value back into the input. |
| Required | Race | Every change calls `fakeUpdateCartAPI` with no ordering (100-600ms delay).<br>Press `+` quickly and the total can belong to an older quantity.<br>REQUIREMENTS: the total on screen must match the quantity currently shown. | Use a request token (or `AbortController`) and ignore out of date responses.<br>Debounce typing if useful. |
| Required | A11y | REQUIREMENTS ask for screen-reader announcements when quantity or total changes.<br>The total updates silently with no `aria-live` (or equivalent), so screen readers never hear the new total. | Put `aria-live="polite"` on the total (and quantity if needed) so each successful update is announced. |
| Optional | Structure | `parseInt` / `Math.max` logic is copied across buttons and typing.<br>It is easy to fix one path and leave the other broken (buttons fine, typing still `NaN`).<br>Nice-to-have / strong signal (Pass+) for one shared path. | Use one `normalizeQty` and one `setQuantity` for both buttons and typing.<br>Always mirror the cleaned value into the input. |
| Optional | HTML | The quantity field has no `<label>`.<br>Only `+/-` have clear names; the stepper group itself is unlabeled. | Label the quantity field.<br>Use `type="number"` + `min`, or keep `text` but handle remove-at-0 explicitly.<br>Wrap the stepper in a labelled group. |
| Optional | UX / CSS | There is no "updating..." state while the total loads (100-600ms feels stuck).<br>`-` never disables at the minimum. Hit targets are 32×32 (aim ≥44px).<br>Nice-to-have / strong signal (Pass+) on pending UI and hit targets. | Show pending while the total loads.<br>Disable `-` at the minimum.<br>Pad hit targets ≥44px. |
| Optional | JS | `UNIT_PRICE = 12.0` is a float (money in float is easy to get wrong).<br>Cleaning only on `change` lags behind typing. | Prefer integer cents end to end; format currency only when displaying.<br>Prefer the `input` event, or clean on blur on purpose. |

========== 6/10 · 06 Modal Dialog · Dev: Findings ==========
Folder: exercises/06-modal-dialog/

You are fixing the interviewee fixture for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Background scroll | Opening only flips `hidden`.<br>The page behind the modal still scrolls.<br>REQUIREMENTS: while the modal is open, the page behind it must not scroll. | Lock `document.body` overflow on open; restore it on close. |
| Required | Clipped content | The dialog is `max-height: 80vh; overflow: hidden` with no inner scroller.<br>On a short screen, terms and fields are cut off with no way to reach them.<br>REQUIREMENTS: everything inside the dialog, including terms, must stay readable by scrolling *inside* the dialog. | Put overflow scroll on an inner body pane, not on the dialog shell with `overflow: hidden`. |
| Required | Keyboard / focus | There is no Escape handler.<br>Focus does not move into the dialog on open, and Tab is not trapped inside it.<br>Close does not return focus to the opener. While open, the page Open button stays in the Tab order.<br>REQUIREMENTS: fully keyboard operable, and on close focus must return to a sensible, predictable place.<br>BRIEF-critical: BRIEF already asks to close with Esc; REQUIREMENTS do not name Escape or a Tab trap. | Cache the focused element before open.<br>Move focus into the dialog, trap Tab, close on Escape, restore focus to the opener, and mark the background `inert` (or equivalent). |
| Required | z-index | Sticky header is `z-index: 999`; modal is `100`.<br>Scroll down, then open → the header sits on top of the modal.<br>BRIEF-critical: BRIEF step 3 already points at this; it is not in REQUIREMENTS. | Raise the modal (and overlay) above the header, with clear stacking tokens. |
| Optional | HTML | Email is placeholder-only: no visible label, no `autocomplete`.<br>Close and Subscribe lack `type="button"`. Terms uses `href="#"` (page jump).<br>Prefer native `<dialog>` + `showModal()` when that is acceptable. | Add a label plus `autocomplete="email"`.<br>Set Close and Subscribe to `type="button"`.<br>Fix or neutralize the Terms `href`. |
| Optional | A11y / UX | `aria-modal` without a real trap can mislead assistive tech.<br>The Close × hit target is tiny. Terms at 12px gray may fail contrast.<br>Subscribe does nothing (dead CTA). | Match `aria-modal` with a real trap, or drop the attribute until a trap exists.<br>Enlarge Close (≥44px); raise Terms contrast.<br>Wire Subscribe, or mark it out of scope. |
| Optional | JS / CSS | Open and close behavior is split across tiny handlers, so it is easy to miss one step (scroll lock without restore, Escape without trap).<br>`modalEl.querySelector` throws if `modalEl` is null. | One open/close pipeline: scroll lock → focus in → Escape → trap → restore → unlock.<br>Null-check queries before use. |

========== 7/10 · 07 Tabs · Dev: Findings ==========
Folder: exercises/07-tabs/

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
| Required | Mobile | Tabs use equal `flex: 1`, `white-space: nowrap`, and the parent has `overflow: hidden`.<br>On a narrow width, "Shipping & Returns" squishes or becomes unreachable.<br>REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Allow horizontal scroll on the tab list.<br>Drop equal flex on small screens so labels stay readable. |
| Optional | A11y wiring | Tablist/tabs exist, but the panel is a plain div: no `tabpanel`, no ids, no `aria-controls` / `aria-labelledby`.<br>Not named in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Wire `tabpanel` + ids + `aria-controls` / `aria-labelledby`. |
| Optional | Race | Fast tab hopping starts overlapping fetches with no request token.<br>An older response can update the panel after a newer tab was selected. | Use a request id or `AbortController` and ignore out of date content. |
| Optional | Focus / JS | Re-rendering the whole tab list steals focus from the active tab.<br>Generated buttons need `type="button"`. `"Loading..."` is not exposed as busy. | Flip classes / `aria-selected` in place instead of rebuilding the list.<br>Set `type="button"`; expose loading with `aria-busy`. |
| Optional | CSS | Inactive `#6b7280` on white is about ~4.6:1 (borderline AA).<br>No `:focus-visible`. | Raise inactive contrast if needed.<br>Add `:focus-visible`. |

========== 8/10 · 08 Carousel · Dev: Findings ==========
Folder: exercises/08-carousel/

You are fixing the interviewee fixture for Review - 08 Carousel (`exercises/08-carousel/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Destroy leak | "Destroy carousel" removes the node but never clears the interval.<br>Autoplay keeps calling `nextSlide` on a detached DOM (BRIEF: watch the console).<br>BRIEF-critical: lifecycle leak, not named in REQUIREMENTS. | One `destroy()`: clear the timer, drop listeners, then remove the node. |
| Required | Pause / resume | There is no hover or focus pause, and nothing resumes after a delay.<br>Hover does not stop autoplay.<br>REQUIREMENTS: pause immediately on hover or focus on controls; resume automatically a couple of seconds after leave/blur; never stop forever from one hover. | One shared timer helper for hover, focus, and reduced motion.<br>On leave/blur, wait a few seconds then restart (unless reduced motion). |
| Required | Reduced motion | Autoplay always starts; there is no `prefers-reduced-motion` check.<br>REQUIREMENTS: if the OS is set to reduce motion, autoplay must not start at all.<br>The track still has `transition: transform 0.4s` (CSS motion is not in REQUIREMENTS; see Author). | Skip `startAutoplay()` when `prefers-reduced-motion: reduce`. |
| Required | Swipe | Only `touchstart` stores X. There is no `touchend`, so swipe never changes slides.<br>REQUIREMENTS: swiping left/right must move to the next/previous slide. | On `touchend`, compare delta to a threshold and call next/prev. |
| Required | Eager slides | All five slides mount up front.<br>If these were real images, off-screen work would load immediately.<br>REQUIREMENTS: resources for off-screen slides should not load until needed. | Keep current ±1 in the DOM, or use real `<img loading="lazy">` (the fixture is colored divs; see Author). |
| Optional | Stacked timers | `startAutoplay` does not clear an existing interval.<br>Call it twice and timers stack. | Always `clearInterval` before starting a new one. |
| Optional | Reduced motion CSS | Autoplay-off can Pass while slides still animate hard on the transform transition. | Disable or shorten `transition` under `prefers-reduced-motion: reduce`. |
| Optional | A11y / UX | Real images would need `alt`.<br>No "Slide X of N" live region. Dots are 8×8 (pad hit area ≥44px).<br>Rebuilding dots every tick can steal focus. | Add `alt` (or keep text labels).<br>Announce slide changes; pad dots; toggle the active class instead of rebuilding. |
| Optional | JS / CSS | Naming mixes `trackEl` / `dotsEl` with `prevBtn` / `nextBtn`.<br>Arrow/dot rules mix positioning and visuals inconsistently. | Keep one `*El` / `*Btn` scheme; null-check queries.<br>Pick a CSS property order. |

========== 9/10 · 09 Form Validation · Dev: Findings ==========
Folder: exercises/09-form-validation/

You are fixing the interviewee fixture for Review - 09 Form Validation (`exercises/09-form-validation/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email | Validator is `includes('@')`.<br>`a@` passes. BRIEF already uses that example.<br>REQUIREMENTS: only a genuinely valid email should pass. | Use a real check, or `type="email"` + `checkValidity()`. |
| Required | Double submit | Nothing guards in-flight work.<br>Double-click Place order (or Enter then click) can create two orders while the first request is still pending.<br>REQUIREMENTS: one perceived submission must not create two orders. | Guard with `isSubmitting` and/or disable the button while the request is in flight. |
| Required | Fail path | Attempt #2 rejects with no `.catch`, so there is no error UI and the rejection is unhandled.<br>The fixture never disables the button today; a common partial fix disables on submit without `finally`, which then leaves Place order stuck forever after failure.<br>REQUIREMENTS: after a failed submit, the button must be usable again and a clear, retryable error must show. | Pattern: `isSubmitting` → disable → try/catch → error message → `finally` enable. |
| Required | XSS | Summary builds HTML with raw name/notes.<br>`<img onerror=...>` can run; `<b>` becomes bold.<br>REQUIREMENTS: user-supplied text in the summary must show as plain text, never as HTML. | Use `textContent` / safe nodes; never `innerHTML` for user input. |
| Required | A11y | Errors are a red border only.<br>No message, no `aria-invalid`, no `aria-describedby`, no live region.<br>REQUIREMENTS: errors must be visible and understandable to screen readers, not color alone. | Show error text; wire `aria-invalid` / `aria-describedby`.<br>Focus the first bad field; clear errors as they type. |
| Optional | HTML | Labels are wired correctly.<br>Missing `autocomplete="name"` / `autocomplete="email"`.<br>Email is `type="text"` + no `novalidate` story. | Add autocomplete.<br>Document why email is `type="text"`, or switch to `type="email"`. |
| Optional | UX / CSS | The empty summary card always takes space.<br>No submit `:disabled` / busy styles.<br>After success the form stays fully editable. | Hide the summary until it has content.<br>Add disabled/busy styles. |
| Optional | JS | Naming is mixed (`form`, `nameInput`, `submitBtn`, `summaryEl`). | Prefer `*El` for nodes (`formEl`, `nameInputEl`) and stick to it.<br>Null-check every `getElementById` before use. |

========== 10/10 · 10 Search Autocomplete · Dev: Findings ==========
Folder: exercises/10-search-autocomplete/

You are fixing the interviewee fixture for Review - 10 Search Autocomplete (`exercises/10-search-autocomplete/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | Each `input` schedules a new `setTimeout` without `clearTimeout` on the previous one.<br>Type `iphone` quickly and you get one timer per key (six keys → six fetches).<br>REQUIREMENTS: requests should fire after the user pauses, not on every keystroke. | Real debounce: always `clearTimeout(debounceTimer)` before scheduling the next timeout. |
| Required | Clear | Emptying the field hides the list and returns early, but leaves any pending debounce timer alive.<br>That timeout still calls `fakeFetchSuggestions` with the *previous* query and can reopen the list after clear.<br>In-flight fetches are also not ignored, so a late response can repopulate the list.<br>REQUIREMENTS: after clear, no suggestions until the user types again. | On empty query, clear the timer and ignore in-flight work (same token/abort as out of date results).<br>Do not call `fakeFetchSuggestions` when the query is empty. |
| Required | Stale results | There is no request token or abort.<br>With 100-600ms jitter, an older suggestions response can win over a newer query.<br>REQUIREMENTS: shown suggestions must match the most recently typed query. | Use a request id or `AbortController` so only the latest query can call `renderSuggestions`. |
| Required | Dismiss / keys | Click outside does not close the list.<br>There is no Arrow / Enter handling.<br>CSS defines `.autocomplete__item--highlighted`, but JS never applies it.<br>REQUIREMENTS: closable by outside click, and keyboard navigable with arrows + Enter.<br>Escape is not in REQUIREMENTS (see Author). | Drive `activeIndex` + `aria-activedescendant` (or apply `--highlighted`), or delete the unused class.<br>Wire outside click to close, plus keyboard nav/select. |
| Optional | HTML / a11y | The field needs a durable accessible name (label).<br>It is not a real combobox pattern today.<br>Nice-to-have / strong signal (Pass+) for a full combobox pattern. | Add a label; `type="search"` fits.<br>Use `combobox` / `listbox` / `option` with expanded / controls / activedescendant. |
| Optional | UX / CSS | There is no loading state while the fetch runs.<br>Empty matches just hide the list (no "No results").<br>Hint contrast is weak (`#9ca3af`). No `:focus-visible`. | Show a loading state.<br>Show "No results" when the query has zero matches.<br>Add `:focus-visible`; check hint ≥4.5:1 if it carries instruction. |
| Optional | JS | Clicks rebind on each item after every render.<br>Naming is mostly good (`inputEl`, `listEl`). | Delegate clicks on the list instead of per-item rebinds.<br>Null-check `getElementById` before use. |
```

### Copy all · Author

```text
========== 1/10 · 01 Accordion · Author: improve the test ==========
Folder: exercises/01-accordion/

You are improving the interview materials for Review - 01 Accordion (`exercises/01-accordion/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Clip | The shipping answer still fits under the `200px` open cap on many screens.<br>Interviewers and interviewees can miss the cut-off if they only try the normal path. | Lengthen the shipping (or another) answer so it overflows `200px`, or lower the open cap to about `80px` so clipping is obvious. |
| Required | Identity | The main lesson is index vs `id`, but the BRIEF never forces a clear open-then-filter check.<br>Someone who only opens and closes items can look done while still tracking open state by filtered index. | Add a BRIEF step: open item B, filter until only A remains (or A takes B's old index) → which panel is open? |
| Required | Scoring | An interviewee can look fine on the normal path while still storing open state as a filtered-list index.<br>Without an explicit score line, interviewers mark this differently. | Score checklist: Fail if open state is keyed off the filtered list index instead of FAQ `id`. |
| Optional | Soft scope | Case-insensitive filter and an empty message are good UX, but they are not in REQUIREMENTS.<br>Interviewers disagree on Fail vs nice-to-have (Pass+). | Move those behaviors into REQUIREMENTS, or mark them Pass+ / out of scope in the BRIEF. |

========== 2/10 · 02 FAQ Search · Author: improve the test ==========
Folder: exercises/02-faq-search/

You are improving the interview materials for Review - 02 FAQ Search (`exercises/02-faq-search/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Case probe | BRIEF uses `password` vs `Password`, but an answer already contains lowercase "password", so a case-sensitive bug can still look fine.<br>Interviewers and interviewees miss the trap. | Point the BRIEF at title casing like `Security` / `Internationally`, where the wrong case truly returns empty. |
| Required | XSS wording | REQUIREMENTS already say markup must never execute as live markup, but "in a way that wasn't intended by the article author" still leaves room to argue that intentional `<em>` may stay live.<br>Interviewers disagree on escape vs sanitize vs "the author meant `<em>`". | Say: treat API HTML as untrusted text.<br>Add one sample payload in REQUIREMENTS so the bar is concrete. |
| Required | Checklist | Case/race behavior and the XSS write-up can diverge.<br>One score line hides a partial Fail (race fixed, XSS ignored). | Score case/race and XSS handling as separate checklist lines. |
| Optional | Debounce | Debounce is good UX but not in REQUIREMENTS, so Pass vs Pass+ scoring is uneven. | Mark debounce out of scope or Pass+ in the BRIEF/REQUIREMENTS. |

========== 3/10 · 03 Product Grid · Author: improve the test ==========
Folder: exercises/03-product-grid/

You are improving the interview materials for Review - 03 Product Grid (`exercises/03-product-grid/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Reset | BRIEF says try Reset after scrolling, but REQUIREMENTS never say what Reset must restore.<br>Interviewers argue over disabled button / late appends vs "out of scope". | Spell out in REQUIREMENTS: Reset must re-enable the button, clear loading, and ignore in-flight appends. |
| Required | Fail path | Page-2 reject is silent unless the interviewee keeps loading until failure.<br>Many stop after one or two happy loads and miss the stuck-button trap. | BRIEF: keep loading until something fails → can you retry? What should the user see? |
| Required | Scroll | REQUIREMENTS already say one scroll gesture to the bottom should load once, not repeatedly.<br>The remaining gap is what counts as "one gesture" (stay in the 200px band vs a discrete reach). | Keep the one-load rule; add a short definition of "one gesture" (latch until leave the bottom band, or `IntersectionObserver` once per intersect). |
| Optional | Duplicates | Duplicate Product 8 is hard to spot in review without stable ids on cards. | Ask for `data-product-id` (or similar) on each card so duplicates are obvious. |

========== 4/10 · 04 Variant Selector · Author: improve the test ==========
Folder: exercises/04-variant-selector/

You are improving the interview materials for Review - 04 Variant Selector (`exercises/04-variant-selector/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | REQUIREMENTS already say: keep the size if still "available" for the new color, else pick the first available size.<br>Interviewers still argue "size exists for that color" vs "in stock (`available: true`)". | Define `available` as in stock (`available: true`), not merely "this size exists for that color". |
| Required | OOS UI | Disable Add to cart only, hide out-of-stock sizes, or allow select-but-block at Add to cart?<br>Interviewees pick different policies and interviewers disagree. | Pick one out-of-stock policy in REQUIREMENTS so scoring stays consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money.<br>Without a score note, some interviewers Pass it because "it doesn't throw". | Score checklist: Fail `$2199.00` (or any display that skips cents → dollars). |
| Optional | Disabled look | The fixture has no `:disabled` styling on Add to cart, so a correct out-of-stock fix is invisible in screenshots. | Add `:disabled` styling in the fixture (or require it) so the correct fix shows. |

========== 5/10 · 05 Cart Quantity · Author: improve the test ==========
Folder: exercises/05-cart-qty/

You are improving the interview materials for Review - 05 Cart Quantity (`exercises/05-cart-qty/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove UX | REQUIREMENTS say remove below 1, but not what the UI becomes afterward.<br>Every interviewee invents a different empty state (hide the row, "cart empty", leave a hole), and interviewers disagree. | Spell out empty cart / hide row / where focus should go after remove. |
| Required | Qty rules | "Always a positive whole number" vs "below 1 removes" looks like a clash if read literally.<br>Interviewers argue whether `0` may flash on screen. | Clarify: while the line exists, quantity is an integer ≥ 1; trying to go below 1 removes the line. |
| Required | Announce | "Must be announced" is vague, so screen-reader solutions diverge (what text, polite vs assertive, quantity-only vs total-only). | Give a sample announcement, e.g. `Quantity 2, total $24.00`. |
| Optional | Race | BRIEF already asks for rapid `+`.<br>Interviewers may still not check whether the final total matches the input after the burst. | Keep rapid `+` in the BRIEF; add an explicit watch: does the final total match the input? |

========== 6/10 · 06 Modal Dialog · Author: improve the test ==========
Folder: exercises/06-modal-dialog/

You are improving the interview materials for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Esc / trap | BRIEF already pushes Esc and keyboard use.<br>REQUIREMENTS require full keyboard operate plus return focus to a "sensible, predictable location", but they never name Escape or a Tab trap, and they never say "opener".<br>Interviewers argue whether mouse-only close is enough, and where focus must land. | Put "Escape closes" and "Tab stays trapped" in REQUIREMENTS.<br>Tighten return-focus to "the control that opened the modal" (already required in softer form). |
| Required | Clip | On a tall laptop the dialog often still "fits", so the `overflow: hidden` clip is easy to miss. | BRIEF: use a ≤600px height viewport (or pad the terms) so clipping is unavoidable without an inner scroller. |
| Required | Header trap | Sticky header over the modal is a strong stacking bug.<br>Polishing the fixture (raising modal z-index) would hide the lesson. | Do not clean it up in the fixture; BRIEF step 3 already points at it.<br>Score checklist: Fail if the sticky header paints above the open modal. |
| Optional | Subscribe | Subscribe is unused and distracts interviewees with nothing useful to probe or score. | Mark Subscribe out of scope, or require a harmless no-op / success handler. |

========== 7/10 · 07 Tabs · Author: improve the test ==========
Folder: exercises/07-tabs/

You are improving the interview materials for Review - 07 Tabs (`exercises/07-tabs/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Default | BRIEF task 1 already says: check which tab opens, then look at what `fakeFetchTabs()` returns.<br>People still see Description and move on, so the `isDefault` trap is easy to skip in a live interview. | Keep BRIEF task 1; add a score checklist line: Fail if the first paint ignores `isDefault: true`. |
| Required | TTL | Nobody waits a full minute in a ~40-minute exercise, so a 60s TTL is hard to prove.<br>Interviewers cannot fairly check cache reuse without a shorter window. | Add a test hook, or comment / set TTL = 5s in the harness for the exercise. |
| Required | Keyboard | REQUIREMENTS already require arrow keys to move between tabs.<br>Interviewers still argue Enter/Space-only "activation" vs real Left/Right movement, and whether Home/End counts. | Under the existing arrow-keys rule, name Left/Right as required.<br>Mark Home/End as nice-to-have / strong signal (Pass+). |
| Required | Mobile | "Narrow viewport" varies by laptop.<br>Checks for Shipping & Returns are inconsistent across interviewers. | BRIEF: resize to 320px → can you reach and activate Shipping & Returns? |

========== 8/10 · 08 Carousel · Author: improve the test ==========
Folder: exercises/08-carousel/

You are improving the interview materials for Review - 08 Carousel (`exercises/08-carousel/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Lazy | REQUIREMENTS say don't load off-screen resources, but the fixture is colored `<div>`s.<br>Interviewees guess the intended pattern; interviewers disagree on what "done" looks like. | Say: keep current ±1 in the DOM, or include a sample `<img>` so lazy-loading is observable. |
| Required | Resume delay | "A couple of seconds" is too soft for scoring resume delay after hover/focus leave. | Pick a number (e.g. 2000ms) in REQUIREMENTS. |
| Required | Reduced motion | Autoplay-off is required.<br>CSS transform transition is unspoken, so people can Pass while slides still animate hard. | Also call out the CSS transition in REQUIREMENTS, or mark it Pass+. |
| Required | Destroy | Destroy-without-clearing-the-interval is the clearest lifecycle trap in the suite.<br>Polishing the fixture would hide it. | Do not remove Destroy when polishing the fixture; keep the leak as a clear score checklist item. |

========== 9/10 · 09 Form Validation · Author: improve the test ==========
Folder: exercises/09-form-validation/

You are improving the interview materials for Review - 09 Form Validation (`exercises/09-form-validation/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email bar | "Genuinely valid" invites regex arguments.<br>BRIEF already shows `a@`, but REQUIREMENTS do not list pass/fail examples. | Concrete examples: `a@` must fail; `alex@example.com` must pass. |
| Required | Fail path | Attempt #2 rejects with no UI unless the interviewee reads the harness (`submitAttempts === 2`).<br>There is no comment calling that out, so many never trigger it and miss the missing-error / stuck-button trap. | BRIEF: the 2nd accepted submit fails → what should the user see, and can they retry?<br>Add a short harness comment that attempt #2 rejects. |
| Required | XSS | The payload is already in the BRIEF.<br>Without a written root-cause note, some rooms treat a silent escape as enough. | Keep the payload; make a short written root-cause note a scored deliverable. |
| Required | Error copy | REQUIREMENTS already say "not color alone".<br>Solutions still diverge (`aria-describedby` vs a live region vs mystery text). | Give sample text ("Enter a valid email...").<br>Expect `aria-describedby` so solutions look alike when scoring. |

========== 10/10 · 10 Search Autocomplete · Author: improve the test ==========
Folder: exercises/10-search-autocomplete/

You are improving the interview materials for Review - 10 Search Autocomplete (`exercises/10-search-autocomplete/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | BRIEF already asks interviewees to compare how many times `fakeFetchSuggestions` runs vs a real debounce while typing `iphone`.<br>REQUIREMENTS already ban a request on every keystroke.<br>The gap is soft proof: "consider" / Network-like intuition is easy to skip, so interviewers may Pass a broken debounce. | In the BRIEF, require a hard check: log (or breakpoint) call count while typing `iphone` quickly; broken code fires once per key, fixed code fires once after the pause. |
| Required | Clear vs in-flight | Clearing mid-debounce (pending timer) is a different bug from a fetch already in flight.<br>One score checklist row hides half the fix. | Use separate score checklist rows so both the pending timer and in-flight fetch get fixed. |
| Optional | Escape | Outside click is in REQUIREMENTS; Esc to close is standard but unspoken.<br>Interviewers invent their own bar for Fail vs nice-to-have (Pass+). | Add Esc to REQUIREMENTS, or document it as out of scope / Pass+. |
| Optional | Highlight | `.autocomplete__item--highlighted` is unused on purpose.<br>Interviewees may delete the CSS blindly without noticing the keyboard-highlight smell. | Mention keyboard highlighting in the BRIEF so interviewees notice the unused class and wire it up (or remove it on purpose). |
```

---

## Per exercise

### 01 Accordion

Folder: `exercises/01-accordion/`

Copy one block into an AI / agent / LLM. Point it at `exercises/01-accordion/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 01 Accordion (`exercises/01-accordion/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | State | Open state is stored as `openIndex` on the *filtered* list, not by FAQ `id`.<br>Repro: open "What is your return policy?" (index 1), type `How` → "How do I find my size?" becomes index 1 and looks open even though the user never opened it.<br>REQUIREMENTS: if the open FAQ is still in the filtered list, it must stay open; if it was filtered out, no other item should appear open. | Track open state by FAQ `id` (e.g. `openId`, or `null`).<br>In render, expand only when `item.id === openId`.<br>Do not re-map "what is open" through the filtered list's indexes. |
| Required | A11y | Closed panels only use `max-height: 0` and `overflow: hidden`. They look hidden, but the content stays in the page.<br>The sizing answer still has `<a href="#">`. Tab can land on that link while the panel looks closed.<br>REQUIREMENTS: closed content, including links, must not be reachable with Tab. | Take closed panels out of keyboard focus (`hidden` / `inert`, or disable/remove focusable nodes while closed).<br>CSS height clipping alone is not enough. |
| Required | Layout | Open panels are capped at `max-height: 200px`.<br>The shipping answer often still fits under that cap on a tall screen, so the bug is easy to miss on the happy path.<br>Zoom, a narrow window, or a longer answer cuts the text off with no scroll inside the panel.<br>REQUIREMENTS: long answers must be fully readable when open. | When open, let the panel grow with the content, or scroll inside the panel.<br>Drop the hard `200px` cap. |
| Optional | HTML | The filter only has a placeholder, so it has no reliable accessible name.<br>It is `type="text"` instead of `type="search"`.<br>The FAQ is a bare `<div id="accordion">`, not a named section. | Add a visible `<label>` or `aria-label` on the filter.<br>Prefer `type="search"`.<br>Wrap the FAQ in a named `<section>`. |
| Optional | A11y | Buttons already have `aria-expanded`, but panels have no stable `id` / `aria-controls`, so a screen reader cannot reliably pair header and content.<br>The decorative `+` is read aloud as text.<br>Filter and buttons have no `:focus-visible` style. | Give each panel an `id` and point the button at it with `aria-controls`.<br>Hide the `+` with `aria-hidden="true"`.<br>Add `:focus-visible` on the filter and accordion buttons. |
| Optional | UX | The filter is case-sensitive and only searches `question`, not `answer`.<br>When nothing matches, the list goes blank with no "No results" message.<br>The sizing support link uses `href="#"`, which jumps to the top of the page.<br>These are not in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Make the filter ignore case and search question + answer.<br>Show a clear empty message when nothing matches.<br>Use a real URL, or `preventDefault` on the support link. |
| Optional | JS | Every toggle and filter rebuilds the whole list with `innerHTML` and rebinds click listeners.<br>The filter also re-renders when the trimmed query did not change. | Prefer one delegated click on `#accordion`.<br>Skip re-render when the trimmed query is unchanged. |
| Optional | CSS | The icon rotate always runs and ignores `prefers-reduced-motion`. | Turn off or shorten the rotate when `prefers-reduced-motion: reduce`. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 01 Accordion (`exercises/01-accordion/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Clip | The shipping answer still fits under the `200px` open cap on many screens.<br>Interviewers and interviewees can miss the cut-off if they only try the normal path. | Lengthen the shipping (or another) answer so it overflows `200px`, or lower the open cap to about `80px` so clipping is obvious. |
| Required | Identity | The main lesson is index vs `id`, but the BRIEF never forces a clear open-then-filter check.<br>Someone who only opens and closes items can look done while still tracking open state by filtered index. | Add a BRIEF step: open item B, filter until only A remains (or A takes B's old index) → which panel is open? |
| Required | Scoring | An interviewee can look fine on the normal path while still storing open state as a filtered-list index.<br>Without an explicit score line, interviewers mark this differently. | Score checklist: Fail if open state is keyed off the filtered list index instead of FAQ `id`. |
| Optional | Soft scope | Case-insensitive filter and an empty message are good UX, but they are not in REQUIREMENTS.<br>Interviewers disagree on Fail vs nice-to-have (Pass+). | Move those behaviors into REQUIREMENTS, or mark them Pass+ / out of scope in the BRIEF. |
```

---

### 02 FAQ Search

Folder: `exercises/02-faq-search/`

Copy one block into an AI / agent / LLM. Point it at `exercises/02-faq-search/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 02 FAQ Search (`exercises/02-faq-search/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Search | Matching uses raw `includes(query)` with no case fold.<br>Type `Security` and you get hits; type `security` and you get "No results found."<br>BRIEF already points at mixed case (`password` vs `Password`), but an answer already contains lowercase "password", so that probe can look fine even when matching is still case-sensitive.<br>REQUIREMENTS: search must not be case-sensitive. | Lowercase (or otherwise normalize) both the query and the article fields before `includes`. |
| Required | Race | Every keystroke starts a new `fakeSearchAPI` call. There is no request id or `AbortController`.<br>Delays are random (100-800ms), so a slow older response can overwrite results for a newer query.<br>REQUIREMENTS: shown results must match the most recently typed query. | Tag each request with a rising id, or use `AbortController`.<br>Ignore out of date `.then` so only the latest query can update the UI. |
| Required | Clear | Clearing the box empties the DOM and returns early, but in-flight requests are not cancelled or ignored.<br>When those promises finish, `renderResults` can bring old hits back after the field is empty.<br>REQUIREMENTS: after clear, no results (old or newly arriving) until the user types again. | On clear, cancel or mark pending work as out of date (same token/abort as the race fix).<br>Emptying the UI alone is not enough. |
| Required | XSS | Results are built with `innerHTML`.<br>Article HTML such as `<em>support@example.com</em>` becomes real markup.<br>The query is dropped raw into `` <mark>${query}</mark> ``, so typed HTML can run.<br>REQUIREMENTS: article text must never execute as unintended live markup. | Escape text, or use `textContent` / safe DOM nodes, before display.<br>Build highlights with DOM nodes; never paste untrusted strings into HTML. |
| Optional | Highlight | `String.replace(query, ...)` only replaces the first match and stays case-sensitive even after search matching is fixed.<br>A query with several hits still looks half-highlighted. | If keeping highlight: global, case-insensitive, regex-escaped replace on already-escaped text (or an equivalent DOM walk). |
| Optional | CSS | `mark` is styled only under `.faq-search__answer`, so title highlights look plain.<br>The search input has no `:focus-visible`. | Style `mark` under the item (or stop highlighting titles).<br>Add `:focus-visible` on the input. |
| Optional | HTML / a11y | The search field only has a placeholder, so it lacks a durable accessible name.<br>`#status` updates "Searching..." / counts but is not a live region, so screen readers can miss it. | Add a visible label (or `aria-label`); `type="search"` is fine.<br>Make `#status` an `aria-live` region (`polite`). |
| Optional | Perf / UX | There is no debounce, so every key fires a request and the status flickers.<br>Not in REQUIREMENTS (nice-to-have / strong signal, Pass+). | Debounce input before calling the API.<br>Keep status and results on the same "latest request" check. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 02 FAQ Search (`exercises/02-faq-search/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Case probe | BRIEF uses `password` vs `Password`, but an answer already contains lowercase "password", so a case-sensitive bug can still look fine.<br>Interviewers and interviewees miss the trap. | Point the BRIEF at title casing like `Security` / `Internationally`, where the wrong case truly returns empty. |
| Required | XSS wording | REQUIREMENTS already say markup must never execute as live markup, but "in a way that wasn't intended by the article author" still leaves room to argue that intentional `<em>` may stay live.<br>Interviewers disagree on escape vs sanitize vs "the author meant `<em>`". | Say: treat API HTML as untrusted text.<br>Add one sample payload in REQUIREMENTS so the bar is concrete. |
| Required | Checklist | Case/race behavior and the XSS write-up can diverge.<br>One score line hides a partial Fail (race fixed, XSS ignored). | Score case/race and XSS handling as separate checklist lines. |
| Optional | Debounce | Debounce is good UX but not in REQUIREMENTS, so Pass vs Pass+ scoring is uneven. | Mark debounce out of scope or Pass+ in the BRIEF/REQUIREMENTS. |
```

---

### 03 Product Grid

Folder: `exercises/03-product-grid/`

Copy one block into an AI / agent / LLM. Point it at `exercises/03-product-grid/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 03 Product Grid (`exercises/03-product-grid/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

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
```

### Author: improve the test

```text
You are improving the interview materials for Review - 03 Product Grid (`exercises/03-product-grid/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Reset | BRIEF says try Reset after scrolling, but REQUIREMENTS never say what Reset must restore.<br>Interviewers argue over disabled button / late appends vs "out of scope". | Spell out in REQUIREMENTS: Reset must re-enable the button, clear loading, and ignore in-flight appends. |
| Required | Fail path | Page-2 reject is silent unless the interviewee keeps loading until failure.<br>Many stop after one or two happy loads and miss the stuck-button trap. | BRIEF: keep loading until something fails → can you retry? What should the user see? |
| Required | Scroll | REQUIREMENTS already say one scroll gesture to the bottom should load once, not repeatedly.<br>The remaining gap is what counts as "one gesture" (stay in the 200px band vs a discrete reach). | Keep the one-load rule; add a short definition of "one gesture" (latch until leave the bottom band, or `IntersectionObserver` once per intersect). |
| Optional | Duplicates | Duplicate Product 8 is hard to spot in review without stable ids on cards. | Ask for `data-product-id` (or similar) on each card so duplicates are obvious. |
```

---

### 04 Variant Selector

Folder: `exercises/04-variant-selector/`

Copy one block into an AI / agent / LLM. Point it at `exercises/04-variant-selector/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 04 Variant Selector (`exercises/04-variant-selector/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text says "Out of stock", but `addToCartBtn.disabled = false` on every render.<br>White/L and Navy/M stay clickable and can still be added.<br>REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when `variant.available` is false.<br>Optionally disable or hide out-of-stock sizes as well (see Author). |
| Required | Price crash | Prices arrive as cent strings (`'2199'`).<br>The price label uses `formatPrice` and shows `$21.99` (correct).<br>Add to cart calls `.toFixed` on that string and throws.<br>REQUIREMENTS: Add to cart must not crash for any combination the UI lets the user select; prices must display correctly. | One money path end to end.<br>Add to cart should reuse `formatPrice` (or integer cents), not call number methods on a raw string. |
| Required | Color → size | Changing color does not rethink size.<br>White/M → Navy keeps M, which is out of stock, instead of the first in-stock size (Navy/S).<br>REQUIREMENTS: if the current size is still available for the new color, keep it; otherwise select the first available size for that color. | After a color change, run a small `reconcileSize(color)` helper against `available: true`. |
| Optional | Wrong "fix" | `Number(price).toFixed(2)` stops the crash but skips `/100`, so the UI can print `$2199.00`.<br>That still fails "correctly formatted". | Score this as Fail unless cents are divided by 100.<br>Integer cents in state; format only at the edge. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to a group.<br>Stock and "Added..." are not live.<br>Option buttons in templates should set `type="button"`. | Use a labelled group (`aria-labelledby` / radiogroup + pressed/checked).<br>Make stock and success live.<br>Set `type="button"` on generated options. |
| Optional | CSS / UX | Add to cart has no `:disabled` look, so a correct disable is easy to miss.<br>Out-of-stock copy is quiet gray while the CTA still looks primary. | Add `:disabled` styles.<br>Give out-of-stock sizes a clear disabled or hidden treatment. |
| Optional | JS | Clicks use `event.target === addToCartBtn`, which misses clicks on child nodes.<br>The success message is not cleared when the selection changes. | Prefer `closest('#addToCartBtn')` (or a dedicated listener).<br>Clear the success message when color/size changes. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 04 Variant Selector (`exercises/04-variant-selector/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | REQUIREMENTS already say: keep the size if still "available" for the new color, else pick the first available size.<br>Interviewers still argue "size exists for that color" vs "in stock (`available: true`)". | Define `available` as in stock (`available: true`), not merely "this size exists for that color". |
| Required | OOS UI | Disable Add to cart only, hide out-of-stock sizes, or allow select-but-block at Add to cart?<br>Interviewees pick different policies and interviewers disagree. | Pick one out-of-stock policy in REQUIREMENTS so scoring stays consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money.<br>Without a score note, some interviewers Pass it because "it doesn't throw". | Score checklist: Fail `$2199.00` (or any display that skips cents → dollars). |
| Optional | Disabled look | The fixture has no `:disabled` styling on Add to cart, so a correct out-of-stock fix is invisible in screenshots. | Add `:disabled` styling in the fixture (or require it) so the correct fix shows. |
```

---

### 05 Cart Quantity

Folder: `exercises/05-cart-qty/`

Copy one block into an AI / agent / LLM. Point it at `exercises/05-cart-qty/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 05 Cart Quantity (`exercises/05-cart-qty/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove | `changeQuantity` uses `Math.max(1, ...)`, so pressing `-` at quantity 1 does nothing and the line never leaves the cart.<br>REQUIREMENTS: going below 1 must remove the line, not quietly keep it at 1. | When quantity would go below 1 (button or typing), remove the line from the cart instead of forcing it back to 1. |
| Required | Bad input | The typing handler uses raw `parseInt` with no checks.<br>Type `abc` then press `+` → the field can show `NaN`.<br>`0` and negatives can also enter state.<br>REQUIREMENTS: while the line exists, quantity must stay a positive whole number. | Reject or clean up invalid input.<br>While the line exists, keep quantity as a positive integer; treat below-1 as remove. |
| Required | Desync | Type `2.9` → the input can still show `2.9` while state becomes `2` via `parseInt`.<br>What the user sees and what the app uses no longer match, so the total can drift from the field.<br>REQUIREMENTS: quantity must stay a whole number, and the total must match the quantity currently shown. | After every change path, write the cleaned value back into the input. |
| Required | Race | Every change calls `fakeUpdateCartAPI` with no ordering (100-600ms delay).<br>Press `+` quickly and the total can belong to an older quantity.<br>REQUIREMENTS: the total on screen must match the quantity currently shown. | Use a request token (or `AbortController`) and ignore out of date responses.<br>Debounce typing if useful. |
| Required | A11y | REQUIREMENTS ask for screen-reader announcements when quantity or total changes.<br>The total updates silently with no `aria-live` (or equivalent), so screen readers never hear the new total. | Put `aria-live="polite"` on the total (and quantity if needed) so each successful update is announced. |
| Optional | Structure | `parseInt` / `Math.max` logic is copied across buttons and typing.<br>It is easy to fix one path and leave the other broken (buttons fine, typing still `NaN`).<br>Nice-to-have / strong signal (Pass+) for one shared path. | Use one `normalizeQty` and one `setQuantity` for both buttons and typing.<br>Always mirror the cleaned value into the input. |
| Optional | HTML | The quantity field has no `<label>`.<br>Only `+/-` have clear names; the stepper group itself is unlabeled. | Label the quantity field.<br>Use `type="number"` + `min`, or keep `text` but handle remove-at-0 explicitly.<br>Wrap the stepper in a labelled group. |
| Optional | UX / CSS | There is no "updating..." state while the total loads (100-600ms feels stuck).<br>`-` never disables at the minimum. Hit targets are 32×32 (aim ≥44px).<br>Nice-to-have / strong signal (Pass+) on pending UI and hit targets. | Show pending while the total loads.<br>Disable `-` at the minimum.<br>Pad hit targets ≥44px. |
| Optional | JS | `UNIT_PRICE = 12.0` is a float (money in float is easy to get wrong).<br>Cleaning only on `change` lags behind typing. | Prefer integer cents end to end; format currency only when displaying.<br>Prefer the `input` event, or clean on blur on purpose. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 05 Cart Quantity (`exercises/05-cart-qty/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove UX | REQUIREMENTS say remove below 1, but not what the UI becomes afterward.<br>Every interviewee invents a different empty state (hide the row, "cart empty", leave a hole), and interviewers disagree. | Spell out empty cart / hide row / where focus should go after remove. |
| Required | Qty rules | "Always a positive whole number" vs "below 1 removes" looks like a clash if read literally.<br>Interviewers argue whether `0` may flash on screen. | Clarify: while the line exists, quantity is an integer ≥ 1; trying to go below 1 removes the line. |
| Required | Announce | "Must be announced" is vague, so screen-reader solutions diverge (what text, polite vs assertive, quantity-only vs total-only). | Give a sample announcement, e.g. `Quantity 2, total $24.00`. |
| Optional | Race | BRIEF already asks for rapid `+`.<br>Interviewers may still not check whether the final total matches the input after the burst. | Keep rapid `+` in the BRIEF; add an explicit watch: does the final total match the input? |
```

---

### 06 Modal Dialog

Folder: `exercises/06-modal-dialog/`

Copy one block into an AI / agent / LLM. Point it at `exercises/06-modal-dialog/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Background scroll | Opening only flips `hidden`.<br>The page behind the modal still scrolls.<br>REQUIREMENTS: while the modal is open, the page behind it must not scroll. | Lock `document.body` overflow on open; restore it on close. |
| Required | Clipped content | The dialog is `max-height: 80vh; overflow: hidden` with no inner scroller.<br>On a short screen, terms and fields are cut off with no way to reach them.<br>REQUIREMENTS: everything inside the dialog, including terms, must stay readable by scrolling *inside* the dialog. | Put overflow scroll on an inner body pane, not on the dialog shell with `overflow: hidden`. |
| Required | Keyboard / focus | There is no Escape handler.<br>Focus does not move into the dialog on open, and Tab is not trapped inside it.<br>Close does not return focus to the opener. While open, the page Open button stays in the Tab order.<br>REQUIREMENTS: fully keyboard operable, and on close focus must return to a sensible, predictable place.<br>BRIEF-critical: BRIEF already asks to close with Esc; REQUIREMENTS do not name Escape or a Tab trap. | Cache the focused element before open.<br>Move focus into the dialog, trap Tab, close on Escape, restore focus to the opener, and mark the background `inert` (or equivalent). |
| Required | z-index | Sticky header is `z-index: 999`; modal is `100`.<br>Scroll down, then open → the header sits on top of the modal.<br>BRIEF-critical: BRIEF step 3 already points at this; it is not in REQUIREMENTS. | Raise the modal (and overlay) above the header, with clear stacking tokens. |
| Optional | HTML | Email is placeholder-only: no visible label, no `autocomplete`.<br>Close and Subscribe lack `type="button"`. Terms uses `href="#"` (page jump).<br>Prefer native `<dialog>` + `showModal()` when that is acceptable. | Add a label plus `autocomplete="email"`.<br>Set Close and Subscribe to `type="button"`.<br>Fix or neutralize the Terms `href`. |
| Optional | A11y / UX | `aria-modal` without a real trap can mislead assistive tech.<br>The Close × hit target is tiny. Terms at 12px gray may fail contrast.<br>Subscribe does nothing (dead CTA). | Match `aria-modal` with a real trap, or drop the attribute until a trap exists.<br>Enlarge Close (≥44px); raise Terms contrast.<br>Wire Subscribe, or mark it out of scope. |
| Optional | JS / CSS | Open and close behavior is split across tiny handlers, so it is easy to miss one step (scroll lock without restore, Escape without trap).<br>`modalEl.querySelector` throws if `modalEl` is null. | One open/close pipeline: scroll lock → focus in → Escape → trap → restore → unlock.<br>Null-check queries before use. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Esc / trap | BRIEF already pushes Esc and keyboard use.<br>REQUIREMENTS require full keyboard operate plus return focus to a "sensible, predictable location", but they never name Escape or a Tab trap, and they never say "opener".<br>Interviewers argue whether mouse-only close is enough, and where focus must land. | Put "Escape closes" and "Tab stays trapped" in REQUIREMENTS.<br>Tighten return-focus to "the control that opened the modal" (already required in softer form). |
| Required | Clip | On a tall laptop the dialog often still "fits", so the `overflow: hidden` clip is easy to miss. | BRIEF: use a ≤600px height viewport (or pad the terms) so clipping is unavoidable without an inner scroller. |
| Required | Header trap | Sticky header over the modal is a strong stacking bug.<br>Polishing the fixture (raising modal z-index) would hide the lesson. | Do not clean it up in the fixture; BRIEF step 3 already points at it.<br>Score checklist: Fail if the sticky header paints above the open modal. |
| Optional | Subscribe | Subscribe is unused and distracts interviewees with nothing useful to probe or score. | Mark Subscribe out of scope, or require a harmless no-op / success handler. |
```

---

### 07 Tabs

Folder: `exercises/07-tabs/`

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
| Required | Mobile | Tabs use equal `flex: 1`, `white-space: nowrap`, and the parent has `overflow: hidden`.<br>On a narrow width, "Shipping & Returns" squishes or becomes unreachable.<br>REQUIREMENTS: the tab list must remain usable on mobile-width viewports. | Allow horizontal scroll on the tab list.<br>Drop equal flex on small screens so labels stay readable. |
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
| Required | Mobile | "Narrow viewport" varies by laptop.<br>Checks for Shipping & Returns are inconsistent across interviewers. | BRIEF: resize to 320px → can you reach and activate Shipping & Returns? |
```

---

### 08 Carousel

Folder: `exercises/08-carousel/`

Copy one block into an AI / agent / LLM. Point it at `exercises/08-carousel/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 08 Carousel (`exercises/08-carousel/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Destroy leak | "Destroy carousel" removes the node but never clears the interval.<br>Autoplay keeps calling `nextSlide` on a detached DOM (BRIEF: watch the console).<br>BRIEF-critical: lifecycle leak, not named in REQUIREMENTS. | One `destroy()`: clear the timer, drop listeners, then remove the node. |
| Required | Pause / resume | There is no hover or focus pause, and nothing resumes after a delay.<br>Hover does not stop autoplay.<br>REQUIREMENTS: pause immediately on hover or focus on controls; resume automatically a couple of seconds after leave/blur; never stop forever from one hover. | One shared timer helper for hover, focus, and reduced motion.<br>On leave/blur, wait a few seconds then restart (unless reduced motion). |
| Required | Reduced motion | Autoplay always starts; there is no `prefers-reduced-motion` check.<br>REQUIREMENTS: if the OS is set to reduce motion, autoplay must not start at all.<br>The track still has `transition: transform 0.4s` (CSS motion is not in REQUIREMENTS; see Author). | Skip `startAutoplay()` when `prefers-reduced-motion: reduce`. |
| Required | Swipe | Only `touchstart` stores X. There is no `touchend`, so swipe never changes slides.<br>REQUIREMENTS: swiping left/right must move to the next/previous slide. | On `touchend`, compare delta to a threshold and call next/prev. |
| Required | Eager slides | All five slides mount up front.<br>If these were real images, off-screen work would load immediately.<br>REQUIREMENTS: resources for off-screen slides should not load until needed. | Keep current ±1 in the DOM, or use real `<img loading="lazy">` (the fixture is colored divs; see Author). |
| Optional | Stacked timers | `startAutoplay` does not clear an existing interval.<br>Call it twice and timers stack. | Always `clearInterval` before starting a new one. |
| Optional | Reduced motion CSS | Autoplay-off can Pass while slides still animate hard on the transform transition. | Disable or shorten `transition` under `prefers-reduced-motion: reduce`. |
| Optional | A11y / UX | Real images would need `alt`.<br>No "Slide X of N" live region. Dots are 8×8 (pad hit area ≥44px).<br>Rebuilding dots every tick can steal focus. | Add `alt` (or keep text labels).<br>Announce slide changes; pad dots; toggle the active class instead of rebuilding. |
| Optional | JS / CSS | Naming mixes `trackEl` / `dotsEl` with `prevBtn` / `nextBtn`.<br>Arrow/dot rules mix positioning and visuals inconsistently. | Keep one `*El` / `*Btn` scheme; null-check queries.<br>Pick a CSS property order. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 08 Carousel (`exercises/08-carousel/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Lazy | REQUIREMENTS say don't load off-screen resources, but the fixture is colored `<div>`s.<br>Interviewees guess the intended pattern; interviewers disagree on what "done" looks like. | Say: keep current ±1 in the DOM, or include a sample `<img>` so lazy-loading is observable. |
| Required | Resume delay | "A couple of seconds" is too soft for scoring resume delay after hover/focus leave. | Pick a number (e.g. 2000ms) in REQUIREMENTS. |
| Required | Reduced motion | Autoplay-off is required.<br>CSS transform transition is unspoken, so people can Pass while slides still animate hard. | Also call out the CSS transition in REQUIREMENTS, or mark it Pass+. |
| Required | Destroy | Destroy-without-clearing-the-interval is the clearest lifecycle trap in the suite.<br>Polishing the fixture would hide it. | Do not remove Destroy when polishing the fixture; keep the leak as a clear score checklist item. |
```

---

### 09 Form Validation

Folder: `exercises/09-form-validation/`

Copy one block into an AI / agent / LLM. Point it at `exercises/09-form-validation/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 09 Form Validation (`exercises/09-form-validation/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email | Validator is `includes('@')`.<br>`a@` passes. BRIEF already uses that example.<br>REQUIREMENTS: only a genuinely valid email should pass. | Use a real check, or `type="email"` + `checkValidity()`. |
| Required | Double submit | Nothing guards in-flight work.<br>Double-click Place order (or Enter then click) can create two orders while the first request is still pending.<br>REQUIREMENTS: one perceived submission must not create two orders. | Guard with `isSubmitting` and/or disable the button while the request is in flight. |
| Required | Fail path | Attempt #2 rejects with no `.catch`, so there is no error UI and the rejection is unhandled.<br>The fixture never disables the button today; a common partial fix disables on submit without `finally`, which then leaves Place order stuck forever after failure.<br>REQUIREMENTS: after a failed submit, the button must be usable again and a clear, retryable error must show. | Pattern: `isSubmitting` → disable → try/catch → error message → `finally` enable. |
| Required | XSS | Summary builds HTML with raw name/notes.<br>`<img onerror=...>` can run; `<b>` becomes bold.<br>REQUIREMENTS: user-supplied text in the summary must show as plain text, never as HTML. | Use `textContent` / safe nodes; never `innerHTML` for user input. |
| Required | A11y | Errors are a red border only.<br>No message, no `aria-invalid`, no `aria-describedby`, no live region.<br>REQUIREMENTS: errors must be visible and understandable to screen readers, not color alone. | Show error text; wire `aria-invalid` / `aria-describedby`.<br>Focus the first bad field; clear errors as they type. |
| Optional | HTML | Labels are wired correctly.<br>Missing `autocomplete="name"` / `autocomplete="email"`.<br>Email is `type="text"` + no `novalidate` story. | Add autocomplete.<br>Document why email is `type="text"`, or switch to `type="email"`. |
| Optional | UX / CSS | The empty summary card always takes space.<br>No submit `:disabled` / busy styles.<br>After success the form stays fully editable. | Hide the summary until it has content.<br>Add disabled/busy styles. |
| Optional | JS | Naming is mixed (`form`, `nameInput`, `submitBtn`, `summaryEl`). | Prefer `*El` for nodes (`formEl`, `nameInputEl`) and stick to it.<br>Null-check every `getElementById` before use. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 09 Form Validation (`exercises/09-form-validation/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email bar | "Genuinely valid" invites regex arguments.<br>BRIEF already shows `a@`, but REQUIREMENTS do not list pass/fail examples. | Concrete examples: `a@` must fail; `alex@example.com` must pass. |
| Required | Fail path | Attempt #2 rejects with no UI unless the interviewee reads the harness (`submitAttempts === 2`).<br>There is no comment calling that out, so many never trigger it and miss the missing-error / stuck-button trap. | BRIEF: the 2nd accepted submit fails → what should the user see, and can they retry?<br>Add a short harness comment that attempt #2 rejects. |
| Required | XSS | The payload is already in the BRIEF.<br>Without a written root-cause note, some rooms treat a silent escape as enough. | Keep the payload; make a short written root-cause note a scored deliverable. |
| Required | Error copy | REQUIREMENTS already say "not color alone".<br>Solutions still diverge (`aria-describedby` vs a live region vs mystery text). | Give sample text ("Enter a valid email...").<br>Expect `aria-describedby` so solutions look alike when scoring. |
```

---

### 10 Search Autocomplete

Folder: `exercises/10-search-autocomplete/`

Copy one block into an AI / agent / LLM. Point it at `exercises/10-search-autocomplete/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 10 Search Autocomplete (`exercises/10-search-autocomplete/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | Each `input` schedules a new `setTimeout` without `clearTimeout` on the previous one.<br>Type `iphone` quickly and you get one timer per key (six keys → six fetches).<br>REQUIREMENTS: requests should fire after the user pauses, not on every keystroke. | Real debounce: always `clearTimeout(debounceTimer)` before scheduling the next timeout. |
| Required | Clear | Emptying the field hides the list and returns early, but leaves any pending debounce timer alive.<br>That timeout still calls `fakeFetchSuggestions` with the *previous* query and can reopen the list after clear.<br>In-flight fetches are also not ignored, so a late response can repopulate the list.<br>REQUIREMENTS: after clear, no suggestions until the user types again. | On empty query, clear the timer and ignore in-flight work (same token/abort as out of date results).<br>Do not call `fakeFetchSuggestions` when the query is empty. |
| Required | Stale results | There is no request token or abort.<br>With 100-600ms jitter, an older suggestions response can win over a newer query.<br>REQUIREMENTS: shown suggestions must match the most recently typed query. | Use a request id or `AbortController` so only the latest query can call `renderSuggestions`. |
| Required | Dismiss / keys | Click outside does not close the list.<br>There is no Arrow / Enter handling.<br>CSS defines `.autocomplete__item--highlighted`, but JS never applies it.<br>REQUIREMENTS: closable by outside click, and keyboard navigable with arrows + Enter.<br>Escape is not in REQUIREMENTS (see Author). | Drive `activeIndex` + `aria-activedescendant` (or apply `--highlighted`), or delete the unused class.<br>Wire outside click to close, plus keyboard nav/select. |
| Optional | HTML / a11y | The field needs a durable accessible name (label).<br>It is not a real combobox pattern today.<br>Nice-to-have / strong signal (Pass+) for a full combobox pattern. | Add a label; `type="search"` fits.<br>Use `combobox` / `listbox` / `option` with expanded / controls / activedescendant. |
| Optional | UX / CSS | There is no loading state while the fetch runs.<br>Empty matches just hide the list (no "No results").<br>Hint contrast is weak (`#9ca3af`). No `:focus-visible`. | Show a loading state.<br>Show "No results" when the query has zero matches.<br>Add `:focus-visible`; check hint ≥4.5:1 if it carries instruction. |
| Optional | JS | Clicks rebind on each item after every render.<br>Naming is mostly good (`inputEl`, `listEl`). | Delegate clicks on the list instead of per-item rebinds.<br>Null-check `getElementById` before use. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 10 Search Autocomplete (`exercises/10-search-autocomplete/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | BRIEF already asks interviewees to compare how many times `fakeFetchSuggestions` runs vs a real debounce while typing `iphone`.<br>REQUIREMENTS already ban a request on every keystroke.<br>The gap is soft proof: "consider" / Network-like intuition is easy to skip, so interviewers may Pass a broken debounce. | In the BRIEF, require a hard check: log (or breakpoint) call count while typing `iphone` quickly; broken code fires once per key, fixed code fires once after the pause. |
| Required | Clear vs in-flight | Clearing mid-debounce (pending timer) is a different bug from a fetch already in flight.<br>One score checklist row hides half the fix. | Use separate score checklist rows so both the pending timer and in-flight fetch get fixed. |
| Optional | Escape | Outside click is in REQUIREMENTS; Esc to close is standard but unspoken.<br>Interviewers invent their own bar for Fail vs nice-to-have (Pass+). | Add Esc to REQUIREMENTS, or document it as out of scope / Pass+. |
| Optional | Highlight | `.autocomplete__item--highlighted` is unused on purpose.<br>Interviewees may delete the CSS blindly without noticing the keyboard-highlight smell. | Mention keyboard highlighting in the BRIEF so interviewees notice the unused class and wire it up (or remove it on purpose). |
```


