/**
 * hero.js — Auto-rotating hero image carousel
 */

const SLIDE_INTERVAL_MS = 5500;

const slides    = document.querySelectorAll('.hero__slide');
const dots      = document.querySelectorAll('.dot');
let   currentIndex = 0;
let   timer        = null;

/**
 * Transition to a specific slide by index.
 * @param {number} index
 */
function goToSlide(index) {
  // Deactivate current
  slides[currentIndex]?.classList.remove('hero__slide--active');
  dots[currentIndex]?.classList.remove('dot--active');
  dots[currentIndex]?.setAttribute('aria-selected', 'false');

  // Activate next
  currentIndex = index;
  slides[currentIndex]?.classList.add('hero__slide--active');
  dots[currentIndex]?.classList.add('dot--active');
  dots[currentIndex]?.setAttribute('aria-selected', 'true');
}

function nextSlide() {
  goToSlide((currentIndex + 1) % slides.length);
}

function startAutoPlay() {
  timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
}

function stopAutoPlay() {
  clearInterval(timer);
}

// Wire up dot buttons
dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const targetIndex = parseInt(dot.dataset.slide, 10);
    stopAutoPlay();
    goToSlide(targetIndex);
    startAutoPlay(); // restart timer after manual interaction
  });
});

// Init
if (slides.length > 0) {
  startAutoPlay();
}
