# Review - 10 Search Autocomplete

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | Each `input` schedules a new `setTimeout` without `clearTimeout` on the previous one.<br>Type `iphone` quickly and you get one timer per key (six keys → six fetches).<br>REQUIREMENTS: requests should fire after the user pauses, not on every keystroke. | Real debounce: always `clearTimeout(debounceTimer)` before scheduling the next timeout. |
| Required | Clear | Emptying the field hides the list and returns early, but leaves any pending debounce timer alive.<br>That timeout still calls `fakeFetchSuggestions` with the *previous* query and can reopen the list after clear.<br>In-flight fetches are also not ignored, so a late response can repopulate the list.<br>REQUIREMENTS: after clear, no suggestions until the user types again. | On empty query, clear the timer and ignore in-flight work (same token/abort as out of date results).<br>Do not call `fakeFetchSuggestions` when the query is empty. |
| Required | Stale results | There is no request token or abort.<br>With 100-600ms jitter, an older suggestions response can win over a newer query.<br>REQUIREMENTS: shown suggestions must match the most recently typed query. | Use a request id or `AbortController` so only the latest query can call `renderSuggestions`. |
| Required | Dismiss / keys | Click outside does not close the list.<br>There is no Arrow / Enter handling.<br>CSS defines `.autocomplete__item--highlighted`, but JS never applies it.<br>REQUIREMENTS: closable by outside click, and keyboard navigable with arrows + Enter.<br>Escape is not in REQUIREMENTS (see Author). | Drive `activeIndex` + `aria-activedescendant` (or apply `--highlighted`), or delete the unused class.<br>Wire outside click to close, plus keyboard nav/select. |
| Optional | HTML / a11y | The field needs a durable accessible name (label).<br>It is not a real combobox pattern today.<br>Nice-to-have / strong signal (Pass+) for a full combobox pattern. | Add a label; `type="search"` fits.<br>Use `combobox` / `listbox` / `option` with expanded / controls / activedescendant. |
| Optional | UX / CSS | There is no loading state while the fetch runs.<br>Empty matches just hide the list (no "No results").<br>Hint contrast is weak (`#9ca3af`). No `:focus-visible`. | Show a loading state.<br>Show "No results" when the query has zero matches.<br>Add `:focus-visible`; check hint ≥4.5:1 if it carries instruction. |
| Optional | JS | Clicks rebind on each item after every render.<br>Naming is mostly good (`inputEl`, `listEl`). | Delegate clicks on the list instead of per-item rebinds.<br>Null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | BRIEF already asks interviewees to compare how many times `fakeFetchSuggestions` runs vs a real debounce while typing `iphone`.<br>REQUIREMENTS already ban a request on every keystroke.<br>The gap is soft proof: "consider" / Network-like intuition is easy to skip, so interviewers may Pass a broken debounce. | In the BRIEF, require a hard check: log (or breakpoint) call count while typing `iphone` quickly; broken code fires once per key, fixed code fires once after the pause. |
| Required | Clear vs in-flight | Clearing mid-debounce (pending timer) is a different bug from a fetch already in flight.<br>One score checklist row hides half the fix. | Use separate score checklist rows so both the pending timer and in-flight fetch get fixed. |
| Optional | Escape | Outside click is in REQUIREMENTS; Esc to close is standard but unspoken.<br>Interviewers invent their own bar for Fail vs nice-to-have (Pass+). | Add Esc to REQUIREMENTS, or document it as out of scope / Pass+. |
| Optional | Highlight | `.autocomplete__item--highlighted` is unused on purpose.<br>Interviewees may delete the CSS blindly without noticing the keyboard-highlight smell. | Mention keyboard highlighting in the BRIEF so interviewees notice the unused class and wire it up (or remove it on purpose). |
