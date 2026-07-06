/*
 * Chart data for "Modern UDP I/O for Firefox in Rust".
 * REAL Firefox Nightly telemetry via GLAM (probe networking_http_3_*, v154,
 * ~365k users), plus figures from the blog and FOSDEM 2025.
 */
window.DECK_DATA = {
  glam: 'https://glam.telemetry.mozilla.org/fog/probe/',

  // REAL GLAM networking_http_3_udp_datagram_segments_received, Firefox for
  // Android (Fenix), which enables GRO. Windows is excluded: it does not do GRO,
  // and it dominates the all-platform aggregate with 1s.
  groSegments: { p: ['P50', 'P75', 'P95', 'P99', 'P99.9'], n: [1, 1, 4, 14, 46] },

  // REAL GLAM networking_http_3_udp_datagram_segment_size_received, Fenix (bytes).
  segSize: { p50: 1217, p95: 1271, p99: 1448 },

  // REAL GLAM networking_http_3_ecn_path_capability (share of connections, %).
  ecnPath: [
    { name: 'capable', value: 58.4 },
    { name: 'bleaching (ECN stripped)', value: 33.0, color: '#eb6834' },
    { name: 'unsent ECT(1)', value: 4.8, color: '#8f8f9d' },
    { name: 'black-hole', value: 3.7, color: '#5b5b66' },
  ],
};
