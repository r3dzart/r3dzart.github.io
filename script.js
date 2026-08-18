(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .14 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('on'));
  }

  const cinematic = document.querySelector('.cinematic');
  const symbol = document.querySelector('.scene-symbol');
  const copy = document.querySelector('.scene-copy');
  const cards = [...document.querySelectorAll('.scene-card')];
  const clamp = (n, min=0, max=1) => Math.min(max, Math.max(min, n));
  const ease = t => 1 - Math.pow(1 - clamp(t), 3);

  function animate() {
    if (!cinematic || reduce) return;
    const rect = cinematic.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = clamp((-rect.top) / Math.max(total, 1));

    const rot = -7 + p * 20;
    const scale = 1 + p * .14;
    symbol.style.transform = `translateY(-50%) rotate(${rot}deg) scale(${scale})`;
    symbol.style.opacity = String(.04 + .06 * Math.sin(Math.PI * p));
    copy.style.transform = `translateY(${p * -26}px)`;
    copy.style.opacity = String(clamp(1 - p * 1.35, .18, 1));

    const stops = [0.05, 0.29, 0.53, 0.77];
    cards.forEach((card, i) => {
      const local = (p - stops[i]) / .18;
      const enter = ease(local);
      const fadeStart = stops[i] + .19;
      const fade = 1 - ease((p - fadeStart) / .10);
      const vis = i === cards.length - 1 ? enter : Math.min(enter, fade);
      card.style.opacity = String(clamp(vis));
      const y = (1 - enter) * 70 + (1 - fade) * -18;
      const s = .96 + .04 * enter;
      card.style.transform = `translateY(${y}px) scale(${s})`;
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => { animate(); ticking = false; });
      ticking = true;
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  animate();
})();