/* ============================================================
   Modal controller - product gallery + detail views
   ============================================================
   Exposes: window.Modal
   Depends on: window.PRODUCTS, window.CATEGORIES, gsap
   ============================================================ */
(function () {
  'use strict';

  const PRODUCTS = window.PRODUCTS || [];
  const CATEGORIES = window.CATEGORIES || {};

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgErrorAttr = ` onerror="this.onerror=null;this.style.display='none';if(this.parentElement)this.parentElement.style.background='linear-gradient(135deg,#EFE6DD 0%,#E5D9CB 100%)';"`;

  const Modal = {
    root:    document.getElementById('modalRoot'),
    card:    document.getElementById('modalCard'),
    body:    document.getElementById('modalBody'),
    title:   document.getElementById('modalTitle'),
    eyebrow: document.getElementById('modalEyebrow'),
    backBtn: document.getElementById('modalBack'),
    closeBtn:document.getElementById('modalClose'),
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
      gsap.to(this.root, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          this.root.classList.add('hidden');
          this.root.style.opacity = '';
          document.body.style.overflow = '';
          this.stack = [];
        }
      });
    },
    _open() {
      this.root.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.root.scrollTop = 0;
      gsap.fromTo(this.root, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(this.card, { y: 24, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    },
    _render(view, animate) {
      this.backBtn.classList.toggle('hidden', this.stack.length < 2);

      if (view.type === 'category') {
        const cat = CATEGORIES[view.category];
        this.eyebrow.textContent = 'Browse Collection';
        this.title.textContent = cat.title;
        const items = PRODUCTS
          .map((p, i) => ({ p, i }))
          .filter(x => x.p.category === view.category);

        if (items.length === 0) {
          this.body.innerHTML = `
            <div class="text-center py-16 px-5">
              <div class="w-16 h-16 mx-auto mb-5 rounded-full bg-brand-section grid place-items-center text-brand-wood">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <h3 class="font-display text-2xl text-brand-teal mb-2">Coming Soon</h3>
              <p class="text-brand-muted max-w-md mx-auto leading-relaxed">No products in this category yet. WhatsApp us — we have many more pieces in our showroom.</p>
              <a href="https://wa.me/923294300096" target="_blank" rel="noopener"
                 class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-white text-sm font-medium btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Inquire on WhatsApp
              </a>
            </div>`;
        } else {
          this.body.innerHTML = `
            <div class="mb-5 text-sm text-brand-muted">${items.length} ${items.length === 1 ? 'piece' : 'pieces'} available</div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              ${items.map(({ p, i }) => `
                <button type="button" data-product-idx="${i}"
                        class="modal-product group relative overflow-hidden rounded-xl bg-brand-section text-left transition-transform duration-500 hover:-translate-y-0.5"
                        style="aspect-ratio:1/1;">
                  <img src="${esc(p.image)}" alt="${esc(p.name)}"
                       class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"${imgErrorAttr}>
                  <div class="absolute inset-0" style="background:linear-gradient(180deg,transparent 50%,rgba(10,28,38,0.78) 100%);"></div>
                  <div class="absolute inset-x-3 bottom-3 text-white">
                    <div class="text-xs md:text-sm font-medium leading-tight">${esc(p.name)}</div>
                  </div>
                </button>
              `).join('')}
            </div>`;
        }
      } else if (view.type === 'product') {
        const p = PRODUCTS[view.idx];
        if (!p) { this.dismiss(); return; }
        const cat = CATEGORIES[p.category];
        this.eyebrow.textContent = cat.eyebrow;
        this.title.textContent = p.name;

        const waMsg = encodeURIComponent("Hi Sami Furniture House, I'm interested in: " + p.name);
        const desc = p.description || 'Hand-crafted at our Gujranwala workshop using kiln-dried solid wood and premium upholstery. Available in multiple sizes, fabrics and finishes — message us for details and current pricing.';

        this.body.innerHTML = `
          <div class="grid md:grid-cols-2 gap-6 md:gap-10">
            <div class="relative overflow-hidden rounded-2xl bg-brand-section" style="aspect-ratio:1/1;">
              <img src="${esc(p.image)}" alt="${esc(p.name)}"
                   class="absolute inset-0 w-full h-full object-cover"${imgErrorAttr}>
            </div>
            <div class="flex flex-col justify-center">
              <div class="eyebrow text-[10px] text-brand-wood font-semibold mb-3">${esc(cat.title)}</div>
              <h3 class="font-display text-3xl md:text-4xl text-brand-teal font-medium leading-tight" style="letter-spacing:-0.015em;">${esc(p.name)}</h3>
              <p class="mt-5 text-brand-muted leading-relaxed">${esc(desc)}</p>
              <div class="mt-6 pt-6 border-t border-brand-line space-y-2 text-sm">
                <div class="flex items-start gap-3 text-brand-ink">
                  <span class="mt-0.5 text-brand-green">✓</span>
                  <span>Custom sizes &amp; finishes available</span>
                </div>
                <div class="flex items-start gap-3 text-brand-ink">
                  <span class="mt-0.5 text-brand-green">✓</span>
                  <span>Pakistan-wide delivery</span>
                </div>
                <div class="flex items-start gap-3 text-brand-ink">
                  <span class="mt-0.5 text-brand-green">✓</span>
                  <span>WhatsApp for current pricing</span>
                </div>
              </div>
              <div class="mt-7 flex flex-wrap gap-3">
                <a href="https://wa.me/923294300096?text=${waMsg}" target="_blank" rel="noopener"
                   class="btn-primary inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-green text-white text-sm font-medium">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  Inquire on WhatsApp
                </a>
                <button type="button" data-view-category="${esc(p.category)}"
                        class="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white text-brand-teal text-sm font-medium border border-brand-line hover:-translate-y-0.5 transition-transform duration-300">
                  More ${esc(cat.title)}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>`;
      }

      if (animate) {
        this.root.scrollTop = 0;
        gsap.fromTo(this.body, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      }
    },
  };

  /* Wire up modal events */
  Modal.closeBtn.addEventListener('click', () => Modal.dismiss());
  Modal.backBtn.addEventListener('click', () => Modal.goBack());
  Modal.root.addEventListener('click', (e) => {
    if (e.target === Modal.root || e.target === Modal.root.firstElementChild) Modal.dismiss();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !Modal.root.classList.contains('hidden')) Modal.dismiss();
  });

  /* Delegated click handling inside the modal body */
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

  /* Bind category cards on the homepage */
  document.querySelectorAll('[data-cat-card]').forEach(card => {
    card.addEventListener('click', () => {
      Modal.show({ type: 'category', category: card.dataset.category });
    });
  });

  window.Modal = Modal;
})();
