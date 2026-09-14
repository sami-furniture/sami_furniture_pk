/* ============================================================
   Modal controller - product gallery + luxury detail views
   ============================================================
   Exposes: window.Modal
   Depends on: window.PRODUCTS, window.CATEGORIES, gsap
   ============================================================ */
(function () {
  'use strict';

  const PRODUCTS = window.PRODUCTS || [];
  const CATEGORIES = window.CATEGORIES || {
    sofas: { title: 'Sofas & Sectionals', eyebrow: 'Living Room Collection' },
    beds: { title: 'Beds & Suites', eyebrow: 'Bedroom Sanctuary' },
    tables: { title: 'Tables & Consoles', eyebrow: 'Dining & Accent' },
    chairs: { title: 'Bedroom & Lounge Chairs', eyebrow: 'Seating Atelier' },
  };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgErrorAttr = ` onerror="this.onerror=null;this.style.display='none';if(this.parentElement)this.parentElement.style.background='linear-gradient(135deg,#F4EFEA 0%,#E8DFC5 100%)';"`;

  const Modal = {
    root:     document.getElementById('modalRoot'),
    card:     document.getElementById('modalCard'),
    body:     document.getElementById('modalBody'),
    title:    document.getElementById('modalTitle'),
    eyebrow:  document.getElementById('modalEyebrow'),
    backBtn:  document.getElementById('modalBack'),
    closeBtn: document.getElementById('modalClose'),
    stack: [],

    show(view) {
      this.stack = [view];
      this._open();
      this._render(view, false);
    },
    navigate(view) {
      this.stack.push(view);
      this._render(view, true);
    },
    goBack() {
      if (this.stack.length > 1) {
        this.stack.pop();
        this._render(this.stack[this.stack.length - 1], true);
      }
    },
    dismiss() {
      if (!this.root) return;
      if (typeof gsap !== 'undefined') {
        gsap.to(this.card, {
          y: 20, opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in',
        });
        gsap.to(this.root, {
          opacity: 0, duration: 0.25, ease: 'power2.in',
          onComplete: () => {
            this.root.classList.add('hidden');
            this.root.style.opacity = '';
            document.body.style.overflow = '';
            this.stack = [];
          }
        });
      } else {
        this.root.classList.add('hidden');
        document.body.style.overflow = '';
        this.stack = [];
      }
    },
    _open() {
      if (!this.root) return;
      this.root.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.root.scrollTop = 0;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(this.root, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(this.card,
          { y: 30, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
        );
      }
    },
    _render(view, animate) {
      if (!this.body) return;
      if (this.backBtn) this.backBtn.classList.toggle('hidden', this.stack.length < 2);

      if (view.type === 'category') {
        const cat = CATEGORIES[view.category] || { title: view.category, eyebrow: 'Collection' };
        if (this.eyebrow) this.eyebrow.textContent = cat.eyebrow;
        if (this.title) this.title.textContent = cat.title;

        const items = PRODUCTS
          .map((p, i) => ({ p, i }))
          .filter(x => x.p.category === view.category);

        if (items.length === 0) {
          this.body.innerHTML = `
            <div class="text-center py-16 px-4">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-sand grid place-items-center text-brand-gold">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <h3 class="font-display text-2xl text-brand-ink mb-2">Showroom Exclusive Pieces</h3>
              <p class="text-brand-muted max-w-md mx-auto leading-relaxed text-sm">
                We have many more custom pieces available on display at our Gujranwala showroom. Inquire directly on WhatsApp to see photos and catalogue options.
              </p>
              <a href="https://wa.me/923294300096" target="_blank" rel="noopener"
                 class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-white text-sm font-medium btn-primary-luxury">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Inquire on WhatsApp
              </a>
            </div>`;
        } else {
          this.body.innerHTML = `
            <div class="mb-5 flex items-center justify-between text-xs text-brand-muted">
              <span>Showing ${items.length} ${items.length === 1 ? 'piece' : 'curated pieces'}</span>
              <span class="text-brand-gold font-medium">Click any item for full specifications</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              ${items.map(({ p, i }) => `
                <button type="button" data-product-idx="${i}" data-cursor="EXPLORE"
                        class="modal-product group relative overflow-hidden rounded-xl bg-brand-sand text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        style="aspect-ratio: 1/1;">
                  <img src="${esc(p.image)}" alt="${esc(p.name)}" referrerpolicy="no-referrer" loading="lazy"
                       class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"${imgErrorAttr}>
                  <div class="absolute inset-0 bg-gradient-to-t from-brand-noir/85 via-brand-noir/30 to-transparent"></div>
                  <div class="absolute inset-x-3.5 bottom-3.5 text-white">
                    <div class="text-xs md:text-sm font-medium leading-tight font-display">${esc(p.name)}</div>
                    <div class="text-[10px] text-brand-gold mt-1 flex items-center gap-1">
                      View Piece →
                    </div>
                  </div>
                </button>
              `).join('')}
            </div>`;
        }
      } else if (view.type === 'product') {
        const p = PRODUCTS[view.idx];
        if (!p) { this.dismiss(); return; }
        const cat = CATEGORIES[p.category] || { title: p.category, eyebrow: 'Signature Piece' };
        if (this.eyebrow) this.eyebrow.textContent = cat.eyebrow;
        if (this.title) this.title.textContent = p.name;

        const waMsg = encodeURIComponent(`Hi Sami Furniture House, I would like to inquire about pricing and custom options for: ${p.name}`);
        const desc = p.description || 'Masterfully hand-crafted at our Gujranwala atelier using kiln-dried solid seasoned wood and high-resilience upholstery. Customized to your exact dimensions, fabric preferences, and wood finish.';

        this.body.innerHTML = `
          <div class="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <!-- Product Photo -->
            <div class="md:col-span-6">
              <div class="relative overflow-hidden rounded-2xl bg-brand-sand shadow-lift border border-brand-line/60" style="aspect-ratio: 1/1;" data-cursor="VIEW">
                <img src="${esc(p.image)}" alt="${esc(p.name)}" referrerpolicy="no-referrer"
                     class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"${imgErrorAttr}>
                <div class="absolute top-4 left-4">
                  <span class="px-3 py-1 rounded-full bg-brand-noir/80 backdrop-blur-md text-brand-gold text-[10px] font-semibold tracking-wider uppercase border border-brand-gold/30">
                    Atelier Original
                  </span>
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="md:col-span-6 flex flex-col justify-center">
              <div class="eyebrow text-[10px] text-brand-gold font-semibold mb-2">${esc(cat.title)}</div>
              <h3 class="font-display text-2xl md:text-4xl text-brand-ink font-medium leading-tight">${esc(p.name)}</h3>
              <p class="mt-4 text-brand-muted text-sm md:text-base leading-relaxed">${esc(desc)}</p>

              <!-- Luxury Attributes -->
              <div class="mt-6 pt-6 border-t border-brand-line space-y-2.5 text-xs md:text-sm">
                <div class="flex items-center gap-3 text-brand-ink">
                  <span class="w-5 h-5 rounded-full bg-brand-sand text-brand-gold-dark grid place-items-center font-bold text-xs">✓</span>
                  <span><strong>100% Solid Seasoned Wood</strong> — Termite &amp; warp resistant</span>
                </div>
                <div class="flex items-center gap-3 text-brand-ink">
                  <span class="w-5 h-5 rounded-full bg-brand-sand text-brand-gold-dark grid place-items-center font-bold text-xs">✓</span>
                  <span><strong>Bespoke Sizing</strong> — Built to match your architectural room dimensions</span>
                </div>
                <div class="flex items-center gap-3 text-brand-ink">
                  <span class="w-5 h-5 rounded-full bg-brand-sand text-brand-gold-dark grid place-items-center font-bold text-xs">✓</span>
                  <span><strong>Pakistan-wide Delivery</strong> — Safe insured white-glove transport</span>
                </div>
              </div>

              <!-- Action CTAs -->
              <div class="mt-8 flex flex-wrap items-center gap-3">
                <a href="https://wa.me/923294300096?text=${waMsg}" target="_blank" rel="noopener"
                   class="btn-primary-luxury px-6 md:px-7 py-3.5 md:py-4 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  Get Quote on WhatsApp
                </a>
                <button type="button" data-view-category="${esc(p.category)}"
                        class="px-5 py-3.5 rounded-full bg-brand-sand text-brand-ink text-sm font-medium border border-brand-line hover:border-brand-gold/50 hover:bg-white transition-all duration-300">
                  More ${esc(cat.title)}
                </button>
              </div>
            </div>
          </div>`;
      }

      if (animate && typeof gsap !== 'undefined') {
        this.root.scrollTop = 0;
        gsap.fromTo(this.body, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
      }
    },
  };

  // Wire up modal events
  if (Modal.closeBtn) Modal.closeBtn.addEventListener('click', () => Modal.dismiss());
  if (Modal.backBtn) Modal.backBtn.addEventListener('click', () => Modal.goBack());
  if (Modal.root) {
    Modal.root.addEventListener('click', (e) => {
      if (e.target === Modal.root || e.target === Modal.root.firstElementChild) Modal.dismiss();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && Modal.root && !Modal.root.classList.contains('hidden')) Modal.dismiss();
  });

  // Delegated clicks inside modal
  if (Modal.body) {
    Modal.body.addEventListener('click', (e) => {
      const productBtn = e.target.closest('[data-product-idx]');
      if (productBtn) {
        Modal.navigate({ type: 'product', idx: parseInt(productBtn.dataset.productIdx, 10) });
        return;
      }
      const catBtn = e.target.closest('[data-view-category]');
      if (catBtn) {
        Modal.navigate({ type: 'category', category: catBtn.dataset.viewCategory });
      }
    });
  }

  // Bind category trigger cards across the site
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-cat-card]');
    if (card) {
      Modal.show({ type: 'category', category: card.dataset.category });
    }
  });

  window.Modal = Modal;
})();
