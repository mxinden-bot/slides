/*
 * Chart data for "Save a round trip" (performance.now() 2026, Amsterdam).
 */
window.DECK_DATA = {
  // GLAM fog, Firefox Release, all OS, Firefox 159, pulled 2026-11-10.
  // networking.http_3_rtt: smoothed RTT of QUIC connections, sampled at close (ms).
  rtt: { p50: 29, p75: 54, p95: 219, p99: 516 },

  // GLAM fog, Firefox Release, Firefox 159, desktop page loads not served from cache,
  // to servers that speak HTTP/3 (netwerk/base/nsLoadGroup.cpp).
  //   TCP + TLS: network.sup_http3_tcp_connection[supports_http3_page], HTTP/2 to a
  //              server that advertises h3, connectEnd - connectStart.
  //   QUIC:      network.http3_tls_handshake[uses_http3_page], connectEnd - secureConnectionStart.
  setup: {
    p: ['P50', 'P75', 'P95'],
    tcp: [73, 134, 492],
    quic: [40, 73, 226],
  },

  // GLAM fog, Firefox Release, all OS, by version, pulled 2026-11-15. Share of HTTP
  // requests. Firefox 160 left out (still accumulating).
  versions: ['v152', 'v153', 'v154', 'v155', 'v156', 'v157', 'v158', 'v159'],
  // networking.connection_address_type: IP family per HTTP transaction.
  ipv6: [25.0, 24.9, 25.4, 24.8, 24.9, 25.3, 24.7, 23.9],
  ipv4: [75.0, 75.1, 74.6, 75.2, 75.1, 74.7, 75.3, 76.1],
  // networking.http_response_version.
  h1: [21.2, 20.7, 20.2, 20.8, 20.6, 20.7, 20.8, 18.1],
  h2: [51.3, 51.5, 49.7, 50.4, 49.5, 49.0, 48.6, 49.3],
  h3: [27.5, 27.8, 30.0, 28.8, 29.9, 30.2, 30.6, 32.7],

  // Release experiment happy-eyeballs-v3-release-v2, Firefox 160, 5% of Release per
  // branch, 2026-11-05 -> 11-13, page loads whose main document opened a new connection.
  // Same numbers as the IETF 127 deck.
  release: {
    version: {
      x: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
      control: [26.7, 53.8, 19.6],
      hev3:    [25.8, 49.7, 24.6],
    },
    p:    ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P90', 'P95', 'P99'],
    diff: [-0.59, -1.84, -3.32, -2.72, -2.33, -2.24, -2.07, -1.87, -3.63],
  },
};
