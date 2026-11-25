# FOSDEM 2027 proposal: Save a round trip

Submit at <https://fosdem.org/submit> (pretalx, FOSDEM 2027).
Network devroom CFP: deadline **30 November 2026**, notification 4 December,
devroom on Saturday 30 January 2027. Short talks are 20 to 25 minutes.

## Title

Save a round trip: HTTP/3 and Happy Eyeballs v3

## Track

Network

## Abstract

Every new connection pays round trips before the first byte: TCP, then TLS, then
the request. QUIC and HTTP/3 save one of them, and QUIC 0-RTT saves another on
repeat visits. Yet most page loads still use TCP. A browser can't just switch to
HTTP/3: some networks block UDP, middleboxes and antivirus software break QUIC,
and a client only learns that a server speaks HTTP/3 from an `Alt-Svc` header or
an HTTPS DNS record.

This talk shows how Firefox solves the client side with Happy Eyeballs v3
(https://datatracker.ietf.org/doc/draft-ietf-happy-happyeyeballs-v3/). It asks
for the HTTPS, AAAA and A records at once, races QUIC and TCP over IPv6 and IPv4,
and keeps whichever connection wins. The implementation is an open-source,
sans-I/O Rust library, mozilla/happy-eyeballs
(https://github.com/mozilla/happy-eyeballs), that any client can embed. I will
share results from a Firefox Release experiment: HTTP/3 went from 20% to 26% of
page loads on a new connection, and first contentful paint got faster at every
percentile.

But clients can only race what servers advertise. The second half is for server
operators: enabling HTTP/3 in nginx, Caddy, HAProxy, H2O and friends, sending
`Alt-Svc`, publishing an HTTPS record and offering 0-RTT. We will check a site
live with savearoundtrip.com. Servers advertise, clients race.

## Submission notes (only the organizers see these)

- Length: 25 minutes, including a few minutes of questions.
- A follow-up to my FOSDEM 2026 Network devroom talk "Modern Network Protocols:
  What's Next for Firefox and the Web?" (with Andrew Creskey). That talk surveyed
  upcoming work and only mentioned Happy Eyeballs v3. Since then it shipped: on by
  default in Nightly, rolling out on Release, with experiment results. This talk
  goes deep on that one mechanism instead of giving an overview.
- An earlier version was the talk at performance.now() 2026 (Amsterdam, 20
  November 2026) for a web performance audience. The FOSDEM version focuses on
  the protocols, the open-source Rust library and server configuration.
- Draft slides: https://mxinden-bot.github.io/slides/16-fosdem2027/
- Fun fact for the live check: fosdem.org currently scores 0 of 5 on
  savearoundtrip.com (no HTTP/3, no `Alt-Svc`, no HTTPS record). Happy to help
  change that before February.

## Speaker bio

Max is a software developer interested in networking and distributed systems.
He works at Mozilla on Firefox's networking stack, focusing on HTTP/3, QUIC and
Happy Eyeballs v3, and contributes the Firefox perspective to the IETF HAPPY
working group. Previously he was stewarding the peer-to-peer networking project
libp2p (https://libp2p.io/), and before that the monitoring system Prometheus and
its integration with Kubernetes. To find out more visit https://max-inden.de/

## Links to put in the abstract field (pretalx asks for project links)

- https://github.com/mozilla/happy-eyeballs
- https://github.com/mozilla/neqo
- https://datatracker.ietf.org/doc/draft-ietf-happy-happyeyeballs-v3/
- https://savearoundtrip.com/

## Sources for the numbers

- HTTP/3 share 20.1% to 25.6%: Firefox 158 to 160 Release experiment, main
  document, page loads on a new connection, 98.6M (control) and 102.2M loads.
  Tracking: https://bugzilla.mozilla.org/show_bug.cgi?id=1953459
- FCP faster from P10 to P99 (-2.1% to -3.5%): Firefox 158 and 159 Release
  experiment report, 73.9M and 77.1M page loads. Every 95% confidence interval
  from P50 to P99 excludes zero.
