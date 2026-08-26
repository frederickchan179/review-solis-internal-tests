// Image Carousel — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const slides = [
  { id: 1, label: 'Slide 1', color: '#ef4444' },
  { id: 2, label: 'Slide 2', color: '#3b82f6' },
  { id: 3, label: 'Slide 3', color: '#10b981' },
  { id: 4, label: 'Slide 4', color: '#f59e0b' },
  { id: 5, label: 'Slide 5', color: '#8b5cf6' }
];

let currentIndex = 0;
let autoplayTimer = null;
let touchStartX = null;

const trackEl = document.getElementById('carouselTrack');
const dotsEl = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const destroyBtn = document.getElementById('destroyBtn');
const carouselEl = document.getElementById('carousel');

const renderTrack = () => {
  trackEl.innerHTML = slides
    .map((slide) => `<div class="carousel__slide" style="background:${slide.color}">${slide.label}</div>`)
    .join('');
};

const renderDots = () => {
  dotsEl.innerHTML = slides
    .map(
      (_, index) => `<button class="carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`
    )
    .join('');
  dotsEl.querySelectorAll('.carousel__dot').forEach((dot) => {
    dot.addEventListener('click', () => goToSlide(Number(dot.dataset.index)));
  });
};

const updateTrackPosition = () => {
  trackEl.style.transform = `translateX(-${currentIndex * 100}%)`;
  renderDots();
};

const goToSlide = (index) => {
  currentIndex = (index + slides.length) % slides.length;
  updateTrackPosition();
};

const nextSlide = () => goToSlide(currentIndex + 1);
const prevSlide = () => goToSlide(currentIndex - 1);

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

const startAutoplay = () => {
  autoplayTimer = setInterval(nextSlide, 3000);
};

carouselEl.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

destroyBtn.addEventListener('click', () => {
  carouselEl.remove();
});

renderTrack();
renderDots();
startAutoplay();
