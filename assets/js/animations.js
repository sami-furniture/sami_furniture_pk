/* ============================================================
   GSAP animations: hero entrance, parallax, scroll reveals, counters
   ============================================================
   Depends on: gsap, ScrollTrigger
   ============================================================ */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  gsap.set('.hero-eyebrow, .hero-title, .hero-sub, .hero-cta', { y: 30 });
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9, delay: 0.2 })
    .to('.hero-title',   { opacity: 1, y: 0, duration: 1.1 }, '-=0.6')
    .to('.hero-sub',     { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.hero-cta',     { opacity: 1, y: 0, duration: 0.9 }, '-=0.7');

  /* Hero parallax */
  gsap.to('#heroImage', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Scroll reveals - staggered for siblings */
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Stat counter */
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '+';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString() + suffix; }
    });
  });
})();
