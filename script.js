/**
 * KakaBabu Cafe JS - Modern Interactive Micro-interactions & Logic
 * Author: Antigravity Agent
 * Date: July 2026
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR TRACKING (DESKTOP ONLY)
     ========================================================================== */
  const cursorDot = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  
  // Activate only on devices with hover capability (desktop)
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

  if (isDesktop && cursorDot && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the center dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animate trailing glow with linear interpolation (lerp)
    const animateGlow = () => {
      const delay = 0.15; // Lower = slower lag effect
      glowX += (mouseX - glowX) * delay;
      glowY += (mouseY - glowY) * delay;
      
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      
      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    // Hover effect on active triggers
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .bento-card, .polaroid-card, .review-screenshot-card, .review-summary-card, .dot, .menu-card-container, .view-counter-badge, [role="button"]');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorGlow.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorGlow.classList.remove('hovered');
      });
    });
  } else {
    // Hide cursor elements on touch devices
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorGlow) cursorGlow.style.display = 'none';
  }

  /* ==========================================================================
     2. STICKY HEADER & SCROLL EFFECTS
     ========================================================================== */
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR ACTIVE DOTS & SCROLL ANIMATIONS
     ========================================================================== */
  const sections = document.querySelectorAll('.scroll-section');
  const navDots = document.querySelectorAll('.side-nav-dots .dot');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -45% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute('id');
        
        // Highlight active side navigation dot
        navDots.forEach(dot => {
          if (dot.getAttribute('data-section') === activeSectionId) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        // Highlight active desktop link
        desktopNavLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          if (href === activeSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // Fade items up as they enter viewport
  const animationObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        
        // Fill bento snack progress bars
        const fills = entry.target.querySelectorAll('.stat-fill');
        if (fills.length > 0) {
          fills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-width');
          });
        }
        
        animationObserver.unobserve(entry.target);
      }
    });
  }, animationObserverOptions);

  animatedElements.forEach(el => animationObserver.observe(el));

  /* ==========================================================================
     4. MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : 'auto';
  };

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu();
      });
    });
  }



  /* ==========================================================================
     6. MOUSE DRAG SCROLL FOR GALLERY CAROUSEL
     ========================================================================== */
  const strip = document.getElementById('polaroids-strip');
  let isDown = false;
  let startX;
  let scrollLeft;

  if (strip) {
    strip.addEventListener('mousedown', (e) => {
      isDown = true;
      strip.style.cursor = 'grabbing';
      startX = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    });

    strip.addEventListener('mouseleave', () => {
      isDown = false;
      strip.style.cursor = 'grab';
    });

    strip.addEventListener('mouseup', () => {
      isDown = false;
      strip.style.cursor = 'grab';
    });

    strip.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.5; // speed modifier
      strip.scrollLeft = scrollLeft - walk;
    });

    strip.style.cursor = 'grab';
  }

  /* ==========================================================================
     7. MENU TAB SWITCH & PHYSICAL MENU LIGHTBOX ZOOM/PAN
     ========================================================================== */
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuTabContents = document.querySelectorAll('.menu-tab-content');
  
  if (menuTabBtns.length > 0) {
    menuTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        menuTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        menuTabContents.forEach(content => {
          content.classList.remove('active');
          content.style.display = 'none';
        });
        
        const targetTab = btn.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
          targetContent.classList.add('active');
          targetContent.style.display = 'block';
        }
      });
    });
  }

  /* ==========================================================================
     8. WEBPAGE VIEW COUNTER (WITH PUBLIC API & LOCAL FALLBACK)
     ========================================================================== */
  const initViewCounter = async () => {
    const viewCountValue = document.getElementById('view-count-value');
    if (!viewCountValue) return;

    const baseCount = 0; // Start count from 0
    let views = baseCount;

    // Helper to format count with leading zeros
    const formatCount = (num) => {
      return String(num).padStart(6, '0');
    };

    // Helper for local fallback storage increment
    const updateLocalFallback = () => {
      let localViews = localStorage.getItem('kakababu_views_v2');
      if (!localViews) {
        localViews = baseCount;
      } else {
        localViews = parseInt(localViews, 10);
      }
      localViews += 1;
      localStorage.setItem('kakababu_views_v2', localViews);
      return localViews;
    };

    try {
      // Use free, public, CORS-enabled CountAPI service to increment and retrieve hits
      const response = await fetch('https://countapi.mileshilliard.com/api/v1/hit/kakababu-bistro-cafe-fresh-v3');
      if (response.ok) {
        const data = await response.json();
        views = data.value;
        
        // Ensure our displayed count incorporates our baseline so it looks established
        if (views < baseCount) {
          views = baseCount + views;
        }
      } else {
        throw new Error('API response not OK');
      }
    } catch (error) {
      console.warn('View Counter API offline/blocked. Using local simulation:', error);
      views = updateLocalFallback();
    }

    // Interactive count-up animation
    let currentCount = Math.max(0, views - 15);
    viewCountValue.textContent = formatCount(currentCount);

    const targetCount = views;
    const speed = 40; // milliseconds per increment tick
    
    const countUp = () => {
      if (currentCount < targetCount) {
        currentCount++;
        viewCountValue.textContent = formatCount(currentCount);
        setTimeout(countUp, speed);
      }
    };
    
    // Start count up animation with a slight delay
    setTimeout(countUp, 500);
  };

  initViewCounter();

});
