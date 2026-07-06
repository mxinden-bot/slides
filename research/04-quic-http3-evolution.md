# Evolving HTTP/3 & QUIC, growing beyond 30%? (discussion brief)

*HTTP Workshop 2026 discussion session. Compiled July 2026.*

## 1. Is HTTP/3 / QUIC really ">30%"? Depends on the denominator

The ">30%" headline is defensible only if precise about *what* is counted. The number ranges ~21% to ~75% by vantage point, and the most-cited "whole-internet" measure (Cloudflare request share) is **below** 30% and has plateaued.

- **Cloudflare Radar (share of HTTP requests):** HTTP/3 **~21%** through H1 2026, vs HTTP/2 ~51%. **Peaked ~28% in May 2023**, then retreated and flattened. Denominator = requests at Cloudflare's edge. (radar.cloudflare.com/adoption-and-usage; blog.cloudflare.com/radar-2025-year-in-review)
  - **Why the plateau (a live debate):** "QUIC is not Quick Enough over Fast Internet" (ACM Web Conf 2024) - QUIC loses up to **45.2% throughput vs HTTP/2 above ~500 Mbps** due to per-packet userspace overhead. As fiber crosses that threshold, H3's win can flip negative. (dl.acm.org/doi/10.1145/3589334.3645323)
- **W3Techs (websites advertising support):** ~**38.8%** (Apr 2026) - capability advertised (Alt-Svc OR HTTPS RR), not traffic; inflated by CDN defaults.
- **Google first-party:** up to **~42%** of Google traffic over QUIC; **>50% of Chrome->Google connections**.
- **Meta first-party:** **>75%** of traffic over QUIC (2020; likely higher now).
- **Transit/backbone:** QUIC only **~2.6-9.1% of Internet bytes**, dominated by Google.

**Takeaway:** ">30%" holds for advertised support and hyperscaler first-party traffic, but the neutral "share of the web's requests" (Cloudflare) is ~21% and *not growing*. Requests-vs-connections is a real confound: H3 multiplexes many requests per connection, flattering a request-share denominator.

## 2. QUIC v2 (RFC 9369): built to be deployed, barely deployed

- **Functionally identical to v1** (same wire format/state machine; `h3`/`doq` and all v1 extensions work). Only **crypto constants and codepoints** differ, to break ossification: version `0x6b3343cf`, different Initial salt, Retry key/nonce, HKDF label prefix `"quicv2 "`, permuted long-header packet types. Confirmed in `/home/user/neqo/neqo-transport/src/version.rs`.
- Published May 2023. **Carries no new features -> no user-visible incentive.**
- **Pairs with Compatible Version Negotiation (RFC 9368):** v1<->v2 compatible, so a client sends a v1 Initial and the server upgrades to v2 in-handshake with zero extra RTT. neqo does exactly this (sends v1 Initial, advertises `[v2, v1]`, prefers v2).
- **Deployment near-zero:** IMC 2024 poster - **<0.003% of QUICv1 domains support v2**, **<0.013% grease the QUIC bit** (so anti-ossification features almost nobody enabled). (dl.acm.org/doi/10.1145/3646547.3689673)
- **Libraries:** neqo full v2 + compatible upgrade (prefers v2); quic-go v1+v2. **quinn does NOT support v2** - `DEFAULT_SUPPORTED_VERSIONS = [0x00000001, ff00001d..22]` (v1 + old drafts, no `0x6b3343cf`), `/home/user/quinn/quinn-proto/src/lib.rs:160`. Chrome/Cloudflare/msquic have v2 code paths but rarely *initiate* v2.
- **Why lagging:** no feature payoff; chicken-and-egg (benefit only at scale); risk-without-reward; greasing (RFC 9287) delivers most of the anti-ossification value more cheaply.
- **"Why deploy v2?"** Only collective reasons: keep version-negotiation exercised so a future feature-bearing version can deploy; prevent v1 from ossifying. A coordination problem - a sharp question for the room.

## 3. Alt-Svc (RFC 7838) -> HTTPS RR (RFC 9460) upgrade path

- **First-connection round-trip problem:** with `Alt-Svc: h3` alone, the browser must finish a TCP+TLS+H2 connection, read the header, and only then use H3 on the *next* connection. An HTTPS RR `alpn="h3"` is learned during DNS resolution -> QUIC on connection #1. (Max's savearoundtrip.com is exactly this.)
- **Firefox telemetry (Max's metric):** savearoundtrip derives, from GLAM HE probes (`netwerk_happy_eyeballs_h3_discovery`, `_https_rr_features`), the share of connections that reach H3 only on a later connection because the site had `Alt-Svc` h3 but no usable HTTPS RR. (per-client reach overstates: ECH ~64% of users but only ~7-15% of connections).
- **HTTPS RR adoption:** ~**15.4%** of Tranco top-1M consistently publish HTTPS records (IMC 2024, arxiv 2403.15672); **>70% are Cloudflare defaults**. `alpn` set on 99.9%; ipv4/6hint and ech rare.
- **Obstacles:** DNS control-plane/tooling lag for type-65 + RFC 3597 generic hex encoding; CORS forbids reading another origin's Alt-Svc (gap only measurable server-side); uneven resolver/CDN support. **ECH hard-depends on HTTPS RR** (the `ech` SvcParam) - so HTTPS-RR deployment is now on the critical path for a *privacy* feature, a stronger adoption lever. "Plan B": draft-thomson-httpbis-alt-svcb reconciles Alt-Svc with SVCB.

## 4. "Optimistic QUIC" / racing QUIC first

- **Idea:** attempt QUIC speculatively on the first connection and race it against TCP, instead of waiting for HTTPS RR / Alt-Svc proof - trade a possible wasted UDP attempt for a saved round trip.
- **HEv3** races QUIC only when h3 is *indicated* (SVCB/Alt-Svc). True optimistic QUIC (race h3 with *no* prior signal) is the open extension this session probes.
- **curl (Aug 2025):** start the QUIC race, after **200 ms** start TCP in parallel, first wins - a shipped eyeballs-style QUIC race. (daniel.haxx.se/blog/2025/08/04/even-happier-eyeballs)
- **draft-duke-httpbis-quic-version-alt-svc:** a `quicv` param advertising supported QUIC versions, so a client picks the version immediately (avoids a version-negotiation RT) - relevant to optimistic *v2*.
- **Risks:** fallback cost on the ~**1-5% of networks that block/throttle UDP** (QUIC timeout + TCP + TLS = slower than never trying, then QUIC marked broken w/ backoff); silent middlebox failures; re-ossification; amplification/cost of speculative Initials; racing-timer tuning is unsettled (0 ms wastes UDP everywhere, 200 ms forfeits the h3 win).

## Open questions

1. Which denominator should the community rally around, and is the request-share plateau/decline since 2023 the number to worry about?
2. Is the fast-internet throughput regression (up to ~45% vs H2 >500 Mbps) the real ceiling on QUIC growth?
3. Can QUIC v2 escape its coordination trap (<0.003% deployment, zero feature incentive)? Is greasing (RFC 9287) enough that v2 is unnecessary?
4. Should a major library shipping no v2 (quinn) worry anyone? What minimum matrix keeps compatible version negotiation exercised on the wire?
5. Deprecate Alt-Svc for HTTPS RR, or bridge them? Is ECH the lever that finally forces HTTPS-RR publication where perf alone failed?
6. Correct default for optimistic QUIC: race QUIC-first everywhere with a small delay, or gate on any prior signal? What delay, adapted per-network?
7. Who eats the optimistic-QUIC fallback tax on UDP-hostile networks, and is a learned per-network suppression list a precondition?
8. Does advertising QUIC versions (`quicv`) unlock optimistic v2, or just add another ossifiable, stale field?

### Local repo pointers
neqo v2 `/home/user/neqo/neqo-transport/src/version.rs`; quinn no-v2 `/home/user/quinn/quinn-proto/src/lib.rs:160`; savearoundtrip `/home/user/savearoundtrip/README.md`; HEv3 draft `/home/user/draft-happy-eyeballs-v3/`.
