const fs = require('fs');
const path = require('path');

const dataStr = fs.readFileSync('assets/data/site-data.js', 'utf8');
let ANNA_SITE_DATA;
eval(dataStr.replace('window.ANNA_SITE_DATA =', 'ANNA_SITE_DATA ='));

const { products, footer: footerData, home: homeData, aboutPage: aboutPageData, contactPage: contactPageData } = ANNA_SITE_DATA;

const currency = (value) => value.toLocaleString("vi-VN") + "đ";

const heartIcon = (active) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>`;
const eyeIcon = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>`;
const arrowRightIcon = () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function productFavoriteButton(productId) {
  return `
    <button
      class="product-floating-btn favorite"
      aria-label="Yêu thích"
    >
      ${heartIcon(false)}
    </button>
  `;
}

function renderProductCard(product, isHome = false) {
  return `
    <article class="product-card ${isHome ? 'is-home' : ''}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-hover"><span>Xem chi tiết</span></div>
        <div class="product-quick-actions">
          ${productFavoriteButton(product.id)}
          <button class="product-floating-btn view" aria-label="Xem nhanh">
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
          <a href="#cart" class="product-cart-btn accent-gradient">+ Giỏ hàng</a>
        </div>
      </div>
    </article>
  `;
}

const renderFooterContent = () => `
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

const renderHomeAbout = () => `
    <div class="section-header">
      <p class="eyebrow">${homeData.aboutSection.eyebrow || ""}</p>
      <h2 class="section-title">${homeData.aboutSection.title || ""}</h2>
      <div class="section-divider"></div>
    </div>
    <div class="about-grid">
      <div class=""><p class="about-copy">${homeData.aboutSection.intro || ""}</p></div>
      <div class="about-list">
        ${(homeData.aboutSection.values || []).map((item, index) => `
          <div class="about-list-item">
            <div class="icon-box">${index === 0 ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>' : index === 1 ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>' : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>'}</div>
            <div><h3 style="margin: 0 0 0.75rem; font-size: 1.25rem; font-weight: 500;">${item.title}</h3><p style="margin: 0; color: var(--color-muted); line-height: 1.7; font-weight: 300;">${item.description}</p></div>
          </div>`).join("")}
      </div>
    </div>`;

const renderHomeGallery = () => `
    <div class="section-header">
      <p class="eyebrow" style="color: rgba(255, 255, 255, 0.85)">${homeData.gallery.eyebrow || ""}</p>
      <h2 class="section-title" style="color: #fff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)">${homeData.gallery.title || ""}</h2>
      <div class="section-divider"></div>
    </div>
    <div class="gallery-grid">
      ${(homeData.gallery.items || []).map((item, index) => `<div class="gallery-tile ${index === 0 ? 'wide' : index === 3 ? 'tall' : ''}"><img src="assets/images/product.png" alt="${item.alt}" /><div class="gallery-caption"><p style="margin: 0; font-size: 0.875rem; letter-spacing: 0.05em">${item.caption}</p></div></div>`).join("")}
    </div>`;

const renderHomeStats = () => `<div class="stats-grid">${(homeData.stats || []).map((item) => `<div class=""><div class="stats-number accent-gradient-text">${item.value}${item.suffix}</div><p style="font-size: clamp(0.75rem, 1.2vw, 1rem); color: var(--color-muted); letter-spacing: 0.1em;">${item.label}</p></div>`).join("")}</div>`;

const renderHomeContact = () => `
    <div class="section-header">
      <h2 class="section-title" style="font-size: clamp(2rem, 5vw, 3.75rem)">${homeData.contactSection.title || ""}</h2>
      <p class="section-sub">${homeData.contactSection.subtitle || ""}</p>
      <div class="section-divider"></div>
    </div>
    <div class="contact-grid">
      <div class="">
        <h3 style="font-size: 1.125rem; letter-spacing: 0.1em; margin: 0 0 2.5rem; font-weight: 500;">${homeData.contactSection.infoTitle || ""}</h3>
        <div style="display: flex; flex-direction: column; gap: 2rem">${(homeData.contactSection.infoItems || []).map((item, index) => `<div class="contact-line" style="color: var(--color-muted)"><div class="icon-box">${index === 0 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>' : index === 1 ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.88.36 1.76.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.34 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>'}</div><span style="font-size: 1.125rem">${item}</span></div>`).join("")}</div>
      </div>
      <div class="">
        <h3 style="font-size: 1.125rem; letter-spacing: 0.1em; margin: 0 0 2.5rem; font-weight: 500;">${homeData.contactSection.policyTitle || ""}</h3>
        <div style="display: flex; flex-direction: column; gap: 1.25rem">${(homeData.contactSection.policyItems || []).map((text, index) => `<div class="warranty-row policy-card" style="padding: 1.5rem; background-color: var(--color-bg)"><div class="icon-box" style="width: 3rem; height: 3rem; border-radius: 0.75rem;">${index === 0 ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>' : index === 1 ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>' : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>'}</div><span style="font-size: 1.125rem; color: var(--color-text-primary);">${text}</span></div>`).join("")}</div>
        <div class="policy-card" style="margin-top: 2rem; padding: 1.75rem; background-color: var(--color-bg)"><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 1rem; letter-spacing: 0.1em; font-weight: 500;">${homeData.contactSection.excludedTitle || ""}</p><div class="pill-group">${(homeData.contactSection.excludedItems || []).map((item) => `<span class="pill-danger">${item}</span>`).join("")}</div></div>
      </div>
    </div>`;

const renderProductsTrack = () => `${products.map((p) => renderProductCard(p, true)).join("")}
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

const renderFeaturedPicks = () => products.slice(0, 3).map((product) => `
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
  `).join("");

const renderAboutPage = () => `
    <section class="page-hero">
      <p class="eyebrow">${aboutPageData.hero.eyebrow || ""}</p>
      <h1 class="section-title" style="font-size: clamp(2.5rem, 5vw, 4rem)">${aboutPageData.hero.title || ""}</h1>
      <p class="section-sub">${aboutPageData.hero.subtitle || ""}</p>
      <div class="section-divider"></div>
    </section>

    <section class="about-values-grid" style="margin-bottom: 2rem">
      ${(aboutPageData.values || []).map((item, index) => `
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
        <p class="eyebrow">${aboutPageData.story?.eyebrow || ""}</p>
        <h2 class="section-title" style="font-size: clamp(2rem, 4vw, 3rem)">${aboutPageData.story?.title || ""}</h2>
        ${(aboutPageData.story?.paragraphs || []).map(p => `<p style="color: var(--color-muted); line-height: 1.8; font-weight: 300; font-size: 1rem; margin: 0 0 1rem;">${p}</p>`).join("")}
      </div>
      <div class="story-image-wrap glass">
        <img src="assets/images/product.png" alt="ANNA Story" style="width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;" />
      </div>
    </section>

    <section class="" style="margin-bottom: 5rem">
      <div class="section-header">
        <h2 class="section-title">${aboutPageData.timelineTitle || ""}</h2>
        <div class="section-divider"></div>
      </div>
      <div class="timeline">
        ${(aboutPageData.timeline || []).map(item => `
          <div class="timeline-item">
            <div class="timeline-dot accent-gradient"></div>
            <span class="timeline-year">${item.year}</span>
            <p style="color: var(--color-muted); margin: 0; line-height: 1.7; font-weight: 300;">${item.text}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="policy-card glass" style="padding: 3.5rem; margin-bottom: 5rem;">
      <div class="section-header" style="margin-bottom: 2.5rem">
        <h2 class="section-title" style="font-size: clamp(1.5rem, 3vw, 2.25rem)">${aboutPageData.benefitsTitle || ""}</h2>
        <div class="section-divider"></div>
      </div>
      <div class="policy-grid">
        ${(aboutPageData.benefits || []).map(text => `
          <div class="card glass" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
            <div class="icon-box" style="width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; flex-shrink: 0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <span style="font-size: 1rem; color: var(--color-text-primary);">${text}</span>
          </div>`).join("")}
      </div>
    </section>`;

const renderContactPage = () => `
    <section class="page-hero">
      <p class="eyebrow">${contactPageData.hero.eyebrow || ""}</p>
      <h1 class="section-title" style="font-size: clamp(2.5rem, 5vw, 4rem)">${contactPageData.hero.title || ""}</h1>
      <p class="section-sub">${contactPageData.hero.subtitle || ""}</p>
      <div class="section-divider"></div>
    </section>

    <section class="contact-page-grid">
      <div style="display: flex; flex-direction: column; gap: 2.5rem">
        <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem">
          <div class="icon-box" style="margin-bottom: 2rem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h3 style="font-size: 1.375rem; margin: 0 0 1.5rem; font-weight: 500;">${contactPageData.contactInfoTitle || ""}</h3>
          <div style="display: flex; flex-direction: column; gap: 1.25rem">
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.12 4.18 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.13.88.36 1.76.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.34 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Hotline</p><p style="font-size: 1.0625rem; margin: 0">${contactPageData.hotline || ""}</p></div>
            </div>
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Email</p><p style="font-size: 1.0625rem; margin: 0">${contactPageData.email || ""}</p></div>
            </div>
            <div class="contact-line">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="flex-shrink: 0; margin-top: 0.25rem"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              <div><p style="font-size: 0.875rem; color: var(--color-muted); margin: 0 0 0.25rem;">Địa chỉ</p><p style="font-size: 1.0625rem; line-height: 1.5; margin: 0">${(contactPageData.address || "").replace(", ", ",<br />")}</p></div>
            </div>
          </div>
        </article>

        <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem">
          <div class="icon-box" style="margin-bottom: 2rem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <h3 style="font-size: 1.375rem; margin: 0 0 1.5rem; font-weight: 500;">${contactPageData.quickSupportTitle || ""}</h3>
          <p style="font-size: 1rem; color: var(--color-muted); line-height: 1.8; font-weight: 300; margin: 0 0 1.5rem;">${contactPageData.quickSupportText || ""}</p>
          <button class="btn-outline" style="width: 100%; padding: 1rem">${contactPageData.quickSupportButton || ""}</button>
        </article>
      </div>

      <article class="glass" style="padding: 3rem 2.5rem; border-radius: 1.5rem; display: flex; flex-direction: column;">
        <div class="icon-box" style="margin-bottom: 2rem">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <h3 style="font-size: 1.375rem; margin: 0 0 0.5rem; font-weight: 500">${contactPageData.formTitle || ""}</h3>
        <p style="font-size: 1rem; color: var(--color-muted); line-height: 1.8; font-weight: 300; margin: 0 0 2.5rem;">${contactPageData.formIntro || ""}</p>
        <form class="form-grid" style="flex: 1">
          <div><label class="label">Họ và tên *</label><input type="text" required class="input-base" placeholder="Nhập họ và tên của bạn" /></div>
          <div><label class="label">Email *</label><input type="email" required class="input-base" placeholder="Nhập địa chỉ email" /></div>
          <div style="flex: 1"><label class="label">Nội dung *</label><textarea required rows="5" class="input-base" style="resize: none; height: calc(100% - 2rem)" placeholder="Bạn cần hỗ trợ gì?"></textarea></div>
          <button type="submit" class="btn-primary" style="margin-top: 1rem; padding: 1rem">Gửi lời nhắn</button>
        </form>
      </article>
    </section>`;

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    // If it's an exact string replace for innerHTML
    if (key.includes('data-')) {
      const regex = new RegExp('<([a-z]+)[^>]*\\\\b' + key.replace(/"/g, '') + '\\\\b[^>]*>(.*?)</\\\\1>', 'gsi');
      content = content.replace(regex, (match, tag, inner) => {
        // preserve the tag but replace content
        return match.replace(inner, value);
      });
    }
  }
  
  // Strip script tags
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Write
  fs.writeFileSync(file, content);
};

// Process index.html
replaceInFile('index.html', {
  'data-footer': renderFooterContent(),
  'data-home-about': renderHomeAbout(),
  'data-home-gallery': renderHomeGallery(),
  'data-home-stats': renderHomeStats(),
  'data-home-contact': renderHomeContact(),
  'data-product-track': renderProductsTrack(),
  'data-picks': renderFeaturedPicks(),
});

// Process san-pham.html
replaceInFile('san-pham.html', {
  'data-footer': renderFooterContent(),
  'data-product-list="all"': products.map(p => renderProductCard(p)).join(''),
});

// Process ve-anna.html
replaceInFile('ve-anna.html', {
  'data-footer': renderFooterContent(),
  'data-about-page': renderAboutPage(),
});

// Process lien-he.html
replaceInFile('lien-he.html', {
  'data-footer': renderFooterContent(),
  'data-contact-page': renderContactPage(),
});

console.log("Done");
