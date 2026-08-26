# Review - 08 Carousel

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Destroy leak | - “Destroy carousel” removes the node but never clears the interval<br>- Autoplay keeps calling `nextSlide` on detached DOM (BRIEF: watch console)<br>- Fix: one `destroy()` → clear timer, drop listeners, then remove |
| Required | Pause / resume | - No hover or focus pause<br>- Nothing resumes after a delay<br>- Live: hover does not stop autoplay<br>- Fix: one shared timer helper for hover / focus / reduced motion |
| Required | Reduced motion | - Autoplay always starts; no `prefers-reduced-motion` check<br>- Track `transition: transform 0.4s` should also respect reduce |
| Required | Swipe | - Only `touchstart` stores X<br>- No `touchend` → swipe never changes slides<br>- Fix: on end, compare delta to threshold → next/prev |
| Required | Eager slides | - All five slides mount up front<br>- Real images would load off-screen work immediately<br>- Fix: keep current ±1 in DOM, or real `loading="lazy"` images |
| Optional | Stacked timers | - `startAutoplay` does not clear an existing interval<br>- Call twice → stacked timers |
| Optional | A11y / UX | - Real images need `alt`<br>- No “Slide X of N” live region / roledescription<br>- No visible pause control<br>- Dots 8×8 → pad hit area ≥44px<br>- Rebuilding dots every tick steals focus → toggle active class instead |
| Optional | CSS | - Arrow/dot rules mix positioning and visuals inconsistently<br>- Pick a property order |
| Optional | JS | - Naming mixes `trackEl` / `dotsEl` / `carouselEl` with `prevBtn` / `nextBtn` / `destroyBtn`<br>- Keep one scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Lazy vs colored divs | - Req says don’t load off-screen resources<br>- Fixture is colored `<div>`s → candidates guess the pattern<br>- Say: keep current ±1 in DOM, or include a sample `<img>` |
| “A couple of seconds” | - Too soft for grading resume delay<br>- Pick a number (e.g. 2000ms) in REQUIREMENTS |
| Reduced motion incomplete | - Autoplay-off is required<br>- Also call out CSS transform transition, or people “pass” while slides still animate hard |
| Keep Destroy | - Clearest lifecycle trap in the suite<br>- Don’t remove it when polishing the fixture |
