 // Asterics Technocart — script.js

const NAV_MAP = {
  'what-we-do':    'ni-do',
  'what-we-think': 'ni-think',
  'about':         'ni-about',
  'career':        'ni-career',
  'internship':    'ni-career',
  'contact':       'ni-contact',
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  setActiveNav(name);
  closeNavs();
  if (name === 'home') setTimeout(initHeroAnimation, 80);
}

function setActiveNav(pageName) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('nav-active'));
  if (pageName === 'home') return;
  const navItemId = NAV_MAP[pageName];
  if (navItemId) {
    const navItem = document.getElementById(navItemId);
    if (navItem) {
      const navLink = navItem.querySelector('.nav-link');
      if (navLink) navLink.classList.add('nav-active');
    }
  }
}

function toggleAcc(trigger) {
  const isOpen = trigger.getAttribute('aria-expanded') === 'true';
  const body = trigger.nextElementSibling;
  if (!isOpen) {
    trigger.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  } else {
    trigger.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
  }
}

function toggleNav(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  closeNavs();
  if (!isOpen) item.classList.add('open');
}

function closeNavs() {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.nav-item')) closeNavs();
});

function openModal(type) {
  document.getElementById('modal-overlay').classList.add('open');
  switchTab(type || 'login');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function switchTab(type) {
  document.getElementById('modal-login').style.display  = type === 'login'  ? 'block' : 'none';
  document.getElementById('modal-signup').style.display = type === 'signup' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active',  type === 'login');
  document.getElementById('tab-signup').classList.toggle('active', type === 'signup');
}

function handleSubmit() {
  const email = document.getElementById('contact-email').value.trim();
  if (!email) { alert('Please fill in your email address.'); return; }
  alert("Thank you! We'll be in touch within one business day.");
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

let heroCycleToken = 0; // lets a fresh call to initHeroAnimation cancel a running cycle

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function showWord(el, text, extraClass, token, holdMs) {
  el.textContent = text;
  el.className = 'stage-word' + (extraClass ? ' ' + extraClass : '');
  await sleep(30);
  if (token !== heroCycleToken) return;
  el.classList.add('show');
  await sleep(600 + holdMs);
  if (token !== heroCycleToken) return;
  el.classList.remove('show');
  await sleep(450);
}

/* ============================================================
   WIPRO-STYLE LETTER ANIMATION HELPERS
   Used for the resting wordmark: "Asterisc" turns/flips in,
   "Technocrat" fades in lightly, then a purple bounce wave
   travels across "Technocrat" — same feel as Wipro's
   "Intelligence" wordmark reveal.
   ============================================================ */

// Splits an element's text into <span class="letter"> pieces, once.
function wrapLetters(el) {
  if (el.dataset.wrapped === '1') return el.querySelectorAll('.letter');
  const text = el.textContent;
  el.textContent = '';
  el.dataset.wrapped = '1';
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
  return el.querySelectorAll('.letter');
}

// Resets letters back to hidden state (used when the hero re-plays).
function resetLetters(el) {
  el.querySelectorAll('.letter').forEach(l => l.classList.remove('show', 'bounce'));
}

// "Turn and flip" reveal — used for Asterisc.
async function flipInLetters(el, token, staggerMs = 55) {
  const letters = wrapLetters(el);
  for (let i = 0; i < letters.length; i++) {
    if (token !== heroCycleToken) return;
    letters[i].classList.add('show');
    await sleep(staggerMs);
  }
}

// Light, slow fade-in — used for Technocrat.
async function fadeInLetters(el, token, staggerMs = 60) {
  const letters = wrapLetters(el);
  for (let i = 0; i < letters.length; i++) {
    if (token !== heroCycleToken) return;
    letters[i].classList.add('show');
    await sleep(staggerMs);
  }
}

// Purple bounce wave that travels across already-visible letters.
async function bounceWave(el, token, staggerMs = 65) {
  const letters = el.querySelectorAll('.letter');
  for (let i = 0; i < letters.length; i++) {
    if (token !== heroCycleToken) return;
    letters[i].classList.add('bounce');
    setTimeout(() => letters[i] && letters[i].classList.remove('bounce'), 700);
    await sleep(staggerMs);
  }
}

// 8-beat hero sequence:
// 1 Design.  2 evolving.  3 Smarter.  4 into → mark+"digital excellence" preview  5 long line
// 6 gradient logo lockup (real "Asterisc Technocrat" reveal)  7 pill sequence
// 8 resting state (Asterisc turns/flips in, then Technocrat fades in + purple bounce wave)
async function initHeroAnimation() {
  const eyebrow = document.getElementById('hero-eyebrow');
  const stageWord = document.getElementById('stage-word');
  const stageLockup = document.getElementById('stage-lockup');
  const lockupWord1 = document.getElementById('lockup-word-1');
  const lockupWord2 = document.getElementById('lockup-word-2');
  const stagePill = document.getElementById('stage-pill');
  const pillText = document.getElementById('pill-text');
  const stageResting = document.getElementById('stage-resting');
  const extras = document.querySelectorAll('.hero-anim-extra');

  if (!stageWord) return;

  heroCycleToken += 1;
  const token = heroCycleToken;
  const isCurrent = () => token === heroCycleToken;

  // Reset
  if (eyebrow) {
    eyebrow.style.transition = 'none';
    eyebrow.style.opacity = '0';
    eyebrow.style.transform = 'translateY(14px)';
  }
  stageWord.className = 'stage-word';
  stageWord.textContent = '';
  stageLockup.className = 'stage-lockup';
  stagePill.className = 'stage-pill';
  pillText.className = 'pill-text';
  pillText.textContent = '';
  stageResting.className = 'stage-resting';
  const restingWord1Reset = stageResting.querySelector('.resting-word-1');
  const restingWord2Reset = stageResting.querySelector('.resting-word-2');
  const restingTaglineReset = stageResting.querySelector('.resting-tagline');
  resetLetters(restingWord1Reset);
  resetLetters(restingWord2Reset);
  if (restingTaglineReset) restingTaglineReset.className = 'resting-tagline';
  extras.forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
  });
  document.body.getBoundingClientRect();

  if (eyebrow) {
    await sleep(80);
    if (!isCurrent()) return;
    eyebrow.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    eyebrow.style.opacity = '1';
    eyebrow.style.transform = 'translateY(0)';
  }
  await sleep(500);
  if (!isCurrent()) return;

  // Beat 1 — Design.
  await showWord(stageWord, 'Design.', '', token, 500);
  if (!isCurrent()) return;

  // Beat 2 — evolving. (letter-spacing collapses)
  stageWord.textContent = 'evolving.';
  stageWord.className = 'stage-word wide';
  await sleep(30);
  if (!isCurrent()) return;
  stageWord.classList.add('show');
  await sleep(500);
  if (!isCurrent()) return;
  stageWord.classList.add('settled');
  await sleep(550);
  if (!isCurrent()) return;
  stageWord.classList.remove('show');
  await sleep(450);
  if (!isCurrent()) return;

  // Beat 3 — Smarter. (punch)
  await showWord(stageWord, 'Smarter.', 'punch', token, 350);
  if (!isCurrent()) return;

  // Beat 4 — into → then mark + wordmark preview
  await showWord(stageWord, 'into', '', token, 250);
  if (!isCurrent()) return;

  lockupWord1.textContent = 'digital';
  lockupWord2.textContent = 'excellence';
  stageLockup.className = 'stage-lockup show';
  await sleep(250);
  if (!isCurrent()) return;
  stageLockup.classList.add('mark-show');
  await sleep(700);
  if (!isCurrent()) return;
  stageLockup.classList.remove('show');
  await sleep(500);
  if (!isCurrent()) return;
  stageLockup.className = 'stage-lockup';

  // Beat 5 — long line
  await showWord(stageWord, 'and now...the digital frontier.', 'long-line', token, 900);
  if (!isCurrent()) return;

  // Beat 6 — full gradient logo lockup (the actual brand name reveal)
  lockupWord1.textContent = 'Asterisc';
  lockupWord2.textContent = 'Technocrat';
  stageLockup.className = 'stage-lockup gradient mark-show show';
  await sleep(300);
  if (!isCurrent()) return;
  stageLockup.classList.add('sweep');
  await sleep(1200);
  if (!isCurrent()) return;
  stageLockup.classList.remove('show');
  await sleep(500);
  if (!isCurrent()) return;
  stageLockup.className = 'stage-lockup';

  // Beat 7 — empowering businesses → with → creative solutions (pill) → design. build. grow.
  await showWord(stageWord, 'empowering businesses', '', token, 400);
  if (!isCurrent()) return;
  await showWord(stageWord, 'with', '', token, 250);
  if (!isCurrent()) return;

  stagePill.className = 'stage-pill show';
  pillText.textContent = 'creative solutions';
  await sleep(150);
  if (!isCurrent()) return;
  stagePill.classList.add('draw');
  await sleep(250);
  if (!isCurrent()) return;
  pillText.classList.add('show');
  await sleep(750);
  if (!isCurrent()) return;
  pillText.classList.remove('show');
  await sleep(280);
  if (!isCurrent()) return;
  pillText.textContent = 'design. build. grow.';
  pillText.classList.add('show');
  await sleep(850);
  if (!isCurrent()) return;
  stagePill.classList.remove('show');
  await sleep(500);
  if (!isCurrent()) return;
  stagePill.className = 'stage-pill';

  // Beat 8 — resting state: "Asterisc" turns/flips in letter by letter,
  // then "Technocrat" fades in lightly, then a purple bounce wave
  // travels across "Technocrat" — same feel as the Wipro wordmark reveal.
  const restingWord1 = stageResting.querySelector('.resting-word-1');
  const restingWord2 = stageResting.querySelector('.resting-word-2');
  const restingTagline = stageResting.querySelector('.resting-tagline');

  stageResting.classList.add('show');
  await sleep(120);
  if (!isCurrent()) return;

  // "Asterisc" — turn/flip in, letter by letter
  await flipInLetters(restingWord1, token, 55);
  if (!isCurrent()) return;
  await sleep(200);
  if (!isCurrent()) return;

  // "Technocrat" — light, slow fade in, letter by letter
  await fadeInLetters(restingWord2, token, 60);
  if (!isCurrent()) return;
  await sleep(150);
  if (!isCurrent()) return;

  // Purple bounce wave travels across "Technocrat"
  await bounceWave(restingWord2, token, 65);
  if (!isCurrent()) return;

  await sleep(150);
  if (!isCurrent()) return;
  if (restingTagline) restingTagline.classList.add('show');
  await sleep(200);
  if (!isCurrent()) return;

  extras.forEach((el, i) => {
    setTimeout(() => {
      if (!isCurrent()) return;
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 170);
  });
}

window.addEventListener('load', () => {
  if (document.getElementById('page-home').classList.contains('active')) {
    setTimeout(initHeroAnimation, 100);
  }
});
