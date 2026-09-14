/* ============================================================
   UI behaviors: transforming navbar, mobile drawer, floating WhatsApp
   ============================================================ */
(function () {
  'use strict';

  function initUI() {
    /* ---------- 1. Dynamic Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2. Mobile menu drawer ---------- */
    const btn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const iconM = document.getElementById('iconMenu');
    const iconX = document.getElementById('iconClose');
    if (btn && drawer) {
      let open = false;
      const set = (v) => {
        open = v;
        drawer.style.maxHeight = v ? '480px' : '0px';
        drawer.classList.toggle('border-brand-line/0', !v);
        drawer.classList.toggle('border-brand-gold/20', v);
        if (iconM && iconX) {
          iconM.classList.toggle('hidden', v);
          iconX.classList.toggle('hidden', !v);
        }
      };
      btn.addEventListener('click', () => set(!open));
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    }

    /* ---------- 3. Sticky / Transforming Navigation (Requirement 13) ---------- */
    const nav = document.getElementById('navbar');
    if (nav) {
      const applyStickyNav = () => {
        if (window.scrollY > 30) {
          nav.classList.add('nav-scrolled');
          nav.style.background = 'rgba(251, 249, 245, 0.92)';
          nav.style.backdropFilter = 'blur(20px) saturate(160%)';
          nav.style.webkitBackdropFilter = 'blur(20px) saturate(160%)';
          nav.style.borderBottom = '1px solid rgba(197, 168, 128, 0.28)';
          nav.style.boxShadow = '0 10px 30px -10px rgba(11, 16, 21, 0.08)';
        } else {
          nav.classList.remove('nav-scrolled');
          nav.style.background = 'transparent';
          nav.style.backdropFilter = 'none';
          nav.style.webkitBackdropFilter = 'none';
          nav.style.borderBottom = '1px solid transparent';
          nav.style.boxShadow = 'none';
        }
      };
      applyStickyNav();
      window.addEventListener('scroll', applyStickyNav, { passive: true });
    }

    /* ---------- 4. Floating WhatsApp visibility ---------- */
    const fab = document.getElementById('floatWA');
    if (fab) {
      const applyFab = () => {
        const show = window.scrollY > 420;
        fab.style.opacity = show ? '1' : '0';
        fab.style.pointerEvents = show ? 'auto' : 'none';
        fab.style.transform = show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.9)';
      };
      applyFab();
      window.addEventListener('scroll', applyFab, { passive: true });
    }
  }

  document.addEventListener('sections:loaded', initUI);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initUI, 100);
  }
})();
