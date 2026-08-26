# Requirements — Image Carousel

- Autoplay must pause immediately when the user's mouse is hovering over the carousel, or when keyboard focus is on one of the carousel's controls (arrows/dots). It must resume automatically a couple of seconds after the mouse leaves or focus moves away — it must never stop permanently because of a single hover or focus event.
- If the user's operating system is set to reduce motion (`prefers-reduced-motion: reduce`), autoplay must not start at all.
- Swiping left/right on a touch device must move to the next/previous slide.
- Resources for off-screen slides should not be loaded until they're needed.
