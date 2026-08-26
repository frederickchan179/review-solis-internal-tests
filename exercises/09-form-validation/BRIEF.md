# Test 09 — Checkout Form Validation (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A checkout form validates name and email, submits an order to a (simulated) backend, and shows an order summary. It "works" for a normal, honest, single submission — but several things break under slightly different but entirely realistic conditions.

## Files
- `index.html`
- `style.css`
- `script.js`

`fakeSubmitOrder()` simulates a real API call with a 600ms delay.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Try submitting with an obviously invalid email (e.g. just `"a@"`) and see if it's accepted.
2. Try clicking "Place order" twice quickly (or submitting via Enter key and then clicking) and watch the order count.
3. Try entering something like `<b>test</b>` or `<img src=x onerror=alert(1)>` in the name or notes field and submit — see what happens in the summary.
4. Trigger a validation error and consider what a screen reader user would actually hear.
5. Find and fix the issues.
6. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
7. AI tools are allowed. Be ready to explain each bug and fix in your own words — especially anything security-related.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
