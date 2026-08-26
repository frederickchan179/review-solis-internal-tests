# Test 02 — FAQ Search (Debug & Fix)

## Time budget

35–45 minutes.

## Scenario

A help-center search box calls a (simulated) backend search API as the user types and highlights the matched keyword in the results. It "works" in a quick demo, but breaks down under real usage — fast typing, mixed-case queries, and certain article content.

## Files

- `index.html`
- `style.css`
- `script.js`

The backend is simulated with `fakeSearchAPI()` in `script.js`, which resolves after a **random delay (100–800ms)** — this is intentional and mimics a real network call. Do not "fix" it by making it synchronous; treat it like a real API you can't control the timing of.

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task

1. Type into the search box the way a real user would — including typing quickly, in different cases (e.g. "password" vs "Password"), and clearing the field.
2. Pay attention not just to whether results appear, but whether they're the *correct* and *consistent* results — including what happens with the loading/empty states.
3. Find and fix the issues. Explain any security-relevant issue you find, even if you also fix it.
4. Keep the existing code style: HTML uses BEM naming, CSS is plain, JS is ES6 in a functional style.
5. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit

- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
