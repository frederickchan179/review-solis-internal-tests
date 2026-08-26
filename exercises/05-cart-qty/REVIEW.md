# Review - 05 Cart Quantity

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove | `changeQuantity` uses `Math.max(1, …)`, so `-` at qty 1 does nothing and the line never leaves the cart. REQUIREMENTS: decreasing below 1 must remove the line entirely, not silently clamp at 1. | When qty would go below 1 (button or typing), remove the line from the cart instead of clamping. |
| Required | Bad input | The manual handler uses raw `parseInt` with no validation. Type `abc` then press `+` → the field can show **`NaN`**. `0` and negatives can also enter state. REQUIREMENTS: qty must always be a positive whole number while the line exists. | Reject or normalize invalid input. Keep qty a positive integer while the line exists; treat below-1 as remove. |
| Required | Desync | Type `2.9` → the input can stay `2.9` while state becomes `2` via `parseInt`. Display and state diverge, so the total path no longer matches what the user sees. | Always write the normalized value back into the input after every change path. |
| Required | Structure | `parseInt` / `Math.max` logic is scattered across buttons and typing. It is easy to fix one path and leave another broken (e.g. buttons correct, typing still NaN). | Use one `normalizeQty` and one `setQuantity` for buttons and typing. Always mirror the normalized value into the input. |
| Required | Race | Every change fires `fakeUpdateCartAPI` with no ordering (100-600ms jitter). Mash `+` and the total can belong to an older qty. REQUIREMENTS: the total shown must match the quantity currently displayed. | Use a request token (or `AbortController`) and ignore stale responses. Debounce typing if wanted. |
| Required | A11y | REQUIREMENTS ask for screen-reader announcements when qty/total change. The total updates silently with no `aria-live` (or equivalent), so SR users never hear the new total. | Put `aria-live="polite"` on the total (and qty if needed) so each successful update is announced. |
| Optional | HTML | The qty field has no `<label>`. `type="text"` plus unclear min behavior makes remove-at-0 harder to reason about. Only `+/-` have accessible names; the stepper group itself is unlabeled. | Label the qty field.<br>Use `type="number"` + `min`, or keep `text` but own remove-at-0 explicitly.<br>Wrap the stepper in a labelled group. |
| Optional | UX / CSS | There is no pending state while the total loads (100-600ms feels stuck). `-` never disables at min; there is no max. Hit targets are 32×32 (aim ≥44px). No disabled/pending styles; CSS property order is messy. | Show pending while the total loads.<br>Disable `-` at min; define a max if needed.<br>Pad hit targets ≥44px.<br>Add disabled/pending styles and normalize property order. |
| Optional | JS | `UNIT_PRICE = 12.0` is a float (money-in-float smell). Blur/`change`-only normalize lags behind typing. Naming mixes `quantityInput` with `*Btn` / no `*El` scheme. Null-checks may be missing. | Prefer integer cents end to end; format at the edge.<br>Prefer `input` (or blur-normalize deliberately) vs silent lag.<br>Rename toward `quantityInputEl` (or one `*Input` / `*Btn` / `*El` scheme).<br>Null-check DOM queries before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove UX | REQUIREMENTS say remove below 1, but not what the UI becomes afterward. Every candidate invents a different empty state (hide row, “cart empty”, leave a hole), and graders disagree. | Spell out empty cart / hide row / where focus should go after remove. |
| Required | Qty rules | “Always a positive whole number” vs “below 1 removes” looks like a clash if read literally. Graders argue whether `0` may appear momentarily. | Clarify: while the line exists, qty is an integer ≥ 1; an attempt to go below 1 removes the line. |
| Required | Announce | “Must be announced” is vague, so SR solutions diverge (live region text, polite vs assertive, qty-only vs total-only). | Give a sample announcement, e.g. `Quantity 2, total $24.00`. |
| Optional | Race | Rapid `+` is hinted in the BRIEF, but graders may not watch whether the total matches the input after the burst. | Keep rapid `+` in the BRIEF; add: watch whether the final total matches the input. |
