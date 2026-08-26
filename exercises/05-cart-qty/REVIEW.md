# Review - 05 Cart Quantity

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove | `changeQuantity` uses `Math.max(1, …)`, so pressing `-` at quantity 1 does nothing and the line never leaves the cart. REQUIREMENTS: going below 1 must remove the line, not quietly keep it at 1. | When quantity would go below 1 (button or typing), remove the line from the cart instead of forcing it back to 1. |
| Required | Bad input | The typing handler uses raw `parseInt` with no validation. Type `abc` then press `+` → the field can show `NaN`. `0` and negatives can also get into state. REQUIREMENTS: while the line exists, quantity must stay a positive whole number. | Reject or clean up invalid input.<br>While the line exists, keep quantity as a positive integer; treat below-1 as remove. |
| Required | Desync | Type `2.9` → the input can still show `2.9` while state becomes `2` via `parseInt`. What the user sees and what the app uses no longer match, so the total can drift from the field. | After every change path, write the cleaned value back into the input. |
| Required | Structure | `parseInt` / `Math.max` logic is copied across buttons and typing. It is easy to fix one path and leave another broken (buttons fine, typing still `NaN`). | Use one `normalizeQty` and one `setQuantity` for both buttons and typing.<br>Always mirror the cleaned value into the input. |
| Required | Race | Every change calls `fakeUpdateCartAPI` with no ordering (100-600ms delay). Press `+` quickly and the total can belong to an older quantity. REQUIREMENTS: the total on screen must match the quantity currently shown. | Use a request token (or `AbortController`) and ignore out of date responses.<br>Debounce typing if useful. |
| Required | A11y | REQUIREMENTS ask for screen-reader announcements when quantity or total changes. The total updates silently with no `aria-live` (or equivalent), so screen readers never hear the new total. | Put `aria-live="polite"` on the total (and quantity if needed) so each successful update is announced. |
| Optional | HTML | The quantity field has no `<label>`. `type="text"` plus unclear min behavior makes “remove at 0” harder to reason about. Only `+/-` have clear names; the stepper group itself is unlabeled. | Label the quantity field.<br>Use `type="number"` + `min`, or keep `text` but handle remove-at-0 explicitly.<br>Wrap the stepper in a labelled group. |
| Optional | UX / CSS | There is no “updating…” state while the total loads (100-600ms feels stuck). `-` never disables at the minimum; there is no max. Hit targets are 32×32 (aim ≥44px). No disabled/pending styles; CSS property order is messy. Nice-to-have / strong signal (Pass+) on pending UI and hit targets. | Show pending while the total loads.<br>Disable `-` at the minimum; define a max if needed.<br>Pad hit targets ≥44px.<br>Add disabled/pending styles and normalize property order. |
| Optional | JS | `UNIT_PRICE = 12.0` is a float (money stored as float is easy to get wrong). Cleaning only on blur/`change` lags behind typing. Naming mixes `quantityInput` with `*Btn` and no clear `*El` pattern. Null-checks may be missing. | Prefer integer cents end to end; format currency only when displaying.<br>Prefer the `input` event (or clean on blur on purpose) instead of silent lag.<br>Rename toward `quantityInputEl` (or one `*Input` / `*Btn` / `*El` pattern).<br>Null-check DOM queries before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Remove UX | REQUIREMENTS say remove below 1, but not what the UI becomes afterward. Every interviewee invents a different empty state (hide the row, “cart empty”, leave a hole), and interviewers disagree. | Spell out empty cart / hide row / where focus should go after remove. |
| Required | Qty rules | “Always a positive whole number” vs “below 1 removes” looks like a clash if read literally. Interviewers argue whether `0` may flash on screen. | Clarify: while the line exists, quantity is an integer ≥ 1; trying to go below 1 removes the line. |
| Required | Announce | “Must be announced” is vague, so screen-reader solutions diverge (what text, polite vs assertive, quantity-only vs total-only). | Give a sample announcement, e.g. `Quantity 2, total $24.00`. |
| Optional | Race | Rapid `+` is hinted in the BRIEF, but interviewers may not check whether the final total matches the input after the burst. | Keep rapid `+` in the BRIEF; add: watch whether the final total matches the input. |
