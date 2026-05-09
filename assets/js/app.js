const siteData = window.ANNA_SITE_DATA || {};
const products = siteData.products || [];
const banners = siteData.banners || [];
const loadingWords = siteData.loadingWords || [];
const modalViews = siteData.modalViews || [];
const footerData = siteData.footer || {};
const homeData = siteData.home || {};
const aboutPageData = siteData.aboutPage || {};
const contactPageData = siteData.contactPage || {};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));
const currency = (value) => value.toLocaleString("vi-VN") + "đ";

function setText(selector, value, parent = document) {
  const node = $(selector, parent);
  if (node && value != null) node.textContent = value;
}

function setTexts(selector, values, parent = document) {
  const nodes = $$(selector, parent);
  nodes.forEach((node, index) => {
    if (values[index] != null) node.textContent = values[index];
  });
}

const storage = {
  getCart() {
    return JSON.parse(sessionStorage.getItem("anna-cart") || "[]");
  },
  setCart(cart) {
    sessionStorage.setItem("anna-cart", JSON.stringify(cart));
  },
  getFavorites() {
    return JSON.parse(sessionStorage.getItem("anna-favorites") || "[]");
  },
  setFavorites(favorites) {
    sessionStorage.setItem("anna-favorites", JSON.stringify(favorites));
  },
};

const state = {
  currentBanner: 0,
  activeView: 0,
  heroTimer: null,
  loadingWordTimer: null,
  toastTimer: null,
  checkoutTimer: null,
  currentProductId: null,
  productPinHandler: null,
  productPinResizeHandler: null,
  productPinRaf: null,
  productProgress: 0,
};

function cartCount() {
  return storage.getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function totalPrice() {
  return storage
    .getCart()
    .reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function isFavorite(id) {
  return storage.getFavorites().some((product) => product.id === id);
}

function lockBody(locked) {
  document.body.classList.toggle("is-locked", locked);
}

function closeMobileMenu() {
  const menu = $("[data-mobile-menu]");
  if (!menu) return;
  menu.classList.remove("open");
}

function closeOverlayUi() {
  $("[data-overlay]")?.classList.remove("open");
  $$("[data-drawer]").forEach((item) => item.classList.remove("open"));
  $$("[data-checkout-shell]").forEach((item) => (item.hidden = true));
  lockBody(false);
}

function openOverlayUi() {
  $("[data-overlay]")?.classList.add("open");
  lockBody(true);
}

function syncHeaderActionState() {
  const cartButton = $("#nav-cart-icon");
  const favoriteButton = $("#nav-favorite-icon");
  if (cartButton) cartButton.classList.toggle("is-active", cartCount() > 0);
  if (favoriteButton)
    favoriteButton.classList.toggle(
      "is-active",
      storage.getFavorites().length > 0,
    );
}

function pulseBadge(selector) {
  const badge = $(selector);
  if (!badge) return;
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
}

function resolveProductSourceElement(sourceElement) {
  if (!(sourceElement instanceof HTMLElement)) return null;
  const scopedImage = sourceElement
    .closest(".product-card, .drawer-item, .modal-content")
    ?.querySelector("img");
  if (scopedImage instanceof HTMLElement) return scopedImage;
  return sourceElement;
}

function sparkAtElement(target) {
  if (!(target instanceof HTMLElement)) return;
  const rect = target.getBoundingClientRect();
  const spark = document.createElement("div");
  spark.style.position = "fixed";
  spark.style.left = `${rect.left + rect.width / 2 - 16}px`;
  spark.style.top = `${rect.top + rect.height / 2 - 16}px`;
  spark.style.width = "32px";
  spark.style.height = "32px";
  spark.style.pointerEvents = "none";
  spark.style.zIndex = "650";
  spark.innerHTML = `
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
      <path d="M16 3 L18.5 12.5 L29 16 L18.5 19.5 L16 29 L13.5 19.5 L3 16 L13.5 12.5 Z" fill="rgba(230,196,138,.92)" stroke="rgba(205,155,81,.95)" stroke-width="1.2"></path>
    </svg>`;
  document.body.appendChild(spark);
  const animation = spark.animate(
    [
      { transform: "scale(0.6) rotate(0deg)", opacity: 0 },
      { transform: "scale(1.15) rotate(16deg)", opacity: 1 },
      { transform: "scale(0.88) rotate(28deg)", opacity: 0 },
    ],
    {
      duration: 420,
      easing: "ease-out",
      fill: "forwards",
    },
  );
  animation.finished.finally(() => spark.remove());
}

function showToast(message) {
  const toast = $("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function flyPulse(targetSelector) {
  const target = $(targetSelector);
  if (!target) return;
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.12)" },
      { transform: "scale(1)" },
    ],
    { duration: 420, easing: "ease-out" },
  );
}

function flyProductImage(productId, targetSelector, sourceElement) {
  const product = products.find((item) => item.id === productId);
  const target = $(targetSelector);
  if (!product || !target) return;

  const rect = target.getBoundingClientRect();
  const sourceNode = resolveProductSourceElement(sourceElement);
  const sourceRect = sourceNode?.getBoundingClientRect?.();
  const startX = sourceRect
    ? sourceRect.left + sourceRect.width / 2 - 32
    : window.innerWidth / 2 - 32;
  const startY = sourceRect
    ? sourceRect.top + sourceRect.height / 2 - 32
    : window.innerHeight / 2 - 32;
  const endX = rect.left + rect.width / 2 - 10;
  const endY = rect.top + rect.height / 2 - 10;
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const curveLift = Math.max(80, Math.min(180, Math.abs(deltaX) * 0.22));

  const flyer = document.createElement("img");
  flyer.src = product.image;
  flyer.alt = "";
  flyer.className = "flying-product";
  flyer.style.left = `${startX}px`;
  flyer.style.top = `${startY}px`;
  document.body.appendChild(flyer);

  const animation = flyer.animate(
    [
      {
        transform: "translate3d(0,0,0) scale(1) rotate(0deg)",
        opacity: 1,
        borderRadius: "16px",
      },
      {
        transform: `translate3d(${deltaX * 0.28}px, ${deltaY * 0.18 - curveLift}px, 0) scale(0.86) rotate(-6deg)`,
        opacity: 0.96,
        borderRadius: "18px",
      },
      {
        transform: `translate3d(${deltaX * 0.7}px, ${deltaY * 0.72 - curveLift * 0.46}px, 0) scale(0.56) rotate(6deg)`,
        opacity: 0.92,
        borderRadius: "20px",
      },
      {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.24) rotate(0deg)`,
        opacity: 0.86,
        borderRadius: "999px",
      },
    ],
    {
      duration: 760,
      easing: "cubic-bezier(0.18, 0.72, 0.2, 1)",
      fill: "forwards",
    },
  );

  animation.finished.finally(() => {
    flyer.remove();
    if (targetSelector === "#nav-cart-icon") pulseBadge("[data-cart-count]");
    if (targetSelector === "#nav-favorite-icon")
      pulseBadge("[data-favorite-count]");
    sparkAtElement(target);
  });
}

function updateBadges() {
  const cartItems = cartCount();
  const favoriteItems = storage.getFavorites().length;

  $$("[data-cart-count]").forEach((node) => {
    node.hidden = cartItems === 0;
    node.textContent = String(cartItems);
  });

  $$("[data-favorite-count]").forEach((node) => {
    node.hidden = favoriteItems === 0;
    node.textContent = String(favoriteItems);
  });

  syncHeaderActionState();
}

function renderFooterContent() {
  const footer = $("[data-footer]") || $(".site-footer");
  if (!footer || !footerData.brandText) return;

  footer.innerHTML = `
    <div class="container-main">
      <div class="footer-main">
        <div>
          <a href="index.html" class="accent-gradient-text" style="font-size: 1.5rem; letter-spacing: 0.1em; font-weight: 400; display: inline-block; margin-bottom: 1.5rem;">${footerData.brandText}</a>
          <p style="font-size: 1rem; color: var(--color-muted); line-height: 1.8; font-weight: 300; max-width: 320px; margin: 0;">${footerData.aboutText}</p>
        </div>
        <div>
          <h3 style="font-size: 0.875rem; letter-spacing: 0.05em; font-weight: 500; margin: 0 0 1.75rem;">${footerData.exploreTitle}</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${(footerData.exploreLinks || []).map((item) => `<a href="${item.href}" class="nav-link" style="font-size: 1rem; color: var(--color-muted); padding: 0.25rem 0;">${item.label}</a>`).join("")}
          </div>
        </div>
        <div>
          <h3 style="font-size: 0.875rem; letter-spacing: 0.05em; font-weight: 500; margin: 0 0 1.75rem;">${footerData.contactTitle}</h3>
          <div style="display: flex; flex-direction: column; gap: 1.25rem; color: var(--color-muted);">
            ${(footerData.contactItems || []).map((item) => `<span>${item}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p style="font-size: 0.875rem; color: var(--color-muted); margin: 0;">${footerData.copyright}</p>
        <div class="socials">
          <a href="${footerData.socialLinks?.facebook || "#"}" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
          <a href="${footerData.socialLinks?.instagram || "#"}" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg></a>
          <a href="${footerData.socialLinks?.tiktok || "#"}" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69A4.83 4.83 0 0 1 15.82 2H12.4v13.17a2.91 2.91 0 1 1-2-2.77V8.9a6.34 6.34 0 1 0 6.33 6.33V8.56a8.16 8.16 0 0 0 4.77 1.53V6.69h-.91z" /></svg></a>
        </div>
      </div>
    </div>`;
}

function renderHomeAboutSection() {
  if (document.body.dataset.page !== "home") return;
  const data = homeData.aboutSection || {};
  const section = $("[data-home-about]");
  if (!section) return;
  section.innerHTML = `
    <div class="section-header">
      <p class="eyebrow">${data.eyebrow || ""}</p>
      <h2 class="section-title">${data.title || ""}</h2>
      <div class="section-divider"></div>
    </div>
    <div class="about-grid">
      <div class=""><p class="about-copy">${data.intro || ""}</p></div>
      <div class="about-list">
        ${(data.values || []).map((item, index) => `
          <div class="about-list-item">
            <div class="icon-box">${index === 0 ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>' : index === 1 ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>' : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>'}</div>
            <div><h3 style="margin: 0 0 0.75rem; font-size: 1.25rem; font-weight: 500;">${item.title}</h3><p style="margin: 0; color: var(--color-muted); line-height: 1.7; font-weight: 300;">${item.description}</p></div>
          </div>`).join("")}
      </div>
    </div>`;
}

function renderHomeGallerySection() {
  if (document.body.dataset.page !== "home") return;
  const data = homeData.gallery || {};
  const section = $("[data-home-gallery]");
  if (!section) return;
  section.innerHTML = `
    <div class="section-header">
      <p class="eyebrow" style="color: rgba(255, 255, 255, 0.85)">${data.eyebrow || ""}</p>
      <h2 class="section-title" style="color: #fff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)">${data.title || ""}</h2>
      <div class="section-divider"></div>
    </div>
    <div class="gallery-grid">
      ${(data.items || []).map((item, index) => `<div class="gallery-tile ${index === 0 ? 'wide' : index === 3 ? 'tall' : ''}"><img src="assets/images/product.png" alt="${item.alt}" /><div class="gallery-caption"><p style="margin: 0; font-size: 0.875rem; letter-spacing: 0.05em">${item.caption}</p></div></div>`).join("")}
    </div>`;
}

function renderHomeStatsSection() {
  if (document.body.dataset.page !== "home") return;
  const section = $("[data-home-stats]");
  if (!section) return;
  section.innerHTML = `<div class="stats-grid">${(homeData.stats || []).map((item) => `<div class=""><div class="stats-number accent-gradient-text" data-counter="${item.value}" data-suffix="${item.suffix}">0${item.suffix}</div><p style="font-size: clamp(0.75rem, 1.2vw, 1rem); color: var(--color-muted); letter-spacing: 0.1em;">${item.label}</p></div>`).join("")}</div>`;
}

function renderHomeContactSection() {
  if (document.body.dataset.page !== "home") return;
  const data = homeData.contactSection || {};
  const section = $("[data-home-contact]");
  if (!section) return;
  section.innerHTML = `
    <div class="section-header">
      <h2 class="section-title" style="font-size: clamp(2rem, 5vw, 3.75rem)">${data.title || ""}</h2>
      <p class="section-sub">${data.subtitle || ""}</p>
      <div class="section-divider"></div>
    </div>
    <div class="contact-grid">
      <div class="">
        <h3 style="font-size: 1.125rem; letter-spacing: 0.1em; margin: 0 0 2.5rem; font-weight: 500;">${data.infoTitle || ""}</h3>
        <div style="display: flex; flex-direction: column; gap: 2rem">${(data.infoItems || []).map((item, index) => `<div class="contact-line" style="color: var(--color-muted)"><div class="icon-box">${index === 0 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>' : index === 1 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.88.36 1.76.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.34 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>'}</div><span style="font-size: 1.125rem">${item}</span></div>`).join("")}</div>
      </div>
      <div class="">
        <h3 style="font-size: 1.125rem; letter-spacing: 0.1em; margin: 0 0 2.5rem; font-weight: 500;">${data.policyTitle || ""}</h3>
        <div style="display: flex; flex-direction: column; gap: 1.25rem">${(data.policyItems || []).map((text, index) => `<div class="warranty-row policy-card" style="padding: 1.5rem; background-color: var(--color-bg)"><div class="icon-box" style="width: 3rem; height: 3rem; border-radius: 0.75rem;">${index === 0 ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>' : index === 1 ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>' : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>'}</div><span style="font-size: 1.125rem; color: var(--color-text-primary);">${text}</span></div>`).join("")}</div>
        <div class="policy-card" style="margin-top: 2rem; padding: 1.75rem; background-color: var(--color-bg)"><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 1rem; letter-spacing: 0.1em; font-weight: 500;">${data.excludedTitle || ""}</p><div class="pill-group">${(data.excludedItems || []).map((item) => `<span class="pill-danger">${item}</span>`).join("")}</div></div>
      </div>
    </div>`;
}

function renderAboutPageContent() {
  if (document.body.dataset.page !== "about") return;
  const data = aboutPageData;
  const container = $("[data-about-page]");
  if (!container || !data.hero) return;

  container.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">${data.hero.eyebrow || ""}</p>
      <h1 class="section-title" style="font-size: clamp(2.5rem, 5vw, 4rem)">${data.hero.title || ""}</h1>
      <p class="section-sub">${data.hero.subtitle || ""}</p>
      <div class="section-divider"></div>
    </section>

    <section class="about-values-grid" style="margin-bottom: 2rem">
      ${(data.values || []).map((item, index) => `
        <article class="value-card glass">
          <div class="icon-box">
            ${index === 0 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6"><path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 15l-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 2z" /></svg>'
      : index === 1 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>'}
          </div>
          <h3>${item.title}</h3>
          <p style="color: var(--color-muted); font-size: 0.95rem; font-weight: 300; line-height: 1.75; margin: 0;">${item.description}</p>
        </article>`).join("")}
    </section>

    <section class="story-grid alt" style="margin-bottom: 5rem">
      <div>
        <p class="eyebrow">${data.story?.eyebrow || ""}</p>
        <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem)">${data.story?.title || ""}</h2>
        ${(data.story?.paragraphs || []).map(p => `<p style="color: var(--color-muted); line-height: 1.8; font-weight: 300; font-size: 1rem; margin: 0 0 1rem;">${p}</p>`).join("")}
      </div>
      <div class="story-image-wrap glass">
        <img src="assets/images/product.png" alt="ANNA Story" style="width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;" />
      </div>
    </section>

    <section class="" style="margin-bottom: 5rem">
      <div class="section-header">
        <h2 class="section-title">${data.timelineTitle || ""}</h2>
        <div class="section-divider"></div>
      </div>
      <div class="timeline">
        ${(data.timeline || []).map(item => `
          <div class="timeline-item">
            <div class="timeline-dot accent-gradient"></div>
            <span class="timeline-year">${item.year}</span>
            <p style="color: var(--color-muted); margin: 0; line-height: 1.7; font-weight: 300;">${item.text}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="policy-card glass" style="padding: 3.5rem; margin-bottom: 5rem;">
      <div class="section-header" style="margin-bottom: 2.5rem">
        <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2.25rem)">${data.benefitsTitle || ""}</h2>
        <div class="section-divider"></div>
      </div>
      <div class="policy-grid">
        ${(data.benefits || []).map(text => `
          <div class="card glass" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
            <div class="icon-box" style="width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; flex-shrink: 0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <span style="font-size: 1rem; color: var(--color-text-primary);">${text}</span>
          </div>`).join("")}
      </div>
    </section>`;
}

function renderContactPageContent() {
  if (document.body.dataset.page !== "contact") return;
  const data = contactPageData;
  const container = $("[data-contact-page]");
  if (!container || !data.hero) return;

  container.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">${data.hero.eyebrow || ""}</p>
      <h1 class="section-title" style="font-size: clamp(2.5rem, 5vw, 4rem)">${data.hero.title || ""}</h1>
      <p class="section-sub">${data.hero.subtitle || ""}</p>
      <div class="section-divider"></div>
    </section>

    <section class="contact-page-grid">
      <div style="display: flex; flex-direction: column; gap: 2.5rem">
        <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem">
          <div class="icon-box" style="margin-bottom: 2rem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h3 style="font-size: 1.375rem; margin: 0 0 1.5rem; font-weight: 500;">${data.contactInfoTitle || ""}</h3>
          <div style="display: flex; flex-direction: column; gap: 1.25rem">
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.12 4.18 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.88.36 1.76.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.34 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Hotline</p><p style="font-size: 1.0625rem; margin: 0">${data.hotline || ""}</p></div>
            </div>
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Email</p><p style="font-size: 1.0625rem; margin: 0">${data.email || ""}</p></div>
            </div>
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Địa chỉ</p><p style="font-size: 1.0625rem; line-height: 1.5; margin: 0">${(data.address || "").replace(", ", ",<br />")}</p></div>
            </div>
          </div>
        </article>

        <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem">
          <div class="icon-box" style="margin-bottom: 2rem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <h3 style="font-size: 1.375rem; margin: 0 0 1.5rem; font-weight: 500;">${data.quickSupportTitle || ""}</h3>
          <p style="font-size: 1rem; color: var(--color-muted); line-height: 1.8; font-weight: 300; margin: 0 0 1.5rem;">${data.quickSupportText || ""}</p>
          <button class="btn-outline" style="width: 100%; padding: 1rem">${data.quickSupportButton || ""}</button>
        </article>
      </div>

      <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem; display: flex; flex-direction: column;">
        <div class="icon-box" style="margin-bottom: 2rem">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <h3 style="font-size: 1.375rem; margin: 0 0 0.5rem; font-weight: 500">${data.formTitle || ""}</h3>
        <p style="font-size: 1rem; color: var(--color-muted); line-height: 1.8; font-weight: 300; margin: 0 0 2.5rem;">${data.formIntro || ""}</p>
        <div class="contact-form-status" data-contact-status>
          <div class="checkout-success-badge accent-gradient" style="margin: 0 auto 1rem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" stroke-width="2"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h4 style="font-size: 1.25rem; margin: 0 0 0.5rem">${data.formSuccessTitle || ""}</h4>
          <p style="font-size: 0.9375rem; color: var(--color-muted); margin: 0;">${data.formSuccessText || ""}</p>
        </div>
        <form data-contact-form class="form-grid" style="flex: 1">
          <div><label class="label">Họ và tên *</label><input type="text" required class="input-base" placeholder="Nhập họ và tên của bạn" /></div>
          <div><label class="label">Email *</label><input type="email" required class="input-base" placeholder="Nhập địa chỉ email" /></div>
          <div style="flex: 1"><label class="label">Nội dung *</label><textarea required rows="5" class="input-base" style="resize: none; height: calc(100% - 2rem)" placeholder="Bạn cần hỗ trợ gì?"></textarea></div>
          <button type="submit" class="btn-primary" style="margin-top: 1rem; padding: 1rem">Gửi lời nhắn</button>
        </form>
      </article>
    </section>`;

  initContactForm();
}

function productFavoriteButton(productId) {
  return `
    <button
      class="product-floating-btn favorite ${isFavorite(productId) ? "active" : ""}"
      data-toggle-favorite="${productId}"
      aria-label="Yêu thích"
    >
      ${heartIcon(isFavorite(productId))}
    </button>
  `;
}

function renderProductCard(product) {
  return `
    <article class="product-card" data-product-card="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-hover"><span>Xem chi tiết</span></div>
        <div class="product-quick-actions">
          ${productFavoriteButton(product.id)}
          <button class="product-floating-btn view" data-open-product="${product.id}" aria-label="Xem nhanh">
            ${eyeIcon()}
          </button>
        </div>
        <span class="product-badge">${product.style}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-bottom">
          <p class="product-price accent-gradient-text">${currency(product.price)}</p>
          <button class="product-cart-btn accent-gradient" data-add-cart="${product.id}">+ Giỏ hàng</button>
        </div>
      </div>
    </article>
  `;
}

function renderHorizontalProducts() {
  const track = $("[data-product-track]");
  if (!track) return;
  track.innerHTML = `${products.map((product) => renderProductCard(product).replace('class="product-card"', 'class="product-card is-home"')).join("")}
    <div class="product-card products-end-card">
      <div class="product-image">
        <div class="product-image-inner">
          <p class="font-display" style="font-size:1.75rem;margin:0 0 .65rem;">Khám phá thêm</p>
          <div class="section-divider" style="margin:.15rem auto .75rem;width:3.5rem;"></div>
          <p style="margin:0;color:var(--color-muted);font-size:.88rem;line-height:1.7;">10 mẫu kính độc đáo đang chờ bạn khám phá.</p>
        </div>
      </div>
      <div class="product-info">
        <div>
          <p class="product-name">Bộ sưu tập Anna Eyewear</p>
          <p class="product-desc">Tiếp tục hành trình với những thiết kế mắt mèo thanh lịch, cá tính và hiện đại cho nhiều phong cách khác nhau.</p>
        </div>
        <div class="product-bottom">
          <p class="product-price accent-gradient-text">10 thiết kế</p>
          <a href="san-pham.html" class="product-cart-btn accent-gradient" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">Xem thêm</a>
        </div>
      </div>
    </div>
    <div class="products-trailing-spacer" aria-hidden="true"></div>`;
}

function initPinnedProducts() {
  const section = $("[data-products-pinned]");
  const shell = $("[data-products-shell]");
  const strip = $(".products-strip", shell || document);
  const track = $("[data-product-track]");
  const progressBar = $("[data-products-progress]");
  if (!section || !shell || !strip || !track) return;

  if (state.productPinHandler) {
    window.removeEventListener("scroll", state.productPinHandler);
    window.removeEventListener("resize", state.productPinResizeHandler);
  }

  if (window.innerWidth <= 1024) {
    section.style.minHeight = "auto";
    shell.style.position = "relative";
    track.style.transform = "translateX(0px)";
    state.productProgress = 0;
    if (progressBar) progressBar.style.width = "0%";
    return;
  }

  const refresh = () => {
    const stickyStyles = window.getComputedStyle(shell);
    const padTop = parseFloat(stickyStyles.paddingTop) || 0;
    const padBottom = parseFloat(stickyStyles.paddingBottom) || 0;
    const visibleWidth = strip.clientWidth;
    const extraTravel = 96;
    const travel = Math.max(track.scrollWidth - visibleWidth + extraTravel, 0);
    const totalHeight = Math.max(
      window.innerHeight + travel + padTop + padBottom,
      window.innerHeight,
    );
    section.style.minHeight = `${totalHeight}px`;

    const rect = section.getBoundingClientRect();
    const spent = Math.min(Math.max(-rect.top, 0), travel);
    const progress = travel === 0 ? 0 : spent / travel;
    state.productProgress = progress;
    track.style.transform = `translateX(${-spent}px)`;
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
  };

  state.productPinHandler = refresh;
  state.productPinResizeHandler = initPinnedProducts;
  refresh();
  window.addEventListener("scroll", state.productPinHandler, { passive: true });
  window.addEventListener("resize", state.productPinResizeHandler);
}

function renderFeaturedPicks() {
  const container = $("[data-picks]");
  if (!container) return;
  container.innerHTML = products
    .slice(0, 3)
    .map(
      (product) => `
    <a href="san-pham.html" class="pick-card">
      <div class="pick-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="pick-overlay">
          <div>
            <span style="font-size:0.6875rem;letter-spacing:0.15em;color:var(--color-accent);display:block;margin-bottom:0.375rem;">${product.style}</span>
            <h3 class="font-display" style="font-size:1.5rem;color:#fff;margin:0;">${product.name}</h3>
          </div>
        </div>
      </div>
      <div class="pick-content">
        <div>
          <p style="font-size:0.875rem;color:var(--color-muted);font-weight:300;margin:0 0 0.25rem;">${product.material}</p>
          <p class="accent-gradient-text" style="font-size:1.25rem;font-weight:600;margin:0;">${currency(product.price)}</p>
        </div>
        <span style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--color-accent);letter-spacing:0.05em;">Khám phá ${arrowRightIcon()}</span>
      </div>
    </a>
  `,
    )
    .join("");
}

function renderProductsGrid() {
  $$('[data-product-list="all"]').forEach((node) => {
    node.innerHTML = products.map(renderProductCard).join("");
  });
}

function renderFavoritesDrawer() {
  const body = $("[data-favorite-body]");
  if (!body) return;
  const favorites = storage.getFavorites();
  if (!favorites.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:1.5rem;opacity:.3;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <p style="font-size:1.0625rem;margin:0;">Chưa có sản phẩm yêu thích</p>
      </div>
    `;
    return;
  }

  body.innerHTML = `<div style="display:flex;justify-content:flex-end;margin-bottom:1rem;"><button class="inline-action" data-clear-favorites>Xóa toàn bộ yêu thích</button></div><div class="drawer-list">${favorites
    .map(
      (product) => `
    <div class="drawer-item">
      <img src="${product.image}" alt="${product.name}">
      <div class="drawer-item-content">
        <h3 style="font-size:1.0625rem;color:var(--color-text-primary);font-weight:500;margin:0;">${product.name}</h3>
        <p class="accent-gradient-text" style="font-size:1rem;font-weight:600;margin:.25rem 0 0;">${currency(product.price)}</p>
        <button class="inline-action with-icon" data-add-cart="${product.id}">${shoppingCartIcon()}<span>Thêm vào giỏ</span></button>
      </div>
      <button class="icon-button" data-toggle-favorite="${product.id}" aria-label="Bỏ yêu thích" style="color:#f87171;">${heartIcon(true)}</button>
    </div>
  `,
    )
    .join("")}</div>`;
}

function renderCartDrawer() {
  const body = $("[data-cart-body]");
  const footer = $("[data-cart-footer]");
  const total = $("[data-cart-total]");
  if (!body || !footer || !total) return;

  const cart = storage.getCart();
  total.textContent = currency(totalPrice());

  if (!cart.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:1.5rem;opacity:.3;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p style="font-size:1.0625rem;margin:0;">Giỏ hàng trống</p>
      </div>
    `;
    footer.hidden = true;
    return;
  }

  footer.hidden = false;
  body.innerHTML = `<div style="display:flex;justify-content:flex-end;margin-bottom:1rem;"><button class="inline-action" data-clear-cart>Xóa toàn bộ giỏ hàng</button></div><div class="drawer-list">${cart
    .map(
      (item) => `
    <div class="drawer-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="drawer-item-content">
        <h3 style="font-size:1.0625rem;color:var(--color-text-primary);font-weight:500;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</h3>
        <p class="accent-gradient-text" style="font-size:1rem;font-weight:600;margin:.25rem 0 0;">${currency(item.price)}</p>
        <div class="qty-wrap">
          <button class="qty-btn" data-qty-minus="${item.id}">&minus;</button>
          <span style="font-size:1.0625rem;color:var(--color-text-primary);font-weight:500;width:2rem;text-align:center;">${item.quantity}</span>
          <button class="qty-btn" data-qty-plus="${item.id}">+</button>
        </div>
      </div>
      <button class="icon-button cart-remove-btn" data-remove-cart="${item.id}" aria-label="Xóa">${trashIcon()}</button>
    </div>
  `,
    )
    .join("")}</div>`;
}

function addToCart(productId, sourceElement = null) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const cart = storage.getCart();
  const found = cart.find((item) => item.id === productId);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  storage.setCart(cart);
  updateBadges();
  renderCartDrawer();
  showToast(`Đã thêm ${product.name} vào giỏ hàng`);
  flyPulse("#nav-cart-icon");
  flyProductImage(productId, "#nav-cart-icon", sourceElement);
}

function toggleFavorite(productId, sourceElement = null) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  let favorites = storage.getFavorites();
  if (favorites.some((item) => item.id === productId)) {
    favorites = favorites.filter((item) => item.id !== productId);
    showToast(`Đã bỏ yêu thích ${product.name}`);
  } else {
    favorites.push(product);
    showToast(`Đã thêm ${product.name} vào yêu thích`);
    flyPulse("#nav-favorite-icon");
    flyProductImage(productId, "#nav-favorite-icon", sourceElement);
  }
  storage.setFavorites(favorites);
  updateBadges();
  renderFavoritesDrawer();
  renderHorizontalProducts();
  renderProductsGrid();
  observeReveal();
}

function updateQuantity(productId, nextQuantity) {
  let cart = storage.getCart();
  cart = cart
    .map((item) =>
      item.id === productId ? { ...item, quantity: nextQuantity } : item,
    )
    .filter((item) => item.quantity > 0);
  storage.setCart(cart);
  updateBadges();
  renderCartDrawer();
}

function removeFromCart(productId) {
  storage.setCart(storage.getCart().filter((item) => item.id !== productId));
  updateBadges();
  renderCartDrawer();
}

function clearCart() {
  storage.setCart([]);
  updateBadges();
  renderCartDrawer();
  showToast("Đã xóa toàn bộ giỏ hàng");
}

function clearFavorites() {
  storage.setFavorites([]);
  updateBadges();
  renderFavoritesDrawer();
  renderHorizontalProducts();
  renderProductsGrid();
  observeReveal();
  showToast("Đã xóa toàn bộ yêu thích");
}

function openConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  danger = false,
}) {
  const root = $("[data-product-modal-root]");
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" data-close-confirm>
      <div class="modal-content confirm-modal" data-confirm-panel>
        <div class="checkout-header">
          <h2 class="drawer-title">${title}</h2>
          <button class="icon-button" data-close-confirm aria-label="Đóng xác nhận">${closeIcon()}</button>
        </div>
        <div class="confirm-modal-body">
          <p style="margin:0;color:var(--color-muted);line-height:1.8;">${message}</p>
          <div class="confirm-modal-actions">
            <button class="btn-outline" data-cancel-confirm style="flex:1;">Hủy</button>
            <button class="${danger ? "btn-danger" : "btn-primary"}" data-accept-confirm style="flex:1;">${confirmText}</button>
          </div>
        </div>
      </div>
    </div>`;

  lockBody(true);

  const close = () => {
    root.innerHTML = "";
    if (
      !$(".overlay.open") &&
      !$$("[data-drawer].open").length &&
      $$("[data-checkout-shell]").every((item) => item.hidden)
    ) {
      lockBody(false);
    }
  };

  $("[data-close-confirm]", root)?.addEventListener("click", close);
  $("[data-cancel-confirm]", root)?.addEventListener("click", close);
  $("[data-confirm-panel]", root)?.addEventListener("click", (event) =>
    event.stopPropagation(),
  );
  $("[data-accept-confirm]", root)?.addEventListener("click", () => {
    close();
    onConfirm();
  });
}

function openDrawer(type) {
  if (type === "cart") renderCartDrawer();
  if (type === "favorite") renderFavoritesDrawer();
  openOverlayUi();
  $(`[data-drawer="${type}"]`)?.classList.add("open");
}

function setBanner(index) {
  state.currentBanner = index;
  const banner = banners[index];
  const copy = $("[data-hero-copy]");
  if (!copy) return;
  copy.innerHTML = `
    ${banner.eyebrow ? `<p class="hero-eyebrow animate-fade-in">${banner.eyebrow}</p>` : ""}
    <h1 class="hero-title animate-fade-in">${banner.title}</h1>
    <p class="hero-sub animate-fade-in">${banner.sub}</p>
  `;
  $$("[data-hero-dot]").forEach((dot, dotIndex) =>
    dot.classList.toggle("active", dotIndex === index),
  );
}

function initHero() {
  const dotWrap = $("[data-hero-dots]");
  if (!dotWrap) return;

  dotWrap.innerHTML = banners
    .map(
      (_, index) =>
        `<button class="hero-dot ${index === 0 ? "active" : ""}" data-hero-dot data-banner-index="${index}" aria-label="Banner ${index + 1}"></button>`,
    )
    .join("");
  setBanner(0);

  clearInterval(state.heroTimer);
  state.heroTimer = setInterval(() => {
    setBanner((state.currentBanner + 1) % banners.length);
  }, 5000);
}

function openProductModal(productId) {
  const product = products.find((item) => item.id === productId);
  const root = $("[data-product-modal-root]");
  if (!product || !root) return;

  state.currentProductId = productId;
  state.activeView = 0;

  root.innerHTML = `
    <div class="modal-overlay" data-close-product-modal>
      <div class="modal-content" data-modal-stop>
        <div class="product-modal-grid">
          <div class="product-modal-media">
            <div class="product-modal-image-wrap">
              <img src="${product.image}" alt="${product.name}" class="product-modal-image" data-product-modal-image style="transform:${modalViews[0].transform};">
            </div>
            <div class="view-selector">
              ${modalViews
      .map(
        (view, index) => `
                <button class="${index === 0 ? "active" : ""}" data-modal-view="${index}">${view.label}</button>
              `,
      )
      .join("")}
            </div>
          </div>
          <div class="product-modal-info">
            <button class="modal-close" data-close-product-modal aria-label="Đóng">${closeIcon()}</button>
            <div class="product-modal-body">
              <div>
                <p style="font-size:.8125rem;letter-spacing:.2em;color:var(--color-accent);margin:0 0 .75rem;">${product.style}</p>
                <h2 class="font-display" style="font-size:2rem;color:var(--color-text-primary);margin:0;">${product.name}</h2>
              </div>
              <div class="product-modal-highlight">Lựa chọn đặc trưng</div>
              <p class="accent-gradient-text" style="font-size:1.75rem;font-weight:600;margin:0;">${currency(product.price)}</p>
              <p class="product-modal-description">${product.description}</p>
              <div class="product-meta-grid">
                <div><p style="font-size:.75rem;color:var(--color-muted);letter-spacing:.1em;margin:0 0 .375rem;">Chất liệu</p><p style="font-size:.9375rem;color:var(--color-text-primary);">${product.material}</p></div>
                <div><p style="font-size:.75rem;color:var(--color-muted);letter-spacing:.1em;margin:0 0 .375rem;">Bảo hành</p><p style="font-size:.9375rem;color:var(--color-text-primary);">6 tháng</p></div>
                <div><p style="font-size:.75rem;color:var(--color-muted);letter-spacing:.1em;margin:0 0 .375rem;">UV</p><p style="font-size:.9375rem;color:var(--color-text-primary);">UV400</p></div>
              </div>
              <div class="product-modal-actions">
                <button class="btn-primary" data-add-cart="${product.id}" style="flex:1;">Thêm vào giỏ</button>
                <button class="favorite-round ${isFavorite(product.id) ? "active" : ""}" data-toggle-favorite="${product.id}" aria-label="Yêu thích">${heartIcon(isFavorite(product.id))}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalOverlay = $(".modal-overlay", root);
  const modalPanel = $("[data-modal-stop]", root);
  const modalImage = $("[data-product-modal-image]", root);
  const closeButtons = $$("[data-close-product-modal]", root);
  const viewButtons = $$("[data-modal-view]", root);
  const addCartButton = $("[data-add-cart]", root);
  const favoriteButton = $("[data-toggle-favorite]", root);

  if (modalOverlay) {
    modalOverlay.addEventListener("click", () => closeProductModal());
  }

  if (modalPanel) {
    modalPanel.addEventListener("click", (event) => event.stopPropagation());
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeProductModal();
    });
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(button.getAttribute("data-modal-view"));
      state.activeView = index;
      viewButtons.forEach((node, nodeIndex) =>
        node.classList.toggle("active", nodeIndex === index),
      );
      if (modalImage) {
        modalImage.classList.add("is-animating");
        modalImage.style.transform = modalViews[index].transform;
        setTimeout(() => modalImage.classList.remove("is-animating"), 180);
      }
    });
  });

  if (addCartButton) {
    addCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      addToCart(product.id, event.currentTarget);
    });
  }

  if (favoriteButton) {
    favoriteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(product.id, event.currentTarget);
      openProductModal(product.id);
    });
  }

  lockBody(true);
}

function closeProductModal() {
  const root = $("[data-product-modal-root]");
  if (!root) return;
  root.innerHTML = "";
  if (
    !$(".overlay.open") &&
    !$$("[data-drawer].open").length &&
    $$("[data-checkout-shell]").every((item) => item.hidden)
  ) {
    lockBody(false);
  }
}

function openCheckout() {
  if (!storage.getCart().length) return;
  $$('[data-drawer="cart"]').forEach((item) => item.classList.remove("open"));
  openOverlayUi();
  const shell = $("[data-checkout-shell]");
  if (!shell) return;
  shell.hidden = false;
  const countNode = $("[data-checkout-count]");
  const totalNode = $("[data-checkout-total]");
  if (countNode)
    countNode.textContent = `${storage.getCart().length} sản phẩm`;
  if (totalNode) totalNode.textContent = currency(totalPrice());
}

function closeCheckout() {
  const shell = $("[data-checkout-shell]");
  if (!shell) return;
  shell.hidden = true;
  const success = $("[data-checkout-success]");
  const form = $("[data-checkout-form]");
  if (success) success.hidden = true;
  if (form) {
    form.hidden = false;
    form.reset();
  }
  if (!$(".overlay.open") && !$$("[data-drawer].open").length) {
    lockBody(false);
  }
}

function initLoadingScreen() {
  const screen = $("[data-loading-screen]");
  const word = $("[data-loading-word]");
  const fill = $("[data-loading-fill]");
  const percent = $("[data-loading-percent]");
  if (!screen || !word || !fill || !percent) return;

  if (sessionStorage.getItem("anna-home-splash-seen") === "1") {
    screen.remove();
    return;
  }

  let wordIndex = 0;
  let progress = 0;
  word.textContent = loadingWords[wordIndex];
  state.loadingWordTimer = setInterval(() => {
    wordIndex = (wordIndex + 1) % loadingWords.length;
    word.textContent = loadingWords[wordIndex];
    word.classList.remove("animate-fade-in");
    void word.offsetWidth;
    word.classList.add("animate-fade-in");
  }, 900);

  const duration = 2700;
  const start = performance.now();
  const animate = (now) => {
    progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * 100);
    fill.style.width = `${value}%`;
    percent.textContent = String(value).padStart(3, "0");
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      clearInterval(state.loadingWordTimer);
      sessionStorage.setItem("anna-home-splash-seen", "1");
      screen.classList.add("hidden");
      setTimeout(() => screen.remove(), 420);
    }
  };
  requestAnimationFrame(animate);
}

function initCounters() {
  const counters = $$("[data-counter]");
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const target = Number(node.getAttribute("data-counter"));
        const suffix = node.getAttribute("data-suffix") || "";
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          node.textContent = `${current.toLocaleString("vi-VN")}${suffix}`;
        }, 40);
        observer.unobserve(node);
      });
    },
    { threshold: 0.4 },
  );
  counters.forEach((counter) => observer.observe(counter));
}

let revealObserver;
function observeReveal() {
  if (revealObserver) revealObserver.disconnect();
  const nodes = $$(".reveal");
  if (!nodes.length) return;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );
  nodes.forEach((node) => revealObserver.observe(node));
}

function initContactForm() {
  const form = $("[data-contact-form]");
  const success = $("[data-contact-status]");
  if (!form || !success) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    success.classList.add("show");
    setTimeout(() => success.classList.remove("show"), 3000);
  });
}

function initCheckoutForm() {
  const form = $("[data-checkout-form]");
  const success = $("[data-checkout-success]");
  if (!form || !success) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    success.hidden = false;
    storage.setCart([]);
    updateBadges();
    renderCartDrawer();
    clearTimeout(state.checkoutTimer);
    state.checkoutTimer = setTimeout(() => {
      closeCheckout();
      closeOverlayUi();
    }, 2200);
  });
}

function initNavbarScroll() {
  const header = $(".site-header");
  if (!header) return;
  const onScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 50);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest(
      "button, a, [data-close-product-modal], [data-modal-view], [data-product-card]",
    );
    const overlay = event.target.closest("[data-overlay]");
    const modalOverlay = event.target.closest(".modal-overlay");
    const modalContent = event.target.closest("[data-modal-stop]");

    if (overlay) {
      closeOverlayUi();
      return;
    }

    if (modalOverlay && !modalContent) {
      closeProductModal();
      return;
    }

    if (event.target.matches("[data-close-product-modal]")) {
      closeProductModal();
      return;
    }

    if (event.target.closest("[data-close-product-modal]")) {
      closeProductModal();
      return;
    }

    if (!target) return;

    if (target.matches("[data-modal-stop]")) {
      return;
    }

    if (target.matches("[data-menu-toggle]")) {
      $("[data-mobile-menu]")?.classList.toggle("open");
      return;
    }

    if (target.matches("[data-open-drawer]")) {
      openDrawer(target.getAttribute("data-open-drawer"));
      return;
    }

    if (target.matches("[data-close-ui]")) {
      closeOverlayUi();
      return;
    }

    if (target.matches("[data-add-cart]")) {
      addToCart(target.getAttribute("data-add-cart"), target);
      return;
    }

    if (target.matches("[data-toggle-favorite]")) {
      toggleFavorite(
        target.getAttribute("data-toggle-favorite"),
        target,
      );
      return;
    }

    if (target.matches("[data-open-product]")) {
      openProductModal(target.getAttribute("data-open-product"));
      return;
    }

    if (target.matches("[data-qty-minus]")) {
      const id = target.getAttribute("data-qty-minus");
      const item = storage.getCart().find((entry) => entry.id === id);
      if (item) updateQuantity(id, item.quantity - 1);
      return;
    }

    if (target.matches("[data-qty-plus]")) {
      const id = target.getAttribute("data-qty-plus");
      const item = storage.getCart().find((entry) => entry.id === id);
      if (item) updateQuantity(id, item.quantity + 1);
      return;
    }

    if (target.matches("[data-remove-cart]")) {
      removeFromCart(target.getAttribute("data-remove-cart"));
      return;
    }

    if (target.matches("[data-clear-cart]")) {
      openConfirmModal({
        title: "Xóa toàn bộ giỏ hàng",
        message:
          "Bạn có chắc muốn xóa toàn bộ sản phẩm đang có trong giỏ hàng không?",
        confirmText: "Xóa giỏ hàng",
        onConfirm: clearCart,
        danger: true,
      });
      return;
    }

    if (target.matches("[data-clear-favorites]")) {
      openConfirmModal({
        title: "Xóa toàn bộ yêu thích",
        message:
          "Bạn có chắc muốn xóa toàn bộ sản phẩm yêu thích không?",
        confirmText: "Xóa yêu thích",
        onConfirm: clearFavorites,
        danger: true,
      });
      return;
    }

    if (target.matches("[data-open-checkout]")) {
      openCheckout();
      return;
    }

    if (target.matches("[data-close-checkout]")) {
      closeCheckout();
      closeOverlayUi();
      return;
    }

    if (target.matches("[data-hero-dot]")) {
      setBanner(Number(target.getAttribute("data-banner-index")));
      return;
    }

    const card = target.closest("[data-product-card]");
    if (card && !target.closest("button")) {
      openProductModal(card.getAttribute("data-product-card"));
      return;
    }

    if (target.tagName === "A") {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProductModal();
      closeOverlayUi();
      closeMobileMenu();
    }
  });
}

function renderAll() {
  renderHorizontalProducts();
  renderFeaturedPicks();
  renderProductsGrid();
  renderFavoritesDrawer();
  renderCartDrawer();
  updateBadges();
  observeReveal();
}

function heartIcon(filled) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>`;
}

function eyeIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>`;
}

function closeIcon() {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>`;
}

function trashIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
}

function arrowRightIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
}

function shoppingCartIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>`;
}

function init() {
  renderAll();
  renderFooterContent();
  renderHomeAboutSection();
  renderHomeGallerySection();
  renderHomeStatsSection();
  renderHomeContactSection();
  renderAboutPageContent();
  renderContactPageContent();
  initHero();
  initPinnedProducts();
  initLoadingScreen();
  initCounters();
  initContactForm();
  initCheckoutForm();
  initNavbarScroll();
  initEvents();
  observeReveal();
}

document.addEventListener("DOMContentLoaded", init);
