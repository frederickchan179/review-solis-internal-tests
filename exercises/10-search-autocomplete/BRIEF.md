# Test 10 — Search Autocomplete (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A product search box shows a dropdown of matching suggestions as the user types, backed by a simulated API with debounce. It looks like it's debouncing correctly, but isn't quite — and it's missing some very standard dropdown/autocomplete behaviors.

## Files
- `index.html`
- `style.css`
- `script.js`

`fakeFetchSuggestions()` simulates a real API call with a random 100–600ms delay — treat it as a real network call you can't make instant.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Type a full word quickly (e.g. "iphone") and, using your browser's Network-like intuition (or just add a `console.log`/breakpoint if you want to verify), consider how many times `fakeFetchSuggestions` is actually being called versus how many times you'd expect with proper debouncing.
2. Type a query, then click somewhere else on the page (not a suggestion, not clearing the input) — does the dropdown close?
3. Type a query and try to select a suggestion using only the keyboard (arrow keys + Enter).
4. Find and fix the issues.
5. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
6. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
