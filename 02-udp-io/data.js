/*
 * Chart data for "Modern UDP I/O for Firefox in Rust".
 * REAL Firefox Nightly telemetry via GLAM (probe networking_http_3_*, v154,
 * ~365k users), plus figures from the blog and FOSDEM 2025.
 */
window.DECK_DATA = {
  glam: 'https://glam.telemetry.mozilla.org/fog/probe/',

  // REAL GLAM networking_http_3_udp_datagram_segments_received:
  // datagrams coalesced into one receive syscall (GRO), by percentile.
  groSegments: { p: ['P50', 'P75', 'P95', 'P99', 'P99.9'], n: [1, 1, 2, 14, 17] },

  // REAL GLAM networking_http_3_udp_datagram_segment_size_received (bytes).
  segSize: { p50: 1217, p95: 1271, p99: 1448 },

  // REAL GLAM networking_http_3_ecn_path_capability (share of connections, %).
  ecnPath: [
    { name: 'capable', value: 58.4 },
    { name: 'bleaching (ECN stripped)', value: 33.0, color: '#eb6834' },
    { name: 'unsent ECT(1)', value: 4.8, color: '#8f8f9d' },
    { name: 'black-hole', value: 3.7, color: '#5b5b66' },
  ],
};
