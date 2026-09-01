/* ============================================================
   Main entry point
   ============================================================
   Boot order:
     1. UI behaviors (navbar, mobile menu, floating WhatsApp)
     2. Featured grid (needs Modal + ScrollTrigger)
     3. GSAP animations
   ============================================================ */
(function () {
  'use strict';

  /* Featured grid is rendered once data + Modal are ready */
  if (typeof window.renderFeatured === 'function') {
    window.renderFeatured();
  }
})();
