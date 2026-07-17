/*
 * Chart data for the MAPRG talk "A Browser's Perspective: Surprises and
 * Insights from Firefox Networking Telemetry". All numbers are real Firefox
 * telemetry pulled from GLAM (glam.telemetry.mozilla.org). Explore URLs are on
 * the slides. Snapshot: mid-2026.
 */
window.DECK_DATA = {
  // GLAM networking_http_response_version, Firefox release: HTTP version of
  // responses received. Splits roughly in thirds.
  httpVersion: [
    { name: 'HTTP/1.1', value: 35, color: '#8f8f9d' },
    { name: 'HTTP/2', value: 35, color: '#2a78d6' },
    { name: 'HTTP/3', value: 30, color: '#1baf7a' },
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

  // GLAM networking_http_3_udp_datagram_segment_size_received, Firefox release,
  // Linux: size of received QUIC datagrams, i.e. the MTU the server sends at.
  segSize: {
    p: ['P5', 'P25', 'P50', 'P75', 'P95', 'P99'],
    bytes: [30, 1166, 1217, 1217, 1448, 1448],
  },

  // GLAM networking_http_3_rtt, Firefox Nightly: smoothed RTT of QUIC connections.
  rtt: {
    p: ['P5', 'P25', 'P50', 'P75', 'P95', 'P99', 'P99.9'],
    ms: [5, 14, 25, 46, 174, 377, 1943],
  },

  // GLAM networking_http_3_ecn_path_capability, Firefox release (label shares via
  // non_norm_histogram): what happened to ECN marks on a QUIC connection's path.
  ecn: [
    { name: 'ECN capable', value: 59.6, color: '#1baf7a' },
    { name: 'bleached', value: 34.6, color: '#eb6834' },
    { name: 'unsent ECT(1)', value: 3.0, color: '#c9c9d1' },
    { name: 'black-holed', value: 2.8, color: '#8f8f9d' },
  ],

  // Share of Firefox page loads over HTTPS, over time. Historical points (2013-2016)
  // are verbatim from Let's Encrypt's historical-https-adoption.csv (HTTP_PAGELOAD_IS_SSL);
  // recent points are the pageload-weighted aggregate of current-https-adoption.csv.
  // Source: https://letsencrypt.org/stats/ .
  httpsAdoption: {
    x: ['2013', '2015', '2016', '2018', '2020', '2022', '2024', '2026'],
    pct: [29, 31, 46, 72, 81, 80, 82, 83],
  },

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
    { name: 'wifi', value: 60.5, color: '#1baf7a' },
    { name: 'cellular', value: 28.8, color: '#2a78d6' },
    { name: 'not reported', value: 10.7, color: '#c9c9d1' },
  ],
};
