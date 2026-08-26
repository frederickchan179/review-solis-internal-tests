# Requirements — Search Autocomplete

- Typing should not trigger a network request on every keystroke — requests should only fire after the user pauses typing.
- Whatever the most recently typed query is, the suggestions shown must always correspond to that exact query — never to an older, already-superseded query.
- If the user clears the input, no suggestions should ever appear afterward until they type something new — this must hold even if a request was already in flight at the moment they cleared it.
- The suggestion list must be closable by clicking anywhere outside it, and fully navigable using only the keyboard (arrow keys + Enter to select).
