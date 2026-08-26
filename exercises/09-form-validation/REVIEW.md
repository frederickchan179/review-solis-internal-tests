# Review - 09 Form Validation

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email | Validator is `includes('@')`.<br>`a@` passes. BRIEF already uses that example.<br>REQUIREMENTS: only a genuinely valid email should pass. | Use a real check, or `type="email"` + `checkValidity()`. |
| Required | Double submit | Nothing guards in-flight work.<br>Double-click Place order (or Enter then click) can create two orders while the first request is still pending.<br>REQUIREMENTS: one perceived submission must not create two orders. | Guard with `isSubmitting` and/or disable the button while the request is in flight. |
| Required | Fail path | Attempt #2 rejects with no `.catch`, so there is no error UI and the rejection is unhandled.<br>The fixture never disables the button today; a common partial fix disables on submit without `finally`, which then leaves Place order stuck forever after failure.<br>REQUIREMENTS: after a failed submit, the button must be usable again and a clear, retryable error must show. | Pattern: `isSubmitting` → disable → try/catch → error message → `finally` enable. |
| Required | XSS | Summary builds HTML with raw name/notes.<br>`<img onerror=...>` can run; `<b>` becomes bold.<br>REQUIREMENTS: user-supplied text in the summary must show as plain text, never as HTML. | Use `textContent` / safe nodes; never `innerHTML` for user input. |
| Required | A11y | Errors are a red border only.<br>No message, no `aria-invalid`, no `aria-describedby`, no live region.<br>REQUIREMENTS: errors must be visible and understandable to screen readers, not color alone. | Show error text; wire `aria-invalid` / `aria-describedby`.<br>Focus the first bad field; clear errors as they type. |
| Optional | HTML | Labels are wired correctly.<br>Missing `autocomplete="name"` / `autocomplete="email"`.<br>Email is `type="text"` + no `novalidate` story. | Add autocomplete.<br>Document why email is `type="text"`, or switch to `type="email"`. |
| Optional | UX / CSS | The empty summary card always takes space.<br>No submit `:disabled` / busy styles.<br>After success the form stays fully editable. | Hide the summary until it has content.<br>Add disabled/busy styles. |
| Optional | JS | Naming is mixed (`form`, `nameInput`, `submitBtn`, `summaryEl`). | Prefer `*El` for nodes (`formEl`, `nameInputEl`) and stick to it.<br>Null-check every `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Email bar | "Genuinely valid" invites regex arguments.<br>BRIEF already shows `a@`, but REQUIREMENTS do not list pass/fail examples. | Concrete examples: `a@` must fail; `alex@example.com` must pass. |
| Required | Fail path | Attempt #2 rejects with no UI unless the interviewee reads the harness (`submitAttempts === 2`).<br>There is no comment calling that out, so many never trigger it and miss the missing-error / stuck-button trap. | BRIEF: the 2nd accepted submit fails → what should the user see, and can they retry?<br>Add a short harness comment that attempt #2 rejects. |
| Required | XSS | The payload is already in the BRIEF.<br>Without a written root-cause note, some rooms treat a silent escape as enough. | Keep the payload; make a short written root-cause note a scored deliverable. |
| Required | Error copy | REQUIREMENTS already say "not color alone".<br>Solutions still diverge (`aria-describedby` vs a live region vs mystery text). | Give sample text ("Enter a valid email...").<br>Expect `aria-describedby` so solutions look alike when scoring. |
