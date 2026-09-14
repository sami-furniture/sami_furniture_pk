/* ============================================================
   Featured Pieces & Collection Grid Renderer
   ============================================================
   Fulfills:
   - Staggered Entrance Animation
   - Luxury Hover Physics (image zoom 1.05, title lift, gold badge)
   - Category Filtering (All, Sofas, Beds, Tables, Chairs)
   - Dynamic Custom Cursor "EXPLORE" trigger
   ============================================================ */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgErrorAttr = ` onerror="this.onerror=null;this.style.display='none';if(this.parentElement)this.parentElement.style.background='linear-gradient(135deg,#F4EFEA 0%,#E8DFC5 100%)';"`;

  let currentCategory = 'all';
  let filtersBound = false;

  function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const Modal = window.Modal;
    const allProducts = window.PRODUCTS || [];

    // Filter products
    const filtered = allProducts
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => {
        if (currentCategory === 'all') return true;
        return p.category === currentCategory;
      })
      .slice(0, 8);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16 px-4">
          <p class="text-brand-muted text-base">No pieces available in this category currently.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(({ p, i }) => `
      <div data-featured-idx="${i}" data-cursor="EXPLORE"
           class="featured-card group relative overflow-hidden rounded-2xl bg-brand-sand border border-brand-line/60 text-left cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
        <!-- Image Container -->
        <div class="relative w-full overflow-hidden bg-brand-sand" style="aspect-ratio: 1/1;">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" referrerpolicy="no-referrer" loading="lazy"
               class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"${imgErrorAttr}>
          <div class="absolute inset-0 bg-gradient-to-t from-brand-noir/80 via-brand-noir/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

          <!-- Top Badge -->
          <div class="absolute top-3 left-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-noir/70 backdrop-blur-md border border-white/10 text-[10px] font-semibold tracking-wider text-brand-gold uppercase">
              ${esc(p.category)}
            </span>
          </div>

          <!-- Quick Action Pill on Hover -->
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <span class="w-8 h-8 rounded-full bg-brand-gold text-brand-noir grid place-items-center shadow-gold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </span>
          </div>
        </div>

        <!-- Details Bar -->
        <div class="p-4 md:p-5 flex items-center justify-between gap-3 bg-white">
          <div>
            <h3 class="font-display text-base md:text-lg font-medium text-brand-ink group-hover:text-brand-gold-dark transition-colors duration-300">
              ${esc(p.name)}
            </h3>
            <p class="text-xs text-brand-muted mt-0.5">Handcrafted in Gujranwala</p>
          </div>
          <span class="text-brand-gold text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
            Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </div>
    `).join('');

    // Staggered Entrance Animation via GSAP if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('#featuredGrid .featured-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

    // Click -> open product detail in Modal
    grid.querySelectorAll('[data-featured-idx]').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.featuredIdx, 10);
        if (window.Modal) window.Modal.show({ type: 'product', idx });
      });
    });
  }

  // Bind category filter tabs
  function initFilters() {
    if (filtersBound) return;
    const filterContainer = document.getElementById('featuredFilters');
    if (!filterContainer) return;
    filtersBound = true;

    filterContainer.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.filter;
        filterContainer.querySelectorAll('[data-filter]').forEach(b => {
          b.classList.remove('bg-brand-noir', 'text-white', 'border-brand-noir');
          b.classList.add('bg-white', 'text-brand-muted', 'border-brand-line');
        });
        btn.classList.remove('bg-white', 'text-brand-muted', 'border-brand-line');
        btn.classList.add('bg-brand-noir', 'text-white', 'border-brand-noir');
        renderFeatured();
      });
    });
  }

  function init() {
    initFilters();
    renderFeatured();
  }

  // Auto-init immediately, on DOMContentLoaded, on sections:loaded, and expose globally
  window.renderFeatured = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('sections:loaded', init);
})();
