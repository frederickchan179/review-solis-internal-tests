# Review - 10 Search Autocomplete

### Dev: Findings

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | Each `input` schedules a new `setTimeout` without `clearTimeout` on the previous one. Type `iphone` quickly and you get one timer per key (six keys → six fetches). REQUIREMENTS: requests should fire after the user pauses, not on every keystroke. | Real debounce: always `clearTimeout(debounceTimer)` before scheduling the next timeout. |
| Required | Clear mid-type | Emptying the field hides the list and returns early, but leaves any pending debounce timer alive. That timeout still calls `fakeFetchSuggestions` and can reopen the list after clear. REQUIREMENTS: after clear, no suggestions until the user types again. | On empty query, clear the timer **and** ignore in-flight work (same token/abort as stale-results). Hiding the list alone is not enough. |
| Required | Empty query | If an empty query somehow reaches the fetch path, `includes('')` is true for every catalog string, so the whole catalog dumps into the list. Clearing must not fetch. | Don’t call `fakeFetchSuggestions` when the query is empty; treat empty as “hide and idle”. |
| Required | Stale results | There is no request token or abort. With 100-600ms jitter, an older suggestions response can win over a newer query. REQUIREMENTS: shown suggestions must match the most recently typed query. | Use a request id or `AbortController` so only the latest query can call `renderSuggestions`. |
| Required | Dismiss / keys | Click outside does not close the list. There is no Arrow / Enter / Escape handling. CSS defines `.autocomplete__item--highlighted`, but JS never applies it (dead CSS / Speculative Generality). REQUIREMENTS: closable by outside click, and keyboard navigable with arrows + Enter. | Drive `activeIndex` + `aria-activedescendant` (or apply `--highlighted`), or delete the dead class if unused.<br>Wire outside click to dismiss, plus keyboard nav/select/dismiss. |
| Optional | HTML / a11y | The field needs a durable accessible name (label). It is not a real combobox pattern today. Options cannot be reached keyboard-only until nav exists. | Add a label; `type="search"` fits.<br>Use a real combobox pattern (`combobox` / `listbox` / `option`, expanded / controls / activedescendant).<br>Make options keyboard-reachable. |
| Optional | UX / CSS | There is no loading state while the fetch runs. Empty matches just hide the list (no “No results”). Hint contrast is weak (`#9ca3af`). No `:focus-visible`. Property order could match the rest of the suite. | Show a loading state.<br>Show “No results” when the query has zero matches.<br>Verify hint ≥4.5:1 if it carries instruction.<br>Add `:focus-visible`.<br>Match property order to the suite. |
| Optional | JS | Clicks rebind on each item after every render. Naming is mostly good (`inputEl`, `listEl`). Null-checks may be missing. | Delegate clicks on the list instead of per-item rebinds.<br>Keep the `El` suffix.<br>Null-check `getElementById` before use. |

### Author: improve the test

| Pri | Area | Issue | Suggestion |
|-----|------|-------|------------|
| Required | Debounce | “Too many requests” as a feeling is not enough for graders. Without a count, per-key fetch is hard to prove in review. | BRIEF: log how many times `fakeFetchSuggestions` runs while typing `iphone` quickly; broken code fires once per key. |
| Required | Clear vs in-flight | Clearing mid-debounce (pending timer) is a different bug from a fetch already in flight. One checklist row hides half the fix. | Separate checklist / rubric rows so both the pending timer and in-flight fetch get fixed. |
| Optional | Escape | Outside click is in REQUIREMENTS; Esc-to-dismiss is standard but unspoken. Graders invent their own bar. | Add Esc to REQUIREMENTS, or document it as out of scope / Pass+. |
| Optional | Highlight | `.autocomplete__item--highlighted` is unused on purpose. Candidates may delete the CSS blindly without noticing the keyboard-highlight smell. | Mention keyboard highlighting in the BRIEF so candidates notice the dead class and wire it up (or remove it deliberately). |
