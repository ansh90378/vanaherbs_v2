/**
 * parallax.js — Subtle parallax on the landscape band image.
 *
 * Works with the updated CSS where the image is centred via
 * translate(-50%, -50%) as baseline. We override that transform
 * here with an additional vertical offset based on scroll position.
 *
 * Max travel: ±40px (image is min-height: calc(100% + 80px) so no gaps).
 */

const band        = document.getElementById('parallaxBand');
const img         = document.getElementById('parallaxImg');
const MAX_OFFSET  = 40;  // px — must match the CSS min-height allowance / 2

if (band && img) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    let rafId = null;

    function updateParallax() {
      rafId = null;
      const rect   = band.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;

      if (!inView) return;

      // pct: 0 when band enters bottom of viewport, 1 when it exits top
      const pct    = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      // Clamp to [0,1] to avoid over-travel on very fast scrolls
      const clamped = Math.min(1, Math.max(0, pct));
      const offset  = (clamped - 0.5) * MAX_OFFSET * 2;   // range: -MAX_OFFSET … +MAX_OFFSET

      band.style.setProperty('--parallax-progress', clamped.toFixed(3));

      // Keep the centring translate and add the vertical parallax offset
      img.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
    }

    function onScroll() {
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();   // run once on mount
  }
}
