/*
 * Chart data for the "Evolving HTTP/3 & QUIC beyond 30%?" discussion.
 * Sources in research/04-quic-http3-evolution.md.
 */
window.DECK_DATA = {
  // HTTP/3 "share" depends entirely on the vantage point. All values sourced:
  //  Firefox desktop requests ~17% (performance.mozilla.org, query 113403, Jul 2026);
  //  Cloudflare likely-human requests ~30% (Radar); W3Techs site support 39.8%;
  //  Chrome<->Google connections >50% (chromium.org/quic); Meta first-party ~75%
  //  (engineering.fb.com, 2020; measured ~86% on some ISPs in 2023).
  denominators: {
    labels: ['Firefox\nrequests', 'Cloudflare\nrequests', 'W3Techs\nsite support', 'Chrome ↔\nGoogle', 'Meta\ntraffic'],
    pct: [17, 30, 40, 50, 75],
  },

  // REAL GLAM netwerk_happy_eyeballs_h3_discovery: how connections learn h3.
  discovery: [
    { name: 'no h3 advertised', value: 31.3, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 29.1, color: '#eb6834' },
    { name: 'HTTPS record only', value: 20.7, color: '#1baf7a' },
    { name: 'both', value: 19.0, color: '#2a78d6' },
  ],
};
