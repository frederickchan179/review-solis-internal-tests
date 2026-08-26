# Review - 04 Variant Selector

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text correctly says “Out of stock” for White/L and Navy/M, but `renderSelection` sets `addToCartBtn.disabled = false` on every render. Those OOS combinations stay clickable. REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when the selected variant is `available: false` (and keep it enabled only for in-stock variants). |
| Required | Price crash | Prices arrive as cent strings (`'2199'`). The price label uses `formatPrice` and shows `$21.99` correctly, but Add to cart calls `.toFixed` on the string and throws. REQUIREMENTS: ATC must never crash for a selectable combination, and prices must display correctly. | Use one money path end to end. ATC should reuse `formatPrice` (or integer cents), never call number methods on the raw string. |
| Required | Color → size | Changing color does not rethink the selected size. White/M → Navy keeps **M**, which is OOS for Navy, instead of moving to the first in-stock size (Navy/S). REQUIREMENTS: keep size only if still available; otherwise select the first available size for the new color. | Add a small `reconcileSize(color)` (or equivalent) on color change before re-render. |
| Optional | Wrong “fix” | `Number(price).toFixed(2)` stops the crash but forgets `/100`, so the message prints `$2199.00`. That still fails “correctly formatted” even though the console is quiet. | Divide cents by 100 (or reuse `formatPrice`). Treat `$2199.00` as Fail, not a Pass. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to the option groups. Stock and “Added…” update silently with no live region. Option buttons in the templates omit `type="button"`. | Wire groups with `aria-labelledby` or radiogroup + pressed/checked semantics.<br>Make stock and “Added…” live (`aria-live`).<br>Set `type="button"` on option buttons. |
| Optional | CSS / UX | There is no `:disabled` look for ATC, so a correct OOS disable is easy to miss in screenshots. OOS copy is quiet gray while the CTA still looks primary. OOS sizes lack a clear disabled/hidden treatment. CSS property order is uneven. | Style `:disabled` ATC.<br>Give OOS sizes a clear disabled or hidden treatment.<br>Normalize CSS property order. |
| Optional | JS | `event.target === addToCartBtn` misses clicks on nested content inside the button. The success message sticks after the selection changes. OOS sizes stay selectable, so an ATC-only block is easy to miss in review. Naming / null-checks are inconsistent. | Prefer `closest('#addToCartBtn')` (or listen on the button).<br>Clear the success message when selection changes.<br>Disable or hide OOS sizes in `renderSizeOptions`.<br>Keep one naming scheme (`*El` / `*Btn`) and null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | Graders argue “size still exists for that color” vs “size is in stock” when keeping selection after a color change. That ambiguity grades the color→size trap inconsistently. | REQUIREMENTS wording: keep size only if that variant is in stock; else select the first in-stock size for the new color. |
| Required | OOS UI | Disable ATC only, hide OOS sizes, or allow select-but-block-at-ATC? Candidates pick different policies and graders disagree. | Pick one OOS policy in REQUIREMENTS so grading is consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money. Without a rubric note, some graders Pass it because “it doesn’t throw”. | Rubric should Fail `$2199.00` (or any display that skips the cents→dollars conversion). |
| Optional | Disabled look | The fixture has no `:disabled` styling on ATC, so a correct OOS fix is invisible in screenshots and live review. | Add `:disabled` styling in the fixture (or require it) so the correct OOS fix shows. |
