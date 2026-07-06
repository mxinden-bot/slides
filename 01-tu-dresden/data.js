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
  // 13 monthly points, Jul 2025 .. Jul 2026
  months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],

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

  // REAL - HEv3 connection-establishment latency percentiles (IETF 125 update)
  hev3Latency: {
    p: ['5th', '25th', '50th', '75th', '95th', '99th', '99.9th'],
    ms: [11, 37, 73, 123, 537, 1700, 11000],
  },

  // REAL - DNS resolution time P95 (ms), DoH vs OS resolver, US + Canada.
  // DoH is consistently faster than the OS resolver at the tail.
  dohPerf: {
    doh: [65.0, 64.1, 63.0, 65.9, 64.4, 65.0, 66.4, 63.7, 62.9, 66.4, 61.4, 58.1, 54.7],
    osResolver: [94.0, 89.7, 89.3, 78.7, 75.1, 74.0, 72.0, 68.4, 66.7, 65.4, 61.6, 62.6, 62.1],
  },

  // REAL - HTTP/3 share of Firefox desktop responses (%). Plateaued ~15-20%.
  h3Adoption: {
    pct: [20.1, 17.9, 18.5, 15.5, 15.1, 15.3, 16.1, 14.9, 14.8, 15.0, 15.9, 16.9, 17.3],
  },

  // REAL - time to request start, P75 (ms), Firefox for Android, by protocol.
  ttrs: {
    labels: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
    ms: [303, 266, 119],
  },
};
