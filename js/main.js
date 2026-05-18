// ============================================
// HOPE FOUNDATION — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // --- Hamburger toggle ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- Scroll fade-in animations ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // --- Auto-add fade-in to key elements ---
  const autoFadeSelectors = [
    '.program-card',
    '.impact-card',
    '.value-card',
    '.team-card',
    '.event-card',
    '.program-detail-card',
    '.gallery-item',
    '.mission-text',
    '.mission-image',
    '.about-text',
    '.about-img',
    '.testimonial-card',
    '.contact-info',
    '.contact-form'
  ];
  autoFadeSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });
  // Re-observe newly added fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
  });

  // --- Counter animation for impact numbers ---
  const counters = document.querySelectorAll('.impact-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/([\d,.]+)/);
    if (!match) return;
    const numStr = match[1].replace(/,/g, '');
    const target = parseFloat(numStr);
    const suffix = text.replace(match[0], '');
    const prefix = text.substring(0, text.indexOf(match[0]));
    const hasComma = match[1].includes(',');
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = Math.floor(target * eased);
      let display = hasComma ? current.toLocaleString() : current.toString();
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Gallery lightbox (simple) ---
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (galleryItems.length > 0) {
    galleryItems.forEach(img => {
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          animation:fadeInLightbox 0.3s ease;
        `;
        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.style.cssText = `
          max-width:90vw;max-height:90vh;border-radius:16px;
          box-shadow:0 20px 60px rgba(0,0,0,0.4);
        `;
        overlay.appendChild(bigImg);
        overlay.addEventListener('click', () => {
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 300);
        });
        document.body.appendChild(overlay);
      });
    });
  }
});
