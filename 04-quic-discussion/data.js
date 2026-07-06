/*
 * Chart data for the "Evolving HTTP/3 & QUIC beyond 30%?" discussion.
 * Sources in research/04-quic-http3-evolution.md.
 */
window.DECK_DATA = {
  // HTTP/3 "share" wildly depends on the denominator.
  denominators: {
    labels: ['Cloudflare\nrequests', 'W3Techs\nsite support', 'Google\ntraffic', 'Meta\ntraffic', 'Backbone\nbytes'],
    pct: [21, 39, 42, 75, 6],
  },
};
