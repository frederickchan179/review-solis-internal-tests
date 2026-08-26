# Review - 08 Carousel

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Destroy leak | "Destroy carousel" removes the node but never clears the interval.<br>Autoplay keeps calling `nextSlide` on a detached DOM (BRIEF: watch the console).<br>BRIEF-critical: lifecycle leak, not named in REQUIREMENTS. | One `destroy()`: clear the timer, drop listeners, then remove the node. |
| Required | Pause / resume | There is no hover or focus pause, and nothing resumes after a delay.<br>Hover does not stop autoplay.<br>REQUIREMENTS: pause immediately on hover or focus on controls; resume automatically a couple of seconds after leave/blur; never stop forever from one hover. | One shared timer helper for hover, focus, and reduced motion.<br>On leave/blur, wait a few seconds then restart (unless reduced motion). |
| Required | Reduced motion | Autoplay always starts; there is no `prefers-reduced-motion` check.<br>REQUIREMENTS: if the OS is set to reduce motion, autoplay must not start at all.<br>The track still has `transition: transform 0.4s` (CSS motion is not in REQUIREMENTS; see Author). | Skip `startAutoplay()` when `prefers-reduced-motion: reduce`. |
| Required | Swipe | Only `touchstart` stores X. There is no `touchend`, so swipe never changes slides.<br>REQUIREMENTS: swiping left/right must move to the next/previous slide. | On `touchend`, compare delta to a threshold and call next/prev. |
| Required | Eager slides | All five slides mount up front.<br>If these were real images, off-screen work would load immediately.<br>REQUIREMENTS: resources for off-screen slides should not load until needed. | Keep current ±1 in the DOM, or use real `<img loading="lazy">` (the fixture is colored divs; see Author). |
| Optional | Stacked timers | `startAutoplay` does not clear an existing interval.<br>Call it twice and timers stack. | Always `clearInterval` before starting a new one. |
| Optional | Reduced motion CSS | Autoplay-off can Pass while slides still animate hard on the transform transition. | Disable or shorten `transition` under `prefers-reduced-motion: reduce`. |
| Optional | A11y / UX | Real images would need `alt`.<br>No "Slide X of N" live region. Dots are 8×8 (pad hit area ≥44px).<br>Rebuilding dots every tick can steal focus. | Add `alt` (or keep text labels).<br>Announce slide changes; pad dots; toggle the active class instead of rebuilding. |
| Optional | JS / CSS | Naming mixes `trackEl` / `dotsEl` with `prevBtn` / `nextBtn`.<br>Arrow/dot rules mix positioning and visuals inconsistently. | Keep one `*El` / `*Btn` scheme; null-check queries.<br>Pick a CSS property order. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Lazy | REQUIREMENTS say don't load off-screen resources, but the fixture is colored `<div>`s.<br>Interviewees guess the intended pattern; interviewers disagree on what "done" looks like. | Say: keep current ±1 in the DOM, or include a sample `<img>` so lazy-loading is observable. |
| Required | Resume delay | "A couple of seconds" is too soft for scoring resume delay after hover/focus leave. | Pick a number (e.g. 2000ms) in REQUIREMENTS. |
| Required | Reduced motion | Autoplay-off is required.<br>CSS transform transition is unspoken, so people can Pass while slides still animate hard. | Also call out the CSS transition in REQUIREMENTS, or mark it Pass+. |
| Required | Destroy | Destroy-without-clearing-the-interval is the clearest lifecycle trap in the suite.<br>Polishing the fixture would hide it. | Do not remove Destroy when polishing the fixture; keep the leak as a clear score checklist item. |
