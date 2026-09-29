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
};
