/* ==========================================================
   FAJ Level — script.js
   ========================================================== */

(function () {
  'use strict';

  /* ---------- Ano do footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: estado scrolled ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-clip, .reveal-stagger');

  revealEls.forEach((el) => {
    const delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  );

  revealEls.forEach((el) => io.observe(el));

  /* ---------- Hero parallax ---------- */
  const heroSection = document.getElementById('hero');
  const heroHeadline = document.getElementById('heroHeadline');
  const heroFigure = document.getElementById('heroFigure');

  const onHeroScroll = () => {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const h = rect.height;
    const progress = Math.max(0, Math.min(1, -rect.top / h));

    if (heroHeadline) {
      heroHeadline.style.transform = `translateY(${progress * -8}%)`;
    }
    if (heroFigure) {
      heroFigure.style.transform = `translateY(${progress * 20}%)`;
    }
  };
  onHeroScroll();
  window.addEventListener('scroll', onHeroScroll, { passive: true });

  /* ---------- Urban experience parallax ---------- */
  const urbanBg = document.getElementById('urbanBg');
  const urbanSection = document.getElementById('experiencia');

  const onUrbanScroll = () => {
    if (!urbanBg || !urbanSection) return;
    const rect = urbanSection.getBoundingClientRect();
    const viewport = window.innerHeight;
    // Progress: 0 quando entra na tela, 1 quando sai
    const progress = 1 - (rect.top + rect.height) / (viewport + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const y = -15 + clamped * 30; // de -15% a 15%
    urbanBg.style.transform = `translateY(${y}%)`;
  };
  onUrbanScroll();
  window.addEventListener('scroll', onUrbanScroll, { passive: true });

  /* ---------- Form: labels flutuantes + submit ---------- */
  const form = document.getElementById('leadForm');
  const leadSent = document.getElementById('leadSent');

  if (form) {
    const fields = form.querySelectorAll('.field');

    fields.forEach((field) => {
      const input = field.querySelector('input');
      if (!input) return;

      const updateFilled = () => {
        if (input.value && input.value.length > 0) {
          field.classList.add('is-filled');
        } else {
          field.classList.remove('is-filled');
        }
      };
      input.addEventListener('input', updateFilled);
      input.addEventListener('blur', updateFilled);
      updateFilled();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validação simples
      const nome = form.nome.value.trim();
      const celular = form.celular.value.trim();
      const email = form.email.value.trim();

      if (!nome || !celular || !email) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // TODO: integrar com API/CRM real
      console.log('Lead capturado:', { nome, celular, email });

      form.hidden = true;
      if (leadSent) leadSent.hidden = false;
    });
  }

  /* ---------- Smooth scroll para âncoras (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
