/*
 * Chart data for "Rollout of Happy Eyeballs v3 in Firefox".
 * Every window.DECK_DATA series is REAL Firefox Nightly telemetry, read from
 * GLAM (probe netwerk_happy_eyeballs_*, aggregationLevel=version). Each metric
 * gets its own slide; the source link on each slide is its GLAM explore page.
 */
window.DECK_DATA = {
  glam: 'https://glam.telemetry.mozilla.org/fog/probe/',

  // end_to_end_time_succeeded (ms), percentiles of successful connects
  e2eOk: { p: ['P5', 'P25', 'P50', 'P75', 'P95', 'P99', 'P99.9'], ms: [13, 40, 74, 161, 603, 2101, 10000] },

  // end_to_end_time_failed (ms). Failures resolve fast (P75 50 ms) or hit the 10 s cap.
  e2eFail: { p: ['P50', 'P75', 'P95', 'P99'], ms: [0, 50, 10000, 10000] },

  // winning_attempt_index: which staggered attempt actually connected (% of connects)
  winIdx: { x: ['1st', '2nd', '3rd', '4th', '5th+'], pct: [84.0, 14.3, 1.3, 0.4, 0.03] },

  // connection_attempt_count: how many attempts were opened before success (%)
  attemptCount: { x: ['1', '2', '3', '4', '5+'], pct: [86.9, 11.3, 1.3, 0.4, 0.05] },

  // cancelled_attempt_count: attempts started then cancelled once a winner appeared (%)
  cancelCount: { x: ['0', '1', '2', '3+'], pct: [91.8, 7.5, 0.5, 0.11] },

  // time_to_first_attempt (ms): how long before the first connection attempt fires
  firstAttempt: { p: ['P50', 'P75', 'P95', 'P99'], ms: [3, 27, 109, 603] },

  // dns_resolution_time (ms) by record type, percentiles
  dnsRes: {
    p: ['P75', 'P95', 'P99', 'P99.9'],
    a:     [17, 109, 1041, 10000],
    aaaa:  [21, 128, 1041, 10000],
    https: [14, 80, 349, 4954],
  },

  // h3_discovery: how a connection learned (or did not) that h3 was available (% of connects)
  discovery: [
    { name: 'no h3 advertised', value: 31.3, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 29.1, color: '#eb6834' },
    { name: 'HTTPS record only', value: 20.7, color: '#1baf7a' },
    { name: 'both', value: 19.0, color: '#2a78d6' },
  ],

  // https_rr_features: of connections that saw an HTTPS record, share carrying each SvcParam
  rrFeatures: { labels: ['h3 ALPN', 'IPv4 hint', 'IPv6 hint', 'ECH'], pct: [97, 86, 86, 53] },

  // https_rr_features_by_resolver: same SvcParams, split by how DNS was resolved (%)
  rrByResolver: {
    labels: ['h3 ALPN', 'IPv4 hint', 'IPv6 hint', 'ECH'],
    doh:    [98, 96, 96, 32],
    native: [96, 90, 89, 52],
  },
};
