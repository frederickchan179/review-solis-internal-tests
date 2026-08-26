# Requirements — Cart Quantity Stepper

- Quantity must always be a positive whole number — no negative numbers, no zero, no decimals, no non-numeric values.
- If the user decreases quantity below 1 (via the "-" button or by typing), the item must be removed from the cart entirely — quantity must never be silently kept at 1 when the user's intent was clearly to go lower.
- The total shown must always correspond to the quantity currently displayed — never a stale total from an earlier quantity.
- Quantity and total changes must be announced to assistive technology (screen readers).
