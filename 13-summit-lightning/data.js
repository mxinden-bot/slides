/*
 * Chart data for the Mozilla Engineering Summit lightning talk. Reuses the
 * sourced series of earlier decks; each slide links its source.
 */
window.DECK_DATA = {
  months: ["Jul '25", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan '26", 'Feb', 'Mar', 'Apr', 'May', "Jun '26"],

  // HTTP/3 share of HTTP responses per Firefox desktop release, Fx 141..152 placed
  // at their release month (GLAM networking_http_response_version, public).
  // cf: Cloudflare Radar HTTP/3 share of requests, worldwide, same months.
  h3Adoption: {
    pct: [31.1, 30.9, 30.2, 30.4, 30.7, 30.6, 29.6, 29.0, 29.1, 29.4, 29.4, 30.0],
    cf:  [32.2, 32.5, 31.4, 30.9, 30.7, 30.1, 31.4, 31.8, 30.9, 31.5, 32.0, 31.6],
  },

  // Beta A/B experiment (happyeyeballsv3), 2026-07-30 -> 08-18, share of page loads
  // over HTTP/3, control vs HEv3, by DoH segment.
  hev3H3: {
    x: ['Overall', 'DoH enabled', 'DoH disabled'],
    control: [11.45, 16.62, 11.12],
    hev3:    [13.22, 27.93, 12.23],
  },

  // GLAM netwerk_happy_eyeballs_h3_discovery, Firefox Nightly: how a connection
  // learned that h3 was available (% of connects). Small slices kept apart so labels don't collide.
  discovery: [
    { name: 'no h3 advertised', value: 58.2, color: '#8f8f9d' },
    { name: 'HTTPS record only', value: 2.9, color: '#1baf7a' },
    { name: 'Alt-Svc only', value: 35.0, color: '#eb6834' },
    { name: 'both', value: 3.8, color: '#2a78d6' },
  ],

  // Cloudflare speed test in Firefox Nightly, one run per path, 2026-09-11:
  // direct vs through Firefox's IP-protection proxy (github.com/mxinden/fireflare,
  // results/report.html). Mbps.
  proxyTput: {
    x: ['direct\nHTTP/1.1', 'direct\nHTTP/3', 'proxy HTTP/2\nCONNECT', 'proxy HTTP/3\nCONNECT', 'proxy HTTP/3\nMASQUE'],
    down: [885.0, 893.6, 890.9, 593.8, 309.9],
    up:   [401.8, 246.0, 527.8, 448.4, 112.8],
  },
};
