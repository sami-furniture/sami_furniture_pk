/* ============================================================
   Featured Pieces grid renderer
   ============================================================
   Renders the homepage "Featured Pieces" grid from window.PRODUCTS.
   Depends on: window.PRODUCTS, window.Modal, gsap, ScrollTrigger
   ============================================================ */
(function () {
  'use strict';

  const PRODUCTS = window.PRODUCTS || [];

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgErrorAttr = ` onerror="this.onerror=null;this.style.display='none';if(this.parentElement)this.parentElement.style.background='linear-gradient(135deg,#EFE6DD 0%,#E5D9CB 100%)';"`;

  function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const Modal = window.Modal;
    const featured = PRODUCTS
      .map((p, i) => ({ p, i }))
      .filter(x => x.p.featured)
      .slice(0, 8);

    if (featured.length === 0) {
      grid.innerHTML = `<p class="col-span-full text-center text-brand-muted py-10">Mark a product with <code>featured: true</code> to show it here.</p>`;
      return;
    }
    grid.innerHTML = featured.map(({ p, i }) => `
      <button type="button" data-featured-idx="${i}"
              class="featured-card group relative overflow-hidden rounded-2xl bg-brand-section text-left"
              style="aspect-ratio:1/1; opacity:0; transform:translateY(30px);">
        <img src="${esc(p.image)}" alt="${esc(p.name)}"
             class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"${imgErrorAttr}>
        <div class="absolute inset-0 transition-opacity duration-500"
             style="background:linear-gradient(180deg,transparent 45%,rgba(10,28,38,0.75) 100%);"></div>
        <div class="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5 text-white">
          <div class="text-sm md:text-base font-medium leading-tight">${esc(p.name)}</div>
          <div class="mt-1 text-xs opacity-0 -translate-y-1 group-hover:opacity-90 group-hover:translate-y-0 transition-all duration-500" style="color:#EFE6DD;">View details →</div>
        </div>
      </button>
    `).join('');

    /* Animate them in on scroll */
    gsap.to('#featuredGrid .featured-card', {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 88%' }
    });

    /* Click -> open product detail directly */
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-featured-idx]');
      if (card && Modal) Modal.show({ type: 'product', idx: parseInt(card.dataset.featuredIdx, 10) });
    });
  }

  /* Expose for main.js */
  window.renderFeatured = renderFeatured;
})();
