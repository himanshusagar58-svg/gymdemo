(() => {
const $ = id => document.getElementById(id), body = document.body;
const N = +body.dataset.frames;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
$('yr').textContent = new Date().getFullYear();

/* preloader: every frame + the "why us" photo, then the curtain lifts */
const srcs = Array.from({ length: N }, (_, i) => `img/f${String(i + 1).padStart(2, '0')}.webp`).concat('img/why.webp');
let done = 0;
const load = s => new Promise(res => {
  const im = new Image();
  im.onload = im.onerror = () => {
    const p = Math.round(++done / srcs.length * 100);
    $('pct').textContent = p; $('bar').style.transform = `scaleX(${p / 100})`;
    res(im);
  };
  im.src = s;
});
Promise.all([Promise.all(srcs.map(load)), Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))])])
  .then(([imgs]) => { start(imgs.slice(0, N)); setTimeout(() => body.classList.add('ready'), 300); });

function start(frames) {
  scrub(frames);
}

/* frames follow scroll through the hero */
function scrub(frames) {
  const c = $('seq'), ctx = c.getContext('2d'), hero = $('hero');
  c.width = frames[0].naturalWidth; c.height = frames[0].naturalHeight;
  let cur = 0, tgt = 0, shown = -1;
  const read = () => {
    const r = hero.getBoundingClientRect();
    tgt = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))) * (N - 1);
  };
  const tick = () => {
    cur += (tgt - cur) * .16;
    if (Math.abs(tgt - cur) < .02) cur = tgt;
    const i = Math.round(cur);
    if (i !== shown) { ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(frames[i], 0, 0); shown = i; }
    requestAnimationFrame(tick);
  };
  addEventListener('scroll', read, { passive: true }); addEventListener('resize', read);
  read(); if (still) { cur = tgt; }
  tick();
}

/* header links that open WhatsApp directly, with the gym number from <body data-wa> */
document.querySelectorAll('.menu a[data-wa]').forEach(a => {
  a.href = `https://wa.me/${body.dataset.wa}?text=${encodeURIComponent(`Hi ${body.dataset.gym}, ${a.dataset.wa}.`)}`;
});

/* header menu */
const bg = $('burger'), mn = $('menu');
const setMenu = o => { mn.classList.toggle('open', o); bg.setAttribute('aria-expanded', o); };
bg.addEventListener('click', () => setMenu(!mn.classList.contains('open')));
mn.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('click', e => { if (!e.target.closest('.top')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* enquiry form -> WhatsApp */
$('f').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, name = f.n.value.trim();
  let ph = f.p.value.replace(/\D/g, '');
  if (ph.length > 10 && /^(91|0)/.test(ph)) ph = ph.slice(-10);
  const fail = (m, el) => { $('err').textContent = m; el.focus(); };
  if (name.length < 2) return fail('Add your name so we know who to reply to.', f.n);
  if (ph.length !== 10) return fail('Enter a 10-digit mobile number.', f.p);
  $('err').textContent = '';
  const text = `Hi ${body.dataset.gym}, I'm ${name}. ${f.r.value}. You can reach me on ${ph}.`;
  window.open(`https://wa.me/${body.dataset.wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
})();
