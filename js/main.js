// ============================================
// HOPE INITIATIVE — Main JS
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
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- Scroll fade-in animations ---
  const autoFadeSelectors = [
    '.program-card', '.impact-card', '.value-card', '.team-card',
    '.event-card', '.program-detail-card', '.gallery-item',
    '.mission-text', '.mission-image', '.about-text', '.about-img',
    '.testimonial-card', '.contact-info', '.contact-form'
  ];
  autoFadeSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

  // --- Counter animation ---
  const counters = document.querySelectorAll('.impact-number');
  if (counters.length > 0) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
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

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Gallery lightbox ---
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        padding:20px;
      `;
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = `
        max-width:90vw;max-height:90vh;border-radius:16px;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);
        object-fit:contain;
      `;
      overlay.appendChild(bigImg);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  // ============================================================
  // DONATE AMOUNT SELECTION (contact.html)
  // ============================================================
  const donateTiles = document.querySelectorAll('.donate-tile');
  const donateBtn = document.getElementById('donateNowBtn');
  let selectedAmount = null;
  let selectedLabel = null;

  if (donateTiles.length > 0) {
    donateTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        // Deselect all
        donateTiles.forEach(t => {
          t.style.background = 'rgba(255,255,255,0.12)';
          t.style.border = '1px solid rgba(255,255,255,0.2)';
          t.style.transform = '';
        });
        // Select clicked
        tile.style.background = 'rgba(255,255,255,0.30)';
        tile.style.border = '2px solid rgba(255,255,255,0.7)';
        tile.style.transform = 'scale(1.04)';
        selectedAmount = tile.dataset.amount;
        selectedLabel = tile.dataset.label;

        // Update button text
        if (donateBtn) {
          donateBtn.textContent = `Donate ${selectedAmount} →`;
        }
      });
    });
  }

  if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const amount = selectedAmount || '(amount not selected)';
      const label  = selectedLabel  || '';
      const subject = encodeURIComponent(`Donation Enquiry – ${amount}${label ? ' ' + label : ''}`);
      const body = encodeURIComponent(
        `Hello HOPE Team,\n\n` +
        `I would like to make a donation of ${amount}${label ? ' (' + label + ')' : ''} to support your programs.\n\n` +
        `Please send me the bank transfer details or payment instructions at your convenience.\n\n` +
        `I am keen to support the following program (if applicable):\n` +
        `[ ] Health Adda\n` +
        `[ ] B-RODH / Centre of Excellence\n` +
        `[ ] Tobacco Control\n` +
        `[ ] Hepatitis C Initiative\n` +
        `[ ] Where most needed\n\n` +
        `Thank you for the wonderful work HOPE does for communities across India.\n\n` +
        `Warm regards,\n` +
        `[Your Name]`
      );
      window.location.href = `mailto:hopeinitiative@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ============================================================
  // CONTACT FORM — open mailto instead of alert
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = contactForm.querySelector('[name="name"]')?.value.trim()    || '';
      const email   = contactForm.querySelector('[name="email"]')?.value.trim()   || '';
      const phone   = contactForm.querySelector('[name="phone"]')?.value.trim()   || '';
      const subject = contactForm.querySelector('[name="subject"]')?.value        || 'General Enquiry';
      const message = contactForm.querySelector('[name="message"]')?.value.trim() || '';

      const subjectMap = {
        donate:    'Donation Enquiry',
        volunteer: 'Volunteer Application',
        partner:   'Corporate Partnership',
        health:    'Health Adda / Camp Query',
        media:     'Media / Press Enquiry',
        general:   'General Enquiry'
      };
      const subjectLabel = subjectMap[subject] || subject || 'Enquiry';

      const mailSubject = encodeURIComponent(`[Website] ${subjectLabel} – from ${name}`);
      const mailBody = encodeURIComponent(
        `Hello HOPE Team,\n\n` +
        `You have a new message via the website contact form:\n\n` +
        `──────────────────────────────\n` +
        `Name:     ${name}\n` +
        `Email:    ${email}\n` +
        (phone ? `Phone:    ${phone}\n` : '') +
        `Subject:  ${subjectLabel}\n` +
        `──────────────────────────────\n\n` +
        `${message}\n\n` +
        `──────────────────────────────\n` +
        `(Sent from the HOPE Initiative website)`
      );
      window.location.href = `mailto:hopeinitiative@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      contactForm.reset();
    });
  }

});
