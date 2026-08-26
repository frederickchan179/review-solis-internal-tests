# Review - 05 Cart Quantity

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Remove | - `Math.max(1, …)` → `-` at qty 1 does nothing<br>- Line never leaves the cart<br>- Req: going below 1 must remove the line |
| Required | Bad input | - Manual handler uses raw `parseInt`<br>- Type `abc` then `+` → field shows **`NaN`**<br>- `0` / negatives can enter state |
| Required | Desync | - Type `2.9` → input stays `2.9`, state becomes `2`<br>- Display and state diverge<br>- Fix: always write normalized value back into the input |
| Required | Structure | - Use one `normalizeQty` + one `setQuantity` for buttons and typing<br>- Don’t scatter `parseInt` / `Math.max`<br>- Always mirror normalized value into the input |
| Required | Race | - Every change fires `fakeUpdateCartAPI` with no ordering<br>- Mash `+` → total can belong to older qty<br>- Fix: request token (or `AbortController`); debounce typing if wanted |
| Required | A11y | - Req asks for screen-reader announcements<br>- Total (and qty) never speak<br>- Missing `aria-live` |
| Optional | HTML | - Qty has no label<br>- Use `type="number"` + `min`, or keep `text` but own remove-at-0<br>- Wrap stepper in a labelled group (today only `+/-` have names) |
| Optional | UX / CSS | - No pending state while total loads (stuck feel 100-600ms)<br>- `-` never disables at min; no max<br>- Hit targets 32×32 (aim ≥44px)<br>- No disabled/pending styles; CSS property order messy |
| Optional | JS | - `UNIT_PRICE = 12.0` is a float → prefer integer cents end to end<br>- Format at the edge<br>- Prefer `input` (or blur-normalize) vs blur-only lag<br>- Naming: `quantityInput` → `quantityInputEl` (or one `*Input` / `*Btn` / `*El` scheme)<br>- Null-check DOM queries before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Remove UX missing | - Req says remove below 1, not what UI becomes<br>- Empty cart? Hide row? Where does focus go?<br>- Without that, every candidate invents a different empty state |
| Qty rules clash | - “Always a positive whole number” vs “below 1 removes” needs one clarifying sentence<br>- While line exists: qty integer ≥ 1; attempt below 1 → remove line |
| Announce is vague | - “Must be announced” - as what?<br>- Sample: `Quantity 2, total $24.00` |
| Race already hinted | - Keep rapid `+` in BRIEF<br>- Add: watch whether total matches the input |
