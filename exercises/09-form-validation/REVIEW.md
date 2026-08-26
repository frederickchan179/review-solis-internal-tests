# Review - 09 Form Validation

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email | `isValidEmail` is only `value.includes('@')`, so `a@` passes. REQUIREMENTS: only a genuinely valid email should pass. | Use a real check, or `type="email"` plus `checkValidity()` (and keep `novalidate` behavior intentional if you stay on custom validation). |
| Required | Double submit | Nothing guards in-flight work. Double-click Place order (or Enter then click) can create multiple orders while the first request is still pending. REQUIREMENTS: one perceived submission must not create two orders. | Guard with `isSubmitting` and/or disable the button while the request is in flight. |
| Required | Fail path | Attempt #2 in `fakeSubmitOrder` rejects, but `handleSubmit` has no `.catch`. There is no error UI and no retry path. Candidates who disable the button for double-submit often forget `finally`, leaving Place order stuck forever after failure. REQUIREMENTS: after failure, the button must be usable again with a clear retryable error. | Pattern: set `isSubmitting` → disable → try/catch (or `.catch`) → show message → `finally` enable and clear the flag. |
| Required | XSS | `renderSummary` builds HTML with raw `order.name` / `order.note`. `<img onerror=…>` runs; `<b>test</b>` becomes bold. REQUIREMENTS: user-supplied text must display as plain text, never as HTML. | Use `textContent` / safe DOM nodes for name and notes. Never feed user input into `innerHTML`. |
| Required | A11y | Errors are a red border only (`checkout-form__input--error`). There is no message text, `aria-invalid`, `aria-describedby`, or live region. That fails “not color alone” and leaves SR users without an explanation. | Focus the first invalid field; clear errors as the user fixes them; wire message text plus `aria-invalid` / `aria-describedby` / a live region. |
| Optional | HTML | Labels are wired correctly (good). Fields lack `autocomplete`. Email is `type="text"` with form `novalidate` and no documented why. There are no per-field error element ids. The summary is not a polite live region. | Add `autocomplete="name"` / `autocomplete="email"`.<br>Document why email is `type="text"` + `novalidate`, or switch to `type="email"`.<br>Give each field an error element id and describe it.<br>Summary can be polite-live after success. |
| Optional | UX / CSS | The empty summary card always takes space. There are no submit `:disabled` / busy styles. Border-only errors need accompanying text styles. CSS property order is uneven. There is no real “Submitting…” state; after success the form stays fully editable with no lock/reset story. | Hide the summary until it has content.<br>Add submit `:disabled` / busy styles.<br>Pair border errors with visible text styles.<br>Normalize CSS property order.<br>Show “Submitting…”; lock or reset the form after success as intended. |
| Optional | Harness | The attempt-counter / fail-on-2nd behavior is easy to miss in `fakeSubmitOrder` unless you read the code. Candidates who never hit attempt #2 never see the fail path. | Keep the attempt-counter comment obvious so the fail-on-2nd path stays findable. |
| Optional | JS | Naming is inconsistent: `form`, `nameInput`, `submitBtn`, `summaryEl`. Null-checks after `getElementById` may be missing. | Prefer `*El` for DOM nodes (`formEl`, `nameInputEl`, `submitBtn`) and stick to it.<br>Null-check every `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email bar | “Genuinely valid” invites regex arguments and uneven Fail/Pass calls on edge cases. | Give concrete examples in REQUIREMENTS: `a@` must fail; `alex@example.com` must pass. |
| Required | Fail path | Attempt #2 rejects with no UI unless the candidate reads the harness. Many never trigger it and miss the stuck-button / missing-error trap. | BRIEF: the 2nd accepted submit fails → what should the user see, and can they retry? |
| Required | XSS | The payload is already in the BRIEF, but a written root-cause note may not be graded. Security understanding then becomes optional in practice. | Keep the payload; make the written root-cause note a graded deliverable. |
| Required | Error copy | REQUIREMENTS already say “not color alone”, but solutions still diverge on wording and ARIA wiring. | Give sample text (“Enter a valid email…”); expect `aria-describedby` so graded solutions look alike. |
