/* 神山まるごと高専 紹介ページ — Interactive (Enhanced) */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 1. Year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== 2. Theme toggle ===== */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'kamiyama-theme';

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', theme === 'light' ? 'ダークモードへ切り替え' : 'ライトモードへ切り替え');
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F4F1E8' : '#0F1B14');
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ===== 3. Hamburger menu ===== */
  const menuBtn = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');

  const closeMenu = () => {
    if (!nav?.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.setAttribute('aria-label', 'メニューを開く');
  };
  const openMenu = () => {
    nav?.classList.add('is-open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    menuBtn?.setAttribute('aria-label', 'メニューを閉じる');
    nav?.querySelector('a')?.focus();
  };
  menuBtn?.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });
  nav?.addEventListener('click', (e) => {
    if (e.target instanceof HTMLAnchorElement) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ===== 4. Reveal animation + count-up ===== */
  const reveals = document.querySelectorAll('.reveal');
  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    if (Number.isNaN(target)) return;
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.querySelectorAll('[data-count]').forEach(countUp);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => {
      el.classList.add('is-visible');
      el.querySelectorAll('[data-count]').forEach((c) => (c.textContent = c.getAttribute('data-count')));
    });
  }

  /* ===== 5. Active nav highlighting ===== */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`)
          );
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => navIo.observe(s));
  }

  /* ===== 6. Scroll progress + header shadow + to-top ===== */
  const bar = document.getElementById('scrollBar');
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');
  const trunks = document.querySelector('.hero-trunks');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${Math.min(100, (y / max) * 100)}%`;
      header?.classList.toggle('is-scrolled', y > 8);
      toTop?.classList.toggle('is-visible', y > 600);
      if (trunks && !reduceMotion && y < window.innerHeight * 1.2) {
        trunks.style.transform = `translateY(${y * 0.18}px)`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ===== 7. Card pointer-glow ===== */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ===== 8. Carousel ===== */
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const thumbs = document.getElementById('thumbs');
    let current = 0;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `${i + 1}枚目へ`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });

    if (thumbs) {
      slides.forEach((slide, i) => {
        const img = slide.querySelector('img');
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `${i + 1}枚目を表示`);
        const im = document.createElement('img');
        im.src = img.src; im.alt = ''; im.loading = 'lazy';
        b.appendChild(im);
        b.addEventListener('click', () => goTo(i));
        li.appendChild(b);
        thumbs.appendChild(li);
      });
    }

    const updateState = () => {
      dotsWrap.querySelectorAll('button').forEach((d, i) =>
        d.setAttribute('aria-selected', i === current ? 'true' : 'false')
      );
      if (thumbs) {
        thumbs.querySelectorAll('button').forEach((t, i) =>
          t.setAttribute('aria-current', i === current ? 'true' : 'false')
        );
      }
    };

    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      updateState();
    };

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    let scrollT;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollT);
      scrollT = setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0, min = Infinity;
        slides.forEach((s, i) => {
          const c = s.offsetLeft + s.clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < min) { min = d; nearest = i; }
        });
        if (current !== nearest) { current = nearest; updateState(); }
      }, 90);
    });

    // Auto-advance (pause on hover/focus/visibility)
    let autoTimer;
    const startAuto = () => {
      if (reduceMotion) return;
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    };
    const stopAuto = () => clearInterval(autoTimer);
    carousel.addEventListener('pointerenter', stopAuto);
    carousel.addEventListener('pointerleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);
    document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
    startAuto();

    updateState();
  }

  /* ===== 9. Lightbox ===== */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = lightbox?.querySelector('.lb-close');
  const lbPrev = lightbox?.querySelector('.lb-prev');
  const lbNext = lightbox?.querySelector('.lb-next');

  const lbItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let lbIndex = 0;

  const showLb = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const el = lbItems[lbIndex];
    const src = el.getAttribute('data-lightbox-src');
    const cap = el.getAttribute('data-lightbox-caption') || '';
    if (lbImage) { lbImage.src = src; lbImage.alt = cap; }
    if (lbCaption) lbCaption.textContent = cap;
  };

  lbItems.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.carousel-btn')) return;
      e.preventDefault();
      showLb(i);
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  lbClose?.addEventListener('click', () => lightbox.close());
  lbPrev?.addEventListener('click', () => showLb(lbIndex - 1));
  lbNext?.addEventListener('click', () => showLb(lbIndex + 1));

  lightbox?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    if (e.key === 'ArrowRight') showLb(lbIndex + 1);
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
})();
