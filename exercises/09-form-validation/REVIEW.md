# Review - 09 Form Validation

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Email | - Validator is `includes('@')`<br>- `a@` passes<br>- Fix: real check, or `type="email"` + `checkValidity()` |
| Required | Double submit | - Nothing guards in-flight work<br>- Double-click Place order → multiple orders |
| Required | Fail path | - Attempt #2 rejects with no `.catch` → no error UI<br>- Disable-on-submit without `finally` re-enable → button stuck forever after failure<br>- Pattern: `isSubmitting` → disable → try/catch → message → `finally` enable |
| Required | XSS | - Summary builds HTML with raw name/notes<br>- `<img onerror=…>` runs; `<b>` becomes bold<br>- Fix: `textContent` / safe nodes; never `innerHTML` for user input |
| Required | A11y | - Errors are red border only<br>- No message / `aria-invalid` / `aria-describedby` / live region<br>- Fails “not color alone” and SR users<br>- Fix: focus first bad field; clear errors as they type |
| Optional | HTML | - Labels wired correctly - good<br>- Add `autocomplete="name"` / `autocomplete="email"`<br>- Document why email is `type="text"` + `novalidate`, or switch to `type="email"`<br>- Give each field an error element id and describe it<br>- Summary can be polite-live |
| Optional | UX / CSS | - Empty summary card always takes space → hide until content<br>- Add submit `:disabled` / busy styles<br>- Border-only errors need accompanying text styles<br>- Normalize CSS property order<br>- No real “Submitting…” state; after success form stays fully editable |
| Optional | Harness | - Keep attempt-counter comment obvious so fail-on-2nd path stays findable |
| Optional | JS | - Naming inconsistent: `form`, `nameInput`, `submitBtn`, `summaryEl`<br>- Prefer `*El` for DOM nodes (`formEl`, `nameInputEl`, `submitBtn`) and stick to it<br>- Null-check every `getElementById` before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Email bar missing | - “Genuinely valid” invites regex arguments<br>- Concrete examples: `a@` must fail; `alex@example.com` must pass |
| Fail path quiet | - Attempt #2 rejects with no UI unless you read the code<br>- BRIEF: 2nd accepted submit fails → what should the user see? |
| XSS already in BRIEF | - Keep the payload<br>- Make written root-cause note a graded deliverable |
| Error copy | - REQUIREMENTS already say “not color alone”<br>- Give sample text (“Enter a valid email…”)<br>- Expect `aria-describedby` so solutions look alike when grading |
