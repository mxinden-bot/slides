/* Chart data for the IETF Happy Eyeballs WG update. Real GLAM (Nightly 154). */
window.DECK_DATA = {
  latency: { p: ['5th', '25th', '50th', '75th', '95th', '99th', '99.9th'], ms: [13, 40, 74, 161, 603, 2101, 10000] },
  discovery: [
    { name: 'no h3 advertised', value: 65.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 21.9, color: '#eb6834' },
    { name: 'both', value: 8.2, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 4.7, color: '#1baf7a' },
  ],
};
