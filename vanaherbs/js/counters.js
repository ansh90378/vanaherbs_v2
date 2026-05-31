/**
 * counters.js — Animated number counters on scroll
 */

const DURATION_MS  = 1600;
const FRAME_MS     = 16;

/**
 * Animate a single counter element from 0 to its data-target value.
 * Reads data-target (number) and data-suffix (string) attributes.
 *
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';

  if (isNaN(target)) return;

  const steps    = DURATION_MS / FRAME_MS;
  const increment = target / steps;
  let   current  = 0;

  const tick = () => {
    current += increment;

    if (current >= target) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    el.textContent = `${Math.floor(current)}${suffix}`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/**
 * Observe a container and kick off its counters when visible.
 * @param {string} containerSelector — wrapping element to watch
 * @param {string} counterSelector   — counter elements inside it
 */
function observeCounters(containerSelector, counterSelector) {
  const containers = document.querySelectorAll(containerSelector);

  if (!containers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(counterSelector).forEach(animateCounter);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  containers.forEach((el) => observer.observe(el));
}

// Counter band (hero stats strip)
observeCounters('#counterBand', '.counter-num[data-target]');

// About section stats
observeCounters('.about__stats', '.stat-num[data-target]');
