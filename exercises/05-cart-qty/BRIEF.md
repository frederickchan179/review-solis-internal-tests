# Test 05 — Cart Quantity Stepper (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A cart line item lets a shopper adjust quantity with +/- buttons or by typing a number directly, and the total re-calculates via a (simulated) server call each time. It looks correct with slow, careful clicking — real users are neither slow nor careful.

## Files
- `index.html`
- `style.css`
- `script.js`

`fakeUpdateCartAPI()` simulates a real network call with a random 100–600ms delay — treat it as something you can't make instant or synchronous.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Click "+" rapidly several times in a row and watch whether the total shown actually matches the quantity shown.
2. Try typing directly into the quantity field: try `0`, a negative number, a decimal, and non-numeric text.
3. Consider what a screen reader user would experience when the total changes.
4. Find and fix the issues.
5. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
6. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
