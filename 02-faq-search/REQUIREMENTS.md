# Requirements — Help Center Search

- Search must not be case-sensitive.
- If the user clears the search box, no results (old or newly-arriving) should ever be displayed again until they type something new — this must hold even if a request was already in flight at the moment they cleared it.
- Whatever the most recently typed query is, the results shown must always correspond to that exact query — never to an older, already-superseded query.
- Any text rendered from an article's content must be safe to display even if that content contains HTML markup — it must never be executed as live markup in a way that wasn't intended by the article author.
