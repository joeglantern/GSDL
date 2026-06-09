document.addEventListener('DOMContentLoaded', () => {
  /* ---- Mobile nav drawer ---- */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveals ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top >= window.innerHeight) { el.classList.add('anim'); io.observe(el); }
  });

  /* ---- Parallax ---- */
  const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0.2,
  }));
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxNodes.forEach((p) => {
      const r      = p.el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const offset = (center - vh / 2) * -p.speed;
      p.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  };
  if (parallaxNodes.length) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ---- Tilt for compass diagram ---- */
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.setProperty('--tx', `${x * 14}px`);
      el.style.setProperty('--ty', `${y * 14}px`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    });
  });

  /* ---- Nav scroll-shrink ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ---- Active nav link ---- */
  const segments = location.pathname.replace(/\/$/, '').split('/');
  const slug = segments[segments.length - 1] || '/';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hSlug = href.replace(/\/$/, '').split('/').pop() || '/';
    if (hSlug === slug || (slug === '/' && href === '/')) a.classList.add('active');
  });

  /* ---- Count-up on scroll ---- */
  const countNodes = document.querySelectorAll('[data-count]');
  if (countNodes.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        countObs.unobserve(el);
        const to     = parseInt(el.dataset.count, 10) || 0;
        const pad    = parseInt(el.dataset.pad,   10) || 0;
        const suffix = el.dataset.suffix || '';
        const dur    = 1400;
        const start  = Date.now();
        function tick() {
          const t     = Math.min(1, (Date.now() - start) / dur);
          const eased = 1 - Math.pow(1 - t, 2);
          const v     = Math.round(eased * to);
          let txt     = String(v);
          if (pad) txt = txt.padStart(pad, '0');
          el.textContent = txt + suffix;
          if (t < 1) setTimeout(tick, 24);
        }
        tick();
      });
    }, { threshold: 0.4 });
    countNodes.forEach((n) => {
      const pad = parseInt(n.dataset.pad, 10) || 0;
      n.textContent = pad ? '0'.repeat(pad) : '0';
      countObs.observe(n);
    });
  }

  /* ---- Horizontal pinned scroll ---- */
  document.querySelectorAll('.hscroll').forEach((wrap) => {
    const pin      = wrap.querySelector('.hscroll-pin');
    const track    = wrap.querySelector('.hscroll-track');
    const pgnumEl  = wrap.querySelector('[data-hscroll-num]');
    const pgbar    = wrap.querySelector('[data-hscroll-bar]');
    const pgtotal  = wrap.querySelector('[data-hscroll-total]');
    if (!pin || !track) return;

    const cards = track.children.length;
    if (pgtotal) pgtotal.textContent = String(cards).padStart(2, '0');

    function sizeWrap() {
      wrap.style.height = `${cards * 90 + 30}vh`;
    }
    sizeWrap();

    let lastProgress = -1;
    function update() {
      const r         = wrap.getBoundingClientRect();
      const scrolled  = -r.top;
      const maxScroll = wrap.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
      if (Math.abs(progress - lastProgress) < 0.0008) return;
      lastProgress = progress;
      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${(-progress * maxTranslate).toFixed(2)}px, 0, 0)`;
      if (pgbar)   pgbar.style.transform = `scaleX(${progress})`;
      if (pgnumEl) pgnumEl.textContent   = String(Math.min(cards, Math.floor(progress * cards) + 1)).padStart(2, '0');
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { sizeWrap(); update(); });
    update();
  });
});
