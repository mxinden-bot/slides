/*
 * Chart data for the FOSDEM 2026 "Intro to WebTransport" deck.
 * HTTP/3 adoption is real Firefox telemetry (STMO query 113403, share of Firefox
 * desktop responses) alongside Cloudflare Radar's worldwide request share.
 */
window.DECK_DATA = {
  months: ["Jul '25", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan '26", 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul '26"],

  h3Adoption: {
    pct: [20.1, 17.9, 18.5, 15.5, 15.1, 15.3, 16.1, 14.9, 14.8, 15.0, 15.9, 16.9, 17.3],
    cf:  [32.2, 32.5, 31.4, 30.9, 30.7, 30.1, 31.4, 31.8, 30.9, 31.5, 32.0, 31.6, 30.0],
  },
};
