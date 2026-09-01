/* ============================================================
   Section loader - assembles index.html from /sections/*.html
   ============================================================
   Each section is fetched and injected into the slot of the
   same name (e.g. sections/navbar.html -> <div data-include="navbar"></div>).

   Load order is preserved by awaiting each fetch in sequence.

   Once all sections are in the DOM, app.js is loaded and the
   "sections:loaded" event is fired so other scripts know it's safe
   to bind behaviour.
   ============================================================ */
(function () {
  'use strict';

  /* Order matters: navbar must be first, modal near the end, etc. */
  const SECTION_ORDER = [
    'navbar',
    'hero',
    'brand-statement',
    'categories',
    'featured-pieces',
    'why-choose-us',
    'showroom',
    'testimonials',
    'final-cta',
    'footer',
    'product-gallery-modal',
    'floating-whatsapp',
  ];

  async function loadSection(name) {
    const slot = document.querySelector(`[data-include="${name}"]`);
    if (!slot) {
      console.warn(`[sections] No slot for "${name}"`);
      return;
    }
    try {
      const res = await fetch(`sections/${name}.html`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      slot.outerHTML = html; // replace the placeholder with the actual content
    } catch (err) {
      console.error(`[sections] Failed to load sections/${name}.html`, err);
      slot.outerHTML = `<!-- sections/${name}.html failed to load -->`;
    }
  }

  async function loadAll() {
    await Promise.all(SECTION_ORDER.map(loadSection));
    document.documentElement.dataset.sectionsReady = 'true';
    document.dispatchEvent(new CustomEvent('sections:loaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();
