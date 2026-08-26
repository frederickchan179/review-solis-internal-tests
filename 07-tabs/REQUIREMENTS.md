# Requirements — Product Detail Tabs

- The tab the backend designates as the default must be the one shown when the page first loads — not simply the first tab in the list.
- Switching between tabs must not cause unnecessary repeated network calls for content that hasn't changed — but cached content must not be treated as valid forever either: if more than 60 seconds have passed since a tab's content was last fetched, it should be re-fetched the next time that tab is selected.
- The tab list and switching between tabs must be fully usable with a keyboard, following standard tab-widget keyboard behavior (arrow keys to move between tabs).
- The tab list must remain usable on narrow (mobile-width) viewports.
