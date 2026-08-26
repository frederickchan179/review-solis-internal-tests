# Review - 07 Tabs (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Default | - API nói Sizing là default (`isDefault: true`)<br>- Init luôn mở index `0` (Description)<br>- Fix: bắt đầu từ `findIndex(t => t.isDefault)` |
| Required | Cache | - `contentCache` có nhưng không dùng<br>- Mỗi lần vào tab đều refetch<br>- TTL 60s trong req chưa implement<br>- Object chết = Speculative Generality → lưu `{ content, fetchedAt }` hoặc xóa |
| Required | Keyboard | - Chỉ click; mũi tên không làm gì<br>- Mọi tab `tabIndex=0`<br>- Fix: roving tabindex + Left/Right trên tablist (Home/End nice-to-have) |
| Required | A11y wiring | - Có tablist/tabs<br>- Panel là div thường: không `tabpanel`, không id, không `aria-controls` / `aria-labelledby` |
| Required | Mobile | - `flex: 1` đều + `nowrap` + parent `overflow: hidden`<br>- “Shipping & Returns” bị ép trên màn hẹp<br>- Fix: scroll ngang; bỏ equal flex trên màn nhỏ |
| Optional | Race | - Đổi tab nhanh → fetch chồng, không token<br>- Response cũ có thể vẽ sai tab<br>- Fix: request id hoặc `AbortController` |
| Optional | Focus / JS | - Render lại cả tab list cướp focus<br>- Chỉ flip class / `aria-selected` tại chỗ<br>- Button generate cần `type="button"`<br>- `"Loading..."` không expose busy cho AT<br>- Giữ naming `tabListEl` / `tabPanelEl`; null-check trước khi dùng |
| Optional | CSS | - Inactive `#6b7280` trên trắng ≈ ~4.6:1 (sát AA)<br>- Không `:focus-visible`<br>- Thứ tự property tab/panel không đều |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Default dễ bỏ qua | - Người ta thấy Description rồi đi tiếp<br>- BRIEF: nhìn `fakeFetchTabs()` → tab nào phải mở trước? |
| TTL 60s khó chứng minh | - Không ai chờ một phút trong bài 40 phút<br>- Test hook hoặc comment TTL = 5s trong harness |
| “Standard keyboard” mơ hồ | - Nêu phím bắt buộc: Left/Right (Home/End optional)<br>- Tránh tranh Enter/Space thôi đã đủ |
| Mobile cần width | - “Narrow viewport” mỗi laptop một kiểu<br>- BRIEF: resize 320px → với tới Shipping & Returns được không? |
