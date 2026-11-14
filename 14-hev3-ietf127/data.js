/*
 * Chart data for "Happy Eyeballs v3 in Firefox" (IETF 127, HAPPY).
 */
window.DECK_DATA = {
  // netwerk.happy_eyeballs_dns_answer_spread_v2, until_first_attempt, Firefox Beta 161,
  // 2026-11-05 -> 11-13, 69,641 clients, 167M runs. Time between the first and the last
  // positive DNS answer before the first connection attempt, % of runs. Derived from
  // zero spread 72.7%, >= 5 ms 1.25%, >= 10 ms 0.75%, reaching 25 ms 0.23%.
  spread: {
    x:   ['all at once', 'under 5 ms', '5 to 10 ms', '10 to 25 ms', 'cut off at 25 ms'],
    pct: [72.7, 26.1, 0.5, 0.5, 0.23],
  },

  // Release experiment happy-eyeballs-v3-release-v2, Firefox 160, 5% of Release per
  // branch, 2026-11-05 -> 11-13, page loads whose main document opened a new connection.
  release: {
    // HTTP version of the main document, % of page loads with a known version.
    // 7.7M (control) and 8.0M (HEv3) page loads.
    version: {
      x: ['HTTP/1.1', 'HTTP/2', 'HTTP/3'],
      control: [26.7, 53.8, 19.6],
      hev3:    [25.8, 49.7, 24.6],
    },
    // First contentful paint, ms. 5.2M (control) and 5.4M (HEv3) page loads.
    p:       ['P5', 'P10', 'P25', 'P50', 'P75', 'P85', 'P90', 'P95', 'P99'],
    control: [170, 217, 361, 661, 1201, 1693, 2172, 3321, 11222],
    hev3:    [169, 213, 349, 643, 1173, 1655, 2127, 3259, 10815],
    diff:    [-0.59, -1.84, -3.32, -2.72, -2.33, -2.24, -2.07, -1.87, -3.63],
  },
};
