# Talks: Modern Network Protocols & Happy Eyeballs

Slide decks for a series of 2026 talks on Firefox's network stack. One repository,
one shared theme, one folder per talk.

## Decks

| Folder | Talk | Venue |
|--------|------|-------|
| `01-tu-dresden/` | Modern Network Protocols: What's Next for Firefox and the Web? | TU Dresden |
| `02-udp-io/` | Modern UDP I/O for Firefox in Rust | HTTP Workshop |
| `03-hev3-workshop/` | Rollout of Happy Eyeballs v3 in Firefox | HTTP Workshop |
| `04-quic-discussion/` | Discussion: Evolving HTTP/3 & QUIC beyond 30% | HTTP Workshop |
| `05-hev3-ietf/` | Happy Eyeballs v3 in Firefox: update | IETF, HE WG |

## Stack

- **[reveal.js](https://revealjs.com)** (vendored in `lib/reveal/`), HTML slides.
- **[ECharts](https://echarts.apache.org)** (vendored in `lib/echarts/`), SVG renderer, for the graphs.
- Shared look in `theme/theme.css`; shared chart helper in `theme/charts.js`.
- Chart data lives in each deck's `data/` as JSON, so graphs are reproducible.

## Working on a deck

```sh
npm run serve         # http://localhost:8000  -> open a deck folder
```

Keyboard: `S` speaker notes, `E` print/PDF view, `F` fullscreen, `?` help.

## Export to PDF

```sh
npm install           # once, pulls Playwright
npm run pdf           # all decks -> dist/<deck>.pdf
npm run pdf 01-tu-dresden
```

## Live site

Pushed to GitHub Pages via `.github/workflows/pages.yml`:
<https://mxinden-bot.github.io/slides/>
