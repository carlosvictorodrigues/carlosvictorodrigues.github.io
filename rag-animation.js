// ═══════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════
const QUERY_TOKENS = [
  { text: 'O', key: false },
  { text: 'que', key: false },
  { text: 'diz', key: false },
  { text: 'a', key: false },
  { text: 'jurisprudência', key: true },
  { text: 'dominante', key: false },
  { text: 'sobre', key: false },
  { text: 'competência', key: true },
  { text: 'da', key: false },
  { text: 'administração', key: true },
  { text: 'pública', key: true },
];

const KEY_WORDS = ['jurisprudência', 'competência', 'administração', 'pública'];

const CHUNKS_DATA = [
  { src: 'RE 573202 — STF', text: 'contratos temporários com a Administração regidos pelo regime jurídico-administrativo…', score: 0.94, color: '#fafaf9' },
  { src: 'Súmula 137 — STJ', text: 'compete à Justiça Comum Estadual processar e julgar ação de servidor público…', score: 0.87, color: '#fafaf9' },
  { src: 'RR-1000234 — TST', text: 'vínculo de emprego público afasta competência da Justiça do Trabalho nos casos…', score: 0.71, color: '#d6d3d1' },
  { src: 'AgRg RE 589998 — STF', text: 'natureza jurídico-administrativa do vínculo determinante para fixar o foro…', score: 0.58, color: '#a8a29e' },
  { src: 'REsp 1.203.802 — STJ', text: 'Administração Pública direta, indireta — competência da Justiça Comum prevalece…', score: 0.41, color: '#78716c' },
];

const GEN_TEXT = 'A jurisprudência dominante do STF (RE 573202) firmou que contratos temporários com a Administração Pública são regidos pelo regime jurídico-administrativo, sendo competente a Justiça Comum Estadual — e não a Justiça do Trabalho — para dirimir os litígios decorrentes dessas relações.';

const STEPS = [
  { id: 'tok', label: 'Tokens' },
  { id: 'embed', label: 'Embed' },
  { id: 'search', label: 'Busca' },
  { id: 'chunks', label: 'Chunks' },
  { id: 'rerank', label: 'Rerank' },
  { id: 'gen', label: 'Gerar' },
];

// Timeline: scene id, startMs, endMs
const TIMELINE = [
  { id: 'tok', si: 0, t0: 0, t1: 4000 },
  { id: 'embed', si: 1, t0: 4000, t1: 8500 },
  { id: 'search', si: 2, t0: 8500, t1: 13500 },
  { id: 'chunks', si: 3, t0: 13500, t1: 16500 },
  { id: 'rerank', si: 4, t0: 16500, t1: 19000 },
  { id: 'gen', si: 5, t0: 19000, t1: 23500 },
  { id: 'ans', si: -1, t0: 23500, t1: 28000 },
];
const TOTAL_MS = 28000;

// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════
let rafId, startTs, lastScene, lastCycle = -1;
let inited = {};
let searchCtx, searchPts, searchQP;
let bgCtx, bgPts;
let genTypTimeout;
let isVisualizerBuilt = false;

// ═══════════════════════════════════════════════
//  DOM BUILD
// ═══════════════════════════════════════════════

function buildVisualizerDOM() {
  if (isVisualizerBuilt) return;
  const heroVisual = document.querySelector('.hero-visual .app');
  if (!heroVisual) return;

  // Query text
  const qTextEl = document.getElementById('qText');
  QUERY_TOKENS.forEach(t => {
    const s = document.createElement('span');
    s.className = 'tok';
    s.textContent = t.text + ' ';
    s.dataset.word = t.text;
    s.dataset.key = t.key ? '1' : '0';
    qTextEl.appendChild(s);
  });

  // Token grid
  const tokGridEl = document.getElementById('tokGrid');
  QUERY_TOKENS.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'tok-chip' + (t.key ? ' key-tok' : '');
    d.id = `chip-${i}`;
    d.innerHTML = `<span class="tok-idx">[${i}]</span>${t.text}`;
    tokGridEl.appendChild(d);
  });

  // Embed items
  const embedItemsEl = document.getElementById('embedItems');
  KEY_WORDS.forEach((w, wi) => {
    const div = document.createElement('div');
    div.className = 'embed-item';
    div.id = `ei-${wi}`;

    const label = document.createElement('div');
    label.className = 'embed-word';
    label.textContent = w;

    const bars = document.createElement('div');
    bars.className = 'embed-bars';

    const nBars = 12;
    for (let i = 0; i < nBars; i++) {
      const b = document.createElement('div');
      b.className = 'embed-bar';
      const hgt = Math.random() * 50 + 10;
      const hue = Math.random();
      b.style.height = '0px';
      b.style.background = `rgba(255, 255, 255, ${hue * 0.5 + 0.1})`;
      b.dataset.h = hgt;
      bars.appendChild(b);
    }

    // Add arrow after last item
    if (wi === KEY_WORDS.length - 1) {
      div.appendChild(label);
      div.appendChild(bars);
      embedItemsEl.appendChild(div);
    } else {
      div.appendChild(label);
      div.appendChild(bars);
      const arr = document.createElement('div');
      arr.className = 'embed-arrow';
      arr.textContent = '+';
      embedItemsEl.appendChild(div);
      embedItemsEl.appendChild(arr);
    }
  });

  // Build embed heatmap
  const hmEl = document.getElementById('embedHm');
  for (let i = 0; i < 48; i++) {
    const c = document.createElement('div');
    c.className = 'hm-cell';
    c.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.05})`;
    hmEl.appendChild(c);
  }

  // Build chunk cards
  CHUNKS_DATA.forEach((c, i) => {
    const el = document.getElementById(`c${i}`);
    if (!el) return;
    el.innerHTML = `
      <div class="chunk-rank">#${i + 1}</div>
      <div class="chunk-body">
        <div class="chunk-src">${c.src}</div>
        <div class="chunk-text">${c.text}</div>
      </div>
      <div class="chunk-right">
        <div class="chunk-score" style="color:${c.color}">${c.score.toFixed(2)}</div>
        <div class="score-track"><div class="score-fill" style="background:${c.color}"></div></div>
      </div>
    `;
  });

  // Gen sources
  const genSrcsEl = document.getElementById('genSrcs');
  ['Chunk #1 — RE 573202', 'Chunk #2 — Súmula 137', 'Chunk #3 — RR-1000234'].forEach(s => {
    const d = document.createElement('div');
    d.className = 'gen-pill';
    d.textContent = s;
    genSrcsEl.appendChild(d);
  });

  // Tracker steps
  const tStepsEl = document.getElementById('tSteps');
  STEPS.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 't-step';
    d.id = `ts-${s.id}`;
    d.innerHTML = `<div class="t-dot">${i + 1}</div><div class="t-label">${s.label}</div>`;
    tStepsEl.appendChild(d);
  });

  isVisualizerBuilt = true;
}

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════
function heatColor(v) {
  // Grayscale mapping
  const g = Math.round(lerp(60, 240, v));
  return `rgb(${g},${g},${g})`;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t) { return 1 - (1 - t) ** 3; }
function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }

function sp(t0, t1, elapsed) { return clamp((elapsed - t0) / (t1 - t0), 0, 1); }

function showScene(id) {
  document.querySelectorAll('.scene').forEach(el => {
    el.classList.remove('on');
    if (el.tagName === 'CANVAS') el.style.display = 'none';
  });
  if (!id) return;
  const el = document.getElementById(`scene-${id}`);
  if (!el) return;
  el.classList.add('on');
  if (el.tagName === 'CANVAS') el.style.display = 'block';
}

function setStep(idx) {
  STEPS.forEach((s, i) => {
    const el = document.getElementById(`ts-${s.id}`);
    if (!el) return;
    el.className = 't-step' + (i < idx ? ' done' : i === idx ? ' active' : '');
  });
}

function allDone() {
  STEPS.forEach(s => {
    const el = document.getElementById(`ts-${s.id}`);
    if (el) el.className = 't-step done';
  });
}

// ═══════════════════════════════════════════════
//  BG PARTICLES
// ═══════════════════════════════════════════════
function initBg() {
  const cv = document.getElementById('bgCanvas');
  if (!cv) return;
  bgCtx = cv.getContext('2d');
  cv.width = cv.offsetWidth * devicePixelRatio;
  cv.height = cv.offsetHeight * devicePixelRatio;
  bgCtx.scale(devicePixelRatio, devicePixelRatio);
  const W = cv.offsetWidth, H = cv.offsetHeight;

  bgPts = Array.from({ length: 25 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    r: Math.random() * 1.2 + .4,
    a: Math.random() * .12 + .04,
  }));
}

function renderBg() {
  const cv = document.getElementById('bgCanvas');
  if (!cv || !bgCtx) return;
  const W = cv.offsetWidth, H = cv.offsetHeight;
  bgCtx.clearRect(0, 0, W, H);
  bgPts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    bgCtx.save();
    bgCtx.globalAlpha = p.a;
    bgCtx.fillStyle = '#44403c';
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fill();
    bgCtx.restore();
  });
}

// ═══════════════════════════════════════════════
//  SEARCH CANVAS
// ═══════════════════════════════════════════════
function initSearch() {
  const cv = document.getElementById('scene-search');
  if (!cv) return;
  searchCtx = cv.getContext('2d');
  cv.width = cv.offsetWidth * devicePixelRatio;
  cv.height = cv.offsetHeight * devicePixelRatio;
  searchCtx.scale(devicePixelRatio, devicePixelRatio);
  const W = cv.offsetWidth, H = cv.offsetHeight;

  const clusters = [
    { cx: W * .18, cy: H * .25, col: '#78716c', n: 22 },
    { cx: W * .5, cy: H * .18, col: '#57534e', n: 20 },
    { cx: W * .68, cy: H * .62, col: '#a8a29e', n: 30 },
    { cx: W * .28, cy: H * .75, col: '#44403c', n: 18 },
    { cx: W * .82, cy: H * .32, col: '#d6d3d1', n: 16 },
  ];

  searchPts = [];
  clusters.forEach((cl, ci) => {
    for (let i = 0; i < cl.n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 55 + 8;
      searchPts.push({
        x: cl.cx + Math.cos(a) * r,
        y: cl.cy + Math.sin(a) * r,
        col: cl.col,
        a: .25 + Math.random() * .45,
        r: 2 + Math.random() * 1.5,
        ci,
        near: false,
      });
    }
  });

  searchQP = { x: W * .62, y: H * .55 };

  searchPts
    .map((p, i) => ({ i, d: Math.hypot(p.x - searchQP.x, p.y - searchQP.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6)
    .forEach(({ i }) => searchPts[i].near = true);
}

function renderSearch(prog) {
  const cv = document.getElementById('scene-search');
  if (!cv || !searchCtx) return;
  const W = cv.offsetWidth, H = cv.offsetHeight;
  const ctx = searchCtx;
  ctx.clearRect(0, 0, W, H);

  // BG
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,.04)';
  ctx.lineWidth = .5;
  for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const p1 = easeOut(clamp(prog / .2, 0, 1));
  const p2 = easeOut(clamp((prog - .2) / .12, 0, 1));
  const p3 = clamp((prog - .3) / .35, 0, 1);
  const p4 = easeOut(clamp((prog - .62) / .38, 0, 1));

  const maxR = Math.hypot(W, H) * .9;
  const ripR = p3 * maxR;

  // Points
  searchPts.forEach((p, i) => {
    const delay = (i / searchPts.length) * .8;
    const a = easeOut(clamp((p1 - delay / .8), 0, 1)) * p.a;
    if (a <= 0) return;

    const hit = p.near && p4 > 0;
    const glow = hit ? easeOut(clamp((p4 - .1) / .5, 0, 1)) : 0;
    const withinRipple = ripR > Math.hypot(p.x - searchQP.x, p.y - searchQP.y);

    ctx.save();
    if (glow > 0) {
      ctx.globalAlpha = glow * .4;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
      g.addColorStop(0, '#fafaf9'); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = a + glow * .4;
    ctx.fillStyle = hit && glow > 0 ? '#ffffff' : withinRipple ? '#d6d3d1' : p.col;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (hit ? 1.5 : 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Ripple rings
  if (p3 > 0 && p3 < 1) {
    for (let ring = 0; ring < 4; ring++) {
      const rp = clamp(p3 - ring * .08, 0, 1);
      if (rp <= 0) continue;
      const r = rp * maxR;
      const alpha = (1 - rp) * .35;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(searchQP.x, searchQP.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }

  // Lines to neighbors
  if (p4 > .3) {
    const la = easeOut(clamp((p4 - .3) / .5, 0, 1));
    searchPts.forEach(p => {
      if (!p.near) return;
      ctx.save();
      ctx.globalAlpha = la * .4;
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(searchQP.x, searchQP.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  // Query point
  if (p2 > 0) {
    ctx.save();
    const grd = ctx.createRadialGradient(searchQP.x, searchQP.y, 0, searchQP.x, searchQP.y, 28);
    grd.addColorStop(0, `rgba(201,169,110,${p2 * .5})`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(searchQP.x, searchQP.y, 28, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = p2;
    ctx.fillStyle = '#c9a96e';
    ctx.beginPath(); ctx.arc(searchQP.x, searchQP.y, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#c9a96e';
    // Use monospace since Instrument Serif isn't guaranteed on canvas natively
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('query vector', searchQP.x, searchQP.y + 18);
    ctx.restore();
  }

  // Top-k label
  if (p4 > .7) {
    const la = easeOut(clamp((p4 - .7) / .3, 0, 1));
    ctx.save();
    ctx.globalAlpha = la;
    ctx.fillStyle = '#fafaf9';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('▲ top-k neighbours', 14, 18);
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════
//  SCENE ENTERS
// ═══════════════════════════════════════════════

function enterTok() {
  showScene('tok');
  setStep(0);
  document.getElementById('tStatus').textContent = 'Tokenizando consulta…';

  const chips = document.querySelectorAll('.tok-chip');
  chips.forEach((c, i) => setTimeout(() => c.classList.add('show'), 120 + i * 180));

  const qToks = document.querySelectorAll('.tok');
  let ti = 0;
  function lit() {
    if (ti > 0) qToks[ti - 1]?.classList.remove('lit');
    if (ti < qToks.length) {
      qToks[ti].classList.add('lit');
      ti++;
      setTimeout(lit, 220);
    } else {
      qToks.forEach(t => {
        t.classList.remove('lit');
        if (t.dataset.key === '1') t.classList.add('key');
      });
      document.getElementById('tokInfo').textContent = `${QUERY_TOKENS.length} tokens · ${KEY_WORDS.length} keywords identificados`;
    }
  }
  setTimeout(lit, 300);
}

function enterEmbed() {
  showScene('embed');
  setStep(1);
  document.getElementById('tStatus').textContent = 'Gerando embeddings vetoriais…';

  const items = document.querySelectorAll('.embed-item');
  items.forEach((item, ii) => {
    setTimeout(() => {
      item.classList.add('show');
      const bars = item.querySelectorAll('.embed-bar');
      bars.forEach((b, bi) => {
        setTimeout(() => {
          b.style.height = b.dataset.h + 'px';
        }, bi * 60);
      });
    }, 400 + ii * 500);
  });

  setTimeout(() => {
    document.getElementById('embedResult').classList.add('show');
  }, 400 + items.length * 500 + 400);
}

function enterSearch() {
  showScene('search');
  setStep(2);
  document.getElementById('tStatus').textContent = 'Busca vetorial no corpus…';
  if (!searchCtx) initSearch();
}

function enterChunks() {
  showScene('chunks');
  setStep(3);
  document.getElementById('tStatus').textContent = 'Recuperando documentos relevantes…';

  CHUNKS_DATA.forEach((c, i) => {
    const card = document.getElementById(`c${i}`);
    if (!card) return;
    setTimeout(() => {
      card.classList.add('show');
      setTimeout(() => {
        const fill = card.querySelector('.score-fill');
        if (fill) fill.style.width = (c.score * 100) + '%';
      }, 250);
    }, i * 300 + 200);
  });
}

function enterRerank() {
  setStep(4);
  document.getElementById('tStatus').textContent = 'Reordenando por relevância…';
  setTimeout(() => {
    document.getElementById('c0').classList.add('top');
    document.getElementById('c1').classList.add('top');
  }, 600);
}

function enterGen() {
  showScene('gen');
  setStep(5);
  document.getElementById('tStatus').textContent = 'Gerando resposta com LLM…';

  const pills = document.querySelectorAll('.gen-pill');
  pills.forEach((p, i) => setTimeout(() => p.classList.add('show'), i * 300 + 200));

  const box = document.getElementById('genBox');
  box.innerHTML = '<span class="cursor-blink"></span>';

  let ci = 0;
  clearTimeout(genTypTimeout);
  function type() {
    if (ci < GEN_TEXT.length) {
      const cur = box.querySelector('.cursor-blink');
      if (cur) cur.insertAdjacentText('beforebegin', GEN_TEXT[ci]);
      ci++;
      genTypTimeout = setTimeout(type, 22 + Math.random() * 18);
    } else {
      const cur = box.querySelector('.cursor-blink');
      if (cur) cur.remove();
    }
  }
  setTimeout(type, 800);
}

function enterAns() {
  showScene('ans');
  document.getElementById('tStatus').textContent = 'Resposta validada ✓';
  allDone();
}

// ═══════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════
function resetAll() {
  inited = {};
  lastScene = null;

  document.querySelectorAll('.tok').forEach(t => t.className = 'tok');
  document.querySelectorAll('.tok-chip').forEach(c => c.classList.remove('show'));
  document.getElementById('tokInfo').textContent = '';
  document.querySelectorAll('.embed-item').forEach(item => {
    item.classList.remove('show');
    item.querySelectorAll('.embed-bar').forEach(b => b.style.height = '0px');
  });
  const embedResult = document.getElementById('embedResult')
  if (embedResult) embedResult.classList.remove('show');

  CHUNKS_DATA.forEach((_, i) => {
    const card = document.getElementById(`c${i}`);
    if (!card) return;
    card.className = 'chunk-card';
    const fill = card.querySelector('.score-fill');
    if (fill) fill.style.width = '0%';
  });
  document.querySelectorAll('.gen-pill').forEach(p => p.classList.remove('show'));
  const genBox = document.getElementById('genBox')
  if (genBox) genBox.innerHTML = '';
  clearTimeout(genTypTimeout);
  setStep(-1);
  showScene(null);
}

// ═══════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════
function tick(ts) {
  if (!isVisualizerBuilt) return;
  if (!startTs) startTs = ts;
  const elapsed = ts - startTs;
  const cycle = Math.floor(elapsed / TOTAL_MS);

  if (cycle !== lastCycle) {
    lastCycle = cycle;
    resetAll();
  }

  const t = elapsed % TOTAL_MS;
  const tTimeEl = document.getElementById('tTime')
  if (tTimeEl) tTimeEl.textContent = (t / 1000).toFixed(1) + 's';

  let cur = null;
  for (const s of TIMELINE) {
    if (t >= s.t0 && t < s.t1) { cur = s; break; }
  }

  if (cur && cur.id !== lastScene) {
    lastScene = cur.id;
    if (!inited[cur.id]) {
      inited[cur.id] = true;
      switch (cur.id) {
        case 'tok': enterTok(); break;
        case 'embed': enterEmbed(); break;
        case 'search': enterSearch(); break;
        case 'chunks': enterChunks(); break;
        case 'rerank': enterRerank(); break;
        case 'gen': enterGen(); break;
        case 'ans': enterAns(); break;
      }
    }
  }

  renderBg();

  if (cur && cur.id === 'search' && searchCtx) {
    const prog = sp(cur.t0, cur.t1, t);
    renderSearch(prog);
  }

  rafId = requestAnimationFrame(tick);
}

// ═══════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════
window.addEventListener('load', () => {
  const heroVisual = document.querySelector('.hero-visual .app');
  if (!heroVisual) return;
  buildVisualizerDOM();
  initBg();
  showScene(null);
  rafId = requestAnimationFrame(tick);
});

window.addEventListener('resize', () => {
  const bgCv = document.getElementById('bgCanvas');
  if (!bgCv) return;
  bgCtx = bgCv.getContext('2d');
  bgCv.width = bgCv.offsetWidth * devicePixelRatio;
  bgCv.height = bgCv.offsetHeight * devicePixelRatio;
  bgCtx.scale(devicePixelRatio, devicePixelRatio);
  searchCtx = null; // reinit on next search scene
});
