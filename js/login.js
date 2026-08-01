/**
 * login.js — Login & register form handling
 */
(function () {
  'use strict';

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const formAlert = document.getElementById('formAlert');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');

  if (!loginForm || !registerForm) return;

  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || 'index.html';

  if (window.VanaHerbsAuth?.isLoggedIn()) {
    window.location.replace(redirectTo);
    return;
  }

  function showAlert(message, type) {
    if (!formAlert) return;
    formAlert.textContent = message;
    formAlert.className = `auth-alert auth-alert--${type}`;
    formAlert.hidden = false;
  }

  function clearAlert() {
    if (!formAlert) return;
    formAlert.hidden = true;
    formAlert.textContent = '';
  }

  function setFieldError(field, message) {
    const group = field.closest('.form__group');
    const existing = group?.querySelector('.form__error');
    if (existing) existing.remove();

    if (message) {
      const error = document.createElement('p');
      error.className = 'form__error';
      error.textContent = message;
      group?.appendChild(error);
      field.classList.add('form__input--error');
    } else {
      field.classList.remove('form__input--error');
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePassword(value) {
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter.';
    if (!/\d/.test(value)) return 'Password must include a digit.';
    return null;
  }

  function switchTab(tab) {
    const isLogin = tab === 'login';
    loginTab?.classList.toggle('auth-tabs__btn--active', isLogin);
    registerTab?.classList.toggle('auth-tabs__btn--active', !isLogin);
    loginTab?.setAttribute('aria-selected', String(isLogin));
    registerTab?.setAttribute('aria-selected', String(!isLogin));
    loginPanel?.toggleAttribute('hidden', !isLogin);
    registerPanel?.toggleAttribute('hidden', isLogin);
    clearAlert();
  }

  loginTab?.addEventListener('click', () => switchTab('login'));
  registerTab?.addEventListener('click', () => switchTab('register'));

  if (params.get('tab') === 'register') {
    switchTab('register');
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    let valid = true;
    setFieldError(loginForm.email, !email ? 'Email is required.' : !validateEmail(email) ? 'Enter a valid email.' : null);
    setFieldError(loginForm.password, !password ? 'Password is required.' : null);
    if (!email || !validateEmail(email) || !password) valid = false;
    if (!valid) return;

    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = 'Signing in…';

    try {
      await window.VanaHerbsAuth.login(email, password);
      showAlert('Welcome back! Redirecting…', 'success');
      setTimeout(() => window.location.replace(redirectTo), 600);
    } catch (err) {
      showAlert(err.message || 'Login failed. Please try again.', 'error');
      loginSubmitBtn.disabled = false;
      loginSubmitBtn.textContent = 'Sign In';
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const displayName = registerForm.displayName.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirm = registerForm.confirmPassword.value;

    let valid = true;
    setFieldError(registerForm.email, !email ? 'Email is required.' : !validateEmail(email) ? 'Enter a valid email.' : null);
    setFieldError(registerForm.password, password ? validatePassword(password) : 'Password is required.');
    setFieldError(
      registerForm.confirmPassword,
      !confirm ? 'Please confirm your password.' : confirm !== password ? 'Passwords do not match.' : null
    );
    if (!email || !validateEmail(email) || !password || validatePassword(password) || password !== confirm) {
      valid = false;
    }
    if (!valid) return;

    registerSubmitBtn.disabled = true;
    registerSubmitBtn.textContent = 'Creating account…';

    try {
      await window.VanaHerbsAuth.register(email, password, displayName || null);
      showAlert('Account created! You can sign in now.', 'success');
      switchTab('login');
      loginForm.email.value = email;
      loginForm.password.focus();
    } catch (err) {
      showAlert(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      registerSubmitBtn.disabled = false;
      registerSubmitBtn.textContent = 'Create Account';
    }
  });
})();
