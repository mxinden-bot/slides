/*
 * Flame: a tiny decorative flamegraph renderer (SVG). Data is a flat list of
 * [x, width, depth, category] rectangles (x/width in 0..1), laid out growing
 * upward from the bottom. Used as a subtle cover-slide background.
 */
(function () {
  const reg = {};
  const COLORS = {
    neqo: '#2a78d6', crypto: '#eb6834', io: '#8f8f9d',
    lock: '#4a3aa7', mem: '#1baf7a', other: '#b9b9c4',
  };
  function render(el, rects) {
    if (!rects || !rects.length) return;
    const W = el.clientWidth || 1200;
    const H = el.clientHeight || 130;
    const rows = 1 + rects.reduce((m, r) => Math.max(m, r[2]), 0);
    const rowH = H / rows;
    const gap = Math.min(1.4, rowH * 0.14);
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    for (const [x, w, d, c] of rects) {
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', (x * W).toFixed(2));
      r.setAttribute('y', (H - (d + 1) * rowH).toFixed(2));
      r.setAttribute('width', Math.max(0.6, w * W - gap).toFixed(2));
      r.setAttribute('height', Math.max(0.6, rowH - gap).toFixed(2));
      r.setAttribute('rx', '1.5');
      r.setAttribute('fill', COLORS[c] || COLORS.other);
      svg.appendChild(r);
    }
    el.textContent = '';
    el.appendChild(svg);
  }
  window.Flame = {
    register(id, rects) { reg[id] = rects; },
    renderAll() {
      for (const id in reg) {
        const el = document.getElementById(id);
        if (el) render(el, reg[id]);
      }
    },
    render,
  };
})();
