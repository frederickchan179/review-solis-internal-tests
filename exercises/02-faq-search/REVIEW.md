# Review - 02 FAQ Search

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Search | Matching uses raw `includes(query)` with no case normalization. Typing `Security` finds the Password article; typing `security` shows “No results found.” REQUIREMENTS say search must not be case-sensitive. | Lowercase (or otherwise normalize) both the query and the article fields before `includes`, or normalize once when building the searchable strings. |
| Required | Race | Every keystroke starts a new `fakeSearchAPI` call. There is no request id or `AbortController`, and each `.then` always paints. Because delays are random (100-800ms), a slow older response can overwrite results for a newer query. REQUIREMENTS: shown results must match the most recently typed query. | Tag each request (monotonic id) or use `AbortController`, and ignore stale `.then`s so only the latest query can update the UI. |
| Required | Clear | Clearing the box empties the DOM and returns early, but in-flight requests are not cancelled or ignored. When those promises finish, `renderResults` can bring old hits back after the field is empty. REQUIREMENTS: after clear, no results (old or newly arriving) until the user types again. | On clear, cancel or mark pending work stale (same token/abort as the race fix). Emptying the UI alone is not enough. |
| Required | XSS | Results are built with `innerHTML`. Article HTML such as `<em>support@example.com</em>` becomes real markup, and the query is dropped raw into `` <mark>${query}</mark> ``. REQUIREMENTS: article text must never execute as unintended live markup. | Escape text (or use `textContent` / safe DOM nodes) before display. Build highlights with DOM nodes, never by pasting untrusted strings into HTML. |
| Optional | Highlight | `String.replace(query, …)` only replaces the first match and stays case-sensitive even after search matching is fixed. Multi-hit or mixed-case queries still look half-highlighted. | If keeping highlight: run a global, case-insensitive, regex-escaped replace on already-escaped text (or equivalent DOM walk). |
| Optional | Structure | Search, render, and highlight share one string path into `innerHTML`. A fix on one branch can still leave another branch unescaped, so XSS regressions are easy. | Keep search / render / highlight as separate steps so escaping is unavoidable on the render path. |
| Optional | CSS | `mark` is styled only under `.faq-search__answer`, so title highlights look plain. Property order is inconsistent across rules. The search input has no `:focus-visible` style. | Style `mark` under the item (or stop highlighting titles).<br>Normalize CSS property order.<br>Add `:focus-visible` on the input. |
| Optional | HTML / a11y | The search field has only a placeholder, so it lacks a durable accessible name. `#status` updates for “Searching…” / counts but is not a live region, so SR users may miss status changes. | Add a visible label (or `aria-label`); `type="search"` is fine.<br>Make `#status` an `aria-live` region (polite). |
| Optional | Perf / UX | There is no debounce, so every key fires a request and the status flickers. Under race conditions, status and results can disagree because they update in separate steps without a shared “latest query” guard. | Debounce input before calling the API.<br>Keep status and results tied to the same request-generation check. |
| Optional | JS | Naming is mostly good (`inputEl`, `resultsEl`, `statusEl`), but null-checks after `querySelector` / `getElementById` may be missing. | Keep the `El` suffix for DOM nodes.<br>Null-check query results before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Case probe | The BRIEF’s `password` example is weak because an answer already contains lowercase “password”, so a case-sensitive bug can still look fine. Graders and candidates miss the trap. | Point the BRIEF at title casing like `Security` / `Internationally` where the wrong case truly returns empty. |
| Required | XSS wording | “Must never execute as live markup” is soft. Graders disagree on whether escaping, sanitizing, or “author intended `<em>`” counts as Pass. | Say explicitly: treat API HTML as untrusted text. Add one sample payload in REQUIREMENTS so the escape bar is concrete. |
| Required | Rubric | Case/race correctness and the XSS write-up can diverge. One score line hides a partial Fail (e.g. race fixed, XSS ignored). | Score case/race behavior and XSS handling as separate rubric lines. |
| Optional | Debounce | Debounce is good UX but not in REQUIREMENTS today, so Pass vs Pass+ grading is uneven. | Mark debounce “out of scope” or Pass+ in the BRIEF/REQUIREMENTS. |
