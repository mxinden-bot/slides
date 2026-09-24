/*
 * Chart data for the FOSDEM 2026 "Intro to WebTransport" deck.
 * HTTP/3 adoption is real, public Firefox telemetry (GLAM) alongside Cloudflare
 * Radar's worldwide request share.
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
};
