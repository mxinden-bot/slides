# Talk decks: conventions

Static reveal.js decks for Max Inden's networking talks. One repository, one
shared theme, one folder per talk. No build step: everything is vendored and
runs from `file://` or GitHub Pages.

## Layout

```
lib/reveal/     vendored reveal.js 5.x (dist + plugins + css/print/pdf.css)
lib/echarts/    vendored ECharts 5.x (SVG renderer)
theme/theme.css shared look + all diagram components
theme/charts.js window.Charts wrapper around ECharts
theme/seq.js    window.Seq SVG sequence-diagram renderer
NN-name/index.html + data.js   one folder per talk
research/       sourced background briefs per talk
export-pdf.mjs  Playwright -> PDF
index.html      landing page linking every deck
```

## Adding / editing a deck

- Copy an existing `NN-name/` (index.html + data.js) and add a card to `index.html`.
- Each `index.html` links `../lib/...` and `../theme/...` with **relative** paths (Pages serves under `/slides/`, so absolute paths break).
- Chart data lives in `NN-name/data.js` as `window.DECK_DATA` (loaded via `<script src>`, not fetch, so it works over `file://`).
- Reveal init at the bottom: `width:1280,height:720`; the render loop calls `Charts.renderAll()` + `Seq.renderAll()` on `ready`/`slidechanged`/`resize`.

## Charts (`theme/charts.js`)

- `Charts.line/bar/barH/donut/area(el, opts)`. Register per chart:
  `Charts.register('c-id', el => Charts.line(el, {...}))`, div `<div class="chart" id="c-id">`.
- ECharts **SVG renderer** and **`animation:false`** are mandatory: canvas is blurry in PDF and animation gets captured mid-flight during export.
- Categorical palette `--c1..--c7` in theme.css is the dataviz skill's **CVD-validated** set. Firefox orange (`--accent`) is chrome only, never a data series.
- Handy opts: line `{dashed, area, endLabels, yType:'log', yMin/yMax, yFormatter}`; bar `{stack, barLabels, refLine, yType:'log'}`; donut `{centerValue, centerLabel}`.

## Diagrams

- `theme/seq.js`: `Seq.render(el, {actors, messages})` draws client/server sequence diagrams (used for the QUIC handshake and Alt-Svc vs HTTPS-RR flows). `messages`: `{from,to,text,dashed,hl}` or `{note,over}`.
- CSS components in theme.css: `.hourglass` (thin-waist), `.protostack` (equal-height H1/H2/H3 stack), `.pipe` (syscall pipeline), `.hops` (annotated proxy chain), `.timeline` (attempt-delay dots).

## PDF export

```
npm install        # once, pulls Playwright
npm run pdf        # all decks -> dist/<deck>.pdf
npm run pdf 01-tu-dresden
```
`export-pdf.mjs` auto-detects a pre-installed Chromium via `PLAYWRIGHT_BROWSERS_PATH` (the CCR sandbox ships build 1194; a fresh `npm i playwright` wants a newer build and would fail without this).

## Style rules

- **No em dashes** (`—`): use a colon, comma, or parentheses.
- **Every data slide carries a source link** (GLAM probe, performance.mozilla.org, RFC, Bugzilla, etc.).
- Prefer **real telemetry** over invented numbers; if a value is illustrative, say so on-slide.

## Telemetry data recipe (the hard-won part)

Two public, no-login sources feed the real charts:

**1. performance.mozilla.org/networking.html -> STMO/Redash CSVs.** The page
embeds chart configs with per-query `api_key`s in its inline HTML. Pull directly:

```
curl "https://sql.telemetry.mozilla.org/api/queries/<ID>/results.csv?api_key=<KEY>"
```
Key queries (re-scrape the HTML if a key rotates -> 403): **121688** DNS lookup
P75/P95 DoH vs OS (US/CA), **113403** HTTP-version share (H3 %), **114600**
desktop time-to-request-start by version, **115316** Fenix TTRS. All derive from
the Glean `perf.page_load` pageload event.

**2. GLAM API -> distributions / percentiles / labeled counters.** Undocumented
but public:

```
POST https://glam.telemetry.mozilla.org/api/v1/data/
{"query":{"product":"fog","app_id":"nightly","os":"*","ping_type":"*",
          "probe":"<probe>","aggregationLevel":"version","versions":5}}
```
Each response row has `.percentiles` (timing/scalar distributions) and
`.non_norm_histogram` (sum `bucket*count` per `metric_key` to get **label
shares** for labeled_counters like ECN path capability or h3_discovery).

Probe naming (differs by category, confirm which prefix returns 200):
- `netwerk_happy_eyeballs_*` (the ten HE metrics: `end_to_end_time_succeeded/failed`, `winning_attempt_index`, `connection_attempt_count`, `cancelled_attempt_count`, `time_to_first_attempt`, `dns_resolution_time`, `h3_discovery`, `https_rr_features`, `https_rr_features_by_resolver`).
- `networking_http_3_*` (`udp_datagram_segments_received`, `udp_datagram_segment_size_received`, `ecn_path_capability`, `ecn_ce_ect0_ratio_received`, `download_throughput`, ...).

Metric definitions: firefox `netwerk/protocol/http/metrics.yaml` (happy_eyeballs)
and `netwerk/metrics.yaml` (networking category, http_3). A GLAM explore URL like
`https://glam.telemetry.mozilla.org/fog/probe/<probe>/explore` is a good on-slide
source link. `savearoundtrip`'s `scripts/fetch-glam.mjs` is a working reference
for the GLAM request shape.
