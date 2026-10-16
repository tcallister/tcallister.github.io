// Site scripts. Everything here is optional polish: pages work without JS.

// ---------- Publications: filter chips ----------
// Chips carry data-filter="all" or a tag; papers carry data-tags="first lvk ...".
function setupFilters() {
  const chips = document.querySelectorAll(".chip[data-filter]");
  if (!chips.length) return;

  chips.forEach(chip => chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.setAttribute("aria-pressed", String(c === chip)));

    document.querySelectorAll(".pub").forEach(p => {
      const tags = (p.dataset.tags || "").split(" ");
      p.hidden = !(f === "all" || tags.includes(f));
    });
    // Hide year groups with no visible papers
    document.querySelectorAll(".year-group").forEach(g => {
      g.hidden = !g.querySelector(".pub:not([hidden])");
    });
  }));
}

// ---------- Sketched GW signals (header rule, gallery noise rules) ----------
function rng(seed) {  // small deterministic PRNG so the sketch doesn't change on redraw
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

// Each signal maps x in [0, 1] to strain in roughly [-1, 1]
// eps = time from merger to coalescence; smaller eps → larger frequency sweep, f ∝ tau^(-3/8)
function chirpSignal(cycles, tMerge, ringDecay, ampMod = 0, eps = 0.06) {
  const tau0 = tMerge + eps;
  return x => {
    if (x <= tMerge) {
      const tau = tau0 - x;
      const amp = Math.pow(eps / tau, 0.25);
      const phase = 2 * Math.PI * cycles * (1 - Math.pow(tau / tau0, 5 / 8));
      return amp * (1 + ampMod * Math.cos(2 * Math.PI * 3 * x)) * Math.cos(phase);
    }
    if (ringDecay === 0) return 0;  // e.g. BNS: signal leaves the band at merger
    const tauM = tau0 - tMerge, fM = cycles * (5 / 8) * Math.pow(tauM / tau0, -3 / 8) / tau0;
    const phaseM = 2 * Math.PI * cycles * (1 - Math.pow(tauM / tau0, 5 / 8));
    return Math.exp(-(x - tMerge) / ringDecay) * Math.cos(phaseM + 2 * Math.PI * fM * 1.3 * (x - tMerge));
  };
}

// ---------- Side strip: slate ground + optional faint image (strip_image in _config.yml) ----------
const STRIP_IMG_ALPHA = 0.18;
// Rotation (deg, + = clockwise) and focus point (fraction of image) placed at strip center.
// Tuned for the LIGO test illustration (-78° would stack its two black holes vertically).
// ZOOM scales relative to the smallest size that covers the strip; < 1 exposes the image's
// edges, which FADE (fraction of each side) softens into the ground.
const STRIP_IMG_ANGLE = -55, STRIP_IMG_FOCUS = [0.566, 0.464], STRIP_IMG_ZOOM = 0.75;
const STRIP_IMG_FADE = 0.12;
// Where the focus lands, as fractions of strip width and height (0.5 = centered)
const STRIP_IMG_X = 0.45, STRIP_IMG_Y = 0.39;
let stripArt = null;  // edge-faded copy of the image, built once on load
// Fetch only when the strip is shown (matches the 1180px breakpoint in main.scss), so phones skip it
const STRIP_MQ = window.matchMedia("(min-width: 1180px)");
let stripImgRequested = false;
function loadStripImg() {
  if (stripImgRequested || !STRIP_MQ.matches || !document.documentElement.dataset.stripImg) return;
  stripImgRequested = true;
  const img = new Image();
  img.onload = () => { stripArt = fadeEdges(img, STRIP_IMG_FADE); drawStrip(); };
  img.src = document.documentElement.dataset.stripImg;
}
loadStripImg();
STRIP_MQ.addEventListener("change", loadStripImg);  // window widened past the breakpoint later

// Copy img to an offscreen canvas whose alpha ramps 0 → 1 over the outer `frac` of each side
function fadeEdges(img, frac) {
  const c = document.createElement("canvas");
  const w = c.width = img.naturalWidth, h = c.height = img.naturalHeight;
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = "destination-in";  // keeps pixels, scaled by the mask's alpha
  for (const [x1, y1] of [[w, 0], [0, h]]) {        // horizontal pass, then vertical
    const m = g.createLinearGradient(0, 0, x1, y1);
    m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(frac, "#000");
    m.addColorStop(1 - frac, "#000"); m.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = m; g.fillRect(0, 0, w, h);
  }
  return c;
}

// Draw img rotated, with its focus point at the box center, scaled so it still covers the w×h box.
// Covering is guaranteed if the box's circumscribed circle fits inside the image around the focus.
function drawCover(g, img, w, h, alpha) {
  const [fx, fy] = STRIP_IMG_FOCUS;
  const iw = img.width, ih = img.height;
  const room = Math.min(fx * iw, (1 - fx) * iw, fy * ih, (1 - fy) * ih);  // image px from focus to nearest edge
  const s = STRIP_IMG_ZOOM * Math.hypot(w, h) / 2 / room;
  g.save();
  g.globalAlpha = alpha;
  g.translate(w * STRIP_IMG_X, h * STRIP_IMG_Y);
  g.rotate(STRIP_IMG_ANGLE * Math.PI / 180);
  g.drawImage(img, -fx * iw * s, -fy * ih * s, iw * s, ih * s);
  g.restore();
}

function drawStrip() {
  const cv = document.getElementById("side-l");
  if (!cv) return;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;  // hidden on narrow screens

  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext("2d");
  g.scale(dpr, dpr);

  // Slate ground, then the faint image. Rejected: hand-sketched signals over it
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#232845"); sky.addColorStop(1, "#2f355a");
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  if (stripArt) drawCover(g, stripArt, w, h, STRIP_IMG_ALPHA);
}

// Draw signal `sig` between x0 and x1 (canvas px), centered on cy, in pencil style
function sketchSignal(g, sig, x0, x1, cy, amp, ink, r, opacity = 1) {
  // Faint baseline, as if ruled in pencil
  g.strokeStyle = ink; g.globalAlpha = 0.12 * opacity; g.lineWidth = 0.8;
  g.beginPath(); g.moveTo(x0, cy); g.lineTo(x1, cy); g.stroke();

  // Two offset, jittered passes give the sketched look
  for (let pass = 0; pass < 2; pass++) {
    g.globalAlpha = (pass ? 0.35 : 0.85) * opacity; g.lineWidth = pass ? 0.8 : 1.3;
    g.beginPath();
    const n = Math.max(200, Math.round((x1 - x0) * 3)), dy = pass ? (r() - 0.5) * 1.6 : 0;
    for (let i = 0; i <= n; i++) {
      const x = i / n, jitter = (r() - 0.5) * 0.7;
      const px = x0 + x * (x1 - x0), py = cy - amp * sig(x) + dy + jitter;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.stroke();
  }
}

// ---------- Header rule: one long sketched chirp ----------
const RULE_SIGNAL = chirpSignal(30, 0.9, 0.015, 0, 0.015);

function drawRule() {
  const cv = document.querySelector(".sig-rule");
  if (!cv) return;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;

  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext("2d");
  g.scale(dpr, dpr);
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim();
  // Per-page front matter `rule: noise` swaps the chirp for the gallery's noise rule
  const r = rng(7);
  if (document.documentElement.dataset.rule === "noise") {
    sketchSignal(g, noiseSignal(r), 1, w - 1, h / 2, h * NOISE_AMP, ink, r, NOISE_OPACITY);
  } else {
    sketchSignal(g, RULE_SIGNAL, 1, w - 1, h / 2, h * 0.36, ink, r, 0.45);
  }
}

function setupRule() {
  const band = document.querySelector(".band");
  if (!band) return;
  const cv = document.createElement("canvas");
  cv.className = "sig-rule"; cv.setAttribute("aria-hidden", "true");
  band.appendChild(cv);
  // Same reasoning as the strip: redraw whenever its displayed size changes
  let t;
  new ResizeObserver(() => { clearTimeout(t); t = setTimeout(drawRule, 60); }).observe(cv);
}

// Redraw whenever the canvas's displayed size changes (window resize, or layout
// settling after CSS/fonts load). Drawing only once could leave a bitmap sized
// for a pre-layout box, which CSS then stretches into a distorted image.
let stripTimer;
function scheduleStrip() { clearTimeout(stripTimer); stripTimer = setTimeout(drawStrip, 60); }
const stripCanvas = document.getElementById("side-l");
if (stripCanvas) new ResizeObserver(scheduleStrip).observe(stripCanvas);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawRule);

// ---------- Gallery: rules between entries are sketched stochastic-background noise ----------
const NOISE_POINTS = 700;    // independent noise samples across a rule (more → busier)
const NOISE_SMOOTH = 1;      // moving-average half-width, in samples (more → smoother, redder)
const NOISE_AMP = 0.16;      // amplitude, as a fraction of the canvas height
const NOISE_OPACITY = 0.45;  // matches the header chirp rule

// Smoothed Gaussian noise, normalized to unit standard deviation, as a signal x in [0, 1] → strain
function noiseSignal(r) {
  const white = Array.from({ length: NOISE_POINTS + 2 * NOISE_SMOOTH }, () =>
    Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()));  // Box–Muller
  const y = [];
  for (let i = 0; i < NOISE_POINTS; i++) {
    let s = 0;
    for (let k = 0; k <= 2 * NOISE_SMOOTH; k++) s += white[i + k];
    y.push(s);
  }
  const sd = Math.sqrt(y.reduce((a, v) => a + v * v, 0) / y.length);
  return x => {
    const t = x * (NOISE_POINTS - 1), i = Math.min(Math.floor(t), NOISE_POINTS - 2), f = t - i;
    return ((1 - f) * y[i] + f * y[i + 1]) / sd / 2.5;  // ~2.5σ peaks reach ±1
  };
}

function drawNoiseRule(cv, seed) {
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const g = cv.getContext("2d");
  g.scale(dpr, dpr);
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim();
  const r = rng(seed);  // same seed → same noise on every redraw
  sketchSignal(g, noiseSignal(r), 1, w - 1, h / 2, h * NOISE_AMP, ink, r, NOISE_OPACITY);
}

function setupNoiseRules() {
  document.querySelectorAll(".noise-rule").forEach((cv, k) => {
    const draw = () => drawNoiseRule(cv, 101 + k);
    let t;
    new ResizeObserver(() => { clearTimeout(t); t = setTimeout(draw, 60); }).observe(cv);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  });
}

// ---------- Gallery: play videos only while on screen ----------
// Videos carry data-autoplay instead of autoplay, so nothing plays (or downloads
// beyond metadata) until scrolled into view. Visitors who ask the OS to reduce
// motion get the video paused, with controls.
function setupVideos() {
  const vids = document.querySelectorAll('video[data-autoplay]');
  if (!vids.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    }
  }, { threshold: 0.25 });
  vids.forEach(v => io.observe(v));
}

setupFilters();
setupVideos();
setupNoiseRules();
setupRule();
drawStrip();
