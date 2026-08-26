# Test 04 — Product Variant Selector (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A product page lets a shopper pick a color and size, see the price update, and add the selected variant to their cart. This is modeled closely on how a real commerce platform (e.g. Shopify) exposes variant data — including price coming back as a string in cents, which is a common real-world gotcha.

## Files
- `index.html`
- `style.css`
- `script.js`

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Try every color/size combination, including ones you'd expect to be out of stock.
2. Try to add an out-of-stock combination to your cart.
3. Watch the browser console for errors while interacting with the page.
4. Find and fix the issues.
5. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
6. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
