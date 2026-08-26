# Review - 03 Product Grid (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Pagination | - Công thức slice `page * SIZE - page` → trang chồng nhau<br>- Load vài lần: **Product 8 hai lần**<br>- Fix: `page * PAGE_SIZE`; helper `getPageSlice` cho dễ đọc contract |
| Required | Double-click | - `loadMore` không check `isLoading` ở đầu<br>- Disable button sau khi kick fetch → click nhanh hai lần = hai request cùng page<br>- Fix: guard `isLoading` / `!hasMore`<br>- Request id hoặc `AbortController` giúp khi Reset race page đang bay |
| Required | Errors | - Page 2 luôn reject, chỉ có `.then`<br>- Không `.catch` / `finally` → button disable mãi<br>- Không retry, không message lỗi |
| Required | Scroll | - Scroll gần đáy cứ gọi `loadMore` khi `!isLoading`<br>- Ở mãi vùng 200px → spam load<br>- Fix: latch, hoặc IntersectionObserver một lần mỗi intersect |
| Required | Reset | - Reset chỉ xóa HTML và `page`<br>- Sau load fail, Reset vẫn để button disabled<br>- Response đang bay có thể append vào grid trống<br>- Fix: clear loading, enable lại, tăng generation để bỏ response muộn |
| Optional | HTML | - Button nên `type="button"` kể cả ngoài form<br>- Prefer list (`<ul>` / `role="list"`) + `data-product-id`<br>- Thumb trang trí có thể `aria-hidden` |
| Optional | CSS | - Load more không có style `:disabled`<br>- Thứ tự property nhảy lung tung<br>- Hint `#9ca3af` trên trắng ≈ ~2.5:1 → fail AA nếu dùng làm hướng dẫn |
| Optional | UX | - Fail im lặng (button chết, không copy)<br>- Sau 40 product: không “end of catalog” / `hasMore` → empty fetch vẫn chạy |
| Optional | A11y | - Không announce card mới (`aria-busy` / live region) |
| Optional | JS | - `gridEl` lẫn `loadMoreBtn` / `resetBtn` → giữ một scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Reset thiếu spec | - BRIEF bảo thử Reset sau scroll<br>- REQUIREMENTS không nói Reset phải khôi phục gì<br>- Viết rõ: enable button, clear loading, bỏ append đang bay |
| Fail dễ miss | - Reject page 2 im lặng trừ khi cứ click<br>- BRIEF: load đến khi fail → có retry được không? |
| Scroll rule mơ hồ | - “Must not run excessively” khó chấm<br>- Định nghĩa một load mỗi lần tới đáy, hoặc bắt IntersectionObserver |
| Bắt duplicate | - Yêu cầu `data-product-id` trên card để duplicate Product 8 thấy rõ khi review |
