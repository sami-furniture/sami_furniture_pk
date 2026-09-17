/* ============================================================
   SAMI FURNITURE HOUSE — PREMIUM MOTION & INTERACTION SYSTEM
   ============================================================
   Fulfills all 24 luxury motion requirements:
   - Staggered Hero Entrance
   - Scroll-Triggered Masked Line Reveals
   - Cinematic Image Unveils (Mask + Counter-scale)
   - Subtle Parallax Depth
   - Scroll-Based Storytelling ("From Wood to Home")
   - Pinned Horizontal Suites Showcase (Desktop) & Swipe (Mobile)
   - Magnetic CTA Micro-physics
   - Fluid Dual-Ring Custom Cursor with Contextual Labels
   - Full prefers-reduced-motion Accessibility
   ============================================================ */
(function () {
  'use strict';

  // Check user motion preferences (Requirement 21)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     1. Scroll Progress Bar (Requirement 17)
     ------------------------------------------------------------ */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const sh = h.scrollHeight || document.body.scrollHeight;
      const pct = (st / (sh - h.clientHeight)) * 100;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     2. Fluid Custom Cursor System (Requirement 12)
     ------------------------------------------------------------ */
  function initCustomCursor() {
    // Only on hover/pointer capable devices, disabled on touch/reduced motion
    if (prefersReducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot = document.getElementById('cursorDot');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;

    dot.style.display = 'block';
    follower.style.display = 'flex';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        follower.style.opacity = '1';
      }
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      follower.style.opacity = '0';
    });

    // Smooth Lerp loop for follower
    function renderCursor() {
      if (isVisible) {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Event delegation for cursor context states
    document.addEventListener('mouseover', (e) => {
      const viewEl = e.target.closest('[data-cursor="VIEW"]');
      const exploreEl = e.target.closest('[data-cursor="EXPLORE"]');
      const linkEl = e.target.closest('a, button, [role="button"], input, .cursor-pointer');

      const labelSpan = follower.querySelector('span');

      if (viewEl) {
        document.body.classList.add('cursor-view');
        document.body.classList.remove('cursor-explore', 'cursor-active');
        if (labelSpan) labelSpan.textContent = 'VIEW';
      } else if (exploreEl) {
        document.body.classList.add('cursor-explore');
        document.body.classList.remove('cursor-view', 'cursor-active');
        if (labelSpan) labelSpan.textContent = 'EXPLORE';
      } else if (linkEl) {
        document.body.classList.add('cursor-active');
        document.body.classList.remove('cursor-view', 'cursor-explore');
        if (labelSpan) labelSpan.textContent = '';
      } else {
        document.body.classList.remove('cursor-view', 'cursor-explore', 'cursor-active');
        if (labelSpan) labelSpan.textContent = '';
      }
    });
  }

  /* ------------------------------------------------------------
     3. Magnetic CTA Micro-Interactions (Requirement 11)
     ------------------------------------------------------------ */
  function initMagneticButtons() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.28;
        const deltaY = (e.clientY - btnCenterY) * 0.28;

        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ------------------------------------------------------------
     4. GSAP & ScrollTrigger Animations
     ------------------------------------------------------------ */
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .line-inner, .img-mask-reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.clipPath = 'none';
      });
      return;
    }

    /* --- 4a. Hero Entrance Animation (Requirement 1) --- */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .to('#navbar', { y: 0, opacity: 1, duration: 1.0, delay: 0.1 })
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to('.hero-title .line-inner', {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.16,
        ease: 'power4.out',
      }, '-=0.6')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero-cta-btn', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, '-=0.7')
      .fromTo('.hero-slide.active .hero-slide-img',
        { scale: 1.15, opacity: 0.5 },
        { scale: 1.0, opacity: 1, duration: 1.8, ease: 'power2.out' },
        '-=1.5'
      );

    /* --- 4b. Hero Subtle Parallax (Requirement 4) --- */
    if (document.getElementById('heroImage')) {
      gsap.to('#heroImage', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }

    /* --- 4c. Masked Text Reveals (Requirement 7) --- */
    document.querySelectorAll('.mask-reveal').forEach((container) => {
      const inners = container.querySelectorAll('.line-inner');
      if (inners.length > 0) {
        gsap.to(inners, {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    /* --- 4d. Cinematic Image Unveils (Requirement 3) --- */
    document.querySelectorAll('.img-mask-reveal').forEach((mask) => {
      ScrollTrigger.create({
        trigger: mask,
        start: 'top 85%',
        onEnter: () => mask.classList.add('revealed'),
      });
    });

    /* --- 4e. General Staggered Scroll Reveals (Requirement 2) --- */
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    /* --- 4f. Number Counter Animations --- */
    document.querySelectorAll('.stat-number').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '+';
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString() + suffix;
        },
      });
    });

    /* --- 4g. Horizontal Scroll Collection (Requirement 6) --- */
    initHorizontalCollection();

    /* --- 4h. Scroll-Based Storytelling (Requirement 5) --- */
    initStorytelling();
  }

  /* ------------------------------------------------------------
     5. Horizontal Collection Suites (Requirement 6)
     Desktop: Pinned scrub | Mobile: Native touch swipe
     ------------------------------------------------------------ */
  function initHorizontalCollection() {
    const container = document.getElementById('collectionSuitesSection');
    const track = document.getElementById('collectionTrack');
    const progressBar = document.getElementById('suiteScrollProgress');
    if (!container || !track) return;

    // Desktop Pinning (1024px and wider)
    if (window.innerWidth >= 1024 && !prefersReducedMotion) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBar) {
            progressBar.style.width = `${Math.round(self.progress * 100)}%`;
          }
        },
      });
    }

    // Prev / Next Navigation Buttons (Works on all screen sizes)
    const prevBtn = document.getElementById('btnSuitePrev');
    const nextBtn = document.getElementById('btnSuiteNext');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -340, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------
     6. Scroll-Based Storytelling: "From Wood to Home" (Requirement 5)
     ------------------------------------------------------------ */
  function initStorytelling() {
    const section = document.getElementById('craftStorySection');
    if (!section) return;

    const steps = section.querySelectorAll('.story-step');
    const images = section.querySelectorAll('.story-visual-img');
    const pill = section.querySelector('#storyStageIndicator');
    const phaseEyebrow = section.querySelector('#storyPhaseEyebrow');
    const phaseTitle = section.querySelector('#storyPhaseTitle');
    const phaseBadge = section.querySelector('#storyPhaseBadge');
    const stageTabs = section.querySelectorAll('.story-stage-tab');

    // Mobile Tracker Elements
    const mobileStageText = section.querySelector('#mobileStoryStageText');
    const mobilePill = section.querySelector('#mobileStoryPill');
    const mobileSegments = section.querySelectorAll('.mobile-bar-seg');

    if (steps.length === 0 || images.length === 0) return;

    const STAGES_DATA = [
      {
        stage: '01',
        eyebrow: 'Phase 01 · Raw Material',
        title: 'Kiln-Dried Hardwood Timber',
        badge: 'Seasoned Wood',
        mobileText: 'Stage 01: Seasoned Timber'
      },
      {
        stage: '02',
        eyebrow: 'Phase 02 · Master Joinery',
        title: 'Solid Wood Workshop Assembly',
        badge: 'Mortise & Tenon',
        mobileText: 'Stage 02: Architectural Joinery'
      },
      {
        stage: '03',
        eyebrow: 'Phase 03 · Hand Polishing',
        title: 'Hand-Rubbed Polish & Finish',
        badge: 'Organic Grain',
        mobileText: 'Stage 03: Artisanal Finishing'
      },
      {
        stage: '04',
        eyebrow: 'Phase 04 · Master Upholstery',
        title: 'Deep Diamond Button Tufting',
        badge: 'Luxury Tailoring',
        mobileText: 'Stage 04: Luxury Upholstery'
      },
      {
        stage: '05',
        eyebrow: 'Phase 05 · Living Sanctuary',
        title: 'Installed in Your Living Space',
        badge: 'Sanctuary Placed',
        mobileText: 'Stage 05: Living Sanctuary'
      }
    ];

    // Clickable Stage Jump Tabs on Desktop
    stageTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(tab.dataset.stage, 10);
        if (steps[targetIdx]) {
          const offset = window.innerWidth < 768 ? 90 : 130;
          const targetY = steps[targetIdx].getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // Switch active visual based on scroll (responsive thresholds for mobile and desktop)
    steps.forEach((step, idx) => {
      ScrollTrigger.create({
        trigger: step,
        start: () => window.innerWidth < 768 ? 'top 65%' : 'top 55%',
        end: () => window.innerWidth < 768 ? 'bottom 35%' : 'bottom 45%',
        onEnter: () => setActiveStep(idx),
        onEnterBack: () => setActiveStep(idx),
      });
    });

    function setActiveStep(index) {
      const data = STAGES_DATA[index] || STAGES_DATA[0];

      // 1. Highlight current step bullet & text
      steps.forEach((s, i) => {
        const isActive = (i === index);
        s.classList.toggle('active-step', isActive);
        const indicator = s.querySelector('.step-bullet');
        if (indicator) {
          if (isActive) {
            indicator.classList.remove('bg-brand-noir-light', 'text-white/40', 'border-white/10');
            indicator.classList.add('bg-brand-gold', 'text-brand-noir', 'border-brand-gold', 'scale-110');
          } else {
            indicator.classList.remove('bg-brand-gold', 'text-brand-noir', 'border-brand-gold', 'scale-110');
            indicator.classList.add('bg-brand-noir-light', 'text-white/40', 'border-white/10');
          }
        }

        // Highlight mobile visual card
        const mobileCard = s.querySelector('.mobile-story-card');
        if (mobileCard) {
          if (isActive) {
            mobileCard.classList.remove('border-white/10');
            mobileCard.classList.add('border-brand-gold/70', 'shadow-gold');
          } else {
            mobileCard.classList.remove('border-brand-gold/70', 'shadow-gold');
            mobileCard.classList.add('border-white/10');
          }
        }
      });

      // 2. Cross-fade desktop visual images smoothly
      images.forEach((img, i) => {
        if (i === index) {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
          img.style.zIndex = '2';
        } else {
          img.style.opacity = '0';
          img.style.transform = 'scale(1.05)';
          img.style.zIndex = '1';
        }
      });

      // 3. Update desktop pill badge
      if (pill) {
        pill.textContent = `Stage ${data.stage} / 05`;
      }

      // 4. Update desktop bottom overlay metadata
      if (phaseEyebrow) phaseEyebrow.textContent = data.eyebrow;
      if (phaseTitle) phaseTitle.textContent = data.title;
      if (phaseBadge) phaseBadge.textContent = data.badge;

      // 5. Update desktop stage navigation tabs
      stageTabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('bg-brand-gold', 'text-brand-noir', 'shadow-gold');
          tab.classList.remove('bg-white/5', 'text-white/60');
        } else {
          tab.classList.remove('bg-brand-gold', 'text-brand-noir', 'shadow-gold');
          tab.classList.add('bg-white/5', 'text-white/60');
        }
      });

      // 6. Update mobile sticky progress tracker
      if (mobileStageText) mobileStageText.textContent = data.mobileText;
      if (mobilePill) mobilePill.textContent = `${data.stage} / 05`;
      if (mobileSegments && mobileSegments.length > 0) {
        mobileSegments.forEach((seg, i) => {
          if (i <= index) {
            seg.classList.remove('bg-white/20');
            seg.classList.add('bg-brand-gold');
          } else {
            seg.classList.remove('bg-brand-gold');
            seg.classList.add('bg-white/20');
          }
        });
      }
    }

    // Set initial stage
    setActiveStep(0);
  }

  /* ------------------------------------------------------------
     Hero Multi-Scene Animated Carousel
     ------------------------------------------------------------ */
  function initHeroScenes() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length <= 1) return;

    let current = 0;
    let timer = null;

    function goToSlide(idx) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      dots.forEach((d, i) => {
        if (i === idx) {
          d.classList.add('bg-brand-gold', 'text-brand-noir', 'font-bold');
          d.classList.remove('text-white/60');
        } else {
          d.classList.remove('bg-brand-gold', 'text-brand-noir', 'font-bold');
          d.classList.add('text-white/60');
        }
      });
      current = idx;
    }

    function nextSlide() {
      const next = (current + 1) % slides.length;
      goToSlide(next);
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 6500);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.heroDot, 10);
        goToSlide(idx);
        startTimer();
      });
    });

    startTimer();
  }

  /* ------------------------------------------------------------
     Initialization on DOM Ready & sections:loaded
     ------------------------------------------------------------ */
  function initAll() {
    initScrollProgress();
    initCustomCursor();
    initMagneticButtons();
    initHeroScenes();
    initGSAPAnimations();
  }

  document.addEventListener('sections:loaded', initAll);

  // Fallback in case sections are already rendered
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAll, 200);
  }
})();
