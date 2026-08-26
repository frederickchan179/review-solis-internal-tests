# Review - 06 Modal Dialog

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Background scroll | - Opening only flips `hidden`<br>- Page behind still scrolls<br>- Fix: lock body overflow on open; restore on close |
| Required | Clipped content | - Dialog is `max-height: 80vh; overflow: hidden` with no inner scroller<br>- Short screen → terms/fields cut off permanently<br>- Fix: scroll on an inner body pane |
| Required | Keyboard / focus | - No Escape<br>- Focus does not move into the dialog<br>- No focus trap<br>- Close does not return focus to opener<br>- While open, page Open button still tabbable → Tab out of modal<br>- Fix: cache prior focus, trap Tab, Esc to close, restore focus, `inert` background |
| Required | z-index | - Sticky header `999`, modal `100`<br>- Scroll down + open → header sits on top of modal<br>- Fix: clear z-index tokens so stacking is intentional |
| Optional | HTML | - Email placeholder-only → needs label + `autocomplete="email"`<br>- Close/Subscribe should be `type="button"`<br>- Terms `href="#"` (hash jump)<br>- Inline `height: 400px` spacer → move to CSS<br>- Prefer native `<dialog>` + `showModal()` for focus / Esc / backdrop |
| Optional | A11y / UX | - `aria-modal` without a real trap is misleading<br>- Close × is tiny<br>- Terms at 12px gray may fail contrast<br>- No `:focus-visible`<br>- Subscribe does nothing (dead CTA) |
| Optional | JS / CSS | - One open/close pipeline: scroll lock → focus in → Esc → trap → restore → unlock<br>- Overlay-as-sibling is fine; don’t make dialog clicks close it later<br>- Clean CSS property order on modal rules<br>- Naming: `*El` for nodes, `*Btn` for buttons<br>- Null-check queries (`modalEl.querySelector` throws if `modalEl` is null) |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Esc / trap only implied | - BRIEF pushes keyboard use<br>- REQUIREMENTS never names Escape, focus trap, or return focus to opener<br>- Put those three in the req |
| Clip needs short viewport | - Tall laptop → dialog often still “fits”<br>- BRIEF: use ≤600px height (or pad terms) so clipping is unavoidable |
| Subscribe unused | - Mark Subscribe out of scope, or require a harmless handler<br>- Right now it distracts with no grading story |
| Keep the header trap | - Sticky header over modal is a strong intentional bug<br>- Don’t clean it up in the fixture; BRIEF step 3 already points at it |
