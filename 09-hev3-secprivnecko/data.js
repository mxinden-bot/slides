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
    // HEv3 change vs control %, by DoH segment (negative = faster). STMO 124709.
    ttrs: {
      p:     ['P25', 'P50', 'P75', 'P90', 'P95', 'P99'],
      doh:   [-7.5, -8.0, -1.0, -7.5, -11.1, -21.7],
      nodoh: [2.3, 9.6, 1.4, -1.3, -0.3, -0.6],
    },
    // 3. First contentful paint: HEv3 change vs control %, by DoH segment (positive =
    // slower, negative = faster). DoH-on crosses over (fast half worse, tail better);
    // DoH-off improves everywhere. STMO 124745.
    fcp: {
      p:     ['P05', 'P25', 'P50', 'P75', 'P90', 'P95', 'P99'],
      doh:   [1.3, 6.0, 3.4, -2.0, -4.7, -5.5, -10.0],
      nodoh: [-2.9, -1.2, -1.6, -2.3, -3.4, -3.6, -4.5],
    },
    // 4. Winning attempt index, treatment arm only, client-normalized %. STMO 125312.
    winIdx: {
      x:   ['1', '2', '3', '4'],
      pct: [95.11, 4.42, 0.42, 0.04],
    },
    // Fenix (Firefox for Android) Nightly, share of page loads over HTTP/3, Glean
    // pageload event (http_ver), 7-day moving average, weekly samples over 365 days.
    // The year-long climb accelerates when HEv3 turns on in late July (~27% -> ~31%).
    fenix: {
      dates: ['Aug', '', 'Sep', '', '', '', 'Oct', '', '', '', '', 'Nov', '', '', '', 'Dec', '', '', '', '', 'Jan', '', '', '', 'Feb', '', '', '', 'Mar', '', '', '', 'Apr', '', '', '', '', 'May', '', '', '', 'Jun', '', '', '', 'Jul', '', '', '', '', 'Aug', '', ''],
      h3:    [19.1, 19.7, 19.6, 19.3, 19.6, 19.6, 21.1, 23.9, 25.5, 26.0, 26.0, 26.2, 26.8, 23.9, 23.4, 23.1, 22.5, 22.8, 23.2, 24.4, 23.5, 23.1, 23.0, 22.8, 22.6, 22.8, 22.6, 21.5, 21.5, 21.4, 21.6, 22.4, 22.6, 22.7, 21.5, 20.0, 19.2, 18.6, 18.3, 20.9, 23.6, 23.9, 23.6, 24.5, 25.2, 26.2, 27.9, 27.5, 26.9, 29.7, 31.4, 30.6, 30.9],
    },

    // Daily HTTP/3 share, DoH-enabled segment, control vs HEv3 (backup). STMO 124764.
    h3DailyDoh: {
      dates:   ['07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17', '08-18'],
      control: [15.01, 12.46, 14.89, 15.56, 13.59, 15.40, 16.54, 14.90, 16.03, 18.96, 20.28, 19.26, 16.58, 17.09, 16.81, 17.15, 18.09, 20.59, 17.60, 15.62],
      hev3:    [23.39, 24.39, 27.86, 26.41, 23.71, 25.17, 28.02, 27.85, 28.83, 31.67, 32.59, 26.50, 29.08, 28.01, 27.69, 27.33, 30.75, 30.02, 29.46, 29.78],
    },
  },
};
