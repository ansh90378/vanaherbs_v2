/**
 * auth.js — Shared auth helpers for login-server (JWT)
 */
(function () {
  'use strict';

  const STORAGE = {
    access: 'vanaherbs_access_token',
    refresh: 'vanaherbs_refresh_token',
    user: 'vanaherbs_user',
  };

  function getConfig() {
    const cfg = window.VANAHERBS_CONFIG || {};
    return {
      baseUrl: cfg.API_BASE_URL || 'http://localhost:8000',
      prefix: cfg.API_PREFIX || '/api/v1',
    };
  }

  function apiUrl(path) {
    const { baseUrl, prefix } = getConfig();
    return `${baseUrl}${prefix}${path}`;
  }

  function getAccessToken() {
    return localStorage.getItem(STORAGE.access);
  }

  function getRefreshToken() {
    return localStorage.getItem(STORAGE.refresh);
  }

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(STORAGE.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveSession(data, user) {
    localStorage.setItem(STORAGE.access, data.access_token);
    localStorage.setItem(STORAGE.refresh, data.refresh_token);
    if (user) {
      localStorage.setItem(STORAGE.user, JSON.stringify(user));
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE.access);
    localStorage.removeItem(STORAGE.refresh);
    localStorage.removeItem(STORAGE.user);
  }

  function isLoggedIn() {
    return Boolean(getAccessToken() && getRefreshToken());
  }

  async function parseErrorResponse(res) {
    try {
      const body = await res.json();
      if (typeof body.detail === 'string') return body.detail;
      if (Array.isArray(body.detail)) {
        return body.detail.map((e) => e.msg || e).join(', ');
      }
    } catch {
      /* ignore */
    }
    return `Request failed (${res.status})`;
  }

  async function apiRequest(path, options = {}) {
    const headers = { ...(options.headers || {}) };

    if (options.json !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (options.auth) {
      const token = getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(apiUrl(path), {
      ...options,
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    });

    if (!res.ok) {
      const message = await parseErrorResponse(res);
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    if (res.status === 204) return null;

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function login(email, password) {
    const data = await apiRequest('/login', {
      method: 'POST',
      json: { email, password },
    });

    saveSession(data, null);
    const user = await fetchCurrentUser(true);
    return { tokens: data, user };
  }

  async function register(email, password, displayName) {
    return apiRequest('/register', {
      method: 'POST',
      json: {
        email,
        password,
        display_name: displayName || null,
      },
    });
  }

  async function fetchCurrentUser(skipRefresh) {
    try {
      const user = await apiRequest('/me', { method: 'GET', auth: true });
      localStorage.setItem(STORAGE.user, JSON.stringify(user));
      return user;
    } catch (err) {
      if (!skipRefresh && err.status === 401 && getRefreshToken()) {
        const refreshed = await refreshTokens();
        if (refreshed) {
          return fetchCurrentUser(true);
        }
      }
      throw err;
    }
  }

  async function refreshTokens() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const data = await apiRequest('/refresh', {
        method: 'POST',
        json: { refresh_token: refreshToken },
      });
      localStorage.setItem(STORAGE.access, data.access_token);
      localStorage.setItem(STORAGE.refresh, data.refresh_token);
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest('/logout', {
          method: 'POST',
          json: { refresh_token: refreshToken },
        });
      } catch {
        /* clear local session even if server call fails */
      }
    }
    clearSession();
  }

  function displayName(user) {
    if (!user) return '';
    return user.display_name || user.email.split('@')[0];
  }

  async function initNavAuth() {
    const loginBtn = document.getElementById('navLoginBtn');
    const userWrap = document.getElementById('navUser');
    const userName = document.getElementById('navUserName');
    const logoutBtn = document.getElementById('navLogoutBtn');

    if (!loginBtn && !userWrap) return;

    function showLoggedOut() {
      loginBtn?.removeAttribute('hidden');
      userWrap?.setAttribute('hidden', '');
    }

    function showLoggedIn(user) {
      loginBtn?.setAttribute('hidden', '');
      userWrap?.removeAttribute('hidden');
      if (userName) userName.textContent = displayName(user);
    }

    logoutBtn?.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      await logout();
      showLoggedOut();
      logoutBtn.disabled = false;
    });

    if (!isLoggedIn()) {
      showLoggedOut();
      return;
    }

    try {
      const user = getStoredUser() || (await fetchCurrentUser());
      showLoggedIn(user);
    } catch {
      clearSession();
      showLoggedOut();
    }
  }

  window.VanaHerbsAuth = {
    login,
    register,
    logout,
    fetchCurrentUser,
    isLoggedIn,
    getStoredUser,
    displayName,
    initNavAuth,
  };

  document.addEventListener('DOMContentLoaded', initNavAuth);
})();
