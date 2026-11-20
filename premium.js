(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Live Bengaluru clock (browser-side display only).
  const clock = $('#local-clock');
  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  // Mobile navigation.
  const menuButton = $('.menu-button');
  const nav = $('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

  // Scroll progress and compact sticky header.
  const progressBar = $('#page-progress-bar');
  const topbar = $('#topbar');
  let scrollQueued = false;
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, progress * 100)}%`;
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 24);
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });
  updateScrollUI();

  // Active section in navigation.
  if ('IntersectionObserver' in window) {
    const navLinks = $$('a[href^="#"]', nav || document);
    const linkById = new Map(navLinks.map(link => [link.getAttribute('href').slice(1), link]));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove('active'));
        const active = linkById.get(entry.target.id);
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
    $$('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  // Ambient low-density particle field. It pauses when the tab is hidden.
  const canvas = $('#ambient-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0, height = 0, dpr = 1, particles = [], frame = 0;
    const pointer = { x: -1000, y: -1000 };
    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(46, Math.max(18, Math.floor(width / 30)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .13, vy: (Math.random() - .5) * .13,
        r: Math.random() * 1.2 + .45
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 145 && distance > 0 && !coarsePointer) {
          p.x -= dx / distance * .12;
          p.y -= dy / distance * .12;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(215,194,161,.45)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 105) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(215,194,161,${(1 - dd / 105) * .075})`;
            ctx.lineWidth = .7; ctx.stroke();
          }
        }
      });
      frame = window.requestAnimationFrame(draw);
    };
    resizeCanvas();
    if (!document.hidden) draw();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    if (!coarsePointer) window.addEventListener('pointermove', event => {
      pointer.x = event.clientX; pointer.y = event.clientY;
      const aura = $('.cursor-aura');
      if (aura) { aura.style.opacity = '.9'; aura.style.transform = `translate(${event.clientX - 145}px,${event.clientY - 145}px)`; }
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.cancelAnimationFrame(frame);
      else if (!reduceMotion) draw();
    });
  }

  // Smooth, restrained entrance and scroll-linked animation with GSAP.
  const initMotion = () => {
    document.documentElement.classList.add('js-motion');
    const loader = $('#page-loader');
    if (loader) window.setTimeout(() => loader.remove(), 1900);

    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      gsap.registerPlugin(ScrollTrigger);
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .7 });
      intro.from('.hero-eyebrow', { y: 14, autoAlpha: 0, duration: .65 })
        .from('.hero-pretitle', { y: 15, autoAlpha: 0, duration: .5 }, '-=.35')
        .from('.hero-title > span', { yPercent: 115, rotate: 2, autoAlpha: 0, duration: .95, stagger: .16, ease: 'power4.out' }, '-=.22')
        .from('.hero-description', { y: 20, autoAlpha: 0, duration: .7 }, '-=.42')
        .from('.hero-actions .button', { y: 12, autoAlpha: 0, duration: .55, stagger: .1 }, '-=.35')
        .from('.portrait-shell', { y: 35, rotate: 7, scale: .96, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, '-=.9')
        .from('.floating-chip,.hero-status-card', { y: 20, autoAlpha: 0, duration: .55, stagger: .12 }, '-=.65')
        .from('.hero-footline', { y: 12, autoAlpha: 0, duration: .55 }, '-=.4');

      $$('.reveal-up').forEach(element => {
        gsap.fromTo(element, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true }
        });
      });
      $$('.premium-project').forEach((card, index) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 36 }, {
          autoAlpha: 1, y: 0, duration: .85, delay: (index % 2) * .08, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
      });
      gsap.fromTo('.contact-glow', { scale: .82, opacity: .6 }, { scale: 1.08, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.premium-contact', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
      $$('.stat-cell strong[data-count]').forEach(counter => {
        const target = Number(counter.dataset.count);
        const state = { value: 0 };
        gsap.to(state, { value: target, duration: 1.8, ease: 'power2.out', snap: { value: 1 },
          onUpdate: () => counter.textContent = Math.round(state.value).toLocaleString('en-IN'),
          scrollTrigger: { trigger: counter, start: 'top 90%', once: true }
        });
      });
      ScrollTrigger.refresh();
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      }), { threshold: .12, rootMargin: '0px 0px -35px 0px' });
      $$('.reveal-up').forEach(el => observer.observe(el));
      $$('.stat-cell strong[data-count]').forEach(el => { el.textContent = Number(el.dataset.count).toLocaleString('en-IN'); });
    } else {
      $$('.reveal-up').forEach(el => el.classList.add('in-view'));
      $$('.stat-cell strong[data-count]').forEach(el => { el.textContent = Number(el.dataset.count).toLocaleString('en-IN'); });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion, { once: true });
  else initMotion();

  // Magnetic micro-interaction on primary links (desktop pointer only).
  if (!coarsePointer && !reduceMotion) {
    $$('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * .07}px,${y * .11}px)`;
      });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    });

    $$('.premium-project').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (card.classList.contains('hidden')) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(1100px) rotateX(${(-y * 2.4).toFixed(2)}deg) rotateY(${(x * 2.8).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // ThermAssure portfolio panel: clearly labelled simulated ambient readings.
  const deviceTemp = $('#device-temp');
  const deviceState = $('#device-state');
  const deviceBattery = $('#device-battery');
  const deviceSync = $('#device-sync');
  const deviceDot = $('#device-dot');
  const chart = $('#device-chart');
  const heroTemp = $('#hero-temperature');
  let excursionMode = false;
  let readingTimer = null;
  let readingIndex = 0;
  const updateDeviceReadout = (temperature, alert = false) => {
    if (deviceTemp) deviceTemp.textContent = `${temperature.toFixed(1)}°C`;
    if (heroTemp) heroTemp.innerHTML = `${temperature.toFixed(1)}<span>°C</span>`;
    if (deviceState) deviceState.textContent = alert ? 'TEMPERATURE ALERT · SIMULATED' : 'DEVICE CONNECTED · SIMULATED';
    if (deviceDot) deviceDot.classList.toggle('is-alert', alert);
    if (deviceBattery) deviceBattery.textContent = `${Math.max(88, 92 - Math.floor(readingIndex / 18))}%`;
    if (deviceSync) deviceSync.textContent = 'LIVE SIMULATION';
    if (chart) {
      const bars = $$('i', chart);
      bars.forEach((bar, index) => {
        const wobble = Math.sin((readingIndex + index * 1.7) * .72) * 7;
        const value = alert ? 70 + Math.sin(index * .8) * 8 : 45 + wobble;
        bar.style.height = `${Math.max(12, Math.min(86, value))}%`;
      });
    }
  };
  const randomReading = () => {
    if (excursionMode) return;
    readingIndex += 1;
    const reading = 4.5 + Math.random() * .8;
    updateDeviceReadout(reading, false);
  };
  const startReadings = () => {
    window.clearInterval(readingTimer);
    excursionMode = false;
    randomReading();
    readingTimer = window.setInterval(randomReading, 2600);
  };
  const stopReadings = () => window.clearInterval(readingTimer);
  const normalButton = $('#normal-reading');
  const excursionButton = $('#excursion-reading');
  if (deviceTemp && chart) {
    startReadings();
    if (normalButton) normalButton.addEventListener('click', () => {
      excursionMode = false;
      readingIndex += 1;
      updateDeviceReadout(4.8, false);
      startReadings();
    });
    if (excursionButton) excursionButton.addEventListener('click', () => {
      excursionMode = true;
      stopReadings();
      readingIndex += 1;
      updateDeviceReadout(8.6, true);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopReadings();
      else if (!excursionMode) startReadings();
    });
  }
})();
