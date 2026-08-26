# Requirements — Checkout Form

- Only a genuinely valid email address should pass validation.
- The "Place order" button must never allow two orders to be created from what the user perceives as a single submission (e.g. a fast double-click).
- If order submission fails for any reason (e.g. a network/server error), the "Place order" button must return to a usable state and a clear, retryable error message must be shown to the user — it must never remain permanently disabled after a failure.
- Any user-supplied text (name, notes) displayed back to the user (e.g. in an order summary) must be shown as plain text, never interpreted as HTML.
- Validation errors must be visible and understandable to screen reader users, not conveyed by color alone.
