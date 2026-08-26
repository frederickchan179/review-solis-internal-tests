# Review - 10 Search Autocomplete

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Debounce | - Timeouts scheduled without `clearTimeout`<br>- Type `iphone` fast → one timer per key (six keys → six fetches)<br>- Fix: real debounce always clears before scheduling |
| Required | Clear mid-type | - Emptying the field hides the list but leaves pending timer alive<br>- That timeout still fetches and can reopen the list<br>- Fix: clear timer **and** ignore in-flight work |
| Required | Empty query | - `includes('')` is true for every catalog string<br>- Fetch with empty query dumps the whole catalog<br>- Fix: don’t fetch on empty |
| Required | Stale results | - No request token/abort<br>- 100-600ms jitter → older suggestions can win<br>- Fix: request id or `AbortController` so only latest query paints |
| Required | Dismiss / keys | - Click outside does not close<br>- No Arrow / Enter / Escape<br>- CSS has `--highlighted` but JS never applies it (dead CSS / Speculative Generality)<br>- Fix: drive `activeIndex` + `aria-activedescendant`, or delete the dead class |
| Optional | HTML / a11y | - Needs a label<br>- Real combobox pattern (`combobox` / `listbox` / `option`, expanded / controls / activedescendant)<br>- `type="search"` fits<br>- Options cannot be keyboard-only today |
| Optional | UX / CSS | - No loading state<br>- Empty matches just hide the list (no “No results”)<br>- Hint contrast weak → verify ≥4.5:1 if it carries instruction<br>- No `:focus-visible`<br>- Property order could match the rest of the suite |
| Optional | JS | - Delegate clicks on the list instead of rebinding each item after every render<br>- Naming mostly good (`inputEl`, `listEl`) → keep `El` suffix<br>- Null-check `getElementById` before use |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Prove the debounce | - “Too many requests” feeling is not enough for graders<br>- BRIEF: log how many times `fakeFetchSuggestions` runs while typing `iphone` quickly<br>- Broken code fires per key |
| Clear ≠ in-flight | - Clearing mid-debounce (pending timer) ≠ fetch already in flight<br>- Separate checklist rows so both get fixed |
| Escape | - Outside click is in the req<br>- Esc-to-dismiss is standard but unspoken<br>- Add it, or graders invent their own bar |
| Dead highlight class | - `.autocomplete__item--highlighted` unused on purpose<br>- Mention keyboard highlighting in BRIEF so candidates notice the smell instead of deleting CSS blindly |
