# Test 06 — Modal / Dialog (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A newsletter signup modal opens over the page content. It visually looks fine at first glance, but breaks several standard, expected modal behaviors — the kind of thing a QA pass with only a mouse would miss entirely.

## Files
- `index.html`
- `style.css`
- `script.js`

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Open the modal using only your **keyboard** (Tab to the button, Enter/Space to activate) and try to interact with it using only the keyboard from there — including trying to close it with Esc, and Tab-ing through its contents.
2. Open the modal with a mouse, then try scrolling the page behind it.
3. Scroll down the page first, then open the modal, and check whether anything visually overlaps it.
4. Find and fix the issues.
5. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
6. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
