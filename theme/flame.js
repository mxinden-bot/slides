/*
 * Flame: small flamegraph renderer (SVG), two modes.
 *  - Flame.register(id, rects): decorative silhouette. rects = [x, w, depth, category].
 *  - Flame.registerFlame(id, rects): Brendan-Gregg-style labelled flamegraph.
 *    rects = [x, w, depth, frameName]. Warm "hot" palette, per-frame labels.
 * x/width are fractions 0..1; frames grow upward from the bottom (root at depth 0).
 */
(function () {
  const reg = {};
  const regF = {};
  const CAT = {
    neqo: '#2a78d6', crypto: '#eb6834', io: '#8f8f9d',
    lock: '#4a3aa7', mem: '#1baf7a', other: '#b9b9c4',
  };
  const NS = 'http://www.w3.org/2000/svg';

  // deterministic hash -> [0,1)
  function h01(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ((h >>> 0) % 100000) / 100000;
  }
  // Gregg "hot" palette, keyed by frame name so equal names share a colour
  function hot(name) {
    const r = 205 + Math.round(50 * h01(name + 'r'));
    const g = Math.round(230 * h01(name + 'g'));
    const b = Math.round(55 * h01(name + 'b'));
    return `rgb(${r},${g},${b})`;
  }

  function svgEl(W, H, stretch) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    if (stretch) svg.setAttribute('preserveAspectRatio', 'none');
    return svg;
  }

  // Decorative: no labels, category colours, faint (opacity from CSS)
  function render(el, rects) {
    if (!rects || !rects.length) return;
    const W = el.clientWidth || 1200, H = el.clientHeight || 130;
    const rows = 1 + rects.reduce((m, r) => Math.max(m, r[2]), 0);
    const rowH = H / rows, gap = Math.min(1.4, rowH * 0.14);
    const svg = svgEl(W, H, true);
    for (const [x, w, d, c] of rects) {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', (x * W).toFixed(2));
      r.setAttribute('y', (H - (d + 1) * rowH).toFixed(2));
      r.setAttribute('width', Math.max(0.6, w * W - gap).toFixed(2));
      r.setAttribute('height', Math.max(0.6, rowH - gap).toFixed(2));
      r.setAttribute('rx', '1.5');
      r.setAttribute('fill', CAT[c] || CAT.other);
      svg.appendChild(r);
    }
    el.textContent = '';
    el.appendChild(svg);
  }

  // Brendan-Gregg-style flamegraph: labelled frames, hot palette, hairline borders
  function renderFlame(el, rects) {
    if (!rects || !rects.length) return;
    const W = el.clientWidth || 1000, H = el.clientHeight || 360;
    const rows = 1 + rects.reduce((m, r) => Math.max(m, r[2]), 0);
    const rowH = H / rows;
    const fs = Math.min(12.5, rowH * 0.62);
    const svg = svgEl(W, H, false);
    for (const [x, w, d, name] of rects) {
      const px = x * W, pw = w * W, py = H - (d + 1) * rowH;
      const g = document.createElementNS(NS, 'g');
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', px.toFixed(2));
      r.setAttribute('y', py.toFixed(2));
      r.setAttribute('width', Math.max(0.5, pw).toFixed(2));
      r.setAttribute('height', Math.max(0.5, rowH - 1).toFixed(2));
      r.setAttribute('fill', hot(name));
      r.setAttribute('stroke', 'rgba(255,255,255,0.7)');
      r.setAttribute('stroke-width', '0.6');
      g.appendChild(r);
      const title = document.createElementNS(NS, 'title');
      title.textContent = `${name} (${(w * 100).toFixed(1)}%)`;
      g.appendChild(title);
      if (pw > 34) {
        const maxChars = Math.floor((pw - 6) / (fs * 0.58));
        let label = name;
        if (label.length > maxChars) label = label.slice(0, Math.max(1, maxChars - 1)) + '…';
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', (px + 3).toFixed(2));
        t.setAttribute('y', (py + rowH / 2 + fs * 0.35).toFixed(2));
        t.setAttribute('font-size', fs.toFixed(1));
        t.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
        t.setAttribute('fill', 'rgba(20,8,0,0.92)');
        t.textContent = label;
        g.appendChild(t);
      }
      svg.appendChild(g);
    }
    el.textContent = '';
    el.appendChild(svg);
  }

  window.Flame = {
    register(id, rects) { reg[id] = rects; },
    registerFlame(id, rects) { regF[id] = rects; },
    renderAll() {
      for (const id in reg) { const el = document.getElementById(id); if (el) render(el, reg[id]); }
      for (const id in regF) { const el = document.getElementById(id); if (el) renderFlame(el, regF[id]); }
    },
    render, renderFlame,
  };
})();
