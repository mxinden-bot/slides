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

  // REAL GLAM netwerk_happy_eyeballs_h3_discovery: how connections learn h3.
  discovery: [
    { name: 'no h3 advertised', value: 65.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 21.9, color: '#eb6834' },
    { name: 'both', value: 8.2, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 4.7, color: '#1baf7a' },
  ],
};
