/* ============================================================
   VOID RESTAURANT — script.js
   Animations · Interactions · Cursor · Parallax · Reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PAGE LOADER ─────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 1800);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('hidden'), 1800);
    }
  }

  /* ── 2. CUSTOM CURSOR ──────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    (function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    })();

    // Scale up on interactive elements
    document.querySelectorAll('a, button, .menu-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '56px';
        ring.style.height = '56px';
        ring.style.background = 'rgba(212,168,67,0.12)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.background = 'transparent';
      });
    });
  }

  /* ── 3. NAVIGATION SCROLL EFFECT ───────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 4. ACTIVE NAV LINK ─────────────────────────────────── */
  (function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  })();

  /* ── 5. MOBILE HAMBURGER ────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('menu-open');
      const bars = hamburger.querySelectorAll('span');
      if (nav.classList.contains('menu-open')) {
        bars[0].style.transform = 'translateY(6px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });
  }

  /* ── 6. INTERSECTION OBSERVER – REVEAL ON SCROLL ──────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate section-line width
          const line = entry.target.querySelector?.('.section-line');
          if (line) line.classList.add('revealed');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // Separately observe section-lines
  document.querySelectorAll('.section-line').forEach(line => {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) line.classList.add('revealed'); });
    }, { threshold: 0.5 }).observe(line);
  });

  /* ── 7. PARALLAX HERO BACKGROUND ───────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1)`;
    }, { passive: true });
  }

  /* ── 8. 3D CARD TILT (Mouse tracking) ───────────────────── */
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) *  8;
      card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  /* ── 9. COUNTER ANIMATION (stats) ──────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseInt(el.dataset.count);
        const dur = 1800;
        const step = 16;
        let current = 0;
        const inc = end / (dur / step);
        const timer = setInterval(() => {
          current = Math.min(current + inc, end);
          el.textContent = Math.floor(current) + (el.dataset.suffix || '');
          if (current >= end) clearInterval(timer);
        }, step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

  /* ── 10. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 11. MARQUEE PAUSE ON HOVER ─────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── 12. RESERVATION FORM – DATE MIN ────────────────────── */
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ── 13. FORM MICRO-INTERACTIONS ───────────────────────── */
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
    .forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.querySelector('label').style.color = '#d4a843';
      });
      input.addEventListener('blur', () => {
        input.parentElement.querySelector('label').style.color = '';
      });
    });

  /* ── 14. FORM SUBMIT FEEDBACK ───────────────────────────── */
  document.querySelectorAll('form[data-feedback]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✦  Confirmed!';
      btn.style.background = '#2e7d52';
      btn.style.color = '#fff';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  /* ── 15. GALLERY LIGHTBOX (simple) ─────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    // Create lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      position:fixed;inset:0;background:rgba(10,7,4,0.95);z-index:5000;
      display:none;align-items:center;justify-content:center;cursor:none;
      backdrop-filter:blur(12px);
    `;
    lb.innerHTML = `<img id="lb-img" style="max-height:88vh;max-width:88vw;object-fit:contain;"/>
      <button id="lb-close" style="position:absolute;top:28px;right:40px;background:none;border:1px solid rgba(212,168,67,0.4);color:#d4a843;font-family:'Josefin Sans',sans-serif;letter-spacing:0.2em;font-size:0.65rem;padding:8px 18px;cursor:none;">✕  CLOSE</button>`;
    document.body.appendChild(lb);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (!src) return;
        lb.querySelector('#lb-img').src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
    lb.querySelector('#lb-close').addEventListener('click', () => {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    });
    lb.addEventListener('click', e => {
      if (e.target === lb) {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 16. HERO BG LOADED CLASS ───────────────────────────── */
  const heroBgEl = document.querySelector('.hero-bg');
  if (heroBgEl) {
    setTimeout(() => heroBgEl.classList.add('loaded'), 100);
  }

});
