/*
 * Chart data for the MAPRG talk "A Browser's Perspective: Surprises and
 * Insights from Firefox Networking Telemetry". All numbers are real Firefox
 * telemetry pulled from GLAM (glam.telemetry.mozilla.org). Explore URLs are on
 * the slides. Snapshot: mid-2026.
 */
window.DECK_DATA = {
  // performance.mozilla.org (STMO query 113403), Firefox desktop top-level page
  // loads, 7-day moving avg 2026-07-16. Derives from the Glean perf.page_load event.
  httpVersion: [
    { name: 'HTTP/1.1', value: 35.0, color: '#8f8f9d' },
    { name: 'HTTP/2', value: 47.5, color: '#2a78d6' },
    { name: 'HTTP/3', value: 17.5, color: '#1baf7a' },
  ],

  // GLAM netwerk_happy_eyeballs_h3_discovery, Firefox Nightly (how a connection
  // learns it can use HTTP/3). ~42% of connections are offered h3 at all.
  discovery: [
    { name: 'no h3 offered', value: 58.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 35.0, color: '#eb6834' },
    { name: 'both', value: 3.8, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 2.9, color: '#1baf7a' },
  ],

  // GLAM netwerk_happy_eyeballs_https_rr_features: of connections that saw an
  // HTTPS record, what the record carried.
  httpsRr: {
    labels: ['h3 ALPN', 'ipv4hint', 'ipv6hint', 'ECH'],
    pct: [79.5, 54.4, 51.2, 16.3],
  },

  // GLAM networking_http_3_udp_datagram_segment_size_received (release, all OSes):
  // received QUIC datagram size = the size the server sends at. Percentile level
  // (%) -> datagram size (bytes); drawn as a CDF through these points. The low
  // tail (P5 ~ 30 B) is ACK-sized control traffic; the mass sits at 1217 B and
  // the ceiling is 1448 B, just under the 1500-byte Ethernet MTU.
  mtu: {
    pct:   [1, 5, 25, 50, 75, 95, 99],
    bytes: [26, 30, 724, 1217, 1217, 1448, 1448],
  },

  // GLAM networking_http_3_rtt (Nightly): smoothed RTT of QUIC connections.
  // Percentile level (%) -> RTT (ms); drawn as a CDF through these points.
  rtt: {
    pct: [0.1, 1, 5, 25, 50, 75, 95, 99, 99.9],
    ms:  [1,   3, 5, 14, 25, 46, 174, 377, 1797],
  },

  // GLAM networking_http_3_ecn_path_capability, Firefox release (client-normalized
  // label shares, latest datapoint): what happened to ECN marks on a QUIC path.
  ecn: [
    { name: 'ECN capable', value: 61.5, color: '#1baf7a' },
    { name: 'removed', value: 36.4, color: '#eb6834' },
    { name: 'black-holed', value: 2.08, color: '#8f8f9d' },
    { name: 'unsent ECT(1)', value: 0.02, color: '#c9c9d1' },
  ],


  // Firefox desktop OS mix, data.firefox.com/dashboard/hardware, snapshot 2026-07-06.
  osMix: [
    { name: 'Windows 11', value: 48.4, color: '#2a78d6' },
    { name: 'Windows 10', value: 30.8, color: '#7ea9dd' },
    { name: 'Windows (older)', value: 6.2, color: '#8f8f9d' },
    { name: 'macOS', value: 8.5, color: '#1baf7a' },
    { name: 'Linux', value: 6.1, color: '#eb6834' },
  ],

  // Firefox Android navigations by network type (7-day avg), performance.mozilla.org
  // (STMO query 115600). ethernet/unknown (<0.1%) folded into 'not reported'.
  netType: [
    { name: 'wifi', value: 60, color: '#1baf7a' },
    { name: 'cellular', value: 29, color: '#2a78d6' },
    { name: 'not reported', value: 11, color: '#c9c9d1' },
  ],
};
