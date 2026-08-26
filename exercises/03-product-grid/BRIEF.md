# Test 03 — Product Grid with Load More (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A product listing grid loads products in pages of 8, either via a "Load more" button or infinite scroll. It works for the first click or two, but has bugs that show up with repeated use — exactly the kind of thing that looks fine in a demo and breaks in production.

## Files
- `index.html`
- `style.css`
- `script.js`

`fakeFetchProducts()` simulates a real API call with a 500ms delay — treat it as a network call you can't make instant.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Use the grid the way a real user would: click "Load more" several times, scroll to trigger the infinite-scroll behavior, click "Load more" rapidly (double-click), and try "Reset Grid" followed by scrolling again.
2. Watch for duplicate items, missed/extra network calls, and anything that still fires after you'd expect it to have stopped.
3. Find and fix the issues.
4. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
5. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
