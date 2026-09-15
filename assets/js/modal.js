/* ============================================================
   SAMI FURNITURE HOUSE — LUXURY ATELIER PRODUCT DETAIL & GALLERY
   High-Contrast Luminous Ivory & Champagne Gold Theme
   ============================================================
   Exposes: window.Modal
   Depends on: window.PRODUCTS, window.CATEGORIES, gsap
   ============================================================ */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const imgErrorAttr = ` onerror="this.onerror=null;this.style.display='none';if(this.parentElement)this.parentElement.style.background='linear-gradient(135deg,#F4EFEA 0%,#E8DFC5 100%)';"`;

  // Material and finish catalogs
  const TIMBER_OPTIONS = [
    { id: 'sheesham', name: 'Kiln-Dried Sheesham (Rosewood)', badge: 'Master Standard', note: '<10% moisture, zero seasonal expansion' },
    { id: 'teak', name: 'Burma Teak (Architectural Grade)', badge: 'Heritage Luxury', note: 'Dense natural teak oils, lifetime durability' },
    { id: 'walnut', name: 'Italian Walnut Lacquer Finish', badge: 'Artisanal Lustre', note: 'Five progressive grits, hand-rubbed finish' },
    { id: 'natural-oil', name: 'Hand-Rubbed Organic Oil', badge: 'Matte Organic', note: 'Preserves raw organic grain texture & warmth' }
  ];

  const FABRIC_OPTIONS = [
    { id: 'emerald-velvet', name: 'Emerald Royale Velvet', swatch: 'bg-[#1b4332]', border: 'border-emerald-700' },
    { id: 'boucle-ivory', name: 'Alabaster Textured Bouclé', swatch: 'bg-[#f4efe6]', border: 'border-amber-300' },
    { id: 'midnight-velvet', name: 'Midnight Noir Velvet', swatch: 'bg-[#11161d]', border: 'border-slate-800' },
    { id: 'champagne-linen', name: 'Champagne Oat Linen', swatch: 'bg-[#d8c8b4]', border: 'border-amber-600' },
    { id: 'italian-leather', name: 'Full-Grain Italian Leather', swatch: 'bg-[#5c3a21]', border: 'border-amber-900' }
  ];

  // Helper to generate complementary angle & detail photos for any product
  function getProductGalleryPhotos(p, idx) {
    const photos = [{ url: p.image, label: 'Master View', desc: 'Complete Atelier Perspective' }];

    const nameLower = (p.name || '').toLowerCase();
    const cat = p.category || 'sofas';

    if (nameLower.includes('dewan') || nameLower.includes('chaise') || nameLower.includes('daybed')) {
      photos.push(
        { url: 'assets/img/dewan-3.jpeg', label: 'Upholstery Detail', desc: 'Deep Button Tufting & Velvet' },
        { url: 'assets/img/dewan-2.jpeg', label: 'Sanctuary Setting', desc: 'Installed in Living Space' },
        { url: 'assets/img/chair-6.jpeg', label: 'Joinery Framework', desc: 'Solid Wood Workshop Assembly' }
      );
    } else if (cat === 'chairs') {
      photos.push(
        { url: 'assets/img/chair-6.jpeg', label: 'Timber Joinery', desc: 'Mortise & Tenon Raw Assembly' },
        { url: 'assets/img/chair-4.jpeg', label: 'Scalloped Pair', desc: 'Accent Bedroom Suite Pair' },
        { url: 'assets/img/chair-8.jpeg', label: 'Cushion Tailoring', desc: 'Double-Stitched Seams & Foam' }
      );
    } else if (cat === 'beds') {
      photos.push(
        { url: 'assets/img/product-3.jpg', label: 'Nightstand Suite', desc: 'Floating Bedside Integration' },
        { url: 'assets/img/chair-6.jpeg', label: 'Timber Rib Framework', desc: 'Heavy Load-Bearing Hardwood' },
        { url: 'assets/img/product-5.jpg', label: 'Headboard Cushion', desc: 'Plush High-Resilience Comfort' }
      );
    } else if (cat === 'tables') {
      photos.push(
        { url: 'https://i.pinimg.com/736x/05/f4/95/05f4951dac576165ad91e09fb89e0dbf.jpg', label: 'Stone Pedestal', desc: 'Honed Travertine & Fluted Timber' },
        { url: 'assets/img/chair-6.jpeg', label: 'Hardwood Base', desc: 'Precision Joinery Understructure' },
        { url: 'assets/img/product-6.jpg', label: 'Ensemble View', desc: 'Nesting Coffee Table Pairing' }
      );
    } else {
      photos.push(
        { url: 'assets/img/chair-6.jpeg', label: 'Master Framework', desc: 'Kiln-Dried Hardwood Structure' },
        { url: 'assets/img/dewan-3.jpeg', label: 'Upholstery Craft', desc: 'Hand-Tailored Seaming' },
        { url: 'assets/img/dewan-2.jpeg', label: 'Installed Piece', desc: 'Living Room Architecture' }
      );
    }

    return photos.slice(0, 4);
  }

  // Get curated recommendations
  function getRelatedPieces(currentIdx, category) {
    const products = window.PRODUCTS || [];
    return products
      .map((p, i) => ({ p, i }))
      .filter(item => item.i !== currentIdx)
      .sort((a, b) => {
        if (a.p.category !== category && b.p.category === category) return -1;
        if (a.p.category === category && b.p.category !== category) return 1;
        return 0;
      })
      .slice(0, 3);
  }

  const Modal = {
    root:     document.getElementById('modalRoot'),
    card:     document.getElementById('modalCard'),
    body:     document.getElementById('modalBody'),
    title:    document.getElementById('modalTitle'),
    eyebrow:  document.getElementById('modalEyebrow'),
    backBtn:  document.getElementById('modalBack'),
    closeBtn: document.getElementById('modalClose'),
    stack: [],
    currentSelection: {
      timber: TIMBER_OPTIONS[0].name,
      fabric: FABRIC_OPTIONS[0].name,
      activePhotoIdx: 0,
    },

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
          y: 20, opacity: 0, scale: 0.97, duration: 0.22, ease: 'power2.in',
        });
        gsap.to(this.root, {
          opacity: 0, duration: 0.22, ease: 'power2.in',
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
        gsap.fromTo(this.root, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
        gsap.fromTo(this.card,
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
      }
    },

    _render(view, animate) {
      if (!this.body) return;
      const PRODUCTS = window.PRODUCTS || [];
      const CATEGORIES = window.CATEGORIES || {
        sofas: { title: 'Sofas & Dewans', eyebrow: 'Living Room Collection' },
        beds: { title: 'Beds & Suites', eyebrow: 'Bedroom Sanctuary' },
        tables: { title: 'Tables & Consoles', eyebrow: 'Dining & Accent' },
        chairs: { title: 'Bedroom & Lounge Chairs', eyebrow: 'Seating Atelier' },
      };

      if (this.backBtn) this.backBtn.classList.toggle('hidden', this.stack.length < 2);

      // Reset selection defaults for each new product
      if (view.type === 'product') {
        this.currentSelection.timber = TIMBER_OPTIONS[0].name;
        this.currentSelection.fabric = FABRIC_OPTIONS[0].name;
        this.currentSelection.activePhotoIdx = 0;
      }

      /* ------------------------------------------------------------------
         VIEW 1: CATEGORY COLLECTION ARCHIVE (Luminous Ivory Theme)
         ------------------------------------------------------------------ */
      if (view.type === 'category') {
        const cat = CATEGORIES[view.category] || { title: view.category, eyebrow: 'Atelier Archive' };
        if (this.eyebrow) this.eyebrow.textContent = cat.eyebrow;
        if (this.title) this.title.textContent = cat.title;

        const items = PRODUCTS
          .map((p, i) => ({ p, i }))
          .filter(x => x.p.category === view.category);

        if (items.length === 0) {
          this.body.innerHTML = `
            <div class="text-center py-20 px-4">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-sand border border-brand-gold/40 grid place-items-center text-brand-gold-dark">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <h3 class="font-display text-2xl text-brand-ink mb-2">Showroom Archive</h3>
              <p class="text-brand-muted max-w-md mx-auto leading-relaxed text-sm font-normal">
                We have numerous handcrafted pieces on display at our Gujranwala gallery floor. Inquire directly with our master craftsmen for catalogue access.
              </p>
              <a href="https://wa.me/923294300096?text=Hi%20Sami%20Furniture%20House%2C%20I'd%20like%20to%20see%20more%20catalogue%20pieces." target="_blank" rel="noopener"
                 class="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-green text-white text-sm font-semibold shadow-soft hover:bg-brand-green-dark transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Inquire on WhatsApp
              </a>
            </div>`;
        } else {
          this.body.innerHTML = `
            <div class="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-brand-line/80 pb-5">
              <div>
                <span class="eyebrow text-xs text-brand-gold-dark tracking-widest-2 uppercase font-bold">Atelier Catalog</span>
                <h2 class="font-display text-2xl md:text-3xl text-brand-ink font-semibold mt-1">${esc(cat.title)}</h2>
              </div>
              <div class="flex items-center gap-3 text-xs text-brand-muted font-medium">
                <span class="px-3.5 py-1.5 rounded-full bg-brand-sand border border-brand-line text-brand-ink font-semibold">${items.length} Curated Pieces</span>
                <span class="hidden sm:inline text-brand-gold-dark">Click any piece for custom specifications</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${items.map(({ p, i }) => `
                <div class="group relative rounded-2xl overflow-hidden bg-white border border-brand-line/80 hover:border-brand-gold hover:shadow-lift transition-all duration-500 flex flex-col" data-cursor="VIEW">
                  <div class="relative w-full aspect-[4/3] overflow-hidden bg-brand-sand">
                    <img src="${esc(p.image)}" alt="${esc(p.name)}" referrerpolicy="no-referrer" loading="lazy"
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"${imgErrorAttr}>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div class="absolute top-3 left-3">
                      <span class="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-brand-line text-[10px] font-bold text-brand-ink tracking-wider uppercase shadow-sm">
                        Solid Hardwood
                      </span>
                    </div>
                  </div>

                  <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div class="eyebrow text-[9px] text-brand-gold-dark tracking-widest-2 uppercase font-bold">${esc(cat.title)}</div>
                      <h3 class="font-display text-lg text-brand-ink font-semibold mt-1 group-hover:text-brand-gold-dark transition-colors">${esc(p.name)}</h3>
                      <p class="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed font-normal">${esc(p.description || '')}</p>
                    </div>

                    <div class="mt-5 pt-4 border-t border-brand-line/70 flex items-center justify-between">
                      <button type="button" data-product-idx="${i}"
                              class="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-brand-gold-dark hover:text-brand-ink uppercase transition-colors">
                        <span>View Atelier Specs</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                      <a href="https://wa.me/923294300096?text=${encodeURIComponent('Hi Sami Furniture House, I would like to inquire about: ' + p.name)}"
                         target="_blank" rel="noopener"
                         class="w-8 h-8 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green grid place-items-center hover:bg-brand-green hover:text-white transition-all duration-300 shadow-sm"
                         title="Quick WhatsApp Inquiry">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`;
        }
      }

      /* ------------------------------------------------------------------
         VIEW 2: FULL EDITORIAL ATELIER PRODUCT DETAIL (Luminous Ivory Theme)
         ------------------------------------------------------------------ */
      else if (view.type === 'product') {
        const p = PRODUCTS[view.idx];
        if (!p) { this.dismiss(); return; }
        const cat = CATEGORIES[p.category] || { title: p.category, eyebrow: 'Signature Masterpiece' };
        if (this.eyebrow) this.eyebrow.textContent = `Atelier Archive · ${cat.title}`;
        if (this.title) this.title.textContent = p.name;

        const photos = getProductGalleryPhotos(p, view.idx);
        const related = getRelatedPieces(view.idx, p.category);

        const buildWaUrl = (timberName, fabricName) => {
          const msg = `Hi Sami Furniture House, I'm interested in commissioning the "${p.name}" in ${timberName} with ${fabricName} upholstery. Could you please provide custom pricing, sizing, and lead time?`;
          return `https://wa.me/923294300096?text=${encodeURIComponent(msg)}`;
        };

        const initialWaUrl = buildWaUrl(this.currentSelection.timber, this.currentSelection.fabric);

        this.body.innerHTML = `
          <!-- MAIN EDITORIAL PRODUCT SHOWCASE -->
          <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            <!-- LEFT: MASTER VISUAL STAGE & THUMBNAILS (7 COLS) -->
            <div class="lg:col-span-7 flex flex-col gap-4">
              <!-- Primary Visual Display (Light Ivory Surround for Crisp Contrast) -->
              <div class="relative w-full rounded-2xl overflow-hidden bg-brand-sand border border-brand-line aspect-[4/3] sm:aspect-[16/10] shadow-soft group" data-cursor="VIEW">
                <img id="detailMainImage"
                     src="${esc(photos[0].url)}"
                     alt="${esc(p.name)}"
                     referrerpolicy="no-referrer"
                     class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"${imgErrorAttr}>
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

                <!-- Top Floating Badges -->
                <div class="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <span class="px-3.5 py-1.5 rounded-full bg-brand-ink/90 backdrop-blur-md border border-brand-gold/50 text-brand-gold-light text-[10px] font-bold tracking-wider uppercase shadow-md">
                    Atelier Commission
                  </span>
                  <span class="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-line text-brand-ink text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    100% Solid Seasoned Wood
                  </span>
                </div>

                <!-- Bottom Image Caption -->
                <div class="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs pointer-events-none">
                  <span id="detailPhotoCaption" class="text-white font-semibold tracking-wide drop-shadow-md">
                    ${esc(photos[0].label)} — ${esc(photos[0].desc)}
                  </span>
                  <span class="text-[10px] text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm font-mono tracking-widest uppercase">
                    REF: SFH-${1000 + (view.idx + 1)}
                  </span>
                </div>
              </div>

              <!-- Interactive Multi-Angle Gallery Thumbnails -->
              <div class="grid grid-cols-4 gap-2.5 sm:gap-3">
                ${photos.map((item, photoIdx) => `
                  <button type="button"
                          data-gallery-photo="${esc(item.url)}"
                          data-photo-label="${esc(item.label)}"
                          data-photo-desc="${esc(item.desc)}"
                          data-photo-index="${photoIdx}"
                          class="gallery-thumb group relative rounded-xl overflow-hidden aspect-[4/3] bg-brand-sand border transition-all duration-300 ${photoIdx === 0 ? 'border-brand-gold-dark ring-2 ring-brand-gold-dark shadow-sm' : 'border-brand-line opacity-75 hover:opacity-100 hover:border-brand-gold'}">
                    <img src="${esc(item.url)}" alt="${esc(item.label)}" referrerpolicy="no-referrer" loading="lazy"
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"${imgErrorAttr}>
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div class="absolute bottom-1 inset-x-1 text-center">
                      <span class="text-[8px] sm:text-[9px] font-bold text-white tracking-wider uppercase px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm block truncate">
                        ${esc(item.label)}
                      </span>
                    </div>
                  </button>
                `).join('')}
              </div>

              <!-- 4 Craftsmanship Assurance Badges (Warm Ivory & Crisp Ink) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div class="p-3 rounded-xl bg-brand-sand/80 border border-brand-line flex items-start gap-2.5 shadow-sm">
                  <span class="text-brand-gold-dark text-base mt-0.5">🪵</span>
                  <div class="leading-tight">
                    <div class="text-[11px] font-bold text-brand-ink">Seasoned Wood</div>
                    <div class="text-[9px] text-brand-muted mt-0.5">&lt;10% moisture kiln dried</div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-brand-sand/80 border border-brand-line flex items-start gap-2.5 shadow-sm">
                  <span class="text-brand-gold-dark text-base mt-0.5">🪚</span>
                  <div class="leading-tight">
                    <div class="text-[11px] font-bold text-brand-ink">Mortise &amp; Tenon</div>
                    <div class="text-[9px] text-brand-muted mt-0.5">Interlocking wood joints</div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-brand-sand/80 border border-brand-line flex items-start gap-2.5 shadow-sm">
                  <span class="text-brand-gold-dark text-base mt-0.5">🛋️</span>
                  <div class="leading-tight">
                    <div class="text-[11px] font-bold text-brand-ink">HR-45 Foam Core</div>
                    <div class="text-[9px] text-brand-muted mt-0.5">Permanent shape rebound</div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-brand-sand/80 border border-brand-line flex items-start gap-2.5 shadow-sm">
                  <span class="text-brand-gold-dark text-base mt-0.5">🚚</span>
                  <div class="leading-tight">
                    <div class="text-[11px] font-bold text-brand-ink">White-Glove Delivery</div>
                    <div class="text-[9px] text-brand-muted mt-0.5">Insured Pakistan-wide</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT: EDITORIAL SPECS & INTERACTIVE CUSTOMIZER (5 COLS) -->
            <div class="lg:col-span-5 flex flex-col justify-between">
              <div>
                <!-- Category & Code Line -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="h-px w-6 bg-brand-gold-dark"></span>
                  <span class="eyebrow text-xs text-brand-gold-dark tracking-widest-2 uppercase font-bold">${esc(cat.title)}</span>
                </div>

                <!-- Product Name -->
                <h1 class="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-ink font-semibold leading-tight">
                  ${esc(p.name)}
                </h1>

                <!-- Commission Pricing Status -->
                <div class="mt-3 flex flex-wrap items-baseline gap-2.5">
                  <span class="px-3.5 py-1.5 rounded-full bg-brand-sand border border-brand-gold/50 text-brand-gold-dark text-xs font-bold tracking-wide">
                    Direct Atelier Pricing
                  </span>
                  <span class="text-xs text-brand-muted font-medium">Custom Sized to Your Blueprint · 3–4 Weeks Crafting</span>
                </div>

                <!-- Editorial Description -->
                <p class="mt-4 text-brand-ink/80 text-sm leading-relaxed font-normal">
                  ${esc(p.description || 'Masterfully hand-crafted at our Gujranwala atelier using kiln-dried solid seasoned wood and high-resilience upholstery. Customized to your exact dimensions, fabric preferences, and wood finish.')}
                </p>

                <!-- CUSTOMIZER SECTION: TIMBER SELECTION -->
                <div class="mt-6 pt-5 border-t border-brand-line">
                  <div class="flex items-center justify-between mb-2.5">
                    <span class="eyebrow text-[10px] text-brand-gold-dark tracking-widest uppercase font-bold">1. Select Solid Timber</span>
                    <span id="activeTimberDisplay" class="text-xs text-brand-ink font-bold">${esc(this.currentSelection.timber)}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    ${TIMBER_OPTIONS.map((opt, optIdx) => `
                      <button type="button"
                              data-timber-name="${esc(opt.name)}"
                              class="timber-option-btn text-left p-2.5 rounded-xl border transition-all duration-300 ${optIdx === 0 ? 'bg-brand-sand-dark/80 border-brand-gold-dark text-brand-ink ring-1 ring-brand-gold-dark shadow-sm' : 'bg-white border-brand-line text-brand-ink hover:border-brand-gold/60 hover:bg-brand-sand/50'}">
                        <div class="text-xs font-bold flex items-center justify-between">
                          <span class="truncate">${esc(opt.name.split(' ')[0])}</span>
                          <span class="text-[9px] text-brand-gold-dark font-semibold px-1.5 py-0.5 rounded bg-brand-sand border border-brand-gold/30">${esc(opt.badge)}</span>
                        </div>
                        <div class="text-[10px] text-brand-muted mt-1 truncate font-normal">${esc(opt.note)}</div>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- CUSTOMIZER SECTION: UPHOLSTERY SELECTION -->
                <div class="mt-5">
                  <div class="flex items-center justify-between mb-2.5">
                    <span class="eyebrow text-[10px] text-brand-gold-dark tracking-widest uppercase font-bold">2. Select Luxury Upholstery</span>
                    <span id="activeFabricDisplay" class="text-xs text-brand-ink font-bold">${esc(this.currentSelection.fabric)}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    ${FABRIC_OPTIONS.map((f, fIdx) => `
                      <button type="button"
                              data-fabric-name="${esc(f.name)}"
                              title="${esc(f.name)}"
                              class="fabric-option-btn group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${fIdx === 0 ? 'bg-brand-sand-dark/90 border-brand-gold-dark text-brand-ink ring-1 ring-brand-gold-dark font-bold shadow-sm' : 'bg-white border-brand-line text-brand-ink hover:border-brand-gold/60'}">
                        <span class="w-3.5 h-3.5 rounded-full ${f.swatch} border ${f.border} shadow-sm shrink-0"></span>
                        <span class="text-xs font-medium">${esc(f.name.split(' ')[0])}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- ARCHITECTURAL SIZING SPECIFICATION -->
                <div class="mt-5 p-3.5 rounded-xl bg-brand-sand/70 border border-brand-line text-xs shadow-sm">
                  <div class="flex items-center justify-between text-brand-ink mb-1.5 font-bold">
                    <span class="text-brand-gold-dark uppercase tracking-wider text-[10px] font-bold">Architectural Dimensions</span>
                    <span class="text-brand-green font-semibold text-[11px]">Bespoke Sizing Guaranteed</span>
                  </div>
                  <div class="text-brand-ink/80 font-normal leading-relaxed">
                    Standard piece length, seating depth, and back cushion ergonomics are completely tailored to your room blueprint at our Gujranwala workshop.
                  </div>
                </div>
              </div>

              <!-- HIGH-CONVERTING ACTION BUTTONS -->
              <div class="mt-7 pt-5 border-t border-brand-line flex flex-col gap-3">
                <!-- Primary WhatsApp Inquiry -->
                <a id="detailPrimaryWhatsApp"
                   href="${initialWaUrl}"
                   target="_blank" rel="noopener"
                   class="btn-primary-luxury w-full py-4 text-center justify-center text-sm tracking-wider uppercase flex items-center gap-2.5 font-bold shadow-lift">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>Inquire on WhatsApp with Master Craftsman</span>
                </a>

                <!-- Secondary Actions -->
                <div class="grid grid-cols-2 gap-2.5">
                  <a href="tel:+923294300096"
                     class="px-4 py-3 rounded-xl bg-white border border-brand-line hover:border-brand-gold hover:bg-brand-sand text-brand-ink text-xs font-bold text-center tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-sm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>Call Concierge</span>
                  </a>

                  <button type="button" data-view-category="${esc(p.category)}"
                          class="px-4 py-3 rounded-xl bg-brand-sand border border-brand-line hover:border-brand-gold text-brand-ink text-xs font-bold text-center tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm">
                    <span>More in ${esc(cat.title.split(' ')[0])}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- COMPLEMENTARY CURATED ENSEMBLE SECTION -->
          ${related.length > 0 ? `
            <div class="mt-12 pt-8 border-t border-brand-line/80">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <span class="eyebrow text-[10px] text-brand-gold-dark tracking-widest uppercase font-bold">Complete Your Sanctuary</span>
                  <h3 class="font-display text-lg sm:text-xl text-brand-ink font-semibold mt-0.5">Curated Pairings from the Atelier</h3>
                </div>
                <span class="text-xs text-brand-muted hidden sm:inline font-medium">Select any piece to view specifications</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                ${related.map(({ p: relPiece, i: relIdx }) => `
                  <button type="button" data-product-idx="${relIdx}"
                          class="group text-left p-3.5 rounded-2xl bg-white border border-brand-line hover:border-brand-gold hover:shadow-soft transition-all duration-300 flex items-center gap-3.5" data-cursor="VIEW">
                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-brand-sand shrink-0 border border-brand-line">
                      <img src="${esc(relPiece.image)}" alt="${esc(relPiece.name)}" referrerpolicy="no-referrer" loading="lazy"
                           class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"${imgErrorAttr}>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="eyebrow text-[9px] text-brand-gold-dark font-bold uppercase tracking-wider truncate">${esc(relPiece.category)}</div>
                      <div class="text-sm font-semibold text-brand-ink truncate font-display group-hover:text-brand-gold-dark transition-colors">${esc(relPiece.name)}</div>
                      <div class="text-[10px] text-brand-muted mt-0.5 flex items-center gap-1 font-medium">
                        <span>View Piece</span>
                        <span class="group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        `;

        // Wire up dynamic gallery switching and customizer events
        const mainImg = this.body.querySelector('#detailMainImage');
        const caption = this.body.querySelector('#detailPhotoCaption');
        const timberDisplay = this.body.querySelector('#activeTimberDisplay');
        const fabricDisplay = this.body.querySelector('#activeFabricDisplay');
        const primaryWaBtn = this.body.querySelector('#detailPrimaryWhatsApp');
        const headerWaBtn = document.getElementById('modalHeaderWA');

        const updateWaLinks = () => {
          const updatedUrl = buildWaUrl(this.currentSelection.timber, this.currentSelection.fabric);
          if (primaryWaBtn) primaryWaBtn.href = updatedUrl;
          if (headerWaBtn) headerWaBtn.href = updatedUrl;
        };

        // Thumbnail Click Events
        const thumbs = this.body.querySelectorAll('.gallery-thumb');
        thumbs.forEach(thumb => {
          thumb.addEventListener('click', () => {
            const photoUrl = thumb.dataset.galleryPhoto;
            const photoLabel = thumb.dataset.photoLabel;
            const photoDesc = thumb.dataset.photoDesc;

            if (mainImg && photoUrl) {
              mainImg.style.opacity = '0.4';
              mainImg.style.transform = 'scale(0.98)';
              setTimeout(() => {
                mainImg.src = photoUrl;
                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
              }, 180);
            }
            if (caption) {
              caption.textContent = `${photoLabel} — ${photoDesc}`;
            }

            thumbs.forEach(t => {
              t.classList.remove('border-brand-gold-dark', 'ring-2', 'ring-brand-gold-dark', 'shadow-sm', 'opacity-100');
              t.classList.add('border-brand-line', 'opacity-75');
            });
            thumb.classList.remove('border-brand-line', 'opacity-75');
            thumb.classList.add('border-brand-gold-dark', 'ring-2', 'ring-brand-gold-dark', 'shadow-sm', 'opacity-100');
          });
        });

        // Timber Options Click Events
        const timberBtns = this.body.querySelectorAll('.timber-option-btn');
        timberBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const tName = btn.dataset.timberName;
            this.currentSelection.timber = tName;
            if (timberDisplay) timberDisplay.textContent = tName;

            timberBtns.forEach(b => {
              b.classList.remove('bg-brand-sand-dark/80', 'border-brand-gold-dark', 'text-brand-ink', 'ring-1', 'ring-brand-gold-dark', 'shadow-sm');
              b.classList.add('bg-white', 'border-brand-line', 'text-brand-ink');
            });
            btn.classList.remove('bg-white', 'border-brand-line');
            btn.classList.add('bg-brand-sand-dark/80', 'border-brand-gold-dark', 'text-brand-ink', 'ring-1', 'ring-brand-gold-dark', 'shadow-sm');

            updateWaLinks();
          });
        });

        // Fabric Swatches Click Events
        const fabricBtns = this.body.querySelectorAll('.fabric-option-btn');
        fabricBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const fName = btn.dataset.fabricName;
            this.currentSelection.fabric = fName;
            if (fabricDisplay) fabricDisplay.textContent = fName;

            fabricBtns.forEach(b => {
              b.classList.remove('bg-brand-sand-dark/90', 'border-brand-gold-dark', 'ring-1', 'ring-brand-gold-dark', 'font-bold', 'shadow-sm');
              b.classList.add('bg-white', 'border-brand-line');
            });
            btn.classList.remove('bg-white', 'border-brand-line');
            btn.classList.add('bg-brand-sand-dark/90', 'border-brand-gold-dark', 'ring-1', 'ring-brand-gold-dark', 'font-bold', 'shadow-sm');

            updateWaLinks();
          });
        });
      }

      if (animate && typeof gsap !== 'undefined') {
        this.root.scrollTop = 0;
        gsap.fromTo(this.body, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
      }
    },
  };

  // Wire up modal global events
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
