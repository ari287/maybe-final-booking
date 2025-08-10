
// Mobile nav toggle
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav){
  toggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', (!open).toString());
    toggle.setAttribute('aria-expanded', (!open).toString());
  });
}

// Reveal on scroll
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll('.reveal, .card, .inline-media, .footer-grid > *');
  nodes.forEach(n => n.classList.add('reveal'));
  if (!reduceMotion && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.06});
    nodes.forEach(n => io.observe(n));
  } else {
    nodes.forEach(n => n.classList.add('in'));
  }
});

// Elevate nav after scroll
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 8) nav.classList.add('elevated');
  else nav.classList.remove('elevated');
}, {passive:true});

// Calendly popup
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('book-popup');
  if(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      if (window.Calendly) Calendly.initPopupWidget({ url: 'https://calendly.com/trickandtreattraining/intro-call' });
      else window.location.href = 'https://calendly.com/trickandtreattraining/intro-call';
    });
  }
});


// ===== Animation Plus Pack =====
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  const barWrap = document.createElement('div');
  barWrap.className = 'scroll-progress';
  barWrap.innerHTML = '<div class="bar"></div>';
  document.body.appendChild(barWrap);
  const bar = barWrap.querySelector('.bar');
  const updateBar = () => {
    const b = document.documentElement;
    const scrolled = (b.scrollTop || document.body.scrollTop);
    const height = (b.scrollHeight - b.clientHeight) || 1;
    bar.style.width = (scrolled / height * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', updateBar, {passive:true});
  updateBar();

  // Card tilt (subtle)
  if (!reduceMotion){
    document.querySelectorAll('.card').forEach(card => {
      let leaveTimer;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = e.clientX - r.left;
        const cy = e.clientY - r.top;
        const rx = ((cy / r.height) - 0.5) * -6;
        const ry = ((cx / r.width) - 0.5) * 6;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(() => { card.style.transform = 'rotateX(0) rotateY(0)'; }, 60);
      });
    });
  }

  // Magnetic buttons + ripple
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = e.offsetX + 'px';
      r.style.top = e.offsetY + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  // Stronger stagger
  const groups = document.querySelectorAll('section, .cards.three, .footer-grid');
  groups.forEach(group => {
    const items = group.querySelectorAll('.reveal, .card, .highlight');
    items.forEach((el, i) => el.style.transitionDelay = (i * 60) + 'ms');
  });

  // Gentle hero parallax
  const heroInner = document.querySelector('.hero .hero-inner');
  let ticking = false;
  function onScroll(){
    if (ticking || reduceMotion || !heroInner) return;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      const off = Math.max(0, Math.min(22, y * 0.06));
      heroInner.style.transform = `translateY(${off}px)`;
      ticking = false;
    });
    ticking = true;
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Marquee: duplicate track for seamless loop
  document.querySelectorAll('.ribbon-roll').forEach(wrapper => {
    const txt = wrapper.textContent.trim();
    wrapper.innerHTML = `<span class="track">${txt}</span><span class="track">${txt}</span>`;
  });
});


// Hero pawprint particle field
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');
  if (!hero || reduce) return;

  const c = document.createElement('canvas');
  c.className = 'hero-canvas';
  hero.appendChild(c);
  const ctx = c.getContext('2d');
  let w, h, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resize(){
    w = hero.clientWidth; h = hero.clientHeight;
    c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize(); window.addEventListener('resize', resize);

  // Simple paw glyph using circles
  function drawPaw(x, y, size, alpha){
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#5ee1a1';
    // pad
    ctx.beginPath();
    ctx.ellipse(x, y, size*0.7, size*0.5, 0, 0, Math.PI*2); ctx.fill();
    // toes
    ctx.beginPath(); ctx.arc(x - size*0.5, y - size*0.6, size*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x - size*0.15, y - size*0.8, size*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + size*0.15, y - size*0.8, size*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + size*0.5, y - size*0.6, size*0.22, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  const N = 28;
  const parts = Array.from({length:N}).map(() => ({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-.5)*0.2, vy: (Math.random()-.5)*0.2,
    s: 6 + Math.random()*10, a: .12 + Math.random()*0.2
  }));

  let raf;
  function step(){
    ctx.clearRect(0,0,w,h);
    for (const p of parts){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = w+20; if (p.x > w+20) p.x = -20;
      if (p.y < -20) p.y = h+20; if (p.y > h+20) p.y = -20;
      drawPaw(p.x, p.y, p.s, p.a);
    }
    raf = requestAnimationFrame(step);
  }
  step();

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){ cancelAnimationFrame(raf); }
    else { raf = requestAnimationFrame(step); }
  });
});


// Autosize textareas on input
document.addEventListener('input', (e) => {
  if (e.target && e.target.tagName === 'TEXTAREA'){
    e.target.style.height = 'auto';
    e.target.style.height = (e.target.scrollHeight + 4) + 'px';
  }
});

// Lightweight form validation
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-validate="true"]');
  if (!form) return;
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    if(!el.value.trim()){
      el.classList.add('field-error'); ok = false;
    } else {
      el.classList.remove('field-error');
    }
  });
  const em = form.querySelector('input[type="email"]');
  if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)){ ok = false; em.classList.add('field-error'); }
  if(!ok){
    e.preventDefault();
    alert('Please complete the required fields (name, email, and your message).');
  }
});


// Testimonials carousel controls
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.t-carousel').forEach(car => {
    const track = car.querySelector('.t-track');
    const prev = car.querySelector('.t-prev');
    const next = car.querySelector('.t-next');
    if (!track || !prev || !next) return;
    const step = () => Math.max(280, Math.floor(track.clientWidth * 0.85));
    prev.addEventListener('click', () => { track.scrollBy({left: -step(), behavior:'smooth'}); });
    next.addEventListener('click', () => { track.scrollBy({left: +step(), behavior:'smooth'}); });
  });
});

// FAQ: ensure opened item is visible (mobile nicety)
document.addEventListener('toggle', (e) => {
  const d = e.target.closest('.faq-item');
  if (d && d.open && window.innerWidth < 900){
    d.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}, true);
