/* Order-tracking API client for the account dashboard. */
(function () {
  'use strict';

  const ORDER_API = 'http://127.0.0.1:8001/api/v1';
  const ACCESS_TOKEN = 'vanaherbs_access_token';

  function date(value) {
    return value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not available';
  }

  async function request(path) {
    const response = await fetch(`${ORDER_API}${path}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.detail || 'Order request failed');
      error.status = response.status;
      throw error;
    }
    return body;
  }

  function render(order, tracking) {
    const card = document.createElement('article');
    card.className = 'dashboard-order';
    const items = (order.items || []).map((item) => `<li>${item.product_name}<span>Qty ${item.quantity}</span></li>`).join('');
    card.innerHTML = `
      <div class="dashboard-order__top"><div><h3>Order ${order.id.slice(0, 8)}</h3><p>Placed ${date(order.created_at)}</p></div><strong>${order.status}</strong></div>
      <ul class="dashboard-order__items">${items}</ul>
      <div class="dashboard-order__dates"><p>Expected delivery <b>${date(order.expected_delivery_date)}</b></p><p>Delivered <b>${date(order.delivered_on)}</b></p></div>
      ${tracking ? `<p class="dashboard-order__customer">Order for ${tracking.order_by.full_name || tracking.order_by.email}</p>` : ''}`;
    return card;
  }

  async function load() {
    const loading = document.getElementById('ordersLoading');
    const empty = document.getElementById('ordersEmpty');
    const error = document.getElementById('ordersError');
    const list = document.getElementById('orderList');
    const refresh = document.getElementById('refreshOrders');
    if (!list) return;
    loading.hidden = false;
    empty.hidden = true;
    error.hidden = true;
    list.replaceChildren();
    refresh.disabled = true;
    try {
      let orders;
      try {
        orders = await request('');
      } catch (requestError) {
        if (requestError.status !== 401 || !(await window.VanaHerbsAuth.fetchCurrentUser())) throw requestError;
        orders = await request('');
      }
      loading.hidden = true;
      if (!orders.length) {
        empty.hidden = false;
        return;
      }
      for (const order of orders) {
        let tracking = null;
        try { tracking = await request(`/${order.id}/tracking`); } catch { /* summary still renders */ }
        list.appendChild(render(order, tracking));
      }
    } catch {
      loading.hidden = true;
      error.hidden = false;
    } finally {
      refresh.disabled = false;
    }
  }

  window.VanaHerbsOrders = { load };
  document.getElementById('refreshOrders')?.addEventListener('click', load);
})();
