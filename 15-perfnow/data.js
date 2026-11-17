/*
 * Chart data for "Save a round trip" (performance.now() 2026, Amsterdam).
 */
window.DECK_DATA = {

  // Time series with Firefox release dates (product-details.mozilla.org), pulled 2026-11-17.
  // TLS 1.3 share of TLS handshakes, legacy telemetry SSL_HANDSHAKE_VERSION (parent process),
  // GLAM firefox release, Firefox 91 to 147. The Glean tls_handshake_version (88% in 159)
  // starts at 154 and measures differently, so the two are not spliced.
  tlsSeries: [["2021-08-10", 60.0], ["2021-09-07", 62.6], ["2021-10-05", 61.5], ["2021-11-02", 57.0], ["2021-12-07", 57.3], ["2022-01-11", 58.5], ["2022-02-08", 58.0], ["2022-03-08", 57.6], ["2022-04-05", 58.5], ["2022-05-03", 58.0], ["2022-05-31", 59.0], ["2022-06-28", 58.4], ["2022-07-26", 59.6], ["2022-08-23", 60.5], ["2022-09-20", 63.1], ["2022-10-18", 61.5], ["2022-11-15", 62.5], ["2022-12-13", 61.3], ["2023-01-17", 62.4], ["2023-02-14", 61.9], ["2023-03-14", 63.1], ["2023-04-11", 64.7], ["2023-05-09", 65.0], ["2023-06-06", 69.0], ["2023-07-04", 71.0], ["2023-08-01", 71.8], ["2023-08-29", 71.9], ["2023-09-26", 72.4], ["2023-10-24", 72.4], ["2023-11-21", 73.3], ["2023-12-19", 74.0], ["2024-01-23", 75.0], ["2024-02-20", 76.0], ["2024-03-19", 76.3], ["2024-04-16", 77.2], ["2024-05-14", 78.0], ["2024-06-11", 78.7], ["2024-07-09", 79.2], ["2024-08-06", 79.9], ["2024-09-03", 80.1], ["2024-10-01", 80.2], ["2024-10-29", 80.8], ["2024-11-26", 81.1], ["2025-01-07", 80.8], ["2025-02-04", 81.0], ["2025-03-04", 81.2], ["2025-04-01", 82.0], ["2025-04-29", 82.1], ["2025-05-27", 82.3], ["2025-06-24", 82.5], ["2025-07-22", 82.0], ["2025-08-19", 82.5], ["2025-09-16", 82.7], ["2025-10-14", 82.6], ["2025-11-11", 82.9], ["2025-12-09", 83.1], ["2026-01-13", 83.1]],
  // IPv6 share of HTTP requests and HTTP/3 share of HTTP responses, Glean, GLAM fog release,
  // Firefox 150 to 159. Older versions in GLAM come from a different aggregation that does
  // not match where they overlap, so they are left out. Longer history needs STMO.
  ipv6Series: [["2026-04-21", 26.2], ["2026-05-19", 26.0], ["2026-06-16", 25.0], ["2026-07-21", 24.9], ["2026-08-18", 25.4], ["2026-09-01", 24.8], ["2026-09-15", 24.9], ["2026-09-29", 25.3], ["2026-10-13", 24.7], ["2026-10-27", 23.9]],
  h3Series: [["2026-04-21", 25.0], ["2026-05-19", 24.6], ["2026-06-16", 27.5], ["2026-07-21", 27.8], ["2026-08-18", 30.0], ["2026-09-01", 28.8], ["2026-09-15", 29.9], ["2026-09-29", 30.2], ["2026-10-13", 30.6], ["2026-10-27", 32.7]],
  // networking.http_3_rtt, Firefox 159 Release, pooled over connections: cumulative share
  // of connections at or below each bucket bound (ms). 50.75% at 25 ms.
  rttCdf: [[1.0, 0.01], [2.0, 0.1], [3.0, 0.4], [4.0, 1.01], [5.0, 1.94], [6.0, 3.2], [7.0, 4.82], [8.0, 6.75], [9.0, 8.91], [10.0, 11.26], [11.0, 13.75], [12.0, 16.33], [13.0, 18.98], [14.0, 21.68], [15.0, 24.43], [16.0, 27.21], [17.0, 30.0], [18.0, 32.79], [19.0, 35.55], [21.0, 40.94], [23.0, 46.04], [25.0, 50.75], [27.0, 55.05], [29.0, 58.92], [31.0, 62.39], [34.0, 66.95], [37.0, 70.83], [40.0, 74.13], [43.0, 76.95], [46.0, 79.35], [50.0, 82.0], [54.0, 84.16], [58.0, 85.92], [63.0, 87.71], [68.0, 89.16], [74.0, 90.55], [80.0, 91.65], [86.0, 92.53], [93.0, 93.36], [101.0, 94.12], [109.0, 94.73], [118.0, 95.3], [128.0, 95.83], [138.0, 96.28], [149.0, 96.68], [161.0, 97.05], [174.0, 97.38], [188.0, 97.68], [203.0, 97.94], [219.0, 98.18], [237.0, 98.4], [256.0, 98.6], [277.0, 98.78], [299.0, 98.94], [323.0, 99.06], [349.0, 99.17], [377.0, 99.26], [408.0, 99.33], [441.0, 99.4], [477.0, 99.46], [516.0, 99.51], [558.0, 99.56], [603.0, 99.6], [652.0, 99.64], [705.0, 99.68], [762.0, 99.71], [824.0, 99.75], [891.0, 99.77], [963.0, 99.8], [1041.0, 99.82], [1125.0, 99.84], [1216.0, 99.85], [1315.0, 99.87], [1422.0, 99.88], [1537.0, 99.9], [1662.0, 99.91], [1797.0, 99.92], [1943.0, 99.93], [2101.0, 99.93]],
  // GLAM fog, Firefox Release, all OS, Firefox 159, pulled 2026-11-10.
  // networking.http_3_rtt: smoothed RTT of QUIC connections, sampled at close (ms).
  rtt: { p50: 29, p75: 54, p95: 219, p99: 516 },
  // Same metric, pooled histogram over all connections (not per-client), bucketed.
  // Median connection falls in the 23 to 25 ms bucket. 27.0B samples.
  rttHist: {
    x: ['< 10 ms', '10 to 25', '25 to 50', '50 to 100', '100 to 200', '200 to 500', '500+'],
    v: [11.3, 39.5, 31.2, 12.1, 3.8, 1.6, 0.5],
  },

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
  // GLAM fog tls_handshake_version, Firefox Release 159, share of TLS handshakes:
  // TLS 1.3 88.17%, TLS 1.2 11.80%, TLS 1.0 0.02%.
  tls13: 88.2,
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
    // Largest contentful paint, same experiment and window, exact percentiles.
    // 5,893,143 (control) and 6,119,675 (HEv3) page loads. p99 and above left out:
    // there LCP measures how long a page stays open, not loading speed.
    lcp: {
      p:       ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P90', 'P95'],
      control: [219, 302, 490, 941, 1883, 2931, 4270, 10711],
      hev3:    [218, 302, 483, 928, 1860, 2886, 4196, 10390],
      diff:    [-0.46, 0.00, -1.43, -1.38, -1.22, -1.54, -1.73, -3.00],
    },
  },
};
