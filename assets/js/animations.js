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
  let scrollProgressInitialized = false;
  function initScrollProgress() {
    if (scrollProgressInitialized) return;
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    scrollProgressInitialized = true;

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
  let customCursorInitialized = false;
  function initCustomCursor() {
    if (customCursorInitialized) return;
    // Only on hover/pointer capable devices, disabled on touch/reduced motion
    if (prefersReducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot = document.getElementById('cursorDot');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;
    customCursorInitialized = true;

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
  let magneticButtonsInitialized = false;
  function initMagneticButtons() {
    if (magneticButtonsInitialized) return;
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (magneticBtns.length === 0) return;
    magneticButtonsInitialized = true;

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
  let gsapInitialized = false;
  function initGSAPAnimations() {
    if (gsapInitialized) return;
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Verify sections have loaded
    if (!document.getElementById('home') && !document.getElementById('collectionSuitesSection')) return;
    gsapInitialized = true;

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
  }

  /* ------------------------------------------------------------
     5. Horizontal Collection Suites (Requirement 6)
     Fluid lookbook carousel with controls, touch-swipe & mouse drag
     ------------------------------------------------------------ */
  function initHorizontalCollection() {
    const container = document.getElementById('collectionSuitesSection');
    const track = document.getElementById('collectionTrack');
    const scrollWrapper = document.getElementById('collectionScrollWrapper') || (track ? track.parentElement : null);
    const progressBar = document.getElementById('suiteScrollProgress');
    if (!container || !track || !scrollWrapper) return;

    if (container.dataset.suiteInitialized === 'true') return;
    container.dataset.suiteInitialized = 'true';

    // Update progress bar based on horizontal scroll
    function updateSuiteProgress() {
      if (!progressBar || !scrollWrapper) return;
      const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const ratio = Math.max(0, Math.min(1, scrollWrapper.scrollLeft / maxScroll));
      const pct = Math.round(20 + ratio * 80);
      progressBar.style.width = `${pct}%`;
    }

    scrollWrapper.addEventListener('scroll', updateSuiteProgress, { passive: true });
    window.addEventListener('resize', updateSuiteProgress, { passive: true });
    updateSuiteProgress();

    // Determine one-card scroll step
    function getScrollStep() {
      const firstCard = track.querySelector('.suite-card');
      return firstCard ? firstCard.offsetWidth + 24 : 380;
    }

    // Prev / Next Navigation Buttons
    const prevBtn = document.getElementById('btnSuitePrev');
    const nextBtn = document.getElementById('btnSuiteNext');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollWrapper.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollWrapper.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }

    // Mouse Drag-To-Scroll (Desktop lookbook browsing)
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;
    let hasMoved = false;

    scrollWrapper.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - scrollWrapper.offsetLeft;
      scrollLeftPos = scrollWrapper.scrollLeft;
      scrollWrapper.classList.add('cursor-grabbing');
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        scrollWrapper.classList.remove('cursor-grabbing');
      }
    });

    scrollWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollWrapper.offsetLeft;
      const walk = (x - startX) * 1.3;
      if (Math.abs(walk) > 6) hasMoved = true;
      scrollWrapper.scrollLeft = scrollLeftPos - walk;
    });

    // Prevent accidental clicks on cards during a drag gesture
    track.querySelectorAll('.suite-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });

    // Subtle entrance animation when section enters viewport
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
      gsap.fromTo(track.querySelectorAll('.suite-card'),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }
  }

  /* ------------------------------------------------------------
     6. Scroll-Based Storytelling: "From Wood to Home" (Requirement 5)
     ------------------------------------------------------------ */
  function initStorytelling() {
    const section = document.getElementById('craftStorySection');
    if (!section) return;
    if (section.dataset.storyInitialized === 'true') return;
    section.dataset.storyInitialized = 'true';

    const mainCard = section.querySelector('#storyMainCard');
    const tabsTrack = section.querySelector('.story-tabs-track');
    const tabs = section.querySelectorAll('.story-tab-btn');
    const images = section.querySelectorAll('.story-visual-img');
    const progressBar = section.querySelector('#storyProgressBar');
    const currentNum = section.querySelector('#storyCurrentNum');

    // Visual Overlay Elements
    const visualPillText = section.querySelector('#storyVisualPillText');
    const visualBadge = section.querySelector('#storyVisualBadge');
    const visualEyebrow = section.querySelector('#storyVisualEyebrow');
    const visualTitle = section.querySelector('#storyVisualTitle');
    const visualAtelier = section.querySelector('#storyVisualAtelier');

    // Narrative Elements
    const watermark = section.querySelector('#storyWatermark');
    const textEyebrow = section.querySelector('#storyTextEyebrow');
    const textTitle = section.querySelector('#storyTextTitle');
    const specsContainer = section.querySelector('#storySpecsContainer');

    // Control Elements
    const dots = section.querySelectorAll('.story-dot');
    const playPauseBtn = section.querySelector('#storyPlayPauseBtn');
    const playIcon = section.querySelector('#storyPlayIcon');
    const pauseIcon = section.querySelector('#storyPauseIcon');

    if (!mainCard || images.length === 0) return;

    const STAGES_DATA = [
      {
        stage: '01',
        phaseEyebrow: 'Step 01 · Wood Quality',
        title: 'Seasoned Solid Wood Selection',
        visualTitle: 'Seasoned Solid Wood Planks',
        badge: 'Seasoned Wood',
        atelier: 'Gujranwala Workshop',
        specs: ['Moisture Under 10%', 'Pure Sheesham & Teak', 'No Cracking or Warping']
      },
      {
        stage: '02',
        phaseEyebrow: 'Step 02 · Wood Structure',
        title: 'Solid Wood Framing & Joints',
        visualTitle: 'Master Hand Joinery',
        badge: 'Interlocking Joints',
        atelier: 'Gujranwala Workshop',
        specs: ['Interlocking Joints', 'Solid Wood Frame', 'Built for Generations']
      },
      {
        stage: '03',
        phaseEyebrow: 'Step 03 · Hand Finishing',
        title: 'Hand Sanding & Smooth Polish',
        visualTitle: 'Hand-Rubbed Lacquer Finish',
        badge: 'Natural Grain',
        atelier: 'Polishing Studio',
        specs: ['5-Grade Hand Sanding', 'Italian Lacquer Polish', 'Rich Natural Wood Grain']
      },
      {
        stage: '04',
        phaseEyebrow: 'Step 04 · Cushioning & Fabric',
        title: 'Comfort Foam & Luxury Upholstery',
        visualTitle: 'Master Button Tufting',
        badge: 'Luxury Fabric',
        atelier: 'Upholstery Team',
        specs: ['High-Density HR Foam', 'Premium Velvet & Leather', 'Durable Double Stitching']
      },
      {
        stage: '05',
        phaseEyebrow: 'Step 05 · Safe Delivery',
        title: 'Delivered & Set Up in Your Home',
        visualTitle: 'Placed in Your Home',
        badge: 'Delivered & Set Up',
        atelier: 'All Pakistan Delivery',
        specs: ['Safe Nationwide Delivery', 'Complete Room Setup', 'Zero-Hassle Unboxing']
      }
    ];

    let currentActiveIdx = -1;
    let autoTimer = null;
    let isPaused = false;
    let isSectionInView = false;

    function setActiveStage(index) {
      if (index === currentActiveIdx || index < 0 || index >= STAGES_DATA.length) return;
      currentActiveIdx = index;
      const data = STAGES_DATA[index];

      // 1. Cross-fade 4:3 visual images
      images.forEach((img, i) => {
        if (i === index) {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
          img.style.pointerEvents = 'auto';
          img.style.zIndex = '2';
        } else {
          img.style.opacity = '0';
          img.style.transform = 'scale(1.05)';
          img.style.pointerEvents = 'none';
          img.style.zIndex = '1';
        }
      });

      // 2. Update Tabs (Scroll track horizontally ONLY - NEVER touch window scroll)
      tabs.forEach((tab, i) => {
        const isActive = (i === index);
        tab.classList.toggle('active', isActive);
        if (isActive && tabsTrack) {
          const trackRect = tabsTrack.getBoundingClientRect();
          const tabRect = tab.getBoundingClientRect();
          const scrollTarget = tabsTrack.scrollLeft + (tabRect.left - trackRect.left) - (tabsTrack.clientWidth / 2) + (tab.clientWidth / 2);
          tabsTrack.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        }
      });

      // 3. Update Progress Line & Counters
      if (progressBar) {
        progressBar.style.width = `${((index + 1) / STAGES_DATA.length) * 100}%`;
      }
      if (currentNum) {
        currentNum.textContent = data.stage;
      }

      // 4. Update Visual Card Overlays
      if (visualPillText) visualPillText.textContent = `Stage ${data.stage} / 05`;
      if (visualBadge) visualBadge.textContent = data.badge;
      if (visualEyebrow) visualEyebrow.textContent = data.phaseEyebrow;
      if (visualTitle) visualTitle.textContent = data.visualTitle;
      if (visualAtelier) visualAtelier.textContent = data.atelier;

      // 5. Update Narrative Content with refined micro-transitions
      if (watermark) {
        watermark.style.opacity = '0';
        setTimeout(() => {
          watermark.textContent = data.stage;
          watermark.style.opacity = '1';
        }, 150);
      }
      if (textEyebrow) textEyebrow.textContent = data.phaseEyebrow;
      if (textTitle) {
        textTitle.style.opacity = '0';
        textTitle.style.transform = 'translateY(6px)';
        setTimeout(() => {
          textTitle.textContent = data.title;
          textTitle.style.opacity = '1';
          textTitle.style.transform = 'translateY(0)';
        }, 120);
      }
      if (specsContainer) {
        const chips = specsContainer.querySelectorAll('.spec-text');
        data.specs.forEach((spec, i) => {
          if (chips[i]) chips[i].textContent = spec;
        });
      }

      // 6. Update Dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        if (i === index) {
          dot.classList.remove('bg-white/20');
          dot.classList.add('bg-brand-gold');
        } else {
          dot.classList.remove('bg-brand-gold');
          dot.classList.add('bg-white/20');
        }
      });
    }

    // Auto Advance Mechanism (Runs ONLY when Section is in View & Pauses on Hover & Touch)
    function startAutoTimer() {
      if (isPaused || !isSectionInView) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isSectionInView) {
          pauseAutoTimer();
          return;
        }
        const next = (currentActiveIdx + 1) % STAGES_DATA.length;
        setActiveStage(next);
      }, 7000);
    }

    function pauseAutoTimer() {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    function handleSectionVisibility(inView) {
      isSectionInView = inView;
      if (isSectionInView && !isPaused) {
        startAutoTimer();
      } else {
        pauseAutoTimer();
      }
    }

    // Tab Clicks
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(tab.dataset.stage, 10);
        setActiveStage(targetIdx);
        if (isSectionInView && !isPaused) startAutoTimer();
      });
    });

    // Dot Clicks
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(dot.dataset.dot, 10);
        setActiveStage(targetIdx);
        if (isSectionInView && !isPaused) startAutoTimer();
      });
    });

    // Play / Pause Auto-Advance Toggle
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
          pauseAutoTimer();
          if (playIcon) playIcon.classList.remove('hidden');
          if (pauseIcon) pauseIcon.classList.add('hidden');
        } else {
          if (isSectionInView) startAutoTimer();
          if (playIcon) playIcon.classList.add('hidden');
          if (pauseIcon) pauseIcon.classList.remove('hidden');
        }
      });
    }

    // Pause on Mouse Hover
    mainCard.addEventListener('mouseenter', pauseAutoTimer);
    mainCard.addEventListener('mouseleave', () => {
      if (!isPaused && isSectionInView) startAutoTimer();
    });

    // Touch Swipe Gesture Detection for Mobile & Tablets
    let touchStartX = 0;
    let touchStartY = 0;
    mainCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      pauseAutoTimer();
    }, { passive: true });

    mainCard.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      const deltaY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) {
          // Swipe Left -> Next
          const next = (currentActiveIdx + 1) % STAGES_DATA.length;
          setActiveStage(next);
        } else if (deltaX > 0 && currentActiveIdx > 0) {
          // Swipe Right -> Prev
          setActiveStage(currentActiveIdx - 1);
        }
      }
      if (!isPaused && isSectionInView) startAutoTimer();
    }, { passive: true });

    // Initial Stage Set (Without triggering page scroll)
    setActiveStage(0);

    // Section Visibility Tracking via ScrollTrigger & IntersectionObserver
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: () => handleSectionVisibility(true),
        onEnterBack: () => handleSectionVisibility(true),
        onLeave: () => handleSectionVisibility(false),
        onLeaveBack: () => handleSectionVisibility(false)
      });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          handleSectionVisibility(entry.isIntersecting && entry.intersectionRatio > 0.15);
        });
      }, { threshold: [0, 0.15, 0.5] });
      observer.observe(section);
    }
  }

  /* ------------------------------------------------------------
     Hero Multi-Scene Animated Carousel
     ------------------------------------------------------------ */
  let heroScenesInitialized = false;
  function initHeroScenes() {
    if (heroScenesInitialized) return;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length <= 1) return;
    heroScenesInitialized = true;

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
  let allInitialized = false;

  function initAll() {
    if (allInitialized) return;

    // Verify sections have been loaded into DOM before marking ready
    const suites = document.getElementById('collectionSuitesSection');
    const story = document.getElementById('craftStorySection');
    if (!suites || !story) return;

    allInitialized = true;

    initScrollProgress();
    initCustomCursor();
    initMagneticButtons();
    initHeroScenes();
    initStorytelling();
    initHorizontalCollection();
    initGSAPAnimations();
  }

  window.initStorytelling = initStorytelling;

  document.addEventListener('sections:loaded', () => {
    initAll();
  });

  // Run if sections were already rendered before script executed
  if (document.documentElement.dataset.sectionsReady === 'true' || document.readyState === 'complete') {
    initAll();
  }
})();
