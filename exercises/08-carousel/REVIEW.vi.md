# Review - 08 Carousel (VI)

### Dev: Findings

| Pri | Area | Issue |
|-----|------|-------|
| Required | Destroy leak | - “Destroy carousel” xóa node nhưng không clear interval<br>- Autoplay vẫn gọi `nextSlide` trên DOM đã detach (BRIEF: xem console)<br>- Fix: một `destroy()` → clear timer, bỏ listener, rồi remove |
| Required | Pause / resume | - Không pause khi hover/focus<br>- Không resume sau delay<br>- Live: hover không dừng autoplay<br>- Fix: một helper timer dùng chung cho hover / focus / reduced motion |
| Required | Reduced motion | - Autoplay luôn start; không check `prefers-reduced-motion`<br>- `transition: transform 0.4s` trên track cũng nên tôn trọng reduce |
| Required | Swipe | - Chỉ `touchstart` lưu X<br>- Không `touchend` → swipe không đổi slide<br>- Fix: ở end, so sánh delta với threshold → next/prev |
| Required | Eager slides | - Cả năm slide mount từ đầu<br>- Ảnh thật sẽ load luôn phần off-screen<br>- Fix: giữ current ±1 trong DOM, hoặc ảnh `loading="lazy"` thật |
| Optional | Stacked timers | - `startAutoplay` không clear interval cũ<br>- Gọi hai lần → chồng timer |
| Optional | A11y / UX | - Ảnh thật cần `alt`<br>- Không live region / roledescription “Slide X of N”<br>- Không nút pause nhìn thấy<br>- Dot 8×8 → pad hit area ≥44px<br>- Rebuild dots mỗi tick cướp focus → chỉ toggle class active |
| Optional | CSS | - Rule arrow/dot lẫn positioning và visual không đều<br>- Chọn một property order |
| Optional | JS | - Naming lẫn `trackEl` / `dotsEl` / `carouselEl` với `prevBtn` / `nextBtn` / `destroyBtn`<br>- Giữ một scheme (`*El` / `*Btn`)<br>- Null-check `getElementById` trước khi dùng |

### Author: improve the test

| Gap | Suggestion |
|-----|------------|
| Lazy vs colored divs | - Req bảo đừng load resource off-screen<br>- Fixture chỉ `<div>` màu → candidate phải đoán pattern<br>- Nói rõ: giữ current ±1 trong DOM, hoặc thêm `<img>` mẫu |
| “A couple of seconds” | - Quá mềm để chấm resume delay<br>- Chọn số cụ thể (vd 2000ms) trong REQUIREMENTS |
| Reduced motion chưa đủ | - Tắt autoplay là bắt buộc<br>- Nêu luôn CSS transform transition, nếu không người ta “pass” trong khi slide vẫn animate mạnh |
| Giữ Destroy | - Lifecycle trap rõ nhất trong suite<br>- Đừng bỏ khi polish fixture |
