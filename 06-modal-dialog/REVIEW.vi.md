# Review - 06 Modal Dialog (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Background scroll | - Mở modal chỉ đổi `hidden`<br>- Page phía sau vẫn scroll<br>- Fix: lock `overflow` body khi mở; restore khi đóng |
| Required | Clipped content | - Dialog `max-height: 80vh; overflow: hidden`, không scroll bên trong<br>- Màn thấp → terms/field bị cắt cứng<br>- Fix: scroll nằm ở pane body bên trong |
| Required | Keyboard / focus | - Không Escape<br>- Focus không vào dialog<br>- Không focus trap<br>- Đóng không trả focus về opener<br>- Khi mở, nút Open trên page vẫn Tab được → Tab ra khỏi modal<br>- Fix: cache focus trước, trap Tab, Esc đóng, restore focus, `inert` background |
| Required | z-index | - Sticky header `999`, modal `100`<br>- Scroll xuống + mở → header đè modal<br>- Fix: z-index token rõ ràng |
| Optional | HTML | - Email chỉ placeholder → cần label + `autocomplete="email"`<br>- Close/Subscribe nên `type="button"`<br>- Terms `href="#"` (nhảy hash)<br>- Spacer inline `height: 400px` → đưa vào CSS<br>- Prefer native `<dialog>` + `showModal()` cho focus / Esc / backdrop |
| Optional | A11y / UX | - Có `aria-modal` nhưng không trap thật → dễ hiểu nhầm<br>- Close × quá nhỏ<br>- Terms 12px xám có thể fail contrast<br>- Không `:focus-visible`<br>- Subscribe không làm gì (CTA chết) |
| Optional | JS / CSS | - Một pipeline open/close: scroll lock → focus in → Esc → trap → restore → unlock<br>- Overlay sibling ổn; đừng để click trong dialog đóng modal<br>- Dọn thứ tự CSS property cho rule modal<br>- Naming: `*El` cho node, `*Btn` cho button<br>- Null-check query (`modalEl.querySelector` throw nếu `modalEl` null) |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Esc / trap chỉ ngụ ý | - BRIEF nhấn keyboard<br>- REQUIREMENTS không nêu Escape, focus trap, trả focus về opener<br>- Ghi rõ ba điểm đó trong req |
| Clip cần viewport thấp | - Laptop cao → dialog thường vẫn “vừa”<br>- BRIEF: chiều cao ≤600px (hoặc dài terms) để clipping chắc chắn |
| Subscribe thừa | - Ghi Subscribe out of scope, hoặc yêu cầu handler vô hại<br>- Hiện distraction không có chuyện để chấm |
| Giữ header trap | - Sticky header đè modal là bug cố ý mạnh<br>- Đừng dọn trong fixture; BRIEF bước 3 đã chỉ sẵn |
