# Review - 04 Variant Selector (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | OOS | - Text stock nói “Out of stock”<br>- Add to cart không bao giờ disable (`disabled = false` mỗi render)<br>- White/L và Navy/M vẫn click được |
| Required | Price crash | - Price đến dạng **chuỗi cent** (`'2199'`)<br>- Label dùng `formatPrice` → `$21.99` (đúng)<br>- ATC gọi `.toFixed` trên string → throw<br>- Fix: một money path; ATC cùng formatter; cent integer từ đầu đến cuối |
| Required | Color → size | - Đổi color không suy lại size<br>- White/M → Navy vẫn giữ **M** (OOS) thay vì size còn hàng đầu (Navy/S)<br>- Fix: helper `reconcileSize(color)` |
| Optional | Wrong “fix” | - `Number(price).toFixed(2)` hết crash<br>- Quên `/100` → in `$2199.00`<br>- Vẫn fail “format đúng” |
| Optional | HTML / a11y | - Label Color/Size là `<span>` rời → nối group (`aria-labelledby` / radiogroup + pressed/checked)<br>- Stock và “Added…” nên live<br>- Button option trong template nên `type="button"` |
| Optional | CSS / UX | - ATC không có look `:disabled` → disable đúng vẫn khó thấy<br>- Copy OOS xám nhạt trong khi CTA vẫn primary<br>- Size OOS cần disabled/hidden rõ<br>- Chuẩn hóa thứ tự CSS property |
| Optional | JS | - Prefer `closest('#addToCartBtn')` thay vì `event.target === addToCartBtn`<br>- Đổi selection → xóa success message<br>- Disable size OOS trong `renderSizeOptions` (rõ hơn chỉ chặn ATC)<br>- Giữ một naming scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| “Available” mơ hồ | - Grader tranh “tồn tại” vs “còn hàng”<br>- Req: giữ size chỉ khi variant còn hàng; không thì size còn hàng đầu của color mới |
| OOS UI policy | - Disable, ẩn, hay chọn rồi chặn ở ATC?<br>- Chọn một để chấm đồng nhất |
| Wrong price “fix” | - `Number(price).toFixed(2)` không `/100` là near-miss kinh điển<br>- Rubric phải Fail `$2199.00` |
| Disabled vô hình | - ATC không có style `:disabled`<br>- Thêm vào để fix OOS hiện rõ trên screenshot |
