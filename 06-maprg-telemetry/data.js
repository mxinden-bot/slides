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

  // GLAM networking_http_3_ecn_path_capability, Firefox release: what happened
  // to ECN marks on the path for a QUIC connection.
  ecn: {
    labels: ['ECN bleached', 'ECN capable', 'black-holed'],
    pct: [47.3, 36.8, 15.9],
  },
};
