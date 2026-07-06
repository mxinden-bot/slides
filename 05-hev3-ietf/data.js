/* Chart data for the IETF Happy Eyeballs WG update.
 * All ten netwerk_happy_eyeballs_* metrics, REAL GLAM (Nightly 154). */
window.DECK_DATA = {
  latency: { p: ['5th', '25th', '50th', '75th', '95th', '99th', '99.9th'], ms: [13, 40, 74, 161, 603, 2101, 10000] },
  racing: { firstWins: 94, firstAttempt: 89, noCancel: 95, toFirstAttemptMs: 27 },
  dnsRes: { types: ['A', 'AAAA', 'HTTPS'], p75: [14, 19, 12], p95: [93, 118, 74] },
  discovery: [
    { name: 'no h3 advertised', value: 65.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 21.9, color: '#eb6834' },
    { name: 'both', value: 8.2, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 4.7, color: '#1baf7a' },
  ],
  rrFeatures: { labels: ['h3 alpn', 'ipv4hint', 'ipv6hint', 'ECH'], pct: [71, 43, 37, 14] },
};
