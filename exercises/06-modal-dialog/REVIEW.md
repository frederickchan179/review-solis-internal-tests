# Review - 06 Modal Dialog

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Background scroll | Opening only flips `hidden` on the modal root. The page behind still scrolls with wheel / touch / trackpad. REQUIREMENTS: while open, the page behind must not scroll. | Lock `document.body` overflow (or equivalent) on open; restore the previous value on close. |
| Required | Clipped content | `.modal__dialog` uses `max-height: 80vh; overflow: hidden` with no inner scroller. On a short viewport, terms and fields are permanently cut off. REQUIREMENTS: all dialog content must stay reachable via scrolling *inside* the dialog. | Put overflow scrolling on an inner body pane (dialog shell fixed height, content scrolls). |
| Required | Keyboard / focus | There is no Escape handler. Focus does not move into the dialog on open, and there is no focus trap. Close does not return focus to the opener. While open, the page “Open” button stays tabbable, so Tab can leave the modal. REQUIREMENTS: fully keyboard operable, and focus must return to a predictable place on close. | Cache prior focus, move focus into the dialog, trap Tab, close on Esc, restore focus on close, and mark the background `inert` (or equivalent). |
| Required | z-index | Sticky header is `z-index: 999`; modal is `z-index: 100`. Scroll down, then open → the header sits on top of the modal. That breaks the “dialog on top” expectation the BRIEF points at in step 3. | Raise modal stacking (or lower the header) with clear z-index tokens so the modal always wins while open. |
| Optional | HTML | Email is placeholder-only (no label / autocomplete). Close and Subscribe lack `type="button"`. Terms uses `href="#"` (hash jump). There is an inline `height: 400px` spacer. The custom div modal reinvents dialog behavior that native `<dialog>` already covers. | Add a label plus `autocomplete="email"`.<br>Set Close/Subscribe to `type="button"`.<br>Fix or neutralize the Terms href.<br>Move spacer height into CSS.<br>Prefer native `<dialog>` + `showModal()` for focus / Esc / backdrop when acceptable. |
| Optional | A11y / UX | `aria-modal` without a real trap is misleading to AT. The Close × hit target is tiny. Terms at 12px gray may fail contrast. There is no `:focus-visible`. Subscribe does nothing (dead CTA). | Match `aria-modal` with a real trap, or drop the attribute until a trap exists.<br>Enlarge the Close hit target (≥44px).<br>Raise Terms contrast.<br>Add `:focus-visible`.<br>Wire Subscribe or mark it out of scope. |
| Optional | JS / CSS | Open/close behaviors are split across tiny handlers, so it is easy to miss one step (scroll lock without restore, Esc without trap, etc.). Overlay-as-sibling is fine, but later “click outside” logic must not close on dialog clicks. CSS property order / naming / null-checks are uneven; `modalEl.querySelector` throws if `modalEl` is null. | One open/close pipeline: scroll lock → focus in → Esc → trap → restore → unlock.<br>Don’t make dialog clicks close the modal.<br>Clean CSS property order on modal rules.<br>Naming: `*El` for nodes, `*Btn` for buttons; null-check queries before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Esc / trap | The BRIEF pushes keyboard use, but REQUIREMENTS never name Escape, focus trap, or return focus to the opener. Graders argue whether mouse-only close is enough. | Put those three behaviors in REQUIREMENTS explicitly. |
| Required | Clip | On a tall laptop the dialog often still “fits”, so the `overflow: hidden` clip bug is easy to miss. | BRIEF: use ≤600px height (or pad terms) so clipping is unavoidable without an inner scroller. |
| Optional | Subscribe | Subscribe is unused and distracts candidates with no grading story. | Mark Subscribe out of scope, or require a harmless no-op / success handler. |
| Required | Header trap | Sticky header over the modal is a strong intentional stacking bug. Polishing the fixture (raising modal z-index) would hide the lesson. | Don’t clean it up in the fixture; BRIEF step 3 already points at it. |
