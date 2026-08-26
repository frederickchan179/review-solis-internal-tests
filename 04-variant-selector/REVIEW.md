# Review - 04 Variant Selector

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | OOS | - Stock text says “Out of stock”<br>- Add to cart never disabled (`disabled = false` every render)<br>- White/L and Navy/M stay clickable |
| Required | Price crash | - Prices arrive as **cent strings** (`'2199'`)<br>- Label uses `formatPrice` → `$21.99` (correct)<br>- ATC calls `.toFixed` on the string → throws<br>- Fix: one money path; ATC uses same formatter; cents as integers end to end |
| Required | Color → size | - Changing color does not rethink size<br>- White/M → Navy keeps **M** (OOS) instead of first in-stock size (Navy/S)<br>- Fix: small `reconcileSize(color)` helper |
| Optional | Wrong “fix” | - `Number(price).toFixed(2)` stops the crash<br>- Forgets `/100` → prints `$2199.00`<br>- Still fails “correctly formatted” |
| Optional | HTML / a11y | - Color/Size labels are loose `<span>`s → wire to group (`aria-labelledby` / radiogroup + pressed/checked)<br>- Stock and “Added…” should be live<br>- Option buttons in templates should set `type="button"` |
| Optional | CSS / UX | - No `:disabled` look for ATC → correct disable easy to miss<br>- OOS copy quiet gray while CTA still looks primary<br>- Give OOS sizes clear disabled/hidden treatment<br>- Normalize CSS property order |
| Optional | JS | - Prefer `closest('#addToCartBtn')` over `event.target === addToCartBtn`<br>- Clear success message when selection changes<br>- Disable OOS sizes in `renderSizeOptions` (clearer than ATC-only block)<br>- Keep one naming scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| “Available” is ambiguous | - Graders argue “exists” vs “in stock”<br>- Req: keep size only if that variant is in stock; else first in-stock size for new color |
| OOS UI policy | - Disable, hide, or select-but-block-at-ATC?<br>- Pick one for consistent grading |
| Wrong price “fix” | - `Number(price).toFixed(2)` without `/100` is a classic near-miss<br>- Rubric should Fail `$2199.00` |
| Disabled is invisible | - No `:disabled` styling on ATC<br>- Add one so correct OOS fix shows in screenshots |
