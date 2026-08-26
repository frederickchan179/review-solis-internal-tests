# Review - 04 Variant Selector

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text says "Out of stock", but `addToCartBtn.disabled` is hardcoded to `false` on every render.<br>White/L and Navy/M stay fully clickable even though `available` is false for them.<br>Right now the price-crash bug (next row) throws before any "Added..." message can show, so no combo visibly completes today; fix that crash alone and these two variants become genuinely addable.<br>REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when `variant.available` is false.<br>Optionally disable or hide out-of-stock sizes as well (see Author). |
| Required | Price crash | Prices arrive as cent strings (`'2199'`), and every variant uses this string format, not just the out-of-stock ones.<br>The price label uses `formatPrice` and shows `$21.99` (correct).<br>Add to cart calls `.toFixed` directly on that string; strings have no `.toFixed` method, so it throws for any color/size combo, in stock or not (confirmed live: clicking Add to cart on White/S never sets the cart message).<br>REQUIREMENTS: Add to cart must not crash for any combination the UI lets the user select; prices must display correctly. | One money path end to end.<br>Add to cart should reuse `formatPrice` (or integer cents), not call number methods on a raw string. |
| Required | Color → size | Changing color does not rethink size at all.<br>Confirmed live: selecting White/L, then clicking Navy, leaves size L selected and shows "Out of stock" for Navy/L instead of switching to the first in-stock size (Navy/S).<br>REQUIREMENTS: if the current size is still available for the new color, keep it; otherwise select the first available size for that color. | After a color change, run a small `reconcileSize(color)` helper against `available: true`. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to a group.<br>Stock and "Added..." are not live (`aria-live` is absent on both elements, confirmed live).<br>Option buttons in templates omit `type="button"`. | Use a labelled group (`aria-labelledby` / radiogroup + pressed/checked).<br>Make stock and success live.<br>Set `type="button"` on generated options. |
| Optional | CSS / UX | Add to cart has no `:disabled` look, so a correct disable is easy to miss.<br>Out-of-stock copy is quiet gray while the CTA still looks primary. | Add `:disabled` styles.<br>Give out-of-stock sizes a clear disabled or hidden treatment. |
| Optional | JS | Clicks use `event.target === addToCartBtn`, which misses clicks on child nodes.<br>The success message is not cleared when the selection changes. | Prefer `closest('#addToCartBtn')` (or a dedicated listener).<br>Clear the success message when color/size changes. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | REQUIREMENTS already say: keep the size if still "available" for the new color, else pick the first available size.<br>Interviewers still argue "size exists for that color" vs "in stock (`available: true`)". | Define `available` as in stock (`available: true`), not merely "this size exists for that color". |
| Required | OOS UI | Disable Add to cart only, hide out-of-stock sizes, or allow select-but-block at Add to cart?<br>Interviewees pick different policies and interviewers disagree. | Pick one out-of-stock policy in REQUIREMENTS so scoring stays consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money.<br>Without a score note, some interviewers Pass it because "it doesn't throw". | Score checklist: Fail `$2199.00` (or any display that skips cents → dollars). |
| Optional | Disabled look | The fixture has no `:disabled` styling on Add to cart, so a correct out-of-stock fix is invisible in screenshots. | Add `:disabled` styling in the fixture (or require it) so the correct fix shows. |
