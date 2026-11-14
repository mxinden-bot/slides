/*
 * Chart data for "Happy Eyeballs v3 in Firefox: partial rollout report" (IETF 127, HAPPY).
 */
window.DECK_DATA = {
  // Beta A/B experiment (happyeyeballsv3), 2026-07-30 -> 08-18, control vs HEv3,
  // ~46M successful runs/day. Numbers from Kershaw Chang (STMO 124764, 124709).
  beta: {
    // Share of page loads over HTTP/3, by DoH segment.
    h3: {
      x: ['Overall', 'DoH enabled', 'DoH disabled'],
      control: [11.45, 16.62, 11.12],
      hev3:    [13.22, 27.93, 12.23],
    },
    // Time to request start: HEv3 change vs control (%), by DoH segment.
    ttrs: {
      p:     ['P25', 'P50', 'P75', 'P90', 'P95', 'P99'],
      doh:   [-7.5, -8.0, -1.0, -7.5, -11.1, -21.7],
      nodoh: [2.3, 9.6, 1.4, -1.3, -0.3, -0.6],
    },
  },

  // Release A/B experiment happy-eyeballs-v3-release-v2, Firefox 160, 5% of Release
  // per branch (~1.17M clients each), pageloads 2026-11-05 -> 11-13 whose main
  // document opened a new connection. First Contentful Paint, ms.
  release: {
    p:       ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P90', 'P95', 'P99'],
    control: [170, 217, 361, 661, 1201, 1693, 2172, 3321, 11222],
    hev3:    [169, 213, 349, 643, 1173, 1655, 2127, 3259, 10815],
    diff:    [-0.59, -1.84, -3.32, -2.72, -2.33, -2.24, -2.07, -1.87, -3.63],
  },

  // netwerk.happy_eyeballs_dns_answer_spread_v2, until_first_attempt: time between the
  // first and last positive DNS answer before the first connection attempt. Runs per
  // histogram bucket (lower bound, ms), Firefox Nightly 162, 2026-11-05 -> 11-13, 395M runs.
  // The 23.73 ms bucket holds the 25 ms Resolution Delay; above it, late timers.
  spread: {
    bucket:  ['14.1', '15.4', '16.8', '18.3', '20.0', '21.8', '23.7', '25.9', '28.2', '30.8', '33.6', '36.6', '39.9', '43.5'],
    nightly: [343989, 349743, 337774, 333551, 323444, 304083, 265997, 83893, 57110, 50832, 45739, 40808, 36240, 32241],
  },
};
