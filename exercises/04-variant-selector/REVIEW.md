# Review - 04 Variant Selector

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text correctly says “Out of stock” for White/L and Navy/M, but `renderSelection` sets `addToCartBtn.disabled = false` on every render. Those out-of-stock combinations stay clickable. REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when the selected variant is `available: false`.<br>Keep it enabled only for in-stock variants. |
| Required | Price crash | Prices arrive as cent strings (`'2199'`). The price label uses `formatPrice` and shows `$21.99` correctly, but Add to cart calls `.toFixed` on the string and throws. REQUIREMENTS: Add to cart must never crash for a selectable combination, and prices must display correctly. | Use one money path end to end.<br>Add to cart should reuse `formatPrice` (or integer cents), never call number methods on the raw string. |
| Required | Color → size | Changing color does not rethink the selected size. White/M → Navy keeps M, which is out of stock for Navy, instead of moving to the first in-stock size (Navy/S). REQUIREMENTS: keep size only if still available; otherwise select the first available size for the new color. | Add a small `reconcileSize(color)` (or equivalent) on color change before re-render. |
| Optional | Wrong “fix” | `Number(price).toFixed(2)` stops the crash but forgets `/100`, so the message prints `$2199.00`. That still fails “correctly formatted” even though the console is quiet. Easy near-miss in review. | Divide cents by 100 (or reuse `formatPrice`).<br>Treat `$2199.00` as Fail, not a Pass. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to the option groups. Stock and “Added…” update silently with no live region, so screen readers may miss the change. Option buttons in the templates omit `type="button"`. | Wire groups with `aria-labelledby` or radiogroup + pressed/checked semantics.<br>Make stock and “Added…” live (`aria-live`).<br>Set `type="button"` on option buttons. |
| Optional | CSS / UX | There is no `:disabled` look for Add to cart, so a correct out-of-stock disable is easy to miss in screenshots. Out-of-stock copy is quiet gray while the CTA still looks primary. Out-of-stock sizes lack a clear disabled/hidden treatment. CSS property order is uneven. | Style `:disabled` Add to cart.<br>Give out-of-stock sizes a clear disabled or hidden treatment.<br>Normalize CSS property order. |
| Optional | JS | `event.target === addToCartBtn` misses clicks on nested content inside the button. The success message sticks after the selection changes. Out-of-stock sizes stay selectable, so an Add-to-cart-only block is easy to miss in review. Naming / null-checks are inconsistent. | Prefer `closest('#addToCartBtn')` (or listen on the button).<br>Clear the success message when selection changes.<br>Disable or hide out-of-stock sizes in `renderSizeOptions`.<br>Keep one naming scheme (`*El` / `*Btn`) and null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | Interviewers argue “size still exists for that color” vs “size is in stock” when keeping selection after a color change. That ambiguity scores the color→size trap inconsistently. | REQUIREMENTS wording: keep size only if that variant is in stock; else select the first in-stock size for the new color. |
| Required | OOS UI | Disable Add to cart only, hide out-of-stock sizes, or allow select-but-block-at-Add-to-cart? Interviewees pick different policies and interviewers disagree. | Pick one out-of-stock policy in REQUIREMENTS so interview scoring stays consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money. Without a score checklist note, some interviewers Pass it because “it doesn’t throw”. | Score checklist should Fail `$2199.00` (or any display that skips the cents→dollars conversion). |
| Optional | Disabled look | The fixture has no `:disabled` styling on Add to cart, so a correct out-of-stock fix is invisible in screenshots and live review. | Add `:disabled` styling in the fixture (or require it) so the correct out-of-stock fix shows. |
