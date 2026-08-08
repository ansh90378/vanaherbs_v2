/**
 * Product Scroller + Detail Modal
 * Reads product data (already fetched) and renders:
 *  - a horizontal scrolling card list (#product-scroller)
 *  - a single reusable modal (#product-modal) that fills in per-click
 *
 * Usage:
 *   1. Include this file after your DOM, e.g. <script src="product-scroller.js" defer></script>
 *   2. Have a container in your HTML: <div id="product-scroller" class="product-scroller"></div>
 *   3. Have the modal markup once per page (see product-modal.html snippet below,
 *      or call injectModalMarkup() from here).
 *   4. Call initProductScroller('products.json') on DOMContentLoaded.
 *
 * WhatsApp enquiry link is built per-product using the product name,
 * matching your existing WhatsApp-first contact flow.
 */

function buildWhatsAppLink(productName) {
  const message = `Hi, I'm interested in bulk enquiry for ${productName}. Could you share pricing and availability?`;
  return `/api/whatsapp?text=${encodeURIComponent(message)}`;
}

function productImagePath(product) {
  // Falls back to a placeholder if a local asset isn't present yet.
  // Swap to `assets/images/${product.id}.jpg` once real photos are in place.
  return product.image || `assets/images/${product.id}.jpg`;
}

function renderProductCard(product) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "product-card";
  card.setAttribute("data-id", product.id);
  card.setAttribute("aria-haspopup", "dialog");
  card.innerHTML = `
    <img class="product-card__image" src="${productImagePath(product)}" alt="${product.name}" loading="lazy" />
    <div class="product-card__body">
      <p class="product-card__category">${product.category}</p>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__short">${product.shortDescription}</p>
    </div>
  `;
  card.addEventListener("click", () => openProductModal(product));
  return card;
}

function injectModalMarkup() {
  if (document.getElementById("product-modal-backdrop")) return;
  const backdrop = document.createElement("div");
  backdrop.id = "product-modal-backdrop";
  backdrop.className = "product-modal-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <div class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-name">
      <button class="product-modal__close" aria-label="Close">&times;</button>
      <img class="product-modal__image" id="product-modal-image" src="" alt="" />
      <div class="product-modal__body">
        <p class="product-modal__category" id="product-modal-category"></p>
        <h2 class="product-modal__name" id="product-modal-name"></h2>
        <p class="product-modal__description" id="product-modal-description"></p>
        <dl class="product-modal__meta">
          <div class="product-modal__meta-item">
            <dt>Botanical Name</dt><dd id="product-modal-botanical"></dd>
          </div>
          <div class="product-modal__meta-item">
            <dt>General Name</dt><dd id="product-modal-general"></dd>
          </div>
          <div class="product-modal__meta-item">
            <dt>Availability</dt><dd id="product-modal-availability"></dd>
          </div>
          <div class="product-modal__meta-item">
            <dt>Capacity</dt><dd id="product-modal-capacity"></dd>
          </div>
        </dl>
        <a class="product-modal__cta" id="product-modal-whatsapp" target="_blank" rel="noopener">Enquire on WhatsApp</a>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeProductModal();
  });
  backdrop.querySelector(".product-modal__close").addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });
}

function openProductModal(product) {
  const backdrop = document.getElementById("product-modal-backdrop");
  document.getElementById("product-modal-image").src = productImagePath(product);
  document.getElementById("product-modal-image").alt = product.name;
  document.getElementById("product-modal-category").textContent = product.category;
  document.getElementById("product-modal-name").textContent = product.name;
  document.getElementById("product-modal-description").textContent = product.description;
  document.getElementById("product-modal-botanical").textContent = product.botanicalName;
  document.getElementById("product-modal-general").textContent = product.generalName;
  document.getElementById("product-modal-availability").textContent = product.availability;
  document.getElementById("product-modal-capacity").textContent = product.capacity;
  document.getElementById("product-modal-whatsapp").href = buildWhatsAppLink(product.name);

  backdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const backdrop = document.getElementById("product-modal-backdrop");
  if (!backdrop) return;
  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";
}

function renderScrollerNav(scrollerEl) {
  const nav = document.createElement("div");
  nav.className = "product-scroller-nav";
  nav.innerHTML = `
    <button type="button" aria-label="Scroll left">&#8592;</button>
    <button type="button" aria-label="Scroll right">&#8594;</button>
  `;
  const [left, right] = nav.querySelectorAll("button");
  left.addEventListener("click", () => scrollerEl.scrollBy({ left: -300, behavior: "smooth" }));
  right.addEventListener("click", () => scrollerEl.scrollBy({ left: 300, behavior: "smooth" }));
  return nav;
}

async function initProductScroller(jsonPath = "products.json", containerId = "product-scroller") {
  const container = document.getElementById(containerId);
  if (!container) return;

  injectModalMarkup();

  let products;
  try {
    const res = await fetch(jsonPath);
    products = await res.json();
  } catch (err) {
    console.error("Could not load products.json", err);
    return;
  }

  container.parentElement.insertBefore(renderScrollerNav(container), container);

  products.forEach((product) => {
    container.appendChild(renderProductCard(product));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProductScroller("data/products.json", "product-scroller");
});
