# Requirements — Product Grid

- The grid must never render duplicate products, regardless of how the user triggers loading (button click, scroll, rapid double-click, or any combination of these).
- If loading a page of products fails (e.g. a network error), the "Load more" button must return to a clickable state so the user can retry — it must never remain permanently disabled after a failure.
- Scroll-triggered loading must not run excessively during a single scroll gesture — one scroll gesture reaching the bottom should trigger loading once, not repeatedly.
