/**
 * cursor.js — Custom cursor tracking & hover states
 */

const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

if (cursor && ring) {
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top  = `${e.clientY}px`;
    ring.style.left   = `${e.clientX}px`;
    ring.style.top    = `${e.clientY}px`;
  });

  // Enlarge ring on interactive elements
  const interactiveSelectors = 'a, button, .product-card, .wa-fab, input, textarea, select';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });
}
