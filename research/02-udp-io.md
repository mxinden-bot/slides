# Modern UDP I/O for Firefox in Rust

Scope note: figures are separated into **verified** (blog / neqo / quinn / firefox source / citable paper) and **not found** (numbers in the talk framing that do NOT appear in the primary blog or local repos). Some "not found" numbers ARE in Max's own FOSDEM 2025 slides (e.g. the 11% recvmmsg gain, GRO percentiles, CE-mark P75) - those are legitimate from his prior deck, just not in the blog. Primary blog: https://max-inden.de/post/fast-udp-io-in-firefox/ (dated 2025-09-14).

## Headline framing
- **~20% of Firefox HTTP traffic is HTTP/3** (QUIC/UDP). (blog)
- Project **started mid-2024**; replace NSPR UDP I/O for QUIC with modern syscalls across Windows/Android/macOS/Linux, in Rust to match neqo. (blog)
- **Rolling out to the majority of users by mid-2025.** As of the post, `network.http.http3.use_nspr_for_io=false` (quinn-udp) ships **only on Nightly**; Beta/Release still NSPR. (Bugzilla 1916558; confirm current channel before saying "shipped to Release".)
- NSPR = Netscape Portable Runtime; only `PR_SendTo`/`PR_RecvFrom` (POSIX `sendto`/`recvfrom`), one datagram per syscall.

## 1. Techniques
- **Single datagram:** `sendto`/`recvfrom`, one crossing per <1500 B datagram. Cheap for one, expensive at ~500 Mbit/s.
- **Batch (multi-message):** Linux `sendmmsg`/`recvmmsg` (`quinn/quinn-udp/src/unix.rs` recv_via_recvmmsg ~L558).
- **Segmentation offload:** one large super-datagram, kernel/NIC segments + checksums; RX coalesces. Linux **GSO/GRO**, Windows **USO/URO**.

Per-OS abstraction (quinn-udp):
- **Linux GSO:** `UDP_SEGMENT` cmsg; `max_gso_segments` probed (returns **64**, cap `UDP_MAX_SEGMENTS=1<<6`). Needs kernel >= 4.18, runtime probe. (`quinn/quinn-udp/src/linux.rs` L164-239)
- **Linux GRO:** `UDP_GRO`; `gro_segments = 64`. (`unix.rs` L129-138)
- **Windows USO/URO:** `WSASendMsg`+`UDP_SEND_MSG_SIZE`; `WSARecvMsg`+`UDP_RECV_MAX_COALESCED_SIZE=u16::MAX`. `max_gso_segments` ~**512 on Win11 x64**. **URO disabled by default** (quinn #2041). (`windows.rs` L166-186, 561-573)
- **macOS `sendmsg_x`/`recvmsg_x`:** undocumented private batch syscalls via `dlsym`, gated behind `apple_fast` cfg. No offload: segmentation in user space. Falls back to `sendmsg`/`recvmsg`. (`apple_fast.rs`; `unix.rs` L386-416)
- **`BATCH_SIZE = 32`** (1 on apple_slow). (`unix.rs` L859-864)

No-alloc receive path:
- `RECV_BUF_SIZE = u16::MAX = 65535`. (`neqo/neqo-udp/src/lib.rs` L31)
- `NUM_BUFS = 1` on GRO/URO (Linux/Windows), **16 on Apple** (no offload). (L45-49)
- Thread-local `RecvBuf` reused across every recv, allocated once. (`firefox/netwerk/socket/neqo_glue/src/lib.rs` L63-65)
- `DatagramIter` chunks the one buffer into borrowed `Datagram<&mut [u8]>` slices by `meta.stride`, no copy/alloc. (L183-238)

ECN via cmsg:
- `IP_RECVTOS`/`IPV6_RECVTCLASS` decoded from `IP_TOS`/`IPV6_TCLASS` cmsgs (macOS 1-byte ABI hack, Apple bug 48761855). (`unix.rs` L764-791)
- Windows `IP_RECVECN`/`IPV6_RECVECN`; disabled if provider lacks it (Wine/Proton). (`windows.rs` L83-155)

PLPMTUD (RFC 8899): neqo datagram-based. Probe table V4 `[1280,1380,1420,1472,1500,2047,4095,8191,16383,32767,65535]`. **Base 1280** (QUIC min); **1472** = 1500 - IPv4+UDP (28). `PMTU_RAISE_TIMER=600 s`. Only when the socket won't fragment. (`neqo/neqo-transport/src/pmtud.rs` L26-39)

QUIC ACK Frequency (draft-ietf-quic-ack-frequency): implemented in neqo (`ackrate.rs`, `frame.rs`, `tparams.rs`). Draft at **-14** (expires Aug 2026).

## 2. Measured gains
- **Throughput: "< 1 Gbit/s to 4 Gbit/s"** on CPU-bound benchmarks; afterward CPU flamegraphs are dominated by I/O syscalls + crypto. (blog)
- **ECN: ~50% of QUIC connections on ECN-outbound-capable paths** (Firefox Nightly). (blog)
- Glean metrics that would produce the finer numbers exist: `http_3_udp_datagram_segments_received/sent`, `http_3_ecn_ce_ect0_ratio_received/_sent`, path outcomes {capable, black-hole, bleaching}. (`neqo_glue` L599-735)

FOSDEM 2025 slide numbers (Max's own, use with "FOSDEM 2025" attribution): GRO P75 read >=2 packets / P95 >=10; P75 2.4 KiB / P95 12 KiB per syscall; **11%** improvement from multi-message on OS loopback; **P75 of QUIC connections see >= 0.6% CE marks** on receive. (NOT in the blog - do not attribute to the blog.)

## 3. OS idiosyncrasies (blog + source)
- **Windows:** URO on ARM64 + WSL **doesn't return segment size** -> packet boundaries lost on short-header QUIC -> page-load failures (repro fosstodon.org); MS contacted, no fix, **URO disabled**. USO enabling caused **increased packet loss + a driver crash report** -> rolled back. ECN best-effort (Wine/Proton disables).
- **macOS/Apple:** **no segmentation offload**; `sendmsg_x`/`recvmsg_x` added by Lars behind a feature flag, **off by default, decided not to ship** (risk Apple removes the private symbol); macOS 10.15 edge case (non-v4/v6 packets; `recvmsg_x` doesn't overwrite `msg_controllen`).
- **Linux:** most mature; quinn-udp **prefers GSO over sendmmsg** for TX; **one socket per connection** (privacy) makes offload the obvious choice; minor sandboxing + runtime GSO check; on `EIO`/`EINVAL` halts offload.
- **Android != Linux:** x86 32-bit dispatches via `socketcall`; default seccomp **crashes** on the direct syscall (~1-line quinn-udp fix). API <= 25 + ECN -> `sendmsg` returns **EINVAL** -> retry with ECN disabled. GSO single-segment error (fix by Thomas).

## 4. Design points
- **quinn-udp is the abstraction** (from the Quinn project); neqo wraps it in `neqo-udp`.
- **In-place en/decryption** added by **Lars Eggert** alongside the batching rewrite.
- **One UDP socket per connection for privacy.**
- **Rust borrow-checker soundness** for the shared buffer: `recv_inner` returns a `DatagramIter<'a>` borrowing the single `RecvBuf`, yielding `&mut [u8]` slices via `chunks_mut` - no aliasing/UAF while processing.
- neqo_glue holds a `BorrowedFd`/`BorrowedSocket` (NSPR owns the socket lifetime). GSO batch fallback: on `EIO` with >1 datagram, resend individually rather than wait ~300 ms PTO.

## 5. Background / related work (citations)
- **Cloudflare, "Accelerating UDP packet transmission for QUIC"** (2019, Ghedini): sendmmsg + GSO drove a benchmark **~640 Mbps -> ~1.6 Gbps** (baseline sendmsg ~80-90 MB/s). The blog's reference study.
- **de Bruijn & Dumazet, LPC 2018:** slides say QUIC has **"2x higher cycle/Byte than TCP"**. IMPORTANT: the **"3.5x cycles per byte"** figure (which Max quotes attributed to de Bruijn in the FOSDEM 2025 slide) is actually **Langley et al., SIGCOMM 2017** (early QUIC server ~3.5x TLS/TCP, later optimized ~2x). **Fix the attribution or cite Langley for 3.5x.**
- **Custura, Fairhurst, Learmonth, "Exploring usable Path MTU in the Internet,"** IFIP TMA 2018 - basis for the 1280/1472/1500 probe steps.
- RFCs: 8899 (PLPMTUD), 9000 (QUIC 1280 min), 3168 (ECN), 9330 (L4S context).

## 6. 2025-2026 status
- quinn-udp path on **Nightly**; "majority of users by mid-2025" (verify Beta/Release default).
- Send-path offload not enabled where risky: **Windows USO/URO disabled**; **Apple sendmsg_x/recvmsg_x off by default**. Linux GSO/GRO is the one production send+receive offload.
- Send-path batching via `process_multiple_output(...)` / `OutputBatch::DatagramBatch`, `buffered_outbound_datagram` retained across `WouldBlock`. No separate "long-lived send buffer" milestone beyond this in the tree - treat as in-progress.
- neqo actively released (v0.30.0); quinn adding kernel RX timestamps (`SO_TIMESTAMPNS`).

### Flag for the speaker
The **11%**, **GRO percentiles**, **CE-mark P75**, and any **CPU-reduction %** are from FOSDEM 2025 / telemetry (STMO), not the blog. Correct the **de Bruijn "3.5x"** attribution (his is 2x; 3.5x is Langley 2017).
