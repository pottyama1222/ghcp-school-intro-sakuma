/* 神山まるごと高専 紹介ページ — Interactive */
(() => {
  'use strict';

  /* ===== 1. Year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== 2. Theme toggle (dark/light) ===== */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'kamiyama-theme';

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', theme === 'light' ? 'ダークモードへ切り替え' : 'ライトモードへ切り替え');
    }
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

  /* ===== 4. IntersectionObserver fade-in ===== */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ===== 5. Carousel ===== */
  const carousel = document.getElementById('carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const thumbs = document.getElementById('thumbs');
    let current = 0;

    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `${i + 1}枚目へ`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });

    // Build thumbnails
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
      const dots = dotsWrap.querySelectorAll('button');
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === current ? 'true' : 'false'));
      if (thumbs) {
        thumbs.querySelectorAll('button').forEach((t, i) =>
          t.setAttribute('aria-current', i === current ? 'true' : 'false')
        );
      }
    };

    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      updateState();
    };

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    // Detect scroll position to sync state
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
        current = nearest;
        updateState();
      }, 80);
    });

    updateState();
  }

  /* ===== 6. Lightbox ===== */
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
      // Avoid hijacking carousel button clicks; check target is not a button
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

  // Click on backdrop closes
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
})();
