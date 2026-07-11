/*
 * Chart data for the "Evolving HTTP/3 & QUIC beyond 30%?" discussion.
 * Sources in research/04-quic-http3-evolution.md.
 */
window.DECK_DATA = {
  // HTTP/3 "share" depends entirely on the vantage point (different denominators):
  //  Firefox desktop TOP-LEVEL PAGE LOADS ~17% (performance.mozilla.org, query 113403,
  //  from the Glean perf.page_load event, Jul 2026); Cloudflare likely-human REQUESTS
  //  ~30% (Radar); W3Techs SITE support 39.8%; Meta first-party traffic ~75%
  //  (engineering.fb.com, 2020; measured ~86% on some ISPs in 2023).
  denominators: {
    labels: ['Firefox\npage loads', 'Cloudflare\nrequests', 'W3Techs\nsite support', 'Meta\ntraffic'],
    pct: [17, 30, 40, 75],
  },

  // REAL GLAM netwerk_happy_eyeballs_h3_discovery: how connections learn h3.
  discovery: [
    { name: 'no h3 advertised', value: 31.3, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 29.1, color: '#eb6834' },
    { name: 'HTTPS record only', value: 20.7, color: '#1baf7a' },
    { name: 'both', value: 19.0, color: '#2a78d6' },
  ],
};
