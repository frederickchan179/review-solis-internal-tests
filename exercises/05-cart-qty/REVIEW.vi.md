# Review - 05 Cart Quantity (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Remove | - `Math.max(1, …)` → `-` ở qty 1 không làm gì<br>- Dòng hàng không bao giờ rời cart<br>- Req: xuống dưới 1 phải remove |
| Required | Bad input | - Handler nhập tay dùng `parseInt` thô<br>- Gõ `abc` rồi `+` → ô hiện **`NaN`**<br>- `0` / số âm cũng vào state được |
| Required | Desync | - Gõ `2.9` → input vẫn `2.9`, state thành `2`<br>- Display và state lệch<br>- Fix: luôn ghi giá trị đã normalize vào input |
| Required | Structure | - Một `normalizeQty` + một `setQuantity` cho cả button và typing<br>- Đừng rải `parseInt` / `Math.max`<br>- Luôn mirror giá trị đã normalize vào input |
| Required | Race | - Mỗi lần đổi gọi `fakeUpdateCartAPI` không thứ tự<br>- Spam `+` → total có thể thuộc qty cũ<br>- Fix: request token (hoặc `AbortController`); typing có thể debounce |
| Required | A11y | - Req yêu cầu announce cho screen reader<br>- Total (và qty) không nói gì<br>- Thiếu `aria-live` |
| Optional | HTML | - Qty không có label<br>- Dùng `type="number"` + `min`, hoặc giữ `text` nhưng xử lý rõ remove-at-0<br>- Bọc stepper trong group có label (hiện chỉ `+/-` có tên) |
| Optional | UX / CSS | - Không pending khi total load (kẹt 100-600ms)<br>- `-` không disable ở min; không max<br>- Hit target 32×32 (nên ≥44px)<br>- Không style disabled/pending; thứ tự CSS lộn xộn |
| Optional | JS | - `UNIT_PRICE = 12.0` là float → prefer integer cent end to end<br>- Format ở biên<br>- Prefer `input` (hoặc blur-normalize) thay blur-only lag<br>- Naming: `quantityInput` → `quantityInputEl` (hoặc một scheme `*Input` / `*Btn` / `*El`)<br>- Null-check DOM query trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Remove UX thiếu | - Req nói remove dưới 1, không nói UI thành gì<br>- Empty cart? Ẩn row? Focus đi đâu?<br>- Không rõ → mỗi người invent empty state khác |
| Qty rules xung đột | - “Always a positive whole number” vs “below 1 removes” cần một câu làm rõ<br>- Khi dòng còn: qty integer ≥ 1; cố dưới 1 → remove dòng |
| Announce mơ hồ | - “Must be announced” - announce cái gì?<br>- Mẫu: `Quantity 2, total $24.00` |
| Race đã gợi ý | - Giữ rapid `+` trong BRIEF<br>- Thêm: xem total có khớp input không |
