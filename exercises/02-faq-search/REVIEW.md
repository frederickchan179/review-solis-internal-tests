# Review - 02 FAQ Search

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Search | - Match is case-sensitive<br>- `Security` finds results; `security` shows “No results found.”<br>- Fix: lowercase both sides before `includes` (or normalize once) |
| Required | Race | - Every keystroke starts a request<br>- No request id / abort → slow older response can overwrite newer query<br>- Fix: tag each request (or `AbortController`) and ignore stale `.then`s |
| Required | Clear | - Clearing empties the DOM and returns early<br>- In-flight requests still finish → `renderResults` can bring old hits back<br>- Fix: clear must cancel or ignore pending work, not only empty the UI |
| Required | XSS | - Results go through `innerHTML`<br>- Article HTML like `<em>…</em>` becomes real markup<br>- Query dropped raw into `<mark>${query}</mark>`<br>- Fix: escape text first; highlight with DOM nodes; never paste untrusted strings into HTML |
| Optional | Highlight | - `replace(query, …)` only hits the first match<br>- Stays case-sensitive after search is fixed<br>- If keeping highlight: global, case-insensitive, regex-escaped replace on escaped text |
| Optional | Structure | - Keep search / render / highlight as separate steps<br>- So escaping cannot be skipped on one path |
| Optional | CSS | - `mark` styled only under `.faq-search__answer` → title highlights look plain<br>- Style under the item, or don’t highlight titles<br>- Property order inconsistent<br>- No `:focus-visible` on the input |
| Optional | HTML / a11y | - Search field has no accessible name (placeholder only) → add a label<br>- `type="search"` is fine<br>- `#status` should be live (`aria-live`) for “Searching…” / counts |
| Optional | Perf / UX | - No debounce → request per key + flickering status<br>- Under race, status and results can disagree (update separately) |
| Optional | JS | - Naming mostly good (`inputEl`, `resultsEl`, `statusEl`)<br>- Keep `El` suffix for DOM nodes<br>- Null-check query results before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Soft case probe | - BRIEF `password` example is weak (answer already has lowercase “password”)<br>- Point at `Security` / `Internationally` instead |
| XSS wording | - “Must never execute as live markup” is soft<br>- Say: treat API HTML as untrusted text<br>- Add one sample payload in the req |
| Rubric split | - Case/race fix and XSS write-up can diverge<br>- Score them as separate lines |
| Debounce | - Not in REQUIREMENTS today<br>- Mark “out of scope” or Pass+ |
