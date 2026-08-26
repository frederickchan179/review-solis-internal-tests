# Requirements — FAQ Accordion

- Only one item may be expanded at a time; opening a new item should not require the user to manually close the previous one first (current behavior is correct here — do not change this).
- If the user filters the list and the currently-open item is still present in the filtered results, it must remain open. If the currently-open item is filtered out of the results, it should simply appear closed (no dangling reference, no wrong item shown as open).
- All content inside a closed panel (including any links) must not be reachable via Tab key.
- Long answers must be fully readable when a panel is open — no answer should ever be cut off.
