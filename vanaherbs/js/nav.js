/**
 * nav.js — Sticky nav on scroll + mobile hamburger menu
 */

const nav           = document.getElementById('nav');
const hamburger     = document.getElementById('navHamburger');
const mobileMenu    = document.getElementById('navMobile');
const mobileLinks   = mobileMenu?.querySelectorAll('a');

// ---- Sticky nav shadow on scroll ----
function handleNavScroll() {
  const scrolled = window.scrollY > 60;
  nav?.classList.toggle('nav--scrolled', scrolled);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// Run once on load in case of page refresh mid-scroll
handleNavScroll();

// ---- Mobile menu toggle ----
function openMenu() {
  mobileMenu?.classList.add('nav-mobile--open');
  mobileMenu?.removeAttribute('aria-hidden');
  hamburger?.classList.add('nav-hamburger--open');
  hamburger?.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  mobileMenu?.classList.remove('nav-mobile--open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  hamburger?.classList.remove('nav-hamburger--open');
  hamburger?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.contains('nav-mobile--open');
  isOpen ? closeMenu() : openMenu();
});

// Close on link click
mobileLinks?.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav?.contains(e.target) && !mobileMenu?.contains(e.target)) {
    closeMenu();
  }
});
