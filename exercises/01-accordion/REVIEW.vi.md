# Review - 01 Accordion (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | State | - Open state gắn theo **index trong list đã filter** (`openIndex`), không theo `id` FAQ<br>- Repro: mở “return policy”, gõ `How` → “Sizing” nhảy vào index đó và bị coi là mở<br>- Fix: lưu `openId`, render theo id |
| Required | A11y | - Panel đóng chỉ `max-height: 0` + `overflow: hidden`<br>- Link trong sizing vẫn Tab được (nhìn ẩn, keyboard vẫn vào)<br>- Req: content đóng không được Tab tới<br>- Fix: `hidden` / `inert`, hoặc bỏ focusable khi đóng (chỉ cắt height chưa đủ) |
| Required | Layout | - Panel mở bị `max-height: 200px`<br>- Text shipping ngắn có thể vẫn vừa → dễ miss<br>- Text dài / zoom / màn hẹp cắt cụt, không scroll trong panel<br>- Fix: mở thì phải đọc hết (không magic height cap) |
| Optional | HTML | - Filter chỉ có placeholder → thêm `<label>` hoặc `aria-label`<br>- Prefer `type="search"`<br>- Bọc FAQ trong `<section>` có tên, không `<div>` trần |
| Optional | A11y | - Có `aria-expanded` nhưng panel thiếu `id` / `aria-controls` / region<br>- Icon `+` nên `aria-hidden`<br>- Thêm `:focus-visible` cho filter và button |
| Optional | UX | - Filter phân biệt hoa thường<br>- Chỉ search `question`, không search `answer`<br>- Không match → accordion trống, không “No results”<br>- Link support `href="#"` nhảy đầu trang |
| Optional | JS | - Mỗi toggle/filter: `innerHTML` + rebind listener<br>- Prefer delegation một lần trên `#accordion`<br>- Query sau `trim` không đổi → khỏi render lại<br>- Giữ naming DOM thống nhất (`*El` / `*Btn`)<br>- Null-check `getElementById` / `querySelector` trước khi dùng |
| Optional | CSS | - Thứ tự property không đều → chọn một (positioning → display → box → type → visual)<br>- Xoay icon nên tôn trọng `prefers-reduced-motion` |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Clip khó thấy | - Shipping vẫn vừa dưới 200px → dễ miss<br>- Làm dài answer, hoặc hạ cap ~80px |
| Identity trap | - Index-vs-id là bài học chính, nhưng BRIEF không ép repro<br>- Thêm bước: mở item B, filter còn mỗi A → panel nào đang mở? |
| Scope mềm | - Case-insensitive / empty state không nằm trong REQUIREMENTS<br>- Nâng bắt buộc, hoặc ghi Pass+ |
| Chấm | - Vẫn key open state theo filtered index = Fail, dù happy path nhìn ổn |
