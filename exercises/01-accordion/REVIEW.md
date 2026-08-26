# Review - 01 Accordion

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | State | - Open state uses **filtered-list index** (`openIndex`), not FAQ `id`<br>- Repro: open “return policy”, type `How` → “Sizing” lands on that index and looks open<br>- Fix: store `openId`, render open state from id |
| Required | A11y | - Closed panels only use `max-height: 0` + `overflow: hidden`<br>- Link in sizing answer stays in Tab order (looks hidden, keyboard still reaches it)<br>- Req: closed content must not be Tab-reachable<br>- Fix: `hidden` / `inert`, or remove focusables when closed (height alone is not enough) |
| Required | Layout | - Open panels capped at `max-height: 200px`<br>- Short shipping text may still fit → bug easy to miss<br>- Longer text / zoom / narrow viewport clips with no inner scroll<br>- Fix: when open, full answer must be readable (no magic height cap) |
| Optional | HTML | - Filter has only a placeholder → add `<label>` or `aria-label`<br>- Prefer `type="search"`<br>- Wrap FAQ in a named `<section>`, not a bare `<div>` |
| Optional | A11y | - Buttons have `aria-expanded` but panels lack `id` / `aria-controls` / region<br>- Hide decorative `+` with `aria-hidden`<br>- Add `:focus-visible` on filter and buttons |
| Optional | UX | - Filter is case-sensitive<br>- Searches `question` only, not `answer`<br>- No matches → empty accordion, no “No results”<br>- Support link `href="#"` jumps to page top |
| Optional | JS | - Each toggle/filter rebuilds DOM via `innerHTML` and rebinds listeners<br>- Prefer one delegated click on `#accordion`<br>- Skip re-render when query unchanged after `trim`<br>- Keep DOM names consistent (`*El` / `*Btn`)<br>- Null-check `getElementById` / `querySelector` before use |
| Optional | CSS | - Property order is inconsistent → pick one (positioning → display → box → type → visual)<br>- Icon rotate should respect `prefers-reduced-motion` |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Clip too subtle | - Shipping still fits under 200px → easy miss<br>- Lengthen the answer, or lower the cap to ~80px |
| Identity trap | - Index-vs-id is the main lesson, but BRIEF never forces a clear repro<br>- Add step: open item B, filter until only A remains → which panel is open? |
| Soft scope | - Case-insensitive filter / empty state not in REQUIREMENTS<br>- Promote to required, or mark Pass+ |
| Grading | - Still keying open state by filtered index = Fail, even if happy path looks fine |
