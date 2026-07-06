# Research briefs

Background research for the 2026 talk series. Each file is a dense, sourced
brief. Numbers flagged in the briefs as unverified should be re-checked before
they go on a slide.

| File | Feeds which talk(s) |
|------|---------------------|
| `01-protocol-landscape.md` | TU Dresden overview |
| `02-udp-io.md` | Modern UDP I/O (HTTP Workshop) |
| `03-happy-eyeballs-v3.md` | HEv3 rollout (HTTP Workshop) + IETF HE WG |
| `04-quic-http3-evolution.md` | HTTP/3 & QUIC discussion (HTTP Workshop) |
| `05-telemetry-data-sources.md` | Cross-cutting: how to pull the real chart data |

## Headline facts worth remembering

- **HTTP/3 has plateaued.** Cloudflare request share ~21% (flat since a ~28% peak in 2023); Firefox desktop responses ~15-20% (declining). "Beyond 30%" only holds for W3Techs advertised *support* (~39%) or hyperscaler first-party traffic (Google ~42%, Meta ~75%).
- **The chart data is public.** performance.mozilla.org/networking.html pulls STMO/Redash CSVs with embedded api_keys, no login. See `05-telemetry-data-sources.md`.
- **HEv3 draft is `-04` (2026-07-01)** under the new **HAPPY** WG. Firefox has it **on by default in Nightly**, running a 50 ms connection-attempt delay with a x2 multiplier (draft default is 250 ms).
- **UDP I/O: < 1 -> 4 Gbit/s** on CPU-bound benchmarks. Note: the "de Bruijn 3.5x" attribution is likely wrong (his figure is 2x; 3.5x is Langley et al. SIGCOMM 2017) - confirm before using.
- **QUIC v2 (RFC 9369) is barely deployed** (<0.003% of domains) because it carries no new features; quinn has no v2 support, neqo does.
