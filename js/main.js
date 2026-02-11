/* =============================================
   CIRCONVALLATION GROUP — Main JS
   Custom cursor, 3D card, reveals, magnetic btns,
   animated counters
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- PAGE LOADER ----------
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero reveals after loader
      setTimeout(triggerHeroReveals, 200);
    }, 1600);
  });

  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(triggerHeroReveals, 200);
    }, 1600);
  }

  function triggerHeroReveals() {
    const heroReveals = document.querySelectorAll('.hero [data-reveal]');
    heroReveals.forEach((el, i) => {
      const delay = parseFloat(el.getAttribute('data-reveal-delay') || 0);
      setTimeout(() => el.classList.add('revealed'), delay * 200);
    });
  }

  // ---------- CUSTOM CURSOR ----------
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .cat-card-v2, .sol-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ---------- HEADER SCROLL ----------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---------- MOBILE MENU ----------
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- ACTIVE NAV ----------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('[data-nav]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.pageYOffset >= section.offsetTop - 200) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // ---------- SCROLL REVEAL ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Skip hero reveals (handled by loader)
        if (entry.target.closest('.hero')) return;

        const delay = parseFloat(entry.target.getAttribute('data-reveal-delay') || 0);
        const siblings = entry.target.parentElement.children;
        const idx = Array.from(siblings).filter(s => s.hasAttribute('data-reveal')).indexOf(entry.target);
        const stagger = idx >= 0 ? idx * 120 : 0;

        setTimeout(() => entry.target.classList.add('revealed'), delay * 200 + stagger);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  // ---------- 3D CARD ----------
  const cardScene = document.getElementById('cardScene');
  const card3d = document.getElementById('card3d');

  if (cardScene && card3d) {
    let cardRotX = 8, cardRotY = -15;
    let targetRotX = 8, targetRotY = -15;
    let isHovering = false;

    cardScene.addEventListener('mouseenter', () => { isHovering = true; });
    cardScene.addEventListener('mouseleave', () => {
      isHovering = false;
      targetRotX = 8;
      targetRotY = -15;
    });

    cardScene.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = cardScene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 40;
      targetRotX = -y * 25;
    });

    function animateCard() {
      cardRotX += (targetRotX - cardRotX) * 0.08;
      cardRotY += (targetRotY - cardRotY) * 0.08;
      card3d.style.transform = `rotateY(${cardRotY}deg) rotateX(${cardRotX}deg)`;

      // Update shine based on rotation
      const shine = card3d.querySelector('.cfront-shine');
      if (shine) {
        const shineAngle = 105 + cardRotY * 1.5;
        const shineIntensity = Math.abs(cardRotY) / 40;
        shine.style.background = `linear-gradient(${shineAngle}deg, transparent 35%, rgba(255,255,255,${0.02 + shineIntensity * 0.08}) 45%, rgba(255,255,255,${0.04 + shineIntensity * 0.12}) 50%, rgba(255,255,255,${0.02 + shineIntensity * 0.08}) 55%, transparent 65%)`;
      }

      requestAnimationFrame(animateCard);
    }
    animateCard();
  }

  // ---------- MAGNETIC BUTTONS ----------
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  // ---------- CONTACT FORM ----------
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"] span:first-child');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.closest('button').disabled = true;

    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        btn.textContent = 'Message envoyé !';
        contactForm.querySelector('button[type="submit"]').style.background = 'linear-gradient(135deg, #16a34a, #0d7a32)';
        setTimeout(() => {
          btn.textContent = originalText;
          contactForm.querySelector('button[type="submit"]').style.background = '';
          btn.closest('button').disabled = false;
          contactForm.reset();
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur serveur');
      }
    })
    .catch(() => {
      btn.textContent = 'Erreur — réessayez';
      contactForm.querySelector('button[type="submit"]').style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
      setTimeout(() => {
        btn.textContent = originalText;
        contactForm.querySelector('button[type="submit"]').style.background = '';
        btn.closest('button').disabled = false;
      }, 3000);
    });
  });

  // ---------- PARALLAX HERO LINES ----------
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const lines = document.querySelectorAll('.hero-lines span');
    lines.forEach((line, i) => {
      const speed = 0.02 + i * 0.01;
      line.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

  // ---------- ANIMATED STAT COUNTERS ----------
  const statValues = document.querySelectorAll('.stat-value');
  let statsCounted = false;

  function animateCounter(el, target, duration) {
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function triggerStatCounters() {
    if (statsCounted) return;
    statsCounted = true;
    statValues.forEach(el => {
      const text = el.textContent.trim();
      const num = parseInt(text, 10);
      if (!isNaN(num) && num > 0 && text === String(num)) {
        el.textContent = '0';
        animateCounter(el, num, 1200);
      }
    });
  }

  // Trigger counters after hero reveals
  const originalTriggerHeroReveals = triggerHeroReveals;
  triggerHeroReveals = function() {
    originalTriggerHeroReveals();
    setTimeout(triggerStatCounters, 1000);
  };

  // ---------- PARALLAX HERO ORBS ----------
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.hero-orb');
    orbs.forEach((orb, i) => {
      const speed = 0.03 + i * 0.015;
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

});
