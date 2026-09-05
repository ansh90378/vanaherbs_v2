/* Account dashboard session and order initialization. */
(function () {
  'use strict';

  async function init() {
    if (!window.VanaHerbsAuth?.isLoggedIn()) {
      window.location.replace('login.html?redirect=dashboard.html');
      return;
    }
    try {
      const user = await window.VanaHerbsAuth.fetchCurrentUser();
      document.getElementById('dashboardUser').textContent = `Signed in as ${user.display_name || user.email}`;
      await window.VanaHerbsOrders.load();
    } catch {
      window.location.replace('login.html?redirect=dashboard.html');
    }
  }

  document.getElementById('dashboardLogout')?.addEventListener('click', async () => {
    await window.VanaHerbsAuth.logout();
    window.location.replace('index.html');
  });

  init();
})();
