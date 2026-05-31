/**
 * animations.js — Scroll-triggered reveal using IntersectionObserver
 */

const OBSERVER_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
};

/**
 * Creates an IntersectionObserver that adds the 'visible' class
 * to elements matching the given selector, then stops observing.
 *
 * @param {string} selector
 */
function createRevealObserver(selector) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // fire once
      }
    });
  }, OBSERVER_OPTIONS);

  elements.forEach((el) => observer.observe(el));
}

// Observe all reveal variants
createRevealObserver('.reveal');
createRevealObserver('.reveal-left');
createRevealObserver('.reveal-right');
createRevealObserver('.stagger');
