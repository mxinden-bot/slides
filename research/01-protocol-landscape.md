# Modern Network Protocols: landscape (early/mid 2026)

*Every claim carries a source. Items flagged with (!) could not be independently verified - re-check before the stage.*

## 1. QUIC / HTTP/3 adoption

- **HTTP/3 = ~21% of global HTTP requests** (Cloudflare Radar 2025; HTTP/2 ~50%, HTTP/1.x ~29%), "largely unchanged from 2024" (blog.cloudflare.com/radar-2025-year-in-review). 2024 baseline 20.5%.
- 2026 quarterly ~21%, brief peak ~22% week of 19 Jan 2026, then flat. (!) decimals via a third party reading Radar; the ~21% level is solid.
- **Key narrative: request share has plateaued at ~21% for three years**, far behind HTTP/2. A reported ~28% peak in 2023 would make today a decline (verify against Cloudflare primary).
- Geographic: countries >33% HTTP/3 grew 8 (2024) -> 15 (2025); Georgia 38%.
- **W3Techs website "support" = 39.8%** (Jul 2026), still climbing (w3techs.com/technologies/details/ce-http3). Support != negotiated use -> the ~40% vs ~21% gap is a talk-worthy point (many first visits never upgrade).
- Per-browser (!) only stale 2023 data: Chrome/Edge ~40%, Firefox ~35% of own requests over H3; Chrome ~74-80% of all H3 volume.
- Support baselines: Chrome since Apr 2020, Firefox since May 2021.

## 2. DNS over HTTPS (DoH)

- **~13.7% of global DNS traffic over DoH** and growing (APNIC, stats.labs.apnic.net/edns). On Cloudflare 1.1.1.1, DoH ~15% / DoT ~10%.
- Firefox DoH default-on US desktop since Feb 2020, Canada 2021, RU/UA from Mar 2022. Chrome auto-upgrade since May 2020 (provider allow-list). Apple DoH/DoT since iOS 14/macOS 11.
- Performance vs Do53: (!) no clean 2025/2026 aggregate; APNIC 2022 found DoH competitive when warm, slower on cold setup.
- **Resolver discovery - DDR (RFC 9462) and DNR (RFC 9463)**, both published Nov 2023 (IETF ADD WG). Apr 2025: 321k DDR-enabled open resolvers of 1.3M probed. DDR protocol priority: DoT 85%, DoH 12.9%, DoQ 0.5%. Provider concentration: Google 80.8%, Cloudflare 12.4%.
- **ODoH (RFC 9230, Jun 2022):** HPKE + proxy so no party sees both client IP and query. Median ODoH ~228 ms vs ~146 ms plain DoH (Cloudflare NA). Firefox uses ODoH-style via Mozilla's OHTTP relay.

## 3. Encrypted Client Hello (ECH)

- Encrypts the inner ClientHello incl. SNI; config (`ECHConfig`) fetched via the **`ech` param of the DNS HTTPS record**. On Cloudflare the outer SNI is a fixed `cloudflare-ech.com`.
- **RFC 9849 "TLS Encrypted Client Hello," Standards Track** (final WG draft esni-25, 2025-07-28). (!) exact publication month ("March 2026") slightly uncertain.
- **Firefox: default-on since Fx 119 (Oct 2023)**, relies on DoH for the config. **Chrome: default-on since Chrome 117/122**, does NOT require DoH. **Safari: not shipping** (in development as of May 2025).
- **Cloudflare enabled ECH by default for all free-plan zones.** Server-side adoption thin: **< ~10% of top-1M sites**, concentrated in Cloudflare.
- Limitations: needs secure DNS; GREASE ECH (fake extensions anti-ossification); middlebox/enterprise breakage; not a censorship silver bullet (static `cloudflare-ech.com` blockable). **Russia began blocking ECH via TSPU on 2024-11-05**; also censored in Iran/China.

## 4. WebTransport and Media over QUIC (MoQ)

- WebTransport W3C spec **still a Working Draft** (Oct 2025); CR expected 2026. IETF HTTP/3-mapping draft in WGLC early 2026.
- Browser support: Chrome/Edge since v97 (Jan 2022); **Firefox default-on since v114 (Jun 2023)**; Safari 26.4+ (2025) (!) third-party source.
- **MoQ Transport: draft-ietf-moq-transport-18 (12 May 2026)**; editors from Meta, Google, Cisco. WG milestone: request publication by Dec 2026; ~122 open issues.
- Adopters: Cloudflare MoQ beta/relay; nanocosmos (first production, IBC 2025); Bitmovin+Cloudflare demo NAB 2026; OpenMOQ consortium (Red5, Akamai, CDN77, Cisco, Synamedia, YouTube).
- **MoQT runs over QUIC and over WebTransport** - WebTransport is the browser-facing carrier; native clients use raw QUIC.

## 5. MASQUE

- **CONNECT-UDP (RFC 9298, Aug 2022):** Extended CONNECT, maps HTTP/QUIC DATAGRAMs to UDP -> proxy QUIC/H3.
- **CONNECT-IP (RFC 9484, Oct 2023):** full IP layer -> HTTP/3 server as a VPN gateway.
- **CONNECT-Ethernet (draft-ietf-masque-connect-ethernet):** L2 tunneling; WG draft (-06..-09 in 2025-26); hackathon ARP interop Ericsson<->Google.
- Single-hop just shifts trust; **two-hop splits knowledge** (ingress sees client IP not dest; egress sees dest not client IP).
- Deployers: **Apple iCloud Private Relay** (Apple ingress; Akamai/Cloudflare/Fastly egress); **Google Chrome "IP Protection"** (two-hop, Incognito-only, staged, Q3 2025 (!) GA unverified); **Cloudflare WARP**.

## 6. Oblivious HTTP (RFC 9458, Jan 2024)

- HPKE-encapsulates binary HTTP through a relay to a gateway: relay sees IP not content, gateway sees content not IP. ODoH is the DNS-specific instantiation.
- Deployments: **Firefox** (Fastly relay, perf metrics + Suggest); **Apple** (Private Cloud Compute / Apple Intelligence); **Google** (Safe Browsing, Privacy Sandbox); **Meta** (WhatsApp Private Processing); Cloudflare Privacy Gateway; ISRG Divvi Up. (!) no public volume figures.

## 7. HTTPS / SVCB Resource Records (RFC 9460, Nov 2023)

- APNIC Oct 2023: **~10M domains (4.4%) publish an HTTPS RR for `www`** - driven by Cloudflare defaults; most orgs adopt passively. (!) certainly higher now, no fresh scan.
- **Alt-Svc -> HTTPS RR upgrade path (core narrative):** Alt-Svc is learned only after a slower H1/H2 connection, so the first visit never uses H3 (a wasted round trip) - exactly why "support" (~40%) overstates use (~21%). HTTPS RR `alpn` lets the client pick QUIC on the first connection; also carries IP hints and the ECH key.
- Browser support (on by default): Firefox since May 2020, Safari since Sep 2020, Chrome partial since Dec 2020.

## 8. Congestion control and modern signalling

- **ECN clients: only ~2-3% of end clients** (APNIC 2025; IPv4 TCP 1.6%, IPv6 TCP 3.9%; DE 6.9%, JP 6.4%). ECN "bleaching" global avg 3.57%.
- **L4S (RFC 9330/1/2):** Apple built-in since iOS 17/macOS Sonoma (2023). **Comcast** first Low Latency DOCSIS field trials Jun 2023, expanded to 6 metros Jan 2025; field study cut tail latency up to 25%. Verizon+Ericsson 5G trials.
- **BBR vs CUBIC:** CUBIC still Linux default; BBR in production at Google (TCP + QUIC), ~4% higher throughput / ~33% lower RTT vs CUBIC. **BBRv3** standardizing (draft-ietf-ccwg-bbr). (!) Chrome/Firefox client-side QUIC CC defaults not confirmed for 2025-26 (neqo uses a NewReno/CUBIC-style controller) - confirm before quoting.

## Cross-cutting talk angles

- **Discovery is the connective tissue:** the DNS HTTPS/SVCB record makes H3 first-hop negotiation, ECH key delivery, and DDR resolver discovery all work - one slide can tie four topics together.
- **"Encrypt the metadata" arc:** DoH -> ECH -> ODoH/OHTTP -> MASQUE (Private Relay / IP Protection): progressively hiding *who talks to whom*.
- **Reality check:** advertised support >> real use everywhere (H3 ~40% support vs ~21% requests; ECH <10% of top sites; ECN ~2-3% of clients). Plumbing lags the specs by years.
