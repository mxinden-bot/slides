# UDP I/O: OS-idiosyncrasy tickets (confirmed)

Bugzilla / GitHub tickets behind each OS war story. Confirmed from code comments in the local quinn / neqo / firefox trees plus the tickets themselves.

## Windows URO on ARM64 / WSL
- **quinn #2041** https://github.com/quinn-rs/quinn/issues/2041 — URO coalesces without a valid segment size on Windows (repro under WSL); cited in `quinn-udp/src/windows.rs:172`. URO disabled by default (PR #2092, quinn-udp 0.5.9).
- **Firefox bug 1916558** https://bugzilla.mozilla.org/show_bug.cgi?id=1916558 — fosstodon.org fails to load on ARM64 Windows with `use_nspr_for_io=false`; the downstream regression.

## Windows USO rollback (packet loss + driver crash)
- **Firefox bug 1979279** https://bugzilla.mozilla.org/show_bug.cgi?id=1979279 — GSO/USO raised p95 loss ~0.5% -> ~6.5%; fix set `max_gso_segments=1` on Windows (cited in `StaticPrefList.yaml:16378`).
- **Firefox bug 1978821** https://bugzilla.mozilla.org/show_bug.cgi?id=1978821 — WLAN Extensibility Module stops / network driver crash (dup of 1979279).

## macOS sendmsg_x / recvmsg_x (undocumented) + decision not to ship
- **quinn #1993** (PR, larseggert) https://github.com/quinn-rs/quinn/pull/1993 — adds the Apple fast datapath.
- **quinn #2154** https://github.com/quinn-rs/quinn/pull/2154 — ignore empty cmsghdr (infinite loop, macOS < 14).
- **quinn #2214 / #2216** https://github.com/quinn-rs/quinn/pull/2216 — zero the cmsg array; macOS 10.15 `recvmsg_x` doesn't set `msg_controllen` (`apple_fast.rs:153`).
- **neqo #2638** https://github.com/mozilla/neqo/pull/2638 — pref-gated, NOT shipped (Apple could remove the private symbol). Kill-switch pref `network.http.http3.apple_fast_datapath`.

## macOS 10.15 non-IPv4/v6 packets
- **quinn #2383 / #2387** https://github.com/quinn-rs/quinn/pull/2387 — don't panic on unknown address family (return IO error).
- **Firefox bug 1987606** https://bugzilla.mozilla.org/show_bug.cgi?id=1987606 — downstream tracking.

## Linux GSO runtime failure -> immediate individual resend
- **quinn #2399** https://github.com/quinn-rs/quinn/issues/2399 — retry failed GSO sendmsg on EIO without GSO (`unix.rs:468`).
- **Firefox bug 2049334** https://bugzilla.mozilla.org/show_bug.cgi?id=2049334 — Android kernels reject GSO batches with EIO, dropping the first packet until PTO (~250-300 ms), losing the HE race; resend individually (`neqo_glue/src/lib.rs:1348`).
- **Firefox bug 1989895** https://bugzilla.mozilla.org/show_bug.cgi?id=1989895 — on GSO EIO Firefox disabled QUIC instead of falling back; `max_gso_segments=10` too aggressive.

## Android x86 32-bit socketcall under seccomp
- **quinn #1966** (+ #1964) https://github.com/quinn-rs/quinn/pull/1966 — `sendmmsg`/`recvmmsg` multiplexed via `socketcall` which seccomp blocks; route through libc. "Basically a single-line change."

## Android API <= 25: EINVAL for sendmsg with ECN
- **quinn #2079** https://github.com/quinn-rs/quinn/pull/2079 — retry send once without the `IP_TOS`/ECN cmsg (`unix.rs:482`), avoids a ~100 ms stall.

## Android GSO single-segment send error
- **quinn #2050** https://github.com/quinn-rs/quinn/pull/2050 — only set `UDP_SEGMENT` if segment size != content length. Report: **quinn #2145**.

## Firefox integration
- Pref **`network.http.http3.use_nspr_for_io`** = false (quinn-udp on), `StaticPrefList.yaml:16332`. Flipped on Nightly by **bug 1910360** https://bugzilla.mozilla.org/show_bug.cgi?id=1910360.
- **Meta bug 1901292** https://bugzilla.mozilla.org/show_bug.cgi?id=1901292 — "[meta] Fast UDP for Firefox" (the tracking bug; the brief's guess of 1916558 was actually item 1).
