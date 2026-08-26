# Agent prompts - 06 Modal Dialog

Copy one block into an AI / agent / LLM. Point it at `exercises/06-modal-dialog/`.

### Dev: Findings

```text
You are fixing the interviewee fixture for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Work only in this folder's fixture files: `index.html`, `style.css`, `script.js` (and any other fixture assets already there). Do not edit `BRIEF.md`, `REQUIREMENTS.md`, `REVIEW.md`, or `AGENT.md`.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep changes minimal and interview-scoped. Do not invent production hardening beyond the Suggestions.

After edits, the fixture should satisfy the linked REQUIREMENTS / BRIEF-critical traps called out in the Issues.

## Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Background scroll | Opening only flips `hidden`.<br>The page behind the modal still scrolls.<br>REQUIREMENTS: while the modal is open, the page behind it must not scroll. | Lock `document.body` overflow on open; restore it on close. |
| Required | Clipped content | The dialog is `max-height: 80vh; overflow: hidden` with no inner scroller.<br>On a short screen, terms and fields are cut off with no way to reach them.<br>REQUIREMENTS: everything inside the dialog, including terms, must stay readable by scrolling *inside* the dialog. | Put overflow scroll on an inner body pane, not on the dialog shell with `overflow: hidden`. |
| Required | Keyboard / focus | There is no Escape handler.<br>Focus does not move into the dialog on open, and Tab is not trapped inside it.<br>Close does not return focus to the opener. While open, the page Open button stays in the Tab order.<br>REQUIREMENTS: fully keyboard operable, and on close focus must return to a sensible, predictable place.<br>BRIEF-critical: BRIEF already asks to close with Esc; REQUIREMENTS do not name Escape or a Tab trap. | Cache the focused element before open.<br>Move focus into the dialog, trap Tab, close on Escape, restore focus to the opener, and mark the background `inert` (or equivalent). |
| Required | z-index | Sticky header is `z-index: 999`; modal is `100`.<br>Scroll down, then open → the header sits on top of the modal.<br>BRIEF-critical: BRIEF step 3 already points at this; it is not in REQUIREMENTS. | Raise the modal (and overlay) above the header, with clear stacking tokens. |
| Optional | HTML | Email is placeholder-only: no visible label, no `autocomplete`.<br>Close and Subscribe lack `type="button"`. Terms uses `href="#"` (page jump).<br>Prefer native `<dialog>` + `showModal()` when that is acceptable. | Add a label plus `autocomplete="email"`.<br>Set Close and Subscribe to `type="button"`.<br>Fix or neutralize the Terms `href`. |
| Optional | A11y / UX | `aria-modal` without a real trap can mislead assistive tech.<br>The Close × hit target is tiny. Terms at 12px gray may fail contrast.<br>Subscribe does nothing (dead CTA). | Match `aria-modal` with a real trap, or drop the attribute until a trap exists.<br>Enlarge Close (≥44px); raise Terms contrast.<br>Wire Subscribe, or mark it out of scope. |
| Optional | JS / CSS | Open and close behavior is split across tiny handlers, so it is easy to miss one step (scroll lock without restore, Escape without trap).<br>`modalEl.querySelector` throws if `modalEl` is null. | One open/close pipeline: scroll lock → focus in → Escape → trap → restore → unlock.<br>Null-check queries before use. |
```

### Author: improve the test

```text
You are improving the interview materials for Review - 06 Modal Dialog (`exercises/06-modal-dialog/`).

Edit `BRIEF.md`, `REQUIREMENTS.md`, and/or the buggy fixture (`index.html`, `style.css`, `script.js`) so probing and scoring stay fair. Do not edit `REVIEW.md` or `AGENT.md`. Do not solve the exercise for the interviewee unless an Author Suggestion explicitly changes the fixture trap.

Apply every row below. Do all Required rows before Optional. For each row, implement the Suggestion so the Issue is gone. Keep the exercise about 40 minutes. Prefer clearer BRIEF steps, REQUIREMENTS, and score-checklist language over large rewrites.

## Author notes

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Esc / trap | BRIEF already pushes Esc and keyboard use.<br>REQUIREMENTS require full keyboard operate plus return focus to a "sensible, predictable location", but they never name Escape or a Tab trap, and they never say "opener".<br>Interviewers argue whether mouse-only close is enough, and where focus must land. | Put "Escape closes" and "Tab stays trapped" in REQUIREMENTS.<br>Tighten return-focus to "the control that opened the modal" (already required in softer form). |
| Required | Clip | On a tall laptop the dialog often still "fits", so the `overflow: hidden` clip is easy to miss.<br>Live check: at a 600px tall viewport the dialog still just barely fits (the last line clips by only 1-2px), so "shrink the window a little" does not reliably trigger the bug. | BRIEF: use a viewport height of 580px or less (or pad the terms with more text) so the clip is clearly visible, not a 1-2px rounding call.<br>Set this with devtools' responsive mode at a fixed height instead of relying on whatever window size the interviewer happens to have open. |
| Required | Header trap | Sticky header over the modal is a strong stacking bug.<br>Polishing the fixture (raising modal z-index) would hide the lesson. | Do not clean it up in the fixture; BRIEF step 3 already points at it.<br>Score checklist: Fail if the sticky header paints above the open modal. |
| Optional | Subscribe | Subscribe is unused and distracts interviewees with nothing useful to probe or score. | Mark Subscribe out of scope, or require a harmless no-op / success handler. |
```

