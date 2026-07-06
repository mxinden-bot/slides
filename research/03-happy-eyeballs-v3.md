# Happy Eyeballs v3 in Firefox (as of 2026-07-06)

*Confirmed = read from a primary source (local repo / datatracker / Bugzilla / Firefox tree). Inference = reasoning, flagged inline.*

## 1. The IETF draft: status and identity

- **Latest version: `draft-ietf-happy-happyeyeballs-v3-04`, published 2026-07-01, expires 2027-01-03.** Active WG document. (https://datatracker.ietf.org/doc/draft-ietf-happy-happyeyeballs-v3/) Local checkout `/home/user/draft-happy-eyeballs-v3/draft-ietf-happy-happyeyeballs-v3.md` is the editor's copy.
- **Working group: HAPPY** (mail `happy@ietf.org`, repo `ietf-wg-happy/draft-happy-eyeballs-v3`).
- **Authors:** Tommy Pauly (Apple), David Schinazi, Nidhi Jaju, Kenichi Ishibashi (Google).
- **Lineage:** `draft-pauly-v6ops-happy-eyeballs-v3` -> WG-adopted `-00` (2025-04-07). Revisions 00 (2025-04-07), 01 (2025-07-04), 02 (2025-10-20), 03 (2026-03-02), **04 (2026-07-01)**.
- **Standards-track; updates RFC 8305 (HEv2), which obsoleted RFC 6555 (HEv1).**
- **Changes in the -02 -> -04 window:** DNS answer-ordering examples incl. multi-SVCB; refined timer rescheduling on DNS answer change; ECH refs updated to published RFCs (ECH = RFC 9849, SVCB-ECH = RFC 9848); "address" -> "endpoint"; clarified service-priority grouping; "interface" -> PvD (RFC 7556); IPv6 MTU text tightened.

## 2. The HEv3 algorithm

**Four phases:** async resolution -> grouping/sorting -> staggered connection attempts -> first success cancels the rest. Default preference: **IPv6 > IPv4 and QUIC > TCP** (adaptable).

**DNS query strategy:** for HTTP(S) incl. WebSockets, query **HTTPS (SVCB)** in addition to AAAA and A; all fired together; send order **SVCB/HTTPS, then AAAA, then A**. Query set adapts to connectivity (dual-stack / v4-only / v6-only, NAT64/DNS64/PREF64).

**Resolution Delay (default 50 ms)** - the move-on gate. Proceed when either (a) some positive addresses AND a positive-or-negative answer for the preferred family AND SVCB info; or (b) some positive addresses AND the Resolution Delay elapsed. SVCB `ipv4hint`/`ipv6hint` count as positive but A/AAAA MUST still be issued.

**Grouping/sorting - three levels:** (1) by application protocol + security (SVCB `alpn`/`ech`); an endpoint can be in multiple groups; SHOULD avoid separate grouping where a protocol is non-critical (so a plain web load groups h3+h2 and honors server priority). (2) by service priority (lower first; equal shuffled). (3) within-group: RFC 6724 destination sort, plus an RTT-preference rule (stateful) and a previously-used-address rule, then interleave address families. "Preferred Address Family Count" default 1.

**Connection racing / Connection Attempt Delay:** attempts one at a time; parallel attempts kept alive; first success cancels the rest. **Delay default 250 ms; min 100 ms (MUST NOT be < 10 ms); max 2 s.** A nuanced impl sets the delay to the previous attempt's first handshake retransmit using historical RTT. SVCB `alpn` defines transports; MUST NOT attempt an endpoint whose ALPN set has no supported protocol (e.g. `alpn="h3" no-default-alpn` -> don't try TCP). h3 (QUIC) vs h2 (TCP+TLS) race as variants -> **QUIC/h3 discovered at resolution time, no Alt-Svc round trip**. TLS-over-TCP success waits for the TLS handshake (guards TCP-terminating proxies); SVCB-reliant/ECH clients MUST wait for SVCB before the crypto handshake (downgrade protection).

## 3. RFC 8305 (v2) -> v3 changes

- **Headline: SVCB/HTTPS record support** (RFC 9460) - protocol discovery (h3/QUIC), ECH keys, address hints, service priorities as racing input, replacing Alt-Svc reliance.
- New three-level grouping by ALPN/security then service priority before the RFC 6724 sort.
- ECH / SVCB-reliant handling: pend TLS/QUIC crypto until SVCB arrives under specific conditions.
- Expanded IPv6-mostly/IPv6-only guidance (NAT64+DNS64, PREF64/RFC 8781, Last Resort Local Synthesis Delay 2 s, VPN split-DNS).
- DNS-answer-change handling during racing; timer reschedule.
- **Firefox-proposed alterations (via mozilla/happy-eyeballs):** interleave *both* protocol variant *and* address family; a configurable **connection-attempt-delay multiplier** (exponential back-off); a flag to **skip waiting for the preferred family**. (Inference: Mozilla experience feeding the WG; not all normative yet.)

**Open draft issues** (github.com/ietf-wg-happy/draft-happy-eyeballs-v3/issues): #117 DNS server selection; #116/#1 retransmission-based timing; #112 QUIC v4/v6; #105 pacing across concurrent HE procedures; #91 Section 8 rework; #89 "Connection Escalator"; #87/#42/#32 NAT64-synthesized-address; #6 ECH impact.

## 4. The `mozilla/happy-eyeballs` Rust library

- **Design: deterministic, pure, sans-I/O state machine.** Caller drives all I/O and passes `now: Instant`. Embeddable in Necko's C++ event loop; exhaustively testable.
- **API** (`src/lib.rs`): `HappyEyeballs::new(host,port)` / `new_with_network_config(...)`; `process_output(now) -> Option<Output>` and `process_input(Input, now)`.
  - `Input`: `DnsResult`, `ConnectionResult`.
  - `Output`: `SendDnsQuery`, `Timer`, `AttemptConnection`, `CancelConnection`, `Succeeded`, `Failed`.
  - `NetworkConfig`: `http_versions{h1,h2,h3}`, `ip: IpPreference`, `alt_svc`, `resolution_delay` (50 ms), `connection_attempt_delay` (250 ms), `connection_attempt_delay_multiplier` (default 1), `ech` (default true), `wait_for_preferred_address` (default true).
- **ECH in-band retry:** `ConnectionResult::EchRetry(EchConfig)`; retry-of-retry rejected per RFC 9849 6.1.6.
- **Interleaving** (`interleave_endpoints`): round-robins `(protocol variant, address family)` ordered `H3 < H2OrH1 < H2 < H1`, preferred family first.
- **Testing:** scenario scripts driving the state machine (`tests/`, `https_records.rs` is the bulk). CI runs rustfmt, clippy, **cargo-mutants**; deny.toml/SBOM.
- **License MIT OR Apache-2.0**, edition 2024, MSRV 1.85, tiny deps (log, thiserror, url).
- **Release: v0.9.0, "WORK IN PROGRESS".** Recent: configurable attempt-delay multiplier (#117), skip preferred family (#116), interleave variants+families (#118). (Inference: likely unpublished on crates.io - WIP, 0.x; crates.io API was access-restricted.)

## 5. Firefox rollout (from the `firefox` tree)

- **Meta bug 1953459 "[meta] Happy Eyeballs v3"**, Core :: Networking: HTTP, **NEW, P2, `[necko-triaged]`**. ~50 resolved dependents, ~17 open (SVCB shuffling, DNS timing, site breakage, DoH fallback), ~12 open blockers (IPv6-only failures, h3 negotiation on cold connections, Alt-Svc validation, coalescing).
- **Prefs** (`modules/libpref/init/StaticPrefList.yaml` ~16886-16922):
  - **`network.http.happy_eyeballs_enabled` = `@IS_NIGHTLY_BUILD@`** -> **ON in Nightly**, off in Beta/Release.
  - `network.http.happy_eyeballs_upgrade_enabled` (Nightly) - gates HE for HTTP-upgrade/WebSocket.
  - `network.http.happy_eyeballs_resolution_delay` = **50** ms.
  - `network.http.happy_eyeballs_connection_attempt_delay` = **50** ms - **well below the draft's 250 ms**.
  - `network.http.happy_eyeballs_connection_attempt_delay_multiplier` = **2** -> schedule t=0, 50, 150, 350, 750 ms.
- **Telemetry (Glean, `netwerk/protocol/http/metrics.yaml`, expires never):**
  - `happy_eyeballs_dns_resolution_time` - labeled by record type {a, aaaa, https} (ms).
  - `happy_eyeballs_connection_attempt_count` - labeled {succeeded, failed}.
  - `happy_eyeballs_end_to_end_time_succeeded` / `_failed`.
  - `happy_eyeballs_time_to_first_attempt`.
  - `happy_eyeballs_winning_attempt_index`, `_cancelled_attempt_count`.
  - `happy_eyeballs_h3_discovery` - labeled {none, altsvc_only, https_rr_only, both}: quantifies the wasted round trip when h3 is only in Alt-Svc.
  - `happy_eyeballs_https_rr_features` + `_by_resolver` (DoH/native) - {total, h3_alpn, ech, ipv4hint, ipv6hint}.
  - Caveat: no single "connection outcome by http/ip-version/ech" metric; that dimension is split across `h3_discovery` and `https_rr_features`.
- **Prior-talk latency percentiles (carry as prior data):** p5 11 ms, p25 37, p50 73, p75 123, p95 537, p99 1.7 s, p99.9 11 s. Re-pull from public Glean for the workshop to show Nightly deltas.
- **Proxy-awareness: not yet implemented; explicit TODO** in `src/lib.rs` (proxy connection / proxy protocol / target connection; MASQUE connect-udp/h3 vs HTTP CONNECT/h2 ordering). WebSocket/WebTransport awareness likewise "v2 of the project."

## 6. Lessons learned / open questions for the WG

- **250 ms Connection Attempt Delay is too coarse in practice.** Firefox ships 50 ms base + x2 multiplier. Feeds WG issues #1/#116 (retransmission-based timing) and #105 (pacing across concurrent HE).
- **HTTPS-RR vs Alt-Svc for h3 discovery** is measurably costing round trips (the `altsvc_only` bucket); DoH-vs-native split shows how often native resolution yields a usable HTTPS RR.
- **"Non-critical protocol" grouping matters:** plain web loads interleave h3/h2 and honor server priority.
- **ECH retry / SVCB-reliant pending** interact subtly with the resolution-delay move-on logic.
- **Webcompat tail:** IPv6-only failures, cold-connection h3 negotiation, Alt-Svc validation, site breakage remain open blockers.
- **Open in the sans-IO design:** proxy-awareness and WebSocket/WebTransport EXTENDED CONNECT fallback.

### Sources
- Library: `/home/user/happy-eyeballs/{src/lib.rs, README.md, Cargo.toml, tests/}`
- Draft: `/home/user/draft-happy-eyeballs-v3/draft-ietf-happy-happyeyeballs-v3.md`; https://datatracker.ietf.org/doc/draft-ietf-happy-happyeyeballs-v3/
- Firefox: `StaticPrefList.yaml`, `netwerk/protocol/http/metrics.yaml`
- Bugzilla 1953459; github.com/mozilla/happy-eyeballs; github.com/ietf-wg-happy/draft-happy-eyeballs-v3
