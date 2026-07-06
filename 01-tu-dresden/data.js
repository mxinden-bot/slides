/*
 * Chart data for the TU Dresden overview deck.
 *
 * REAL       = measured, sourced from Firefox telemetry / prior decks.
 * ILLUSTRATIVE = shape is representative but the exact numbers are placeholders
 *                pending a real STMO/Redash pull. These are flagged on-slide.
 */
window.DECK_DATA = {
  // REAL - FOSDEM 2026 deck, "Global DNS resolution method"
  dohAdoption: [
    { name: 'DoH', value: 11.6 },
    { name: 'OS resolver', value: 88.4, color: '#8f8f9d' },
  ],

  // REAL - FOSDEM 2026 deck, "Global request scheme"
  scheme: [
    { name: 'HTTPS', value: 92.4 },
    { name: 'HTTP (local domain)', value: 5.7 },
    { name: 'HTTP', value: 1.9 },
  ],

  // REAL - IETF 125 HEv3 deck, "Connection Establishment Latency"
  hev3Latency: {
    p: ['5th', '25th', '50th', '75th', '95th', '99th', '99.9th'],
    ms: [11, 37, 73, 123, 537, 1700, 11000],
  },

  // ILLUSTRATIVE - DoH resolution time P75, US & Canada (needs STMO)
  dohPerf: {
    months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    osResolver: [30, 29, 31, 30, 28, 29],
    doh:        [24, 23, 22, 21, 21, 20],
  },

  // ILLUSTRATIVE - HTTP/3 share of Firefox responses over time (needs STMO)
  h3Adoption: {
    months: ['2023', '2024 H1', '2024 H2', '2025 H1', '2025 H2', '2026'],
    pct:    [19, 22, 25, 27, 29, 31],
  },

  // ILLUSTRATIVE - time to request start by protocol, P75, ms (needs STMO)
  ttrs: {
    labels: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
    ms:     [190, 150, 110],
  },
};
