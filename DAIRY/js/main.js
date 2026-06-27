/**
 * PURE DAIRY FARM - Main JavaScript
 * Handles: Navbar scroll, Reveal animations, Testimonial slider,
 *          Gallery lightbox, Hero particles, Contact form.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. STICKY NAVBAR — toggle .scrolled class on scroll
     ============================================================ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load

  /* ============================================================
     2. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      // Prevent body scroll when menu open
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     3. ACTIVE NAV LINK — highlight based on current page
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     4. SCROLL REVEAL ANIMATION — Intersection Observer
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ============================================================
     5. HERO BACKGROUND — Parallax effect & image load animation
     ============================================================ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    // Trigger scale animation once image loads
    const bgImg = new Image();
    bgImg.src = heroBg.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)/, '');
    bgImg.onload = () => heroBg.classList.add('loaded');
    heroBg.classList.add('loaded'); // fallback

    // Subtle parallax on scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ============================================================
     6. HERO FLOATING PARTICLES
     ============================================================ */
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width:  ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        animation-duration: ${8 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${0.1 + Math.random() * 0.3};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ============================================================
     7. TESTIMONIALS SLIDER — drag / touch scrolling + dot nav
     ============================================================ */
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('.t-dot');

  if (track && dots.length > 0) {
    let activeIndex = 0;

    function setActiveDot(index) {
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
      activeIndex = index;
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const cards = track.querySelectorAll('.testimonial-card');
        if (cards[idx]) {
          track.scrollTo({ left: cards[idx].offsetLeft, behavior: 'smooth' });
          setActiveDot(idx);
        }
      });
    });

    // Auto-advance slider every 4 seconds
    setInterval(() => {
      const cards = track.querySelectorAll('.testimonial-card');
      const next  = (activeIndex + 1) % cards.length;
      if (cards[next]) {
        track.scrollTo({ left: cards[next].offsetLeft, behavior: 'smooth' });
        setActiveDot(next);
      }
    }, 4500);

    // Sync dots on manual scroll
    track.addEventListener('scroll', () => {
      const cards    = track.querySelectorAll('.testimonial-card');
      const scrollLeft = track.scrollLeft;
      let closest = 0;
      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - scrollLeft) < Math.abs(cards[closest].offsetLeft - scrollLeft)) {
          closest = i;
        }
      });
      setActiveDot(closest);
    }, { passive: true });
  }

  /* ============================================================
     8. GALLERY FILTERS + LIGHTBOX
     ============================================================ */
  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeUp 0.4s ease both';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxIndex = 0;
  const lightboxImages = [];

  // Collect gallery images
  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) lightboxImages.push({ src: img.src, alt: img.alt });

    item.addEventListener('click', () => {
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImages[index]) return;
    currentLightboxIndex = index;
    lightboxImg.src = lightboxImages[index].src;
    lightboxImg.alt = lightboxImages[index].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lightboxNavigate(dir) {
    const total = lightboxImages.length;
    currentLightboxIndex = (currentLightboxIndex + dir + total) % total;
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxImg.alt = lightboxImages[currentLightboxIndex].alt;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
  if (lightboxNext)  lightboxNext.addEventListener('click', () => lightboxNavigate(1));
  if (lightbox)      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxNavigate(-1);
    if (e.key === 'ArrowRight') lightboxNavigate(1);
  });

  /* ============================================================
     9. CONTACT FORM — Client-side validation & success message
     ============================================================ */
  const contactForm    = document.getElementById('contactForm');
  const formSuccess    = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateContactForm()) return;

      // Simulate form submission (replace with real backend call)
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1500);
    });
  }

  function validateContactForm() {
    let valid = true;
    const fields = [
      { id: 'contactName',    msg: 'Please enter your name.' },
      { id: 'contactPhone',   msg: 'Please enter a valid phone number.', regex: /^[6-9]\d{9}$/ },
      { id: 'contactMessage', msg: 'Please enter a message.' },
    ];

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-control').forEach(el => el.style.borderColor = '');

    fields.forEach(({ id, msg, regex }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.value.trim();
      const isInvalid = !val || (regex && !regex.test(val));

      if (isInvalid) {
        valid = false;
        el.style.borderColor = '#e53e3e';
        const err = document.createElement('span');
        err.className = 'form-error';
        err.style.cssText = 'color:#e53e3e;font-size:0.8rem;display:block;margin-top:4px;';
        err.textContent = msg;
        el.parentElement.appendChild(err);
      }
    });

    return valid;
  }

  /* ============================================================
     10. ANIMATED COUNTER (stats on home page)
     ============================================================ */
  function animateCounter(el, end, duration = 1800) {
    const start     = 0;
    const step      = (end / duration) * 16;
    let   current   = start;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) { current = end; clearInterval(timer); }
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }, 16);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ============================================================
     11. SMOOTH SCROLL — for on-page anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

}); // end DOMContentLoaded
