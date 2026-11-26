# FOSDEM 2027 proposal: Save a round trip

Submit at <https://fosdem.org/submit> (pretalx, FOSDEM 2027).
Network devroom CFP: deadline **30 November 2026**, notification 4 December,
devroom on Saturday 30 January 2027. Short talks are 20 to 25 minutes.

## Title

Save a round trip with HTTP/3 and Happy Eyeballs v3

## Track

Network

## Abstract

Connecting to a website used to be simple: open a TCP connection, send the
request. Today a browser chooses between IPv4 and IPv6, HTTP/3 and HTTP/2, A/AAAA
and HTTPS DNS records, and the combinations keep growing.

The choice matters. Over TCP with TLS 1.3, a browser waits two round trips before
it can send its first request: one for TCP, one for TLS. QUIC (HTTP/3) needs one,
and with 0-RTT on a repeat visit the request goes out in the very first packet.
But HTTP/3 does not work everywhere: some networks block UDP, and VPNs and
antivirus software break QUIC.

Happy Eyeballs v3, being standardized at the IETF, lets the browser race all
options and keep whichever connects first. Firefox is shipping it, built on an
open-source, sans-I/O Rust library (https://github.com/mozilla/happy-eyeballs).
Data from millions of Firefox clients: HTTP/3 went from 20% to 26% of page loads
on a new connection, and first contentful paint got faster at every percentile.

Clients can only race what servers advertise. So the call to action is for server
operators: enable HTTP/3, advertise it with an Alt-Svc header and an HTTPS DNS
record, and enable 0-RTT. I will show how to check your own site with
savearoundtrip.com (https://savearoundtrip.com/), a small tool I built for this.

## Submission notes (only the organizers see these)

- Length: 25 minutes, including a few minutes of questions.
- A follow-up to my FOSDEM 2026 Network devroom talk "Modern Network Protocols:
  What's Next for Firefox and the Web?" (with Andrew Creskey). That talk surveyed
  upcoming work and only mentioned Happy Eyeballs v3. Since then it shipped. This
  talk goes deep on that one mechanism instead of giving an overview.
- An earlier version was my talk at performance.now() 2026 in Amsterdam, for a web
  performance audience. The FOSDEM version focuses on the protocols, the
  open-source Rust library and server configuration.
- Draft slides: https://mxinden-bot.github.io/slides/16-fosdem2027/
- Fun fact for the live check: fosdem.org currently scores 0 of 5 on
  savearoundtrip.com (no HTTP/3, no Alt-Svc, no HTTPS record). Happy to help
  change that before February.

## Speaker bio

Max is a software developer interested in networking and distributed systems. He
works on Firefox's networking stack at Mozilla, focusing on HTTP/3, QUIC and Happy
Eyeballs v3, and contributes to the IETF. Before Mozilla, he led the peer-to-peer
networking project libp2p (https://libp2p.io/) and worked on the Prometheus
monitoring system and its Kubernetes integration. More at https://max-inden.de/

## Sources for the numbers

- Round trips: TCP handshake 1, TLS 1.3 handshake 1, then the request (RFC 8446);
  QUIC combines transport and TLS in 1 (RFC 9000, RFC 9001); 0-RTT sends the
  request in the first flight.
- HTTP/3 share 20.1% to 25.6%: Firefox 158 to 160 Release experiment, main
  document, page loads on a new connection, 98.6M (control) and 102.2M loads.
  Tracking: https://bugzilla.mozilla.org/show_bug.cgi?id=1953459
- FCP faster from P10 to P99 (-2.1% to -3.5%): Firefox 158 and 159 Release
  experiment report, 73.9M and 77.1M page loads.
