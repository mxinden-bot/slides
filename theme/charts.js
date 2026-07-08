/*
 * Shared charting helper for all decks. Wraps ECharts (SVG renderer, so charts
 * stay crisp in the exported PDF) with one consistent theme derived from the CSS
 * custom properties in theme.css. Decks call e.g. Charts.line(el, {...}).
 *
 * Design rules baked in (from the dataviz method):
 *   - categorical series use the validated --c1..--c7 palette in fixed order
 *   - never a dual y-axis
 *   - recessive grid/axes, thin marks, direct series labels where room allows
 *   - a legend whenever there are >= 2 series
 */
(function () {
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);

  const INK        = v('--ink', '#1c1b22');
  const INK_MUTED  = v('--ink-muted', '#5b5b66');
  const INK_FAINT  = v('--ink-faint', '#8f8f9d');
  const HAIRLINE   = v('--hairline', '#d7d7db');
  const SURFACE    = v('--surface', '#ffffff');
  const FONT       = v('--font-sans', 'Inter, system-ui, sans-serif');

  const PALETTE = ['--c1','--c2','--c3','--c4','--c5','--c6','--c7']
    .map((n) => v(n)).filter(Boolean);
  const OTHER = v('--c-other', '#8f8f9d');

  const AXIS_FS  = 15;
  const LABEL_FS = 15;

  function make(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    // dispose any previous instance (idempotent re-render on resize/print)
    const prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();
    return echarts.init(el, null, { renderer: 'svg' });
  }

  const baseGrid = { left: 8, right: 24, top: 28, bottom: 8, containLabel: true };

  function axisCommon(name) {
    return {
      name: name || undefined,
      nameTextStyle: { color: INK_MUTED, fontSize: AXIS_FS, fontFamily: FONT, fontWeight: 600 },
      axisLine: { lineStyle: { color: HAIRLINE } },
      axisTick: { show: false },
      axisLabel: { color: INK_FAINT, fontSize: AXIS_FS, fontFamily: FONT },
      splitLine: { show: true, lineStyle: { color: HAIRLINE, type: [2, 4] } },
    };
  }

  function tooltip(extra) {
    return Object.assign({
      trigger: 'axis',
      backgroundColor: SURFACE,
      borderColor: HAIRLINE,
      borderWidth: 1,
      textStyle: { color: INK, fontFamily: FONT, fontSize: 15 },
      axisPointer: { type: 'line', lineStyle: { color: INK_FAINT, width: 1 } },
    }, extra || {});
  }

  function legend(show) {
    return {
      show: show,
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 14, itemHeight: 8, itemGap: 18,
      textStyle: { color: INK_MUTED, fontFamily: FONT, fontSize: LABEL_FS },
    };
  }

  /*
   * Line chart.
   *   { x: [...], series: [{name, data, color?, area?, dashed?}], yName, xName,
   *     yFormatter?, endLabels? (direct label at line end, default true when <=4 series),
   *     yMax?, smooth? }
   */
  function line(el, o) {
    const chart = make(el);
    const multi = o.series.length >= 2;
    const endLabels = o.endLabels !== undefined ? o.endLabels : (o.series.length <= 4);
    const series = o.series.map((s, i) => {
      const color = s.color || PALETTE[i % PALETTE.length];
      return {
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: o.smooth || false,
        showSymbol: false,
        symbolSize: 8,
        emphasis: { focus: 'series' },
        lineStyle: { width: 2.5, color, type: s.dashed ? 'dashed' : 'solid' },
        itemStyle: { color },
        areaStyle: s.area ? { color, opacity: 0.10 } : undefined,
        endLabel: endLabels ? {
          show: true, formatter: s.name, color, fontFamily: FONT,
          fontSize: LABEL_FS, fontWeight: 600, distance: 8,
        } : undefined,
      };
    });
    chart.setOption({
      animation: false,
      color: PALETTE,
      grid: Object.assign({}, baseGrid, { right: endLabels ? 128 : 24 }),
      tooltip: tooltip({ valueFormatter: o.yFormatter }),
      legend: legend(multi && !endLabels),
      xAxis: Object.assign(axisCommon(o.xName), {
        type: 'category', boundaryGap: false, data: o.x,
        splitLine: { show: false },
      }),
      yAxis: Object.assign(axisCommon(o.yName), {
        type: 'value', max: o.yMax,
        axisLabel: { color: INK_FAINT, fontSize: AXIS_FS, fontFamily: FONT,
          formatter: o.yFormatter },
      }),
      series,
    });
    return chart;
  }

  /* Vertical bar chart. { x, series:[{name,data,color?}], yName, yFormatter?, stack? } */
  function bar(el, o) {
    const chart = make(el);
    const multi = o.series.length >= 2;
    const series = o.series.map((s, i) => {
      const color = s.color || PALETTE[i % PALETTE.length];
      return {
        name: s.name, type: 'bar',
        stack: o.stack ? 'total' : undefined,
        data: s.data,
        barMaxWidth: 54,
        itemStyle: { color, borderRadius: o.stack ? 0 : [4, 4, 0, 0],
          borderColor: SURFACE, borderWidth: o.stack ? 1.5 : 0 },
        emphasis: { focus: 'series' },
        label: o.barLabels ? { show: true, position: o.stack ? 'inside' : 'top',
          color: o.stack ? '#fff' : INK_MUTED, fontFamily: FONT, fontSize: LABEL_FS,
          formatter: o.barLabelFormatter || undefined } : undefined,
      };
    });
    if (o.refLine != null && series[0]) {
      series[0].markLine = {
        silent: true, symbol: 'none',
        lineStyle: { color: INK_FAINT, type: 'dashed', width: 1.5 },
        label: { formatter: o.refLineLabel || String(o.refLine), color: INK_MUTED,
          fontFamily: FONT, fontSize: LABEL_FS, position: 'insideEndTop' },
        data: [{ yAxis: o.refLine }],
      };
    }
    chart.setOption({
      animation: false,
      color: PALETTE,
      grid: baseGrid,
      tooltip: tooltip({ trigger: 'axis', axisPointer: { type: 'shadow' },
        valueFormatter: o.yFormatter }),
      legend: legend(multi),
      xAxis: Object.assign(axisCommon(o.xName), { type: 'category', data: o.x,
        splitLine: { show: false } }),
      yAxis: Object.assign(axisCommon(o.yName), { type: o.yType || 'value',
        max: o.yMax, min: o.yMin,
        axisLabel: { color: INK_FAINT, fontSize: AXIS_FS, fontFamily: FONT,
          formatter: o.yFormatter } }),
      series,
    });
    return chart;
  }

  /* Horizontal bar. { y:[labels], data:[...], colorByIndex?, yName?, valueFormatter? } */
  function barH(el, o) {
    const chart = make(el);
    chart.setOption({
      animation: false,
      color: PALETTE,
      grid: Object.assign({}, baseGrid, { left: 8 }),
      tooltip: tooltip({ trigger: 'axis', axisPointer: { type: 'shadow' },
        valueFormatter: o.valueFormatter }),
      xAxis: Object.assign(axisCommon(o.xName), { type: 'value', max: o.xMax,
        axisLabel: { color: INK_FAINT, fontSize: AXIS_FS, fontFamily: FONT,
          formatter: o.valueFormatter } }),
      yAxis: Object.assign(axisCommon(), { type: 'category', data: o.y,
        inverse: true, splitLine: { show: false } }),
      series: [{
        type: 'bar', data: o.data.map((val, i) => ({ value: val,
          itemStyle: { color: o.colorByIndex ? PALETTE[i % PALETTE.length] : PALETTE[0] } })),
        barMaxWidth: 40,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: INK_MUTED, fontFamily: FONT,
          fontSize: LABEL_FS, formatter: (p) => (o.valueFormatter ? o.valueFormatter(p.value) : p.value) },
      }],
    });
    return chart;
  }

  /* Donut. { data:[{name,value,color?}], centerLabel?, centerValue? } */
  function donut(el, o) {
    const chart = make(el);
    const data = o.data.map((d, i) => ({
      name: d.name, value: d.value,
      itemStyle: { color: d.color || PALETTE[i % PALETTE.length],
        borderColor: SURFACE, borderWidth: 2 },
    }));
    chart.setOption({
      animation: false,
      tooltip: Object.assign(tooltip({ trigger: 'item' }),
        { formatter: o.tooltipFormatter || '{b}: {d}%' }),
      legend: Object.assign(legend(true), { top: 'middle', right: 0, orient: 'vertical',
        itemGap: 14 }),
      series: [{
        type: 'pie', radius: ['58%', '82%'], center: o.center || ['38%', '52%'],
        avoidLabelOverlap: true,
        label: { show: !!o.sliceLabels, formatter: '{d}%', color: INK, fontFamily: FONT,
          fontSize: LABEL_FS, fontWeight: 600 },
        labelLine: { show: !!o.sliceLabels },
        data,
        emphasis: { scaleSize: 6 },
      }],
      graphic: (o.centerValue ? [{
        type: 'text', left: '35%', top: '44%', style: {
          text: o.centerValue, fill: INK, fontFamily: FONT, fontSize: 40, fontWeight: 800,
          textAlign: 'center' },
      }, {
        type: 'text', left: '35%', top: '56%', style: {
          text: o.centerLabel || '', fill: INK_MUTED, fontFamily: FONT, fontSize: 15,
          textAlign: 'center' },
      }] : undefined),
    });
    return chart;
  }

  /* Stacked area (100% or absolute). Same shape as line + {percent?} */
  function area(el, o) {
    const chart = make(el);
    const total = o.x.map((_, xi) => o.series.reduce((a, s) => a + (s.data[xi] || 0), 0));
    const series = o.series.map((s, i) => {
      const color = s.color || PALETTE[i % PALETTE.length];
      const data = o.percent ? s.data.map((d, xi) => +(100 * d / total[xi]).toFixed(2)) : s.data;
      return {
        name: s.name, type: 'line', stack: 'total', data,
        smooth: false, showSymbol: false,
        lineStyle: { width: 0 },
        areaStyle: { color, opacity: 0.9 },
        emphasis: { focus: 'series' },
        itemStyle: { color, borderColor: SURFACE, borderWidth: 1 },
      };
    });
    chart.setOption({
      animation: false,
      color: PALETTE,
      grid: baseGrid,
      tooltip: tooltip({ valueFormatter: o.yFormatter }),
      legend: legend(true),
      xAxis: Object.assign(axisCommon(o.xName), { type: 'category', boundaryGap: false,
        data: o.x, splitLine: { show: false } }),
      yAxis: Object.assign(axisCommon(o.yName), { type: 'value',
        max: o.percent ? 100 : o.yMax,
        axisLabel: { color: INK_FAINT, fontSize: AXIS_FS, fontFamily: FONT,
          formatter: o.percent ? '{value}%' : o.yFormatter } }),
      series,
    });
    return chart;
  }

  // Re-fit every chart on load and resize (reveal scales slides via transform,
  // so we render at the slide's intrinsic pixel size).
  const instances = () => document.querySelectorAll('[data-chart]');

  window.Charts = {
    line, bar, barH, donut, area,
    palette: PALETTE, other: OTHER,
    // Render all [data-chart] elements once the deck is ready. Each element's
    // render function is registered by the deck via Charts.register(id, fn).
    _registry: {},
    register(id, fn) { this._registry[id] = fn; },
    renderAll() {
      Object.entries(this._registry).forEach(([id, fn]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.clientWidth > 0) { fn(el); return; }
        // Slide not laid out yet (e.g. mid-transition on direct navigation):
        // retry until it has a size, so the chart never renders empty.
        let tries = 0;
        const retry = () => {
          if (el.clientWidth > 0) fn(el);
          else if (tries++ < 20) setTimeout(retry, 50);
        };
        setTimeout(retry, 50);
      });
    },
  };
})();
