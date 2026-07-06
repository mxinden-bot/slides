/*
 * Tiny SVG sequence-diagram renderer, themed to match the deck. Same visual
 * language as savearoundtrip.com's Mermaid diagrams (client/server lifelines,
 * arrows, spanning notes) but self-contained and crisp in the exported PDF.
 *
 *   Seq.render(el, {
 *     actors: [{id:'C', label:'Client'}, {id:'S', label:'Server'}],
 *     messages: [
 *       { from:'C', to:'S', text:'TCP SYN' },
 *       { from:'S', to:'C', text:'SYN-ACK', dashed:true },
 *       { note:'client learns h3 only now', over:['C','S'] },
 *       { from:'C', to:'S', text:'GET request', hl:true },
 *     ],
 *   });
 */
(function () {
  const css = getComputedStyle(document.documentElement);
  const v = (n, f) => (css.getPropertyValue(n).trim() || f);
  const INK = v('--ink', '#1c1b22'), MUTED = v('--ink-muted', '#5b5b66'),
        HAIR = v('--hairline', '#d7d7db'), SURF = v('--surface', '#ffffff'),
        FONT = v('--font-sans', 'system-ui, sans-serif'), ACC = v('--accent', '#e66000');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function render(el, spec) {
    if (typeof el === 'string') el = document.querySelector(el);
    const actors = spec.actors, msgs = spec.messages;
    const W = el.clientWidth || 560;
    const padX = 16, topH = 40, rowH = 34, noteH = 28, botPad = 14;
    const n = actors.length, laneW = (W - 2 * padX) / n;
    const cx = (i) => padX + laneW * (i + 0.5);
    const idx = {}; actors.forEach((a, i) => { idx[a.id] = i; });
    const H = topH + msgs.reduce((h, m) => h + (m.note ? noteH + 6 : rowH), 0) + botPad;

    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" font-family="${FONT}">`;
    s += `<defs><marker id="seqah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">`
      + `<path d="M0,0 L7,3 L0,6 Z" fill="${MUTED}"/></marker>`
      + `<marker id="seqahA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">`
      + `<path d="M0,0 L7,3 L0,6 Z" fill="${ACC}"/></marker></defs>`;

    // lifelines + actor heads
    actors.forEach((a, i) => {
      const x = cx(i);
      s += `<line x1="${x}" y1="${topH}" x2="${x}" y2="${H - botPad}" stroke="${HAIR}" stroke-width="1.5"/>`;
      s += `<rect x="${x - laneW * 0.44}" y="6" width="${laneW * 0.88}" height="26" rx="6" fill="${SURF}" stroke="${HAIR}"/>`;
      s += `<text x="${x}" y="23" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${esc(a.label)}</text>`;
    });

    let y = topH + 6;
    msgs.forEach((m) => {
      if (m.note) {
        const ids = (m.over || actors.map((a) => a.id)).map((id) => idx[id]);
        const x1 = cx(Math.min(...ids)) - laneW * 0.34, x2 = cx(Math.max(...ids)) + laneW * 0.34;
        s += `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${noteH}" rx="5" fill="rgba(230,96,0,0.08)" stroke="rgba(230,96,0,0.30)"/>`;
        s += `<text x="${(x1 + x2) / 2}" y="${y + noteH / 2 + 4}" text-anchor="middle" font-size="12" fill="${ACC}">${esc(typeof m.note === 'string' ? m.note : m.text)}</text>`;
        y += noteH + 6; return;
      }
      const xa = cx(idx[m.from]), xb = cx(idx[m.to]);
      const yy = y + rowH - 12, dir = xb >= xa ? 1 : -1;
      const col = m.hl ? ACC : MUTED, mark = m.hl ? 'seqahA' : 'seqah';
      s += `<text x="${(xa + xb) / 2}" y="${yy - 6}" text-anchor="middle" font-size="12.5" `
        + `fill="${m.hl ? ACC : INK}" font-weight="${m.hl ? 700 : 400}">${esc(m.text)}</text>`;
      s += `<line x1="${xa + dir * 2}" y1="${yy}" x2="${xb - dir * 6}" y2="${yy}" stroke="${col}" `
        + `stroke-width="1.6" ${m.dashed ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#${mark})"/>`;
      y += rowH;
    });
    s += '</svg>';
    el.innerHTML = s;
  }

  window.Seq = {
    render, _reg: {},
    register(id, fn) { this._reg[id] = fn; },
    renderAll() {
      Object.entries(this._reg).forEach(([id, fn]) => {
        const el = document.getElementById(id);
        if (el && el.clientWidth > 0) fn(el);
      });
    },
  };
})();
