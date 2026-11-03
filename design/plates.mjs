// Sidekick seeded plates: one motif per entry kind, drawn deterministically from the entry id.
// Ported from the design canvas (Plate.dc.html). Pure function, no DOM: safe to run at build time in Astro.
// Colours are CSS custom properties, so an inline <svg> follows the page theme (light/dark) without re-rendering.

/** kind -> motif. Unmapped kinds fall back to FALLBACK_MOTIF. */
export const KIND_TO_MOTIF = {
  spec: 'Exploded view',
  prd: 'Phyllotaxis',
  decision: 'Bifurcation',
  plan: 'Gantt',
  guidance: 'Radar',
  glossary: 'Element table',
  opportunity: 'Scatter',
};
/** Every Writing, whatever its `kind`. */
export const WRITINGS_MOTIF = 'Margin';
/** Home page hero, seed "sidekick". */
export const HERO_MOTIF = 'Companion orbit';
export const FALLBACK_MOTIF = 'Drift';
/** Drawn by buildPlate but not mapped to any kind yet; available for future kinds. */
export const RESERVE_MOTIFS = ['Lexicon', 'Lattice', 'Contour', 'Drift', 'Frame stack', 'Requirement grid', 'Branch'];

export function motifFor(entry) {
  if (entry.collection === 'writings') return WRITINGS_MOTIF;
  return KIND_TO_MOTIF[entry.kind] || FALLBACK_MOTIF;
}

/**
 * @param {string} type  motif name
 * @param {string} seed  stable identity: the entry's frontmatter `id` (writings: their `id` too)
 * @param {number} W     viewBox width; height is always 240 (640 for bands, 480 for the home hero)
 * @param {string} label term shown by Element table / Lexicon (the entry title); optional
 * @returns {{paths:object[], circles:object[], rects:object[], texts:object[]}}
 */
export function buildPlate(type, seed, W = 640, label = '') {

const INK = 'var(--muted, #545e68)', ACC = 'var(--accent, #2e6e79)', PAPER = 'var(--bg, #f2f5f6)';
const pal = { ink: INK, accent: ACC, paper: PAPER };
const st = (stroke, w, o, fill, dash) => 'stroke: ' + (stroke || 'none') + '; stroke-width: ' + (w || 0) + '; fill: ' + (fill || 'none') + '; opacity: ' + (+o).toFixed(2) + '; stroke-dasharray: ' + (dash || 'none') + '; stroke-linecap: round; stroke-linejoin: round';
const P = (d, stroke, w, o, dash, fill) => ({ d, style: st(stroke, w, o, fill, dash) });
const C = (cx, cy, r, stroke, w, o, fill, dash) => ({ cx: (+cx).toFixed(1), cy: (+cy).toFixed(1), r: (+r).toFixed(1), style: st(stroke, w, o, fill, dash) });
const R = (x, y, wd, ht, stroke, w, o, fill, rx) => ({ x: (+x).toFixed(1), y: (+y).toFixed(1), wd: (+wd).toFixed(1), ht: (+ht).toFixed(1), rx: rx || 0, style: st(stroke, w, o, fill) });
let h = 0; const key = type + '::' + seed;
for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
let s = Math.abs(h);
const rand = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const paths = [], circles = [], rects = [], texts = [];
const SURF = 'var(--surface, #ffffff)', WASH = 'var(--tint, #dde9eb)';
const T = (x, y, s, fill, anchor) => ({ x: (+x).toFixed(1), y: (+y).toFixed(1), s, style: 'font-family: var(--mono, monospace); font-size: 9px; letter-spacing: 0.08em; font-weight: 500; fill: ' + fill + '; text-anchor: ' + (anchor || 'start') });
const TX = (x, y, s, style) => ({ x: (+x).toFixed(1), y: (+y).toFixed(1), s, style });
const words = String(label || '').trim().split(/\s+/).filter(Boolean);
if (type === 'Companion orbit') {
for (let i = 0; i < 70; i++) circles.push(C(10 + rand() * (W - 20), 10 + rand() * 220, 0.6 + rand() * 0.9, 'none', 0, 0.18 + rand() * 0.3, pal.ink));
const cx = W * (0.36 + rand() * 0.08), cy = 120 + (rand() - 0.5) * 16;
const a = Math.min(cx - 40, W - cx - 60, W * 0.34 + rand() * 40), b = Math.min(a * 0.62, 66 + rand() * 14), phi = (rand() - 0.5) * 0.14;
const at = (t) => ({ x: cx + a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi), y: cy + a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi) });
for (let k = 1; k <= 6; k++) { const r0 = 14 + k * 12, h1 = rand() * 6.28; let d = ''; for (let s = 0; s <= 72; s++) { const t = (s / 72) * 6.283, rr = r0 * (1 + 0.06 * Math.sin(2 * t + h1) + 0.03 * Math.sin(3 * t)); d += (s ? ' L ' : 'M ') + (cx + Math.cos(t) * rr * 1.25).toFixed(1) + ' ' + (cy + Math.sin(t) * rr * 0.8).toFixed(1); } paths.push(P(d + ' Z', pal.ink, 1, 0.42 - k * 0.04)); }
let od = ''; for (let s = 0; s <= 96; s++) { const p = at((s / 96) * 6.283); od += (s ? ' L ' : 'M ') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
paths.push(P(od, pal.ink, 1, 0.55, '3 5'));
const th = (rand() - 0.5) * 0.9 + (rand() < 0.5 ? 0 : 3.14);
for (let s = 1; s <= 16; s++) { const p = at(th - s * 0.07); circles.push(C(p.x, p.y, 2.4 - s * 0.11, 'none', 0, 0.75 - s * 0.042, pal.accent)); }
const cp = at(th);
circles.push(C(cx, cy, 11, 'none', 0, 0.95, pal.ink));
circles.push(C(cx, cy, 17, pal.ink, 1, 0.4, 'none'));
circles.push(C(cp.x, cp.y, 11, pal.accent, 1.3, 0.9, 'none'));
circles.push(C(cp.x, cp.y, 5.5, 'none', 0, 1, pal.accent));
paths.push(P('M ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' L ' + cp.x.toFixed(1) + ' ' + cp.y.toFixed(1), pal.accent, 1, 0.5, '1 4'));
const dx = cp.x - cx, dy = cp.y - cy, rot = (ang) => ({ x: cx + dx * Math.cos(ang) - dy * Math.sin(ang), y: cy + dx * Math.sin(ang) + dy * Math.cos(ang) });
const L = [['L1', { x: cx + dx * 0.8, y: cy + dy * 0.8 }], ['L2', { x: cx + dx * 1.2, y: cy + dy * 1.2 }], ['L3', { x: cx - dx, y: cy - dy }], ['L4', rot(1.047)], ['L5', rot(-1.047)]];
L.forEach(([n, p]) => { if (p.x < 24 || p.x > W - 30 || p.y < 30 || p.y > 196 || Math.hypot(p.x - cp.x, p.y - cp.y) < 34) return; paths.push(P('M ' + (p.x - 3.5).toFixed(1) + ' ' + p.y.toFixed(1) + ' L ' + (p.x + 3.5).toFixed(1) + ' ' + p.y.toFixed(1) + ' M ' + p.x.toFixed(1) + ' ' + (p.y - 3.5).toFixed(1) + ' L ' + p.x.toFixed(1) + ' ' + (p.y + 3.5).toFixed(1), pal.ink, 1.1, 0.7)); texts.push(T(p.x + 6, p.y - 5, n, pal.ink)); });
const sx = W - 150; paths.push(P('M ' + sx + ' 214 L ' + (sx + 110) + ' 214 M ' + sx + ' 210 L ' + sx + ' 218 M ' + (sx + 55) + ' 211 L ' + (sx + 55) + ' 217 M ' + (sx + 110) + ' 210 L ' + (sx + 110) + ' 218', pal.ink, 1, 0.5));
texts.push(T(sx, 204, 'e = ' + Math.sqrt(1 - (b * b) / (a * a)).toFixed(3), pal.ink));
texts.push(T(cp.x, cp.y + 26, 'sidekick', pal.accent, 'middle'));
} else if (type === 'Element table') {
const cell = 22, g = 4, x0 = 26, y0 = 30, cols = 15, rowsN = 6, cells = [];
for (let r = 0; r < rowsN; r++) for (let c = 0; c < cols; c++) { if (r === 0 && c > 0 && c < cols - 1) continue; if ((r === 1 || r === 2) && c > 1 && c < 9) continue; cells.push({ x: x0 + c * (cell + g), y: y0 + r * (cell + g) }); }
const hi = Math.floor(rand() * cells.length);
cells.forEach((q, i) => { if (i === hi) return; const tone = rand() < 0.3; rects.push(R(q.x, q.y, cell, cell, pal.ink, 1, tone ? 0.5 : 0.28, tone ? WASH : 'none', 2)); });
for (let c = 0; c < 15; c++) { const q = { x: x0 + c * (cell + g), y: y0 + 6.5 * (cell + g) }; rects.push(R(q.x, q.y, cell, cell, pal.ink, 1, 0.2, 'none', 2)); }
const hc = cells[hi];
rects.push(R(hc.x, hc.y, cell, cell, pal.accent, 1.5, 1, pal.accent, 2));
const tx = W - 168, ty = 34, tw = 134, thh = 166;
paths.push(P('M ' + (hc.x + cell).toFixed(1) + ' ' + (hc.y + cell / 2).toFixed(1) + ' L ' + (tx - 14) + ' ' + (hc.y + cell / 2).toFixed(1) + ' L ' + (tx - 14) + ' ' + (ty + 24) + ' L ' + tx + ' ' + (ty + 24), pal.accent, 1, 0.75, '2 3'));
rects.push(R(tx, ty, tw, thh, pal.accent, 1.4, 1, WASH, 3));
const w1 = words[0] || 'term', w2 = words[1] || '';
const sym = w1.charAt(0).toUpperCase() + (w2 ? w2.charAt(0).toLowerCase() : (w1.slice(1).replace(/[aeiou]/gi, '').charAt(0) || w1.charAt(1) || '').toLowerCase());
const num = 1 + (Math.abs(h) % 118);
texts.push(T(tx + 12, ty + 20, String(num), pal.accent));
texts.push(TX(tx + tw / 2, ty + 104, sym, 'font-family: var(--serif, Georgia, serif); font-size: 64px; font-weight: 500; fill: var(--text, #0d1114); text-anchor: middle'));
texts.push(T(tx + tw / 2, ty + 136, (label || 'term').toUpperCase(), pal.ink, 'middle'));
texts.push(T(tx + tw / 2, ty + 152, (num * 2.0147 + rand()).toFixed(3), pal.ink, 'middle'));
} else if (type === 'Lexicon') {
const head = label || 'term', initial = head.charAt(0).toUpperCase();
texts.push(TX(W - 120, 196, initial, 'font-family: var(--serif, Georgia, serif); font-size: 230px; font-weight: 500; fill: var(--muted, #545e68); opacity: 0.09; text-anchor: middle'));
texts.push(TX(36, 74, head.toLowerCase(), 'font-family: var(--serif, Georgia, serif); font-size: 38px; font-weight: 500; fill: var(--text, #0d1114)'));
texts.push(T(38, 98, 'GLOSSARY · NO. ' + String(1 + (Math.abs(h) % 99)).padStart(3, '0'), pal.ink));
paths.push(P('M 36 112 L ' + (W - 70) + ' 112', pal.ink, 1, 0.35));
let y = 134; const senses = 2 + Math.floor(rand() * 2); let accentDone = false;
for (let sN = 1; sN <= senses && y < 206; sN++) {
texts.push(T(36, y + 3, sN + '.', sN === 1 ? pal.accent : pal.ink));
const lines = 1 + Math.floor(rand() * 2);
for (let l = 0; l < lines && y < 206; l++) {
let x = 56; const end = W - 90 - rand() * 120;
while (x < end) { const ww = 18 + rand() * 54; const isA = !accentDone && sN === 1 && x > 120 && rand() < 0.35; if (isA) accentDone = true; rects.push(R(x, y - 3, Math.min(ww, end - x), 6, 'none', 0, isA ? 1 : 0.22, isA ? pal.accent : pal.ink, 3)); x += ww + 6; }
y += 15;
}
y += 7;
}
const groups = ['A–C', 'D–F', 'G–I', 'J–L', 'M–O', 'P–S', 'T–Z'], idx = Math.max(0, groups.findIndex((gr) => initial >= gr.charAt(0) && initial <= gr.charAt(2)));
groups.forEach((gr, i) => { const yy = 14 + i * 31; const on = i === idx; rects.push(R(W - 30, yy, 34, 28, on ? 'none' : pal.ink, on ? 0 : 1, on ? 1 : 0.3, on ? pal.accent : 'none', 3)); texts.push(TX(W - 14, yy + 17, gr, 'font-family: var(--mono, monospace); font-size: 8px; font-weight: 500; text-anchor: middle; fill: ' + (on ? 'var(--surface, #ffffff)' : 'var(--muted, #545e68)'))); });
} else if (type === 'Exploded view') {
const n = 4 + Math.floor(rand() * 3), cx = W / 2 - 40 + (rand() - 0.5) * 60, hi = Math.floor(rand() * n);
const layers = []; let Bmax = 0;
for (let i = 0; i < n; i++) { const A = 80 * (0.72 + rand() * 0.38); Bmax = Math.max(Bmax, A * 0.5); layers.push({ A, B: A * 0.5, feat: Math.floor(rand() * 4) }); }
const gap = Math.min(26 + rand() * 8, (196 - 2 * Bmax - 6) / (n - 1)), top = 120 - ((n - 1) * gap) / 2 - 3;
layers.forEach((L, i) => { L.y = top + i * gap; });
paths.push(P('M ' + cx.toFixed(1) + ' ' + (top - 34).toFixed(1) + ' L ' + cx.toFixed(1) + ' ' + (top + (n - 1) * gap + 44).toFixed(1), pal.ink, 1, 0.35, '2 4'));
const yb = top + (n - 1) * gap;
const dx0 = Math.max(30, cx - 80 * 1.1 - 34); paths.push(P('M ' + dx0 + ' ' + top.toFixed(1) + ' L ' + dx0 + ' ' + yb.toFixed(1) + ' M ' + (dx0 - 4) + ' ' + top.toFixed(1) + ' L ' + (dx0 + 4) + ' ' + top.toFixed(1) + ' M ' + (dx0 - 4) + ' ' + yb.toFixed(1) + ' L ' + (dx0 + 4) + ' ' + yb.toFixed(1), pal.ink, 1, 0.45)); texts.push(T(dx0 - 8, (top + yb) / 2 + 3, 'Δ' + Math.round(yb - top), pal.ink, 'end'));
for (let i = n - 1; i >= 0; i--) {
const L = layers[i], y = L.y, A = L.A, B = L.B, isH = i === hi;
const stroke = isH ? pal.accent : pal.ink, sw = isH ? 1.4 : 1, so = isH ? 0.95 : 0.6;
paths.push(P('M ' + (cx - A).toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (cx - A).toFixed(1) + ' ' + (y + 6).toFixed(1) + ' L ' + cx.toFixed(1) + ' ' + (y + B + 6).toFixed(1) + ' L ' + (cx + A).toFixed(1) + ' ' + (y + 6).toFixed(1) + ' L ' + (cx + A).toFixed(1) + ' ' + y.toFixed(1), stroke, sw, so, 'none', SURF));
paths.push(P('M ' + (cx - A).toFixed(1) + ' ' + y.toFixed(1) + ' L ' + cx.toFixed(1) + ' ' + (y - B).toFixed(1) + ' L ' + (cx + A).toFixed(1) + ' ' + y.toFixed(1) + ' L ' + cx.toFixed(1) + ' ' + (y + B).toFixed(1) + ' Z', stroke, sw, so, 'none', isH ? WASH : SURF));
if (L.feat === 0) { for (let k = 1; k < 3; k++) { const f = k / 3; paths.push(P('M ' + (cx - A + A * f).toFixed(1) + ' ' + (y - B * f).toFixed(1) + ' L ' + (cx + A * f).toFixed(1) + ' ' + (y + B - B * f).toFixed(1), stroke, 0.8, so * 0.6)); paths.push(P('M ' + (cx - A + A * f).toFixed(1) + ' ' + (y + B * f).toFixed(1) + ' L ' + (cx + A * f).toFixed(1) + ' ' + (y - B + B * f).toFixed(1), stroke, 0.8, so * 0.6)); } }
else if (L.feat === 1) { const rx = A * 0.38, ry = B * 0.38; paths.push(P('M ' + (cx - rx).toFixed(1) + ' ' + y.toFixed(1) + ' A ' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 1 0 ' + (cx + rx).toFixed(1) + ' ' + y.toFixed(1) + ' A ' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 1 0 ' + (cx - rx).toFixed(1) + ' ' + y.toFixed(1), stroke, 1, so)); circles.push(C(cx, y, 2, 'none', 0, so, stroke)); }
else if (L.feat === 2) { for (let k = -2; k <= 2; k++) circles.push(C(cx + k * A * 0.22, y + k * B * 0.22 * -0, 1.8, 'none', 0, so, stroke)); }
paths.push(P('M ' + (cx + A + 6).toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (W - 74) + ' ' + y.toFixed(1), stroke, isH ? 1.2 : 0.8, isH ? 0.9 : 0.35, isH ? 'none' : '1 3'));
texts.push(T(W - 66, y + 3, (isH ? '▸ ' : '') + '0' + (i + 1), isH ? pal.accent : pal.ink));
}
} else if (type === 'Phyllotaxis') {
const N = 150 + Math.floor(rand() * 90), cx = W * (0.3 + rand() * 0.4), cy = 120, c = 100 / Math.sqrt(N), rot = rand() * 6.283, golden = 2.39996323;
circles.push(C(cx, cy, 108, pal.ink, 1, 0.3, 'none', '2 5'));
paths.push(P('M ' + (cx - 118).toFixed(1) + ' ' + cy + ' L ' + (cx + 118).toFixed(1) + ' ' + cy + ' M ' + cx.toFixed(1) + ' ' + (cy - 116) + ' L ' + cx.toFixed(1) + ' ' + (cy + 116), pal.ink, 0.8, 0.25, '1 4'));
for (let a = 0; a < 24; a++) { const th = (a / 24) * 6.283; paths.push(P('M ' + (cx + Math.cos(th) * 112).toFixed(1) + ' ' + (cy + Math.sin(th) * 112).toFixed(1) + ' L ' + (cx + Math.cos(th) * (a % 6 === 0 ? 122 : 117)).toFixed(1) + ' ' + (cy + Math.sin(th) * (a % 6 === 0 ? 122 : 117)).toFixed(1), pal.ink, 1, 0.45)); }
const picks = {}; const k = 3 + Math.floor(rand() * 3);
for (let j = 0; j < k; j++) picks[Math.floor(N * (0.35 + rand() * 0.6))] = true;
let first = null;
for (let i = 1; i < N; i++) {
const r = c * Math.sqrt(i), th = i * golden + rot, x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r, t = i / N, sz = 0.9 + 2.3 * t;
if (picks[i]) { circles.push(C(x, y, sz + 4.5, pal.accent, 1.2, 0.9, 'none')); circles.push(C(x, y, sz + 0.6, 'none', 0, 0.95, pal.accent)); if (!first) first = { x, y, i }; }
else circles.push(C(x, y, sz, 'none', 0, 0.22 + 0.5 * t, pal.ink));
}
if (first) { const lx = first.x > cx ? W - 40 : 40; paths.push(P('M ' + first.x.toFixed(1) + ' ' + first.y.toFixed(1) + ' L ' + lx + ' ' + (first.y - 0).toFixed(1), pal.accent, 0.9, 0.7, '2 3')); texts.push(T(lx, first.y - 6, 'n = ' + first.i, pal.accent, first.x > cx ? 'end' : 'start')); }
texts.push(T(cx + 126, cy - 4, '137.5°', pal.ink));
} else if (type === 'Bifurcation') {
const x0 = 44, x1 = W - 28, y0 = 26, y1 = 214;
const rMin = 2.7 + rand() * 0.22, rMax = 3.72 + rand() * 0.27, up = rand() < 0.5;
const px = (r) => x0 + ((r - rMin) / (rMax - rMin)) * (x1 - x0), py = (x) => y1 - x * (y1 - y0);
paths.push(P('M ' + x0 + ' ' + (y1 + 8) + ' L ' + x1 + ' ' + (y1 + 8), pal.ink, 1, 0.45));
[3, 3.449, 3.5699].forEach((r) => { if (r > rMin && r < rMax) { const x = px(r); paths.push(P('M ' + x.toFixed(1) + ' ' + y0 + ' L ' + x.toFixed(1) + ' ' + (y1 + 12), pal.ink, 0.8, 0.3, '1 4')); texts.push(T(x, y1 + 22, r.toFixed(2), pal.ink, 'middle')); } });
let d = '';
const cols = 130;
for (let k = 0; k < cols; k++) {
const r = rMin + ((rMax - rMin) * k) / (cols - 1); let x = 0.2 + rand() * 0.6;
for (let it = 0; it < 220; it++) x = r * x * (1 - x);
const xs = px(r).toFixed(1);
for (let it = 0; it < 22; it++) { x = r * x * (1 - x); d += 'M' + xs + ' ' + py(x).toFixed(1) + 'h0'; }
}
paths.push(P(d, pal.ink, 1.3, 0.5));
const branch = (r, sgn) => r < 3 ? 1 - 1 / r : ((r + 1) + sgn * Math.sqrt((r + 1) * (r - 3))) / (2 * r);
let ca = '', cr = '';
const rEnd = Math.min(3.449, rMax);
for (let s = 0; s <= 60; s++) { const r = rMin + ((rEnd - rMin) * s) / 60; ca += (s ? ' L ' : 'M ') + px(r).toFixed(1) + ' ' + py(branch(r, up ? 1 : -1)).toFixed(1); if (r >= 3) cr += (cr ? ' L ' : 'M ') + px(r).toFixed(1) + ' ' + py(branch(r, up ? -1 : 1)).toFixed(1); }
paths.push(P(cr, pal.ink, 1.2, 0.55, '3 4'));
paths.push(P(ca, pal.accent, 2, 0.95));
const ex = px(rEnd), ey = py(branch(rEnd, up ? 1 : -1)), rx2 = px(rEnd), ry2 = py(branch(rEnd, up ? -1 : 1));
circles.push(C(ex, ey, 6, pal.accent, 1.2, 0.9, 'none'));
circles.push(C(ex, ey, 2.6, 'none', 0, 1, pal.accent));
paths.push(P('M ' + (rx2 - 4).toFixed(1) + ' ' + (ry2 - 4).toFixed(1) + ' L ' + (rx2 + 4).toFixed(1) + ' ' + (ry2 + 4).toFixed(1) + ' M ' + (rx2 - 4).toFixed(1) + ' ' + (ry2 + 4).toFixed(1) + ' L ' + (rx2 + 4).toFixed(1) + ' ' + (ry2 - 4).toFixed(1), pal.ink, 1.3, 0.7));
texts.push(T(x0, y0 - 8, 'r ∈ [' + rMin.toFixed(2) + ', ' + rMax.toFixed(2) + ']', pal.ink));
} else if (type === 'Frame stack') {
const n = 4 + Math.floor(rand() * 2), cx = W / 2, cy = 128; let w = W * 0.6, hh = 156;
for (let i = 0; i < n; i++) { const jx = (rand() - 0.5) * 6, jy = (rand() - 0.5) * 6; const a = i === 0; rects.push(R(cx - w / 2 + jx, cy - hh / 2 + jy, w, hh, a ? pal.accent : pal.ink, a ? 1.6 : 1, a ? 0.75 : 0.22 + (n - i) * 0.08, 'none', 2)); w *= 0.72; hh *= 0.72; }
const topY = cy - 78 - 14, x0 = cx - W * 0.3, x1 = cx + W * 0.3;
paths.push(P('M ' + x0 + ' ' + topY + ' L ' + x0 + ' ' + (topY + 8), pal.ink, 1, 0.4));
paths.push(P('M ' + x1 + ' ' + topY + ' L ' + x1 + ' ' + (topY + 8), pal.ink, 1, 0.4));
paths.push(P('M ' + x0 + ' ' + (topY + 4) + ' L ' + x1 + ' ' + (topY + 4), pal.ink, 1, 0.4));
} else if (type === 'Requirement grid') {
const cell = 46, gap = 12, tw = cell * 3 + gap * 2, x0 = W / 2 - tw / 2, y0 = 120 - tw / 2, filled = Math.floor(rand() * 9);
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const idx = r * 3 + c, x = x0 + c * (cell + gap), y = y0 + r * (cell + gap); if (idx === filled) rects.push(R(x, y, cell, cell, 'none', 0, 0.85, pal.accent, 2)); else rects.push(R(x, y, cell, cell, pal.ink, 1, 0.28 + rand() * 0.15, 'none', 2)); }
} else if (type === 'Branch') {
const cx = 66, cy = 120, rx = W - 66, y1 = 66 + rand() * 24, y2 = 174 - rand() * 24, top = rand() < 0.5, mx = (cx + rx) / 2;
paths.push(P('M ' + cx + ' ' + cy + ' C ' + mx + ' ' + cy + ', ' + mx + ' ' + y1.toFixed(1) + ', ' + rx + ' ' + y1.toFixed(1), top ? pal.accent : pal.ink, top ? 2.2 : 1.2, top ? 0.85 : 0.3));
paths.push(P('M ' + cx + ' ' + cy + ' C ' + mx + ' ' + cy + ', ' + mx + ' ' + y2.toFixed(1) + ', ' + rx + ' ' + y2.toFixed(1), !top ? pal.accent : pal.ink, !top ? 2.2 : 1.2, !top ? 0.85 : 0.3));
circles.push(C(cx, cy, 5, 'none', 0, 0.8, pal.ink));
circles.push(C(rx, y1, top ? 5 : 4, 'none', 0, top ? 0.85 : 0.4, top ? pal.accent : pal.ink));
circles.push(C(rx, y2, !top ? 5 : 4, 'none', 0, !top ? 0.85 : 0.4, !top ? pal.accent : pal.ink));
const ny = top ? y2 : y1;
paths.push(P('M ' + (rx - 6) + ' ' + (ny - 6).toFixed(1) + ' L ' + (rx + 6) + ' ' + (ny + 6).toFixed(1) + ' M ' + (rx - 6) + ' ' + (ny + 6).toFixed(1) + ' L ' + (rx + 6) + ' ' + (ny - 6).toFixed(1), pal.ink, 1.4, 0.55));
} else if (type === 'Gantt') {
for (let x = 36; x <= W - 20; x += 33) paths.push(P('M ' + x + ' 20 L ' + x + ' 222', pal.ink, 1, 0.12));
const bars = [];
for (let i = 0; i < 6; i++) { const yc = 40 + i * 30, start = 36 + rand() * (W - 190), len = Math.min(45 + rand() * (W * 0.36), W - 24 - start), col = rand() < 0.25 ? pal.accent : pal.ink; bars.push({ yc, start, end: start + len }); rects.push(R(start, yc - 6.5, len, 13, 'none', 0, 0.22, col, 2)); rects.push(R(start, yc - 6.5, len, 13, col, 1.1, 0.6, 'none', 2)); }
for (let i = 0; i < 5; i++) if (rand() < 0.6) { const a = bars[i], b = bars[i + 1]; paths.push(P('M ' + a.end.toFixed(1) + ' ' + a.yc + ' L ' + a.end.toFixed(1) + ' ' + b.yc + ' L ' + b.start.toFixed(1) + ' ' + b.yc, pal.ink, 1, 0.4, '3 4')); }
for (let k = 0; k < 2; k++) { const b = bars[Math.floor(rand() * bars.length)], mx = Math.min(b.end + 14, W - 20), my = b.yc; paths.push(P('M ' + mx.toFixed(1) + ' ' + (my - 6) + ' L ' + (mx + 6).toFixed(1) + ' ' + my + ' L ' + mx.toFixed(1) + ' ' + (my + 6) + ' L ' + (mx - 6).toFixed(1) + ' ' + my + ' Z', 'none', 0, 0.8, 'none', pal.accent)); }
} else if (type === 'Radar') {
const cx = W / 2 + (rand() - 0.5) * W * 0.1, cy = 120 + (rand() - 0.5) * 18, sc = W > 400 ? 1.15 : 1;
const radii = [30, 60, 92].map((r) => r * sc * (0.85 + rand() * 0.3));
radii.forEach((r) => circles.push(C(cx, cy, r, pal.ink, 1 + rand() * 0.6, 0.28 + rand() * 0.22, 'none', rand() < 0.4 ? '3 7' : 'none')));
circles.push(C(cx, cy, 5 + rand() * 3, 'none', 0, 0.85, pal.accent));
const nodes = 5 + Math.floor(rand() * 4);
for (let i = 0; i < nodes; i++) { const a = rand() * 6.28, r = radii[Math.floor(rand() * 3)]; circles.push(C(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.5 + rand() * 2, 'none', 0, 0.5 + rand() * 0.3, rand() < 0.4 ? pal.accent : pal.ink)); }
const a0 = rand() * 6.28, sw = 0.7 + rand() * 1.1, r = radii[2];
paths.push(P('M ' + (cx + Math.cos(a0) * r).toFixed(1) + ' ' + (cy + Math.sin(a0) * r).toFixed(1) + ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (cx + Math.cos(a0 + sw) * r).toFixed(1) + ' ' + (cy + Math.sin(a0 + sw) * r).toFixed(1), pal.accent, 2.2, 0.75));
} else if (type === 'Lattice') {
const n = 9 + Math.floor(rand() * 4), nodes = [];
for (let i = 0; i < n; i++) nodes.push({ x: 40 + rand() * (W - 80), y: 26 + rand() * 188 });
for (let i = 0; i < n; i++) { const links = 1 + Math.floor(rand() * 2); for (let l = 0; l < links; l++) { const j = Math.floor(rand() * n); if (j === i) continue; paths.push(P('M ' + nodes[i].x.toFixed(1) + ' ' + nodes[i].y.toFixed(1) + ' L ' + nodes[j].x.toFixed(1) + ' ' + nodes[j].y.toFixed(1), pal.ink, 1, 0.2)); } }
const ringed = Math.floor(rand() * n);
nodes.forEach((nd, i) => { if (i === ringed) { circles.push(C(nd.x, nd.y, 7, pal.accent, 1.6, 0.9, 'none')); circles.push(C(nd.x, nd.y, 3, 'none', 0, 0.9, pal.accent)); } else circles.push(C(nd.x, nd.y, 3 + rand() * 1.5, 'none', 0, 0.45 + rand() * 0.3, pal.ink)); });
} else if (type === 'Scatter') {
paths.push(P('M 36 20 L 36 220', pal.ink, 1, 0.25));
paths.push(P('M 36 220 L ' + (W - 20) + ' 220', pal.ink, 1, 0.25));
const n = 22 + Math.floor(rand() * 10), ox = W - 50, oy = 50;
for (let i = 0; i < n; i++) circles.push(C(46 + rand() * (W - 80), 40 + rand() * 160, 2.2 + rand() * 1.3, 'none', 0, 0.32 + rand() * 0.3, pal.ink));
circles.push(C(ox, oy, 4, 'none', 0, 0.9, pal.accent));
paths.push(P('M ' + (ox - 8) + ' ' + (oy - 12) + ' L ' + (ox - 12) + ' ' + (oy - 12) + ' L ' + (ox - 12) + ' ' + (oy + 12) + ' L ' + (ox - 8) + ' ' + (oy + 12), pal.accent, 1.2, 0.7));
paths.push(P('M ' + (ox + 8) + ' ' + (oy - 12) + ' L ' + (ox + 12) + ' ' + (oy - 12) + ' L ' + (ox + 12) + ' ' + (oy + 12) + ' L ' + (ox + 8) + ' ' + (oy + 12), pal.accent, 1.2, 0.7));
} else if (type === 'Contour') {
const n = 7 + Math.floor(rand() * 3), ai = Math.floor(rand() * n), steps = 6;
for (let i = 0; i < n; i++) {
const baseY = 20 + (i / (n - 1)) * 200, amp = 12 + rand() * 22, drift = 16 + rand() * 36;
let d = 'M 0 ' + baseY.toFixed(1), lx = 0, ly = baseY;
for (let k = 1; k <= steps; k++) { const x = (W / steps) * k, y = baseY + Math.sin(k * 1.3 + i * 0.7) * amp + (x / W) * drift * 0.3; d += ' Q ' + (lx + (x - lx) / 2).toFixed(1) + ' ' + ly.toFixed(1) + ', ' + x.toFixed(1) + ' ' + y.toFixed(1); lx = x; ly = y; }
const isA = i === ai;
paths.push(P(d, isA ? pal.accent : pal.ink, isA ? 1.8 : 1.1, isA ? 0.8 : 0.2 + rand() * 0.18));
if (isA) { const nx = W * (0.55 + rand() * 0.2), stp = nx / (W / steps), ny = baseY + Math.sin(stp * 1.3 + i * 0.7) * amp + (nx / W) * drift * 0.3; circles.push(C(nx, ny, 3.5, 'none', 0, 0.9, pal.accent)); }
}
} else if (type === 'Margin') {
const mxl = W * 0.22;
paths.push(P('M ' + mxl.toFixed(1) + ' 14 L ' + mxl.toFixed(1) + ' 226', pal.accent, 1, 0.5));
for (let y = 30; y < 220; y += 16) paths.push(P('M 20 ' + y + ' L ' + (W - 20) + ' ' + y, pal.ink, 1, 0.12));
let d = 'M 20 120'; for (let x = 40; x < W - 20; x += 28) d += ' L ' + x + ' ' + (120 + (rand() - 0.5) * 40).toFixed(1);
paths.push(P(d, pal.ink, 1.3, 0.5));
for (let i = 0; i < 5; i++) { const y = 40 + rand() * 160; paths.push(P('M ' + (mxl - 8).toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (mxl - 2).toFixed(1) + ' ' + y.toFixed(1), pal.accent, 1, 0.4)); }
} else if (type === 'Drift') {
let done = false;
for (let i = 0; i < 160; i++) { const x = rand() * W, y = 20 + rand() * 200, bias = (1 - x / W) * (y / 220); if (rand() > bias + 0.15) continue; const len = 6 + rand() * 6, a = !done && rand() < 0.03; if (a) done = true; paths.push(P('M ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (x - len * 0.4).toFixed(1) + ' ' + (y + len).toFixed(1), a ? pal.accent : pal.ink, a ? 1.6 : 1, a ? 0.85 : 0.22 + rand() * 0.2)); }
}
return { paths, circles, rects, texts };
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Standalone inline SVG string. Render it inside a <figure class="plate" aria-hidden="true">.
 * preserveAspectRatio slice crops to the container; keep containers near 640x240 (or 480x240 for vbw 480).
 */
export function renderPlateSVG(type, seed, { width = 640, label = '', dots = true } = {}) {
  const art = buildPlate(type, seed, width, label);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">`;
  if (dots) for (let y = 12; y < 240; y += 24) for (let x = 12; x < width; x += 24) s += `<circle cx="${x}" cy="${y}" r="0.9" style="fill: var(--muted); opacity: 0.22"/>`;
  art.rects.forEach((e) => { s += `<rect x="${e.x}" y="${e.y}" width="${e.wd}" height="${e.ht}" rx="${e.rx}" style="${e.style}"/>`; });
  art.paths.forEach((e) => { s += `<path d="${e.d}" style="${e.style}"/>`; });
  art.circles.forEach((e) => { s += `<circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" style="${e.style}"/>`; });
  art.texts.forEach((t) => { s += `<text x="${t.x}" y="${t.y}" style="${t.style}">${esc(t.s)}</text>`; });
  return s + '</svg>';
}
