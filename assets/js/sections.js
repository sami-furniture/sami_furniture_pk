/* ============================================================
   Section loader - assembles index.html from /sections/*.html
   ============================================================ */
(function () {
  'use strict';

  const SECTION_ORDER = [
    'navbar',
    'hero',
    'brand-statement',
    'categories',
    'storytelling',
    'featured-pieces',
    'custom-furniture',
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
      slot.outerHTML = html;
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
