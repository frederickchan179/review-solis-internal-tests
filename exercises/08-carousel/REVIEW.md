# Review - 08 Carousel

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Destroy leak | “Destroy carousel” removes the node but never clears `autoplayTimer`. Autoplay keeps calling `nextSlide` on a detached DOM (BRIEF: watch the console). That is a lifecycle leak, not a clean teardown. | One `destroy()` path: clear the timer, drop listeners, then remove the node. |
| Required | Pause / resume | There is no hover or focus pause, and nothing resumes after a delay. Live check: hovering the carousel does not stop autoplay. REQUIREMENTS: pause on hover/focus, then resume a couple of seconds after leave/blur; never stop permanently from one hover. | One shared timer helper for hover / focus / reduced motion: clear on enter, schedule resume on leave. |
| Required | Reduced motion | Autoplay always starts in `startAutoplay()` with no `prefers-reduced-motion` check. The track also uses `transition: transform 0.4s`, which still animates hard under reduce. REQUIREMENTS: autoplay must not start when reduce motion is set. | Honor `prefers-reduced-motion: reduce` for autoplay and for the track transform transition. |
| Required | Swipe | Only `touchstart` stores X. There is no `touchend` (or equivalent), so swipe never changes slides. REQUIREMENTS: swiping left/right must move next/prev. | On `touchend`, compare delta to a threshold and call next/prev. |
| Required | Eager slides | All five slides mount up front in the track. If these were real images, off-screen work would load immediately. REQUIREMENTS: off-screen slide resources should not load until needed. | Keep current ±1 in the DOM, or use real `<img loading="lazy">` (or equivalent) so off-screen assets stay deferred. |
| Optional | Stacked timers | `startAutoplay` assigns a new `setInterval` without clearing an existing one. Calling it twice stacks timers and advances too fast. | Clear any existing interval before starting a new one. |
| Optional | A11y / UX | Real images would need `alt`. There is no “Slide X of N” live region / roledescription. No visible pause control. Dots are 8×8 with a hit area that is too small. Rebuilding dots every tick can steal focus. | Add `alt` when using real images.<br>Announce “Slide X of N”.<br>Add a visible pause control.<br>Pad dot hit areas ≥44px.<br>Toggle the active class instead of rebuilding dots each time. |
| Optional | CSS | Arrow and dot rules mix positioning and visuals inconsistently across the file. | Pick one CSS property order and apply it to carousel rules. |
| Optional | JS | Naming mixes `trackEl` / `dotsEl` / `carouselEl` with `prevBtn` / `nextBtn` / `destroyBtn`. Null-checks after `getElementById` may be missing. | Keep one scheme (`*El` / `*Btn`).<br>Null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Lazy | REQUIREMENTS say don’t load off-screen resources, but the fixture is colored `<div>`s. Candidates guess the intended pattern and graders disagree on what “done” looks like. | Say: keep current ±1 in the DOM, or include a sample `<img>` so lazy-loading is observable. |
| Required | Resume delay | “A couple of seconds” is too soft for grading resume delay after hover/focus leave. | Pick a number (e.g. 2000ms) in REQUIREMENTS. |
| Required | Reduced motion | Autoplay-off is required, but the CSS transform transition is unspoken. People “pass” while slides still animate hard under reduce motion. | Also call out the CSS transform transition under `prefers-reduced-motion`. |
| Required | Destroy | Destroy-without-clearing-the-interval is the clearest lifecycle trap in the suite. Polishing the fixture would hide it. | Don’t remove Destroy when polishing the fixture; keep the leak as a graded trap. |
