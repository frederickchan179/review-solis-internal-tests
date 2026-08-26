# Review - 02 FAQ Search (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Search | - Match phân biệt hoa thường<br>- `Security` ra kết quả; `security` báo “No results found.”<br>- Fix: lowercase cả hai phía trước `includes` (hoặc normalize một lần) |
| Required | Race | - Mỗi phím một request<br>- Không request id / abort → response cũ chậm ghi đè query mới<br>- Fix: gắn tag mỗi request (hoặc `AbortController`) và bỏ qua `.then` cũ |
| Required | Clear | - Clear empty DOM rồi return sớm<br>- Request đang bay vẫn xong → `renderResults` kéo kết quả cũ lại<br>- Fix: clear phải hủy hoặc ignore pending work, không chỉ xóa UI |
| Required | XSS | - Kết quả đi qua `innerHTML`<br>- HTML article như `<em>…</em>` thành markup thật<br>- Query nhét thô vào `<mark>${query}</mark>`<br>- Fix: escape text trước; highlight bằng DOM node; đừng dán chuỗi chưa tin cậy vào HTML |
| Optional | Highlight | - `replace(query, …)` chỉ đổi match đầu<br>- Vẫn case-sensitive sau khi sửa search<br>- Nếu giữ highlight: replace global, không phân biệt hoa thường, regex-escaped, trên text đã escape |
| Optional | Structure | - Tách search / render / highlight thành bước riêng<br>- Để không bỏ sót escape trên một đường |
| Optional | CSS | - `mark` chỉ style dưới `.faq-search__answer` → highlight title nhìn thường<br>- Style theo item, hoặc đừng highlight title<br>- Thứ tự property không đều<br>- Input thiếu `:focus-visible` |
| Optional | HTML / a11y | - Ô search không accessible name (chỉ placeholder) → thêm label<br>- `type="search"` ổn<br>- `#status` nên live (`aria-live`) cho “Searching…” / số kết quả |
| Optional | Perf / UX | - Không debounce → mỗi phím một request, status nhấp nháy<br>- Khi race, status và results có thể lệch |
| Optional | JS | - Naming gần ổn (`inputEl`, `resultsEl`, `statusEl`)<br>- Giữ suffix `El` cho DOM node<br>- Null-check kết quả query trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Case probe yếu | - Ví dụ `password` trong BRIEF yếu (answer đã có “password” chữ thường)<br>- Chỉ `Security` / `Internationally` |
| XSS wording | - Câu “Must never execute as live markup” còn mềm<br>- Nói thẳng: coi HTML từ API là text chưa tin cậy<br>- Thêm một payload mẫu vào req |
| Rubric tách | - Case/race và XSS có thể lệch nhau<br>- Chấm thành hai dòng riêng |
| Debounce | - Chưa nằm trong REQUIREMENTS<br>- Ghi “out of scope” hoặc Pass+ |
