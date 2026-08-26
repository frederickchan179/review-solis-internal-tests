# Review - 04 Variant Selector

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | OOS | Stock text says "Out of stock", but `addToCartBtn.disabled = false` on every render.<br>White/L and Navy/M stay clickable and can still be added.<br>REQUIREMENTS: an out-of-stock variant must never be addable. | Disable Add to cart when `variant.available` is false.<br>Optionally disable or hide out-of-stock sizes as well (see Author). |
| Required | Price crash | Prices arrive as cent strings (`'2199'`).<br>The price label uses `formatPrice` and shows `$21.99` (correct).<br>Add to cart calls `.toFixed` on that string and throws.<br>REQUIREMENTS: Add to cart must not crash for any combination the UI lets the user select; prices must display correctly. | One money path end to end.<br>Add to cart should reuse `formatPrice` (or integer cents), not call number methods on a raw string. |
| Required | Color → size | Changing color does not rethink size.<br>White/M → Navy keeps M, which is out of stock, instead of the first in-stock size (Navy/S).<br>REQUIREMENTS: if the current size is still available for the new color, keep it; otherwise select the first available size for that color. | After a color change, run a small `reconcileSize(color)` helper against `available: true`. |
| Optional | Wrong "fix" | `Number(price).toFixed(2)` stops the crash but skips `/100`, so the UI can print `$2199.00`.<br>That still fails "correctly formatted". | Score this as Fail unless cents are divided by 100.<br>Integer cents in state; format only at the edge. |
| Optional | HTML / a11y | Color/Size labels are loose `<span>`s, not wired to a group.<br>Stock and "Added..." are not live.<br>Option buttons in templates should set `type="button"`. | Use a labelled group (`aria-labelledby` / radiogroup + pressed/checked).<br>Make stock and success live.<br>Set `type="button"` on generated options. |
| Optional | CSS / UX | Add to cart has no `:disabled` look, so a correct disable is easy to miss.<br>Out-of-stock copy is quiet gray while the CTA still looks primary. | Add `:disabled` styles.<br>Give out-of-stock sizes a clear disabled or hidden treatment. |
| Optional | JS | Clicks use `event.target === addToCartBtn`, which misses clicks on child nodes.<br>The success message is not cleared when the selection changes. | Prefer `closest('#addToCartBtn')` (or a dedicated listener).<br>Clear the success message when color/size changes. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Available | REQUIREMENTS already say: keep the size if still "available" for the new color, else pick the first available size.<br>Interviewers still argue "size exists for that color" vs "in stock (`available: true`)". | Define `available` as in stock (`available: true`), not merely "this size exists for that color". |
| Required | OOS UI | Disable Add to cart only, hide out-of-stock sizes, or allow select-but-block at Add to cart?<br>Interviewees pick different policies and interviewers disagree. | Pick one out-of-stock policy in REQUIREMENTS so scoring stays consistent. |
| Required | Price near-miss | `Number(price).toFixed(2)` without `/100` is a classic near-miss that still shows wrong money.<br>Without a score note, some interviewers Pass it because "it doesn't throw". | Score checklist: Fail `$2199.00` (or any display that skips cents → dollars). |
| Optional | Disabled look | The fixture has no `:disabled` styling on Add to cart, so a correct out-of-stock fix is invisible in screenshots. | Add `:disabled` styling in the fixture (or require it) so the correct fix shows. |
