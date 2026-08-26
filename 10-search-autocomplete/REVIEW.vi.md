# Review - 10 Search Autocomplete (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Debounce | - Timeout schedule không `clearTimeout`<br>- Gõ `iphone` nhanh → một timer mỗi phím (sáu phím → sáu fetch)<br>- Fix: debounce thật luôn clear trước khi schedule |
| Required | Clear mid-type | - Xóa hết ô thì list ẩn nhưng timer pending vẫn sống<br>- Timeout đó vẫn fetch và có thể mở lại list<br>- Fix: clear timer **và** ignore in-flight work |
| Required | Empty query | - `includes('')` đúng với mọi chuỗi catalog<br>- Fetch query rỗng → dump cả catalog<br>- Fix: đừng fetch khi empty |
| Required | Stale results | - Không request token/abort<br>- Jitter 100-600ms → suggestion cũ có thể thắng<br>- Fix: request id hoặc `AbortController` để chỉ query mới nhất được vẽ |
| Required | Dismiss / keys | - Click ngoài không đóng<br>- Không Arrow / Enter / Escape<br>- CSS có `--highlighted` nhưng JS không apply (dead CSS / Speculative Generality)<br>- Fix: drive `activeIndex` + `aria-activedescendant`, hoặc xóa class chết |
| Optional | HTML / a11y | - Cần label<br>- Combobox pattern thật (`combobox` / `listbox` / `option`, expanded / controls / activedescendant)<br>- `type="search"` hợp<br>- Option hiện không keyboard-only được |
| Optional | UX / CSS | - Không loading state<br>- Không match thì chỉ ẩn list (không “No results”)<br>- Hint contrast yếu → verify ≥4.5:1 nếu dùng làm hướng dẫn<br>- Không `:focus-visible`<br>- Thứ tự property nên khớp phần còn lại của suite |
| Optional | JS | - Delegation click trên list thay vì rebind từng item sau mỗi render<br>- Naming gần ổn (`inputEl`, `listEl`) → giữ suffix `El`<br>- Null-check `getElementById` trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Chứng minh debounce | - Cảm giác “quá nhiều request” chưa đủ để chấm<br>- BRIEF: log số lần `fakeFetchSuggestions` khi gõ `iphone` nhanh<br>- Code hỏng fire theo từng phím |
| Clear ≠ in-flight | - Clear giữa debounce (timer pending) khác fetch đã bay<br>- Tách hai dòng checklist để cả hai được sửa |
| Escape | - Outside click đã có trong req<br>- Esc-to-dismiss là chuẩn nhưng chưa viết<br>- Thêm vào, nếu không grader tự đặt bar |
| Dead highlight class | - `.autocomplete__item--highlighted` unused cố ý<br>- Nhắc keyboard highlighting trong BRIEF để candidate nhận smell, không xóa CSS mù |
