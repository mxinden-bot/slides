/*
 * Chart data for "Happy Eyeballs v3 in Firefox: IETF update".
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

  // h3_discovery: how a connection learned (or did not) that h3 was available (% of
  // connects). Real GLAM via savearoundtrip's method (non_norm_histogram, per-build avg).
  discovery: [
    { name: 'no h3 advertised', value: 58.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 35.0, color: '#eb6834' },
    { name: 'both', value: 3.8, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 2.9, color: '#1baf7a' },
  ],

  // https_rr_features: of connections that saw an HTTPS record, share carrying each SvcParam
  rrFeatures: { labels: ['h3 ALPN', 'IPv4 hint', 'IPv6 hint', 'ECH'], pct: [79.5, 54.4, 51.2, 16.3] },

  // https_rr_features_by_resolver: same SvcParams, split by how DNS was resolved (%)
  rrByResolver: {
    labels: ['h3 ALPN', 'IPv4 hint', 'IPv6 hint', 'ECH'],
    doh:    [76, 48, 42, 16],
    native: [75, 45, 40, 16],
  },

  // Beta A/B experiment (happyeyeballsv3), 2026-07-30 -> 08-18, control vs HEv3,
  // ~46M successful runs/day. Numbers from Kershaw Chang, STMO queries below.
  exp: {
    // 1. HTTP/3 usage: share of page loads over h3, control vs HEv3, by DoH segment.
    // STMO 124764.
    h3: {
      x: ['Overall', 'DoH enabled', 'DoH disabled'],
      control: [11.45, 16.62, 11.12],
      hev3:    [13.22, 27.93, 12.23],
    },
    // 2. Time to request start (navigationStart -> requestStart): DNS + TCP/TLS setup.
    // HEv3 change vs control %, DoH-enabled segment (negative = faster). STMO 124709.
    ttrs: {
      p:     ['P25', 'P50', 'P75', 'P90', 'P95', 'P99'],
      delta: [-7.5, -8.0, -1.0, -7.5, -11.1, -21.7],
    },
    // 3. First contentful paint: HEv3 delta %, DoH-enabled segment (positive = slower,
    // negative = faster). Crossover: fast half worse, tail better. STMO 124745.
    fcp: {
      p:     ['P05', 'P25', 'P50', 'P75', 'P90', 'P95', 'P99'],
      delta: [1.3, 6.0, 3.4, -2.0, -4.7, -5.5, -10.0],
    },
    // 4. Winning attempt index, treatment arm only, client-normalized %. STMO 125312.
    winIdx: {
      x:   ['1', '2', '3', '4'],
      pct: [95.11, 4.42, 0.42, 0.04],
    },
    // Fenix (Firefox for Android) Nightly, share of responses over HTTP/3 by build
    // date (client-normalized), GLAM networking_http_response_version. The share
    // steps up from ~14% to ~18% when HEv3 turned on in late July.
    fenix: {
      dates: ['07-20', '07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27', '07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17'],
      h3:    [13.6, 14.1, 14.4, 17.8, 17.3, 18.2, 17.7, 18.1, 18.3, 18.1, 18.0, 18.6, 17.9, 17.4, 18.0, 18.7, 18.2, 17.9, 18.4, 18.6, 17.7, 18.0, 18.6, 18.8, 18.7, 18.4, 18.6, 18.2, 19.6],
    },

    // Daily HTTP/3 share, DoH-enabled segment, control vs HEv3 (backup). STMO 124764.
    h3DailyDoh: {
      dates:   ['07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17', '08-18'],
      control: [15.01, 12.46, 14.89, 15.56, 13.59, 15.40, 16.54, 14.90, 16.03, 18.96, 20.28, 19.26, 16.58, 17.09, 16.81, 17.15, 18.09, 20.59, 17.60, 15.62],
      hev3:    [23.39, 24.39, 27.86, 26.41, 23.71, 25.17, 28.02, 27.85, 28.83, 31.67, 32.59, 26.50, 29.08, 28.01, 27.69, 27.33, 30.75, 30.02, 29.46, 29.78],
    },
  },
};
