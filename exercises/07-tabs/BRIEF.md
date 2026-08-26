# Test 07 — Tabs Component (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A product detail "tabs" widget (Description / Sizing / Shipping & Returns / Reviews) loads its configuration and content from a simulated CMS/API. It works, but doesn't follow standard tab behavior, and does more network work than it needs to.

## Files
- `index.html`
- `style.css`
- `script.js`

`fakeFetchTabs()` and `fakeFetchTabContent()` simulate real API calls with delays — treat them as real network calls.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Load the page and check which tab opens by default — then look at what `fakeFetchTabs()` actually returns and whether the UI is respecting it.
2. Try navigating the tabs using only your keyboard.
3. Click back and forth between tabs a few times and think about whether the app is doing more work than necessary.
4. Resize your browser to a narrow (mobile) width and check the tab list.
5. Find and fix the issues.
6. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
7. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
