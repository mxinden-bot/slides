/*
 * Chart data for the "Modern UDP I/O for Firefox in Rust" deck.
 * REAL numbers from the blog post (max-inden.de/post/fast-udp-io-in-firefox)
 * and the FOSDEM 2025 talk. Anything approximate is noted.
 */
window.DECK_DATA = {
  // REAL - blog: "jump from < 1 Gbit/s to 4 Gbit/s" on CPU-bound benchmarks.
  // Baseline shown as ~0.9 to convey "< 1"; labels carry the exact wording.
  throughput: {
    labels: ['NSPR baseline', 'Rust + offload'],
    gbit: [0.9, 4.0],
    labelText: ['< 1 Gbit/s', '4 Gbit/s'],
  },

  // REAL - FOSDEM 2025: GRO read-syscall distribution (Firefox Nightly, Linux).
  gro: {
    p: ['P75', 'P95'],
    packets: [2, 10],   // "2 or more" / "10 or more" packets per read syscall
    kib: [2.4, 12],     // total bytes per read syscall
  },

  // REAL - ECN on Firefox Nightly.
  ecn: {
    capablePaths: 50,   // ~50% of paths ECN-capable outbound
    ceP75: 0.6,         // P75 of QUIC connections see >= 0.6% CE marks on receive
  },
};
