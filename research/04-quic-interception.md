# How antivirus / TLS interception breaks QUIC in Firefox

Sourced background for the "HTTP/3 & QUIC" discussion deck (04-quic-discussion).
Every claim is drawn from the linked Bugzilla bugs and mozilla/neqo PRs.

Two recurring failure modes:

- **(A) Firefox intentionally refuses HTTP/3** when it detects TLS interception,
  a third-party root in the verified cert chain.
- **(B) Interception middleware silently corrupts QUIC** (mangled ACKs,
  SCONE-padded Initials, dropped crypto frames), so the connection dies or stalls.

---

## Part A: Firefox disabling HTTP/3 on interception detection

### [Bug 1919678](https://bugzilla.mozilla.org/show_bug.cgi?id=1919678): crash in `Encoder::encode_uint`
- Vendor: **Avast**. Symptom: parent-process crash (`assertion failed: n > 0 && n <= 8`),
  the #2 topcrash in Nightly 133.
- Root cause: neqo received an **ACK for a packet it never sent**, driving the
  packet-number encoder to zero length and panicking. Tracked upstream as
  [neqo#2132](https://github.com/mozilla/neqo/issues/2132).
- Fix: turn the panic into a graceful close,
  [neqo#2150](https://github.com/mozilla/neqo/pull/2150) ("Check that the
  largest_acked was sent", returns `Error::AckedUnsentPacket`), shipped in neqo
  v0.9.2. Uplifted to release, esr128, esr115.
- Quote (c12, Max Inden): "terminates a connection, instead of panicking, when
  receiving an invalid ACK ... it is still an open question why we are seeing an
  increase in invalid ACKs."

### [Bug 1923943](https://bugzilla.mozilla.org/show_bug.cgi?id=1923943): Avast unexpected ACK closes QUIC
- Vendor: **Avast**. Offshoot of 1919678: once neqo no longer crashes, the
  underlying problem surfaces as connections closing on the bad ACK.
- Resolution: **INVALID** (closing is correct behavior).
- Quote (c2, Timothy Leggett): "This is not a bug. We should close the
  connection, because the peer (the Avast proxy?) is not following the protocol spec."

### [Bug 1925014](https://bugzilla.mozilla.org/show_bug.cgi?id=1925014): disable HTTP/3 if third-party roots found
- Introduced the pref **`network.http.http3.disable_when_third_party_roots_found`**,
  which blocks an HTTP/3 attempt when a non-built-in root is present. Shipped
  disabled by default, an insurance switch (also in the Nimbus manifest for remote flip).
- Quote (c13): "This feature is disabled. This patch is intended to be used only
  if an HTTP/3 connection is interrupted by Avast again."

### [Bug 1929368](https://bugzilla.mozilla.org/show_bug.cgi?id=1929368): only when the root is actually used
- Refinement: key off the third-party root appearing in the connection's
  succeeded cert chain (`mSucceededCertChain`), not merely being installed, so
  users who only have an enterprise root are not punished on every origin.

### [Bug 1985341](https://bugzilla.mozilla.org/show_bug.cgi?id=1985341): no QUIC upgrade with a custom CA
- The user-facing consequence. Firefox 142, self-hosted nginx with a custom CA:
  Firefox stays on h2 while `curl --http3` works. Resolution: **INVALID** (by design).
  Flipping the pref to false restores HTTP/3. Note the heuristic also catches
  user-imported Authorities roots, and `security.enterprise_roots.enabled` is on by default.
- Quote (c7, Max Inden), the rationale: "We take a third-party root as an
  indicator that the TLS connection is being intercepted, e.g. by an anti-virus
  software. We had multiple occasions where such machine-in-the-middle software
  did not proxy the connection according to the specification, leading to bugs
  very hard to root cause. In addition, these would lead users to blame Firefox,
  not the buggy machine-in-the-middle software. Thus we have decided to disable
  HTTP/3 ... The assumption being that those machine-in-the-middle software does
  a better job proxying HTTP/2 and HTTP/1."

### [Bug 2006660](https://bugzilla.mozilla.org/show_bug.cgi?id=2006660): make it enterprise-policy configurable
- The gap: the only escape hatch is the raw about:config pref, no `policies.json`
  or GPO knob. An enterprise running a correct HTTP/3 proxy still gets HTTP/3
  disabled with no managed way to re-enable it. Status: **NEW / open**.

---

## Part B: interception corrupting QUIC so it fails

### [Bug 2034178](https://bugzilla.mozilla.org/show_bug.cgi?id=2034178): Facebook blank behind Bitdefender (FF 150)
- Vendor: **Bitdefender** (Online Threat Prevention / Search Advisor, its HTTP/3
  inspection). Regression in Firefox 150, Brave/Chrome unaffected.
- Root cause: the new **SCONE** feature ([draft-ietf-scone-protocol](https://datatracker.ietf.org/doc/draft-ietf-scone-protocol/))
  was defaulted off in [neqo#3492](https://github.com/mozilla/neqo/pull/3492), but
  that flag only gated advertising the transport parameter, not the Initial-packet
  padding. neqo v0.24.1 still emitted the SCONE indicator bytes **`0xc8 0x13`** in
  every Initial. Facebook's edge reacted to the indicator; the QUIC handshake still
  completed (SCONE is on-path signaling, not part of the handshake) so **H3 to H2
  fallback never triggered**, and Bitdefender's inspection then broke on the altered frames.
- Fix: gate the Initial padding on `scone_enabled()`,
  [neqo#3573](https://github.com/mozilla/neqo/pull/3573), released as neqo v0.24.2,
  cherry-picked to v0.26.1 ([neqo#3574](https://github.com/mozilla/neqo/pull/3574)).
  Firefox 150.0.1. VERIFIED FIXED on Win 11 + Bitdefender Total Security.
- Quote (c23, Max Inden): "every Firefox 150 client signals SCONE on the wire
  without advertising it ... the padding contents are an endpoint's prerogative
  ... HTTP/3 inspectors are expected to tolerate that ... pragmatically it's
  tripping Bitdefender here, so backing it out for now is the least disruptive mitigation."

### [Bug 1990699](https://bugzilla.mozilla.org/show_bug.cgi?id=1990699): sporadic Google Drive stalls, Firefox only
- On-path QUIC breakage: neqo logs show all HTTP/3 connections blocked because
  crypto frames were lost, correctly triggering H3 to H2 fallback, but the
  **fallback itself was broken** (anonymous-connection coalescing refused the h2
  connection). So the QUIC path was dead and the escape hatch failed too.
- Fix: allow fallback to a coalescing connection; uplifted broadly. The Firefox
  defect fixed here is the broken fallback, not the crypto loss itself (the cause
  of the loss is not conclusively attributed to AV vs a lossy path).
- Quote (c10, Kershaw Chang): "All HTTP/3 connections appear to be blocked ...
  crypto frames were lost ... the fallback connection failed to be created ...
  we allow coalescing of anonymous connections, but this doesn't work for fallback connections."

### [Bug 1990210](https://bugzilla.mozilla.org/show_bug.cgi?id=1990210): `unknown_ca` on shutdown despite a trusted AV root
- Vendor: **Kaspersky** (HTTPS MITM). TLS-layer, not QUIC-specific, included for
  the interception theme. Firefox unloads trust anchors at shutdown, so in-flight
  verifications fail with unknown-CA and Firefox sends a spec-wrong `unknown_ca`
  alert. Status: **REOPENED**, unowned.

---

## The Chrome parallel (verbatim)

[chromium.org "Playing with QUIC"](https://www.chromium.org/quic/playing-with-quic/),
cited by Max in [1985341 c7](https://bugzilla.mozilla.org/show_bug.cgi?id=1985341#c7):
"It is not possible to trust a custom CA using this flag. If you wish to deploy a
MITM proxy that intercepts traffic, you need to block QUIC entirely and intercept
TLS instead."

Both browsers converge: QUIC and transparent TLS interception do not mix. To MITM,
block QUIC and fall back to TLS. Firefox automates the block via the third-party-root
heuristic; Chrome states it as an operator requirement and does not accept custom
CAs for QUIC at all.
