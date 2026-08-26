# Test 08 — Image Carousel (Debug & Fix)

## Time budget
35–45 minutes.

## Scenario
A product gallery carousel auto-advances every 3 seconds, supports arrow/dot navigation, and is meant to support touch swipe on mobile. Slides are represented as colored blocks here (imagine each one is a real `<img>` in production) so you can focus on behavior rather than needing real image assets.

## Files
- `index.html`
- `style.css`
- `script.js`

- `REQUIREMENTS.md` — read this fully before you start, and re-check your fixes against it before submitting. Some fixes that resolve a visible bug can still violate a rule stated here.

## Your task
1. Let the carousel autoplay for a bit and watch how it behaves.
2. Open your browser's dev tools and click "Destroy carousel" — then watch the console over the next several seconds.
3. If you have a touch device or can simulate touch in dev tools, try swiping.
4. Think about a user who has "reduce motion" turned on in their OS accessibility settings — would this carousel respect that?
5. Assume every slide will eventually be a real `<img>` — think about what the current approach means for page load performance.
6. Find and fix the issues.
7. Keep the existing code style: BEM HTML, plain CSS, ES6 functional-style JS.
8. AI tools are allowed. Be ready to explain each bug and fix in your own words.

## What to submit
- Fixed `index.html`, `style.css`, `script.js`.
- A short note listing each bug found and how you fixed it.
