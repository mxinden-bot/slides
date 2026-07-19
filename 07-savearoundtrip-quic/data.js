/*
 * Chart data for "Save a round trip" (QUIC WG pitch for savearoundtrip.com).
 * The discovery donut mirrors deck 04/06: real GLAM h3_discovery shares.
 */
window.DECK_DATA = {
  // GLAM netwerk_happy_eyeballs_h3_discovery: how a connection learns h3.
  discovery: [
    { name: 'no h3 advertised', value: 58.2, color: '#8f8f9d' },
    { name: 'Alt-Svc only', value: 35.0, color: '#eb6834' },
    { name: 'both', value: 3.8, color: '#2a78d6' },
    { name: 'HTTPS record only', value: 2.9, color: '#1baf7a' },
  ],
};
