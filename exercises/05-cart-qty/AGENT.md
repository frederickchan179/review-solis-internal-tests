# Agent prompts - 05 Cart Quantity

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

