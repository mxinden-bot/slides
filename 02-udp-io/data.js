/*
 * Chart data for "Modern UDP I/O for Firefox in Rust".
 * REAL Firefox Nightly telemetry via GLAM (probe networking_http_3_*, v154,
 * ~365k users), plus figures from the blog and FOSDEM 2025.
 */
window.DECK_DATA = {
  glam: 'https://glam.telemetry.mozilla.org/fog/probe/',

  // REAL GLAM networking_http_3_udp_datagram_segments_received, Firefox for
  // Android (Fenix), which enables GRO. Windows is excluded: it does not do GRO,
  // and it dominates the all-platform aggregate with 1s.
  groSegments: { p: ['P50', 'P75', 'P95', 'P99', 'P99.9'], n: [1, 1, 4, 14, 46] },

  // REAL GLAM networking_http_3_udp_datagram_segment_size_received, Fenix (bytes).
  segSize: { p50: 1217, p95: 1271, p99: 1448 },

  // REAL Firefox Profiler capture: on-CPU self time on the Socket Thread during
  // a 2.3 GB QUIC download, network-wait (poll) excluded, aggregated by library.
  // Single hottest function: intel_aes_gcmDEC (AES-GCM decrypt) at ~10%.
  // Source: https://share.firefox.dev/4fmWsog (Firefox 153, Linux).
  cpuBreakdown: {
    labels: ['neqo packet processing', 'UDP send/recv syscalls', 'AES-GCM crypto (NSS)', 'lock contention', 'clock / math', 'packet memory copies'],
    pct: [40, 20, 18, 9, 7, 6],
  },

  // REAL GLAM networking_http_3_upload_throughput (Mbps, release, per version).
  // HTTP/3 uploads >10 MB. Up ~60-90% across percentiles over Fx 141..152.
  uploadTput: {
    v: ['141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152'],
    p50: [20, 21, 25, 25, 25, 25, 27, 27, 29, 29, 33, 33],
    p75: [38, 44, 50, 54, 54, 54, 58, 62, 62, 66, 66, 71],
    p95: [107, 132, 163, 175, 175, 175, 175, 175, 188, 188, 202, 202],
  },

  // REAL GLAM networking_http_3_ecn_path_capability (share of connections, %).
  ecnPath: [
    { name: 'capable', value: 58.4 },
    { name: 'bleaching (ECN stripped)', value: 33.0, color: '#eb6834' },
    { name: 'unsent ECT(1)', value: 4.8, color: '#8f8f9d' },
    { name: 'black-hole', value: 3.7, color: '#5b5b66' },
  ],

  // Decorative flamegraph for the cover: real on-CPU call tree from the profile
  // above (share.firefox.dev/4fmWsog), pruned. Each: [x, width, depth, category].
  flame: [[0.0,0.9686,0,'neqo'],[0.0,0.86624,1,'neqo'],[0.0,0.86551,2,'neqo'],[0.0,0.86551,3,'neqo'],[0.0,0.4927,4,'neqo'],[0.0,0.48734,5,'neqo'],[0.0,0.18318,6,'neqo'],[0.0,0.13851,7,'neqo'],[0.0,0.13754,8,'neqo'],[0.0,0.13741,9,'crypto'],[0.0,0.1295,10,'crypto'],[0.0,0.10163,11,'crypto'],[0.13851,0.01424,7,'neqo'],[0.18318,0.13011,6,'neqo'],[0.18318,0.0723,7,'neqo'],[0.18318,0.04491,8,'neqo'],[0.18318,0.04443,9,'neqo'],[0.18318,0.04357,10,'neqo'],[0.18318,0.04199,11,'neqo'],[0.18318,0.04017,12,'neqo'],[0.25548,0.02666,7,'neqo'],[0.31329,0.06147,6,'neqo'],[0.31329,0.06147,7,'io'],[0.31329,0.06134,8,'io'],[0.31329,0.06134,9,'io'],[0.31329,0.06134,10,'io'],[0.31329,0.06134,11,'io'],[0.37476,0.03298,6,'neqo'],[0.40774,0.01181,6,'neqo'],[0.4927,0.2842,4,'neqo'],[0.4927,0.27118,5,'neqo'],[0.4927,0.25986,6,'neqo'],[0.4927,0.12403,7,'neqo'],[0.4927,0.12403,8,'io'],[0.4927,0.12366,9,'io'],[0.4927,0.12366,10,'io'],[0.4927,0.12354,11,'io'],[0.61672,0.11149,7,'neqo'],[0.61672,0.09993,8,'neqo'],[0.61672,0.09701,9,'neqo'],[0.61672,0.023,10,'neqo'],[0.61672,0.02276,11,'neqo'],[0.61672,0.02276,12,'crypto'],[0.63973,0.01947,10,'neqo'],[0.63973,0.01947,11,'neqo'],[0.75256,0.01047,6,'neqo'],[0.76388,0.01168,5,'neqo'],[0.76388,0.01156,6,'neqo'],[0.7769,0.08836,4,'neqo'],[0.7769,0.08021,5,'neqo'],[0.7769,0.07972,6,'neqo'],[0.7769,0.07875,7,'neqo'],[0.7769,0.07838,8,'neqo'],[0.7769,0.07753,9,'neqo'],[0.7769,0.04832,10,'neqo'],[0.7769,0.03639,11,'neqo'],[0.7769,0.03444,12,'neqo'],[0.7769,0.03444,13,'neqo'],[0.7769,0.03298,14,'neqo'],[0.7769,0.02836,15,'neqo'],[0.82522,0.0224,10,'neqo'],[0.82522,0.0213,11,'neqo'],[0.82522,0.02093,12,'neqo'],[0.86624,0.09408,1,'neqo'],[0.86624,0.04357,2,'neqo'],[0.86624,0.04357,3,'other'],[0.86624,0.04357,4,'io'],[0.86624,0.02081,5,'neqo'],[0.88705,0.01692,5,'neqo'],[0.88705,0.01692,6,'crypto'],[0.88705,0.0157,7,'crypto'],[0.90981,0.01558,2,'neqo'],[0.90981,0.01558,3,'neqo'],[0.90981,0.00998,4,'neqo'],[0.90981,0.00998,5,'other'],[0.92539,0.01375,2,'neqo'],[0.92539,0.01375,3,'neqo'],[0.92539,0.01351,4,'neqo'],[0.92539,0.01144,5,'neqo'],[0.92539,0.01035,6,'neqo'],[0.93914,0.01217,2,'neqo'],[0.93914,0.01168,3,'neqo'],[0.9686,0.02373,0,'neqo'],[0.9686,0.02373,1,'neqo'],[0.9686,0.02118,2,'neqo'],[0.9686,0.01546,3,'neqo'],[0.9686,0.01546,4,'neqo'],[0.9686,0.00949,5,'neqo']],

  // Full labeled call tree for a Brendan-Gregg-style flamegraph (Result slide).
  // Real on-CPU stacks from share.firefox.dev/4fmWsog, network wait excluded.
  // Each: [x, width, depth, frameName]. 'libxul.so' = unsymbolicated neqo/Necko.
  flameFull: [[0.0,0.9686,0,"libxul.so"],[0.0,0.86624,1,"libxul.so"],[0.0,0.86551,2,"libxul.so"],[0.0,0.86551,3,"libxul.so"],[0.0,0.4927,4,"libxul.so"],[0.0,0.48734,5,"libxul.so"],[0.0,0.18318,6,"libxul.so"],[0.0,0.13851,7,"libxul.so"],[0.0,0.13754,8,"libxul.so"],[0.0,0.13741,9,"AES_AEAD"],[0.0,0.1295,10,"platform_AES_GCM_DecryptAEAD"],[0.0,0.10163,11,"intel_aes_gcmDEC"],[0.13851,0.01424,7,"libxul.so"],[0.18318,0.13011,6,"libxul.so"],[0.18318,0.0723,7,"libxul.so"],[0.18318,0.04491,8,"libxul.so"],[0.18318,0.04443,9,"libxul.so"],[0.18318,0.04357,10,"libxul.so"],[0.18318,0.04199,11,"libxul.so"],[0.18318,0.04017,12,"libxul.so"],[0.25548,0.02666,7,"libxul.so"],[0.31329,0.06147,6,"libxul.so"],[0.31329,0.06147,7,"__recvmmsg"],[0.31329,0.06134,8,"recvmmsg_syscall"],[0.31329,0.06134,9,"__syscall_cancel"],[0.31329,0.06134,10,"__internal_syscall_cancel"],[0.31329,0.06134,11,"__syscall_cancel_arch"],[0.37476,0.03298,6,"libxul.so"],[0.40774,0.01181,6,"libxul.so"],[0.4927,0.2842,4,"libxul.so"],[0.4927,0.27118,5,"libxul.so"],[0.4927,0.25986,6,"libxul.so"],[0.4927,0.12403,7,"libxul.so"],[0.4927,0.12403,8,"__sendmsg"],[0.4927,0.12366,9,"__syscall_cancel"],[0.4927,0.12366,10,"__internal_syscall_cancel"],[0.4927,0.12354,11,"__syscall_cancel_arch"],[0.61672,0.11149,7,"libxul.so"],[0.61672,0.09993,8,"libxul.so"],[0.61672,0.09701,9,"libxul.so"],[0.61672,0.023,10,"libxul.so"],[0.61672,0.02276,11,"libxul.so"],[0.61672,0.02276,12,"AES_AEAD"],[0.63973,0.01947,10,"libxul.so"],[0.63973,0.01947,11,"libxul.so"],[0.75256,0.01047,6,"libxul.so"],[0.76388,0.01168,5,"libxul.so"],[0.76388,0.01156,6,"libxul.so"],[0.7769,0.08836,4,"libxul.so"],[0.7769,0.08021,5,"libxul.so"],[0.7769,0.07972,6,"libxul.so"],[0.7769,0.07875,7,"libxul.so"],[0.7769,0.07838,8,"libxul.so"],[0.7769,0.07753,9,"libxul.so"],[0.7769,0.04832,10,"libxul.so"],[0.7769,0.03639,11,"libxul.so"],[0.7769,0.03444,12,"libxul.so"],[0.7769,0.03444,13,"libxul.so"],[0.7769,0.03298,14,"libxul.so"],[0.7769,0.02836,15,"libxul.so"],[0.82522,0.0224,10,"libxul.so"],[0.82522,0.0213,11,"libxul.so"],[0.82522,0.02093,12,"libxul.so"],[0.86624,0.09408,1,"libxul.so"],[0.86624,0.04357,2,"libxul.so"],[0.86624,0.04357,3,"PR_Poll"],[0.86624,0.04357,4,"_pr_poll_with_poll"],[0.86624,0.02081,5,"libxul.so"],[0.88705,0.01692,5,"libxul.so"],[0.88705,0.01692,6,"ssl_Poll"],[0.88705,0.0157,7,"SSL_DataPending"],[0.90981,0.01558,2,"libxul.so"],[0.90981,0.01558,3,"libxul.so"],[0.90981,0.00998,4,"libxul.so"],[0.90981,0.00998,5,"__clock_gettime_2"],[0.92539,0.01375,2,"libxul.so"],[0.92539,0.01375,3,"libxul.so"],[0.92539,0.01351,4,"libxul.so"],[0.92539,0.01144,5,"libxul.so"],[0.92539,0.01035,6,"libxul.so"],[0.93914,0.01217,2,"libxul.so"],[0.93914,0.01168,3,"libxul.so"],[0.9686,0.02373,0,"libxul.so"],[0.9686,0.02373,1,"libxul.so"],[0.9686,0.02118,2,"libxul.so"],[0.9686,0.01546,3,"libxul.so"],[0.9686,0.01546,4,"libxul.so"],[0.9686,0.00949,5,"libxul.so"]],
};
