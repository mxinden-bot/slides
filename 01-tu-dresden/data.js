/*
 * Chart data for the TU Dresden overview deck.
 * All series below are REAL Firefox telemetry, pulled from the public Redash
 * queries behind performance.mozilla.org/networking.html (Jul 2025 - Jul 2026):
 *   DNS P95   -> STMO query 121688 (desktop, US + Canada)
 *   HTTP/3 %  -> STMO query 113403 (desktop, share of responses)
 *   TTRS      -> STMO query 115316 (Fenix / Firefox for Android, P75)
 * plus figures from prior Firefox telemetry decks (adoption, scheme, HEv3).
 */
window.DECK_DATA = {
  // 13 monthly points, Jul 2025 .. Jul 2026 (year shown at the boundaries)
  months: ["Jul '25", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan '26", 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul '26"],

  // REAL - DoH adoption (Global DNS resolution method)
  dohAdoption: [
    { name: 'DoH', value: 11.6 },
    { name: 'OS resolver', value: 88.4, color: '#8f8f9d' },
  ],

  // REAL - Global request scheme
  scheme: [
    { name: 'HTTPS', value: 92.4 },
    { name: 'HTTP (local domain)', value: 5.7 },
    { name: 'HTTP', value: 1.9 },
  ],

  // REAL - HEv3 end-to-end connection latency, Firefox Nightly, from GLAM probe
  // netwerk_happy_eyeballs_end_to_end_time_succeeded (Nightly 154, ~284k users).
  hev3Latency: {
    p: ['5th', '25th', '50th', '75th', '95th', '99th', '99.9th'],
    ms: [13, 40, 74, 161, 603, 2101, 10000],
  },

  // REAL - DNS lookup time (ms), DoH vs OS resolver, US + Canada, P75 and P95.
  // Same four series as performance.mozilla.org's "DNS Lookup Time" chart.
  dohPerf: {
    dohP95: [65.0, 64.1, 63.0, 65.9, 64.4, 65.0, 66.4, 63.7, 62.9, 66.4, 61.4, 58.1, 54.7],
    osP95:  [94.0, 89.7, 89.3, 78.7, 75.1, 74.0, 72.0, 68.4, 66.7, 65.4, 61.6, 62.6, 62.1],
    dohP75: [14.0, 9.4, 7.7, 9.7, 10.3, 9.3, 8.1, 8.0, 7.6, 9.0, 6.6, 4.7, 2.6],
    osP75:  [14.0, 12.6, 11.7, 5.7, 3.4, 2.9, 2.0, 2.1, 1.9, 1.9, 1.0, 1.0, 1.0],
  },

  // REAL - HTTP/3 share of Firefox desktop responses (%). Plateaued ~15-20%.
  h3Adoption: {
    pct: [20.1, 17.9, 18.5, 15.5, 15.1, 15.3, 16.1, 14.9, 14.8, 15.0, 15.9, 16.9, 17.3],
  },

  // REAL - time to request start, P75 (ms), Firefox desktop, by protocol over
  // time (STMO query 114600). Includes DNS lookup + connection setup with TLS.
  ttrs: {
    overall: [116, 118, 117, 118, 110, 110, 107, 108, 107, 108, 108, 110, 108],
    h1: [138, 127, 122, 110, 104, 105, 101, 103, 101, 101, 101, 111, 110],
    h2: [128, 137, 138, 142, 132, 131, 129, 128, 127, 130, 132, 129, 125],
    h3: [64, 61, 63, 70, 65, 64, 64, 64, 64, 64, 63, 63, 66],
  },
};
