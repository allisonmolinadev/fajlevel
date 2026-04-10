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

  /* ==========================================================
     ADVANCED — efeitos extras
     ========================================================== */

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const root = document.documentElement;

  /* ---------- Scroll progress bar ---------- */
  const onProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    root.style.setProperty('--scroll', p.toFixed(4));
  };
  onProgress();
  window.addEventListener('scroll', onProgress, { passive: true });

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor && cursor.querySelector('.cursor__label');

  if (cursor && !isTouch) {
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-clicking'));

    const hoverables = document.querySelectorAll('a, button, [data-cursor], [data-magnetic], input, .chip');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        const label = el.getAttribute('data-cursor') || '';
        if (cursorLabel) cursorLabel.textContent = label;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic-strength') || '0.35');
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width / 2);
        const my = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Tilt 3D ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const target = el.querySelector('.product__image') || el;
      const max = 8;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const ty = (px - 0.5) * (max * 2);
        const tx = (0.5 - py) * (max * 2);
        target.style.setProperty('--tx', tx.toFixed(2) + 'deg');
        target.style.setProperty('--ty', ty.toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', () => {
        target.style.setProperty('--tx', '0deg');
        target.style.setProperty('--ty', '0deg');
      });
    });
  }

  /* ---------- Counter animado ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter')) || 0;
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const fmt = el.getAttribute('data-counter-format') || '';
      const pad = fmt === '02' ? 2 : 0;
      const dur = 1600;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.floor(ease(t) * target);
        const str = pad ? String(v).padStart(pad, '0') : String(v);
        el.textContent = prefix + str;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- Stat bar reveal ---------- */
  const statItems = document.querySelectorAll('.stat-item');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statItems.forEach((s) => barIO.observe(s));

  /* ---------- Text scramble nos links da nav ---------- */
  const CHARS = '!<>-_\\/[]{}—=+*^?#________';
  class Scrambler {
    constructor(el) {
      this.el = el;
      this.original = el.getAttribute('data-scramble') || el.textContent;
      this.frame = 0;
      this.queue = [];
      el.addEventListener('mouseenter', () => this.run(this.original));
    }
    run(text) {
      const old = this.el.textContent;
      const length = Math.max(old.length, text.length);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = old[i] || '';
        const to = text[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.raf);
      this.frame = 0;
      this.update();
    }
    update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < this.queue.length; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            this.queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      this.el.textContent = output;
      if (complete < this.queue.length) {
        this.raf = requestAnimationFrame(this.update);
        this.frame++;
      }
    };
  }
  if (!prefersReduced) {
    document.querySelectorAll('[data-scramble]').forEach((el) => new Scrambler(el));
  }

  /* ---------- Nav: seção ativa ---------- */
  const sections = ['conceito', 'marca', 'experiencia', 'produto']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => sectionIO.observe(s));

  /* ---------- Hero canvas — partículas ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const PARTICLES = 60;
    const particles = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLES; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          p.x += (dx / d) * 0.6;
          p.y += (dy / d) * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(133, 166, 185, 0.55)';
        ctx.fill();

        // ligações
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const dd = Math.hypot(ddx, ddy);
          if (dd < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(16, 45, 91, ${0.18 * (1 - dd / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    window.addEventListener('resize', () => { resize(); seed(); });
    canvas.parentElement.addEventListener('mousemove', onMouse);
    canvas.parentElement.addEventListener('mouseleave', onLeave);

    resize();
    seed();
    draw();
  }
})();
