/* ============================================================
   UI behaviors: mobile menu, sticky navbar, floating WhatsApp
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  (function mobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const iconM = document.getElementById('iconMenu');
    const iconX = document.getElementById('iconClose');
    if (!btn || !drawer) return;
    let open = false;
    const set = (v) => {
      open = v;
      drawer.style.maxHeight = v ? '420px' : '0px';
      drawer.classList.toggle('border-brand-line/0', !v);
      drawer.classList.toggle('border-brand-line', v);
      iconM.classList.toggle('hidden', v);
      iconX.classList.toggle('hidden', !v);
    };
    btn.addEventListener('click', () => set(!open));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  })();

  /* ---------- Sticky navbar background ---------- */
  (function stickyNav() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const apply = () => {
      if (window.scrollY > 24) {
        nav.style.background = 'rgba(250,250,250,0.85)';
        nav.style.backdropFilter = 'blur(16px) saturate(140%)';
        nav.style.borderBottom = '1px solid #E7DFD4';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'blur(0)';
        nav.style.borderBottom = '1px solid transparent';
      }
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  })();

  /* ---------- Floating WhatsApp visibility ---------- */
  (function floatingWA() {
    const fab = document.getElementById('floatWA');
    if (!fab) return;
    const apply = () => {
      const show = window.scrollY > 400;
      fab.style.opacity = show ? '1' : '0';
      fab.style.pointerEvents = show ? 'auto' : 'none';
      fab.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  })();
})();
