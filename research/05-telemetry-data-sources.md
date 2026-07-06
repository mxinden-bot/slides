# Firefox networking telemetry charts: real public data sources

Reference for reproducing three charts from `https://performance.mozilla.org/networking.html`:

1. DNS resolution time P75 (DoH vs OS resolver, US/Canada)
2. HTTP/3 share of Firefox responses over time (HTTP protocol version)
3. Time to request start by HTTP protocol version (P75, Firefox for Android)

Verified July 2026. **Headline finding: all three charts on performance.mozilla.org are
driven by public STMO/Redash CSV endpoints whose API keys are embedded in the page HTML.
You do NOT need a login to pull them.** Every underlying probe is the Glean `pageload`
ping event `perf.page_load` and its numeric extra keys.

---

## 1. performance.mozilla.org (the primary, ready-to-use source)

The page loads Chart.js and pulls each chart's data client-side from a Redash query
`results.csv` URL with a per-query `api_key` baked into the HTML. `assets/main-ui.js` is
only the sidebar; the chart configs live in an inline `<script>` in `networking.html`
(arrays `RELEASE_CHARTS` and `NIGHTLY_CHARTS`, ~line 549+). Each entry is
`{ id, url, valueColumn, ... }`.

- Endpoint pattern: `https://sql.telemetry.mozilla.org/api/queries/<QUERY_ID>/results.csv?api_key=<KEY>`
- The same base without `/results.csv` returns the query JSON **including the full SQL and
  the source BigQuery table** (also works with the api_key, no login):
  `https://sql.telemetry.mozilla.org/api/queries/<QUERY_ID>?api_key=<KEY>`
- Reliability: high. Public keys, CORS-enabled (the browser fetches them directly), refreshed
  by Redash on the query's schedule. Keys could be rotated by the portal owners at any time,
  so re-scrape the HTML if a 403/404 appears. Data is a 1% (desktop) / ~0.01% (Fenix) sample.

### Exact queries for the three target charts (release channel)

| Chart | id in page | Query ID | api_key | CSV columns |
|---|---|---|---|---|
| 1. DNS lookup time, DoH vs OS, US+CA, P75/P95 (desktop) | `dns-lookup-desktop` | **121688** | `zhnbWXs4e8ArSumpkVDHzFmVBcsFcDIzAHRAqcfK` | `date, trr_domain, value_at_percentile, ma_7day` |
| 2. HTTP protocol version share incl HTTP/3 (desktop) | `http-desktop` | **113403** | `sJ7dVgzAsACPSW93F0k0UAN6Ak7EQI05pSxrAdBK` | `date, http_version_name, percentage, percentage_7d_moving_avg` |
| 3. Time to request start by HTTP version, P75 (Android/Fenix) | `ttrs-android` | **115316** | `gOm1naQJ8JgSmE9cOIcyyWz1Jrq49HWCKmrMtEGS` | `date, http_protocol_version, P75_7day_average_ms` |

Example (confirmed working):

```bash
# Chart 1: DNS lookup P75/P95, DoH vs os_resolver, US+CA, 7-day MA (ms)
curl -sS "https://sql.telemetry.mozilla.org/api/queries/121688/results.csv?api_key=zhnbWXs4e8ArSumpkVDHzFmVBcsFcDIzAHRAqcfK"
# date,trr_domain,value_at_percentile,ma_7day
# 2025-07-06,DoH-p75,14.0,14.0
# 2025-07-06,os_resolver-p75,14.0,14.0
# 2025-07-06,DoH-p95,65.0,65.0
# 2025-07-06,os_resolver-p95,94.0,94.0   ... (~365 days x 4 series)
# For the P75 chart use rows where trr_domain in ('DoH-p75','os_resolver-p75'); plot ma_7day.

# Chart 2: HTTP version share; HTTP/3 = rows where http_version_name='HTTP/3'
curl -sS "https://sql.telemetry.mozilla.org/api/queries/113403/results.csv?api_key=sJ7dVgzAsACPSW93F0k0UAN6Ak7EQI05pSxrAdBK"
# date,http_version_name,percentage,percentage_7d_moving_avg
# 2025-07-06,HTTP/3,20.15,20.15   (also HTTP/1.1, HTTP/2, Unknown per day)

# Chart 3: Fenix time-to-request-start P75 by HTTP version
curl -sS "https://sql.telemetry.mozilla.org/api/queries/115316/results.csv?api_key=gOm1naQJ8JgSmE9cOIcyyWz1Jrq49HWCKmrMtEGS"
# date,http_protocol_version,P75_7day_average_ms
# 2025-07-06,3,115.0    (http_protocol_version in 1,2,3,'overall')
```

### Full chart -> query map (for context / variants)

Release (`RELEASE_CHARTS`): dns-desktop 112861 (DNS resolver method %), http-desktop **113403**,
https-desktop 115307, dns-lookup-desktop **121688**, ttrs-desktop 114600, fcp-desktop 114620,
lcp-desktop 114621, tls-desktop 113419, http-android 115321, https-android 115320,
dns-lookup-android 115329, ttrs-android **115316**, fcp-android 115318, lcp-android 115319,
nettype-android 115600, tls-android 115579.

Nightly (`NIGHTLY_CHARTS`): dns-desktop 115473, http-desktop 115477, https-desktop 115479,
dns-lookup-desktop 121686, ttrs-desktop 115484, fcp-desktop 115488, lcp-desktop 115494,
dns-android 115475, http-android 115478, https-android 115480, dns-lookup-android 121687,
ttrs-android 115485, fcp-android 115489, lcp-android 115497, nettype-android 115599,
tls-desktop 115601, tls-android 115576. (Each carries its own api_key in the page HTML;
re-scrape `networking.html` to get the current key for any of these.)

### Underlying BigQuery tables + probe extras (pulled from the query SQL)

All three read the Glean `pageload` ping's `perf.page_load` event, unnesting `event.extra`:

- **Chart 1 (121688):** table `firefox_desktop.pageload_1pct`; extras `dns_lookup_time`,
  `trr_domain`; filtered to country US and CA; `APPROX_QUANTILES` at p75/p95; 7-day AVG window.
  (`trr_domain` non-empty => DoH/TRR, empty/native => os_resolver.)
- **Chart 2 (113403):** table `firefox_desktop.pageload_1pct`; extra `http_ver` (1/2/3);
  daily count share per version + 7-row moving average.
- **Chart 3 (115316):** table `fenix.pageload`; extras `time_to_request_start`, `http_ver`;
  `APPROX_QUANTILES(...,101)[OFFSET(75)]` per version + 7-day AVG. Sampled with `RAND() < 0.0001`.

These tables are in Mozilla's `mozdata`/telemetry BigQuery and require STMO login to query
directly; the CSV endpoints above are the public escape hatch.

---

## 2. The Glean probe / event behind all three charts

Defined in `dom/metrics.yaml` (mozilla-central), category `perf`:

- Event: **`perf.page_load`**, `type: event`, `send_in_pings: [pageload]`, `expires: never`.
  Recorded once per top-level content document load. Bug 1759744 (+ follow-ups).
- Relevant numeric `extra_keys` (all `type: quantity`, `unit: ms` unless noted):
  - `http_ver` (unit: integer) - HTTP protocol version, 1/2/3
  - `dns_lookup_time` - DNS lookup of the top-level document
  - `time_to_request_start` - requestStart minus navigationStart
  - `tls_handshake_time`, `response_time`, `fcp_time`, `lcp_time`, `load_time`,
    `redirect_time`, `js_exec_time`
  - `trr_domain` (string) - the TRR/DoH domain used (empty => OS resolver)

Discovery surfaces:
- Glean Dictionary: `https://dictionary.telemetry.mozilla.org/apps/firefox_desktop/metrics/perf_page_load`
  and the ping page `.../pings/pageload` (Fenix: `apps/fenix/...`). Note the dictionary UI is a
  JS SPA, so `curl`/WebFetch of the HTML returns an empty shell; use the site in a browser or the
  probeinfo API below.
- probeinfo API (raw JSON, scriptable): `https://probeinfo.telemetry.mozilla.org/glean/firefox-desktop/metrics`
  (large; grep for `perf.page_load`). App slugs: `firefox-desktop`, `fenix`.
- These extras are **event extras, not standalone metrics**, so they are NOT in GLAM (see below).

---

## 3. GLAM: usable only as an approximate proxy, not for these exact charts

GLAM API format (generalized from `/home/user/savearoundtrip/scripts/fetch-glam.mjs`):

```bash
curl -sS -X POST https://glam.telemetry.mozilla.org/api/v1/data/ \
  -H 'Content-Type: application/json' \
  -d '{"query":{"product":"fog","app_id":"release","os":"*","ping_type":"*",
       "probe":"networking_http_response_version","aggregationLevel":"version","versions":20}}'
```

- `product`: `fog` (Glean desktop) or `fenix` for Android.
- `app_id`: channel, one of `nightly` / `beta` / `release` (nightly has the widest probe coverage).
- `probe`: the Glean metric name with dots replaced by underscores
  (e.g. `networking.dns_lookup_time` -> `networking_dns_lookup_time`).
- `aggregationLevel`: `build_id` (per-build time series) or `version`.
- Response: `{ "response": [ { build_id, version, metric_key, histogram, non_norm_histogram,
  total_users, ... } ] }`. For histograms/distributions you reconstruct percentiles/shares
  client-side (see `seriesH3`/`eventCount` in fetch-glam.mjs). Explore URL for humans:
  `https://glam.telemetry.mozilla.org/fog/probe/<probe>/explore`.
- Reliability: medium. Undocumented internal API, rolling build_id window (merge across runs to
  keep history), aggregates are per-client not per-connection/navigation.

**Why GLAM cannot reproduce the three charts exactly:** the charts come from the `perf.page_load`
event's extras, and GLAM aggregates histograms/scalars/distributions, not event extras. GLAM also
has no per-country (US/CA) split and no DoH-vs-OS split of DNS time.

GLAM-available *proxy* probes (standalone metrics, close-but-not-identical), names verified in
mozilla-central metrics.yaml:
- HTTP/3 share proxy: **`networking.http_response_version`** (labeled_counter, labels are HTTP
  versions; bug 1876776) or legacy dist **`http.response_version`** (custom_distribution, from
  `HTTP_RESPONSE_VERSION`). GLAM probe: `fog/probe/networking_http_response_version`.
- DNS time proxy: **`networking.dns_lookup_time`** (timing_distribution) for overall; DoH-only:
  **`dns.trr_lookup_time`** (timing_distribution). No US/CA geo filter in GLAM.
- No standalone probe for "time to request start"; that value only exists as the
  `perf.page_load` extra, so chart 3 is STMO-only.

---

## 4. Cloudflare Radar API (independent third-party source for HTTP/3 adoption)

Good for chart 2 as an *external* cross-check (global internet-wide, not Firefox-specific).
Requires a free Cloudflare API token (`Authorization: Bearer <token>`).

```bash
# Point-in-time HTTP-version share (HTTP/1.x, HTTP/2, HTTP/3), e.g. last 90 days
curl -sS "https://api.cloudflare.com/client/v4/radar/http/summary/http_version" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -G --data-urlencode "dateRange=90d"
# -> summary_0: { "HTTP/1.x": "...", "HTTP/2": "...", "HTTP/3": "..." }, normalization PERCENTAGE

# Time series of the HTTP/3 share (use the timeseries_groups variant for a stacked series)
curl -sS "https://api.cloudflare.com/client/v4/radar/http/timeseries_groups/http_version" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -G --data-urlencode "dateRange=52w" --data-urlencode "aggInterval=1w"
```

Optional filters: `location=US`/`location=CA`, `botClass=LIKELY_HUMAN`, `dateStart`/`dateEnd`.
Docs: developers.cloudflare.com/radar (HTTP requests) and the API reference under
`radar/http/summary/http_version` and `radar/http/timeseries_groups/http_version`.
Reliability: high and stable, but measures Cloudflare's global request mix, so absolute numbers
differ from Firefox telemetry (Firefox HTTP/3 top-level-doc share was ~20% in mid-2025 per query
113403; Cloudflare reports HTTP/3 nearer ~30% of human traffic). Use it for narrative context,
not to match the Firefox chart line.

---

## Recommended pull for each of the 3 charts

**Chart 1 - DNS resolution time P75, DoH vs OS resolver, US/Canada (desktop):**
Reproducible from public data. `curl` query **121688**
(`.../api/queries/121688/results.csv?api_key=zhnbWXs4e8ArSumpkVDHzFmVBcsFcDIzAHRAqcfK`),
keep rows `trr_domain in ('DoH-p75','os_resolver-p75')`, plot `ma_7day` (ms) over `date` as two
lines. (Add `-p95` rows for the fuller portal chart.) GLAM/Radar cannot do the geo + resolver
split, so STMO CSV is the only faithful source. For Android use 115329, for nightly use 121686.

**Chart 2 - HTTP/3 share of Firefox responses over time (desktop):**
Reproducible from public data. `curl` query **113403**
(`.../api/queries/113403/results.csv?api_key=sJ7dVgzAsACPSW93F0k0UAN6Ak7EQI05pSxrAdBK`); filter
`http_version_name='HTTP/3'` and plot `percentage_7d_moving_avg` over `date` (or stack all four
versions). Optional external corroboration: Cloudflare Radar `http/timeseries_groups/http_version`.
Fenix variant: 115321. If the portal key ever dies, GLAM `networking_http_response_version` is a
rough proxy.

**Chart 3 - Time to request start by HTTP version, P75 (Firefox for Android):**
Reproducible from public data via the portal CSV, but STMO-only in substance (no GLAM/Radar
equivalent). `curl` query **115316**
(`.../api/queries/115316/results.csv?api_key=gOm1naQJ8JgSmE9cOIcyyWz1Jrq49HWCKmrMtEGS`); pivot on
`http_protocol_version` (1=HTTP/1.1, 2=HTTP/2, 3=HTTP/3, plus `overall`) and plot
`P75_7day_average_ms` over `date`. Because it derives from the `perf.page_load` event extra
`time_to_request_start`, only STMO/BigQuery (or this public CSV) can produce it; if the key is
rotated you would need STMO login to re-run the query against `fenix.pageload`.

**Bottom line:** all three are reproducible today with zero login by curling the embedded-key
Redash CSV endpoints. GLAM gives only approximate proxies (and nothing for chart 3); Cloudflare
Radar is a useful independent HTTP/3 cross-check for chart 2. The only scenario needing internal
STMO/Redash access is if Mozilla rotates the embedded api_keys.
