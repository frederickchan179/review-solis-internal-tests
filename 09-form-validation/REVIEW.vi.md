# Review - 09 Form Validation (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Email | - Validator chỉ `includes('@')`<br>- `a@` vẫn pass<br>- Fix: check thật, hoặc `type="email"` + `checkValidity()` |
| Required | Double submit | - Không guard việc đang submit<br>- Double-click Place order → nhiều order |
| Required | Fail path | - Attempt #2 reject không `.catch` → không error UI<br>- Disable lúc submit mà không enable trong `finally` → button kẹt mãi sau fail<br>- Pattern: `isSubmitting` → disable → try/catch → message → `finally` enable |
| Required | XSS | - Summary dựng HTML từ name/notes thô<br>- `<img onerror=…>` chạy; `<b>` thành bold<br>- Fix: `textContent` / node an toàn; đừng `innerHTML` với input user |
| Required | A11y | - Lỗi chỉ border đỏ<br>- Không message / `aria-invalid` / `aria-describedby` / live region<br>- Fail “not color alone” và screen reader<br>- Fix: focus field lỗi đầu; clear error khi họ gõ |
| Optional | HTML | - Label nối đúng - tốt<br>- Thêm `autocomplete="name"` / `autocomplete="email"`<br>- Ghi rõ vì sao email `type="text"` + `novalidate`, hoặc đổi `type="email"`<br>- Mỗi field cần error element id và describe<br>- Summary có thể polite-live |
| Optional | UX / CSS | - Summary card trống vẫn chiếm chỗ → ẩn đến khi có nội dung<br>- Thêm style submit `:disabled` / busy<br>- Lỗi chỉ border cần kèm style text<br>- Chuẩn hóa thứ tự CSS property<br>- Không “Submitting…” thật; sau success form vẫn edit hết |
| Optional | Harness | - Giữ comment attempt-counter dễ thấy để path fail lần 2 tìm được |
| Optional | JS | - Naming không đều: `form`, `nameInput`, `submitBtn`, `summaryEl`<br>- Prefer `*El` cho DOM node (`formEl`, `nameInputEl`, `submitBtn`) và giữ một scheme<br>- Null-check mọi `getElementById` trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Email bar thiếu | - “Genuinely valid” dễ dẫn tranh regex<br>- Ví dụ cụ thể: `a@` phải fail; `alex@example.com` phải pass |
| Fail path im lặng | - Attempt #2 reject không UI trừ khi đọc code<br>- BRIEF: submit hợp lệ lần 2 fail → user phải thấy gì? |
| XSS đã có trong BRIEF | - Giữ payload<br>- Biến note root-cause thành deliverable được chấm |
| Error copy | - REQUIREMENTS đã nói “not color alone”<br>- Cho mẫu text (“Enter a valid email…”)<br>- Expect `aria-describedby` để bài nộp nhìn đồng đều khi chấm |
