/*
 * Export decks to PDF with headless Chromium (Playwright), using reveal.js's
 * built-in ?print-pdf print view. Produces vector-crisp output because the
 * charts render as SVG.
 *
 *   npm install          # once
 *   npm run pdf          # all NN-* decks -> dist/<deck>.pdf
 *   npm run pdf 01-tu-dresden   # a single deck
 *
 * Chromium is pre-provisioned in this environment (PLAYWRIGHT_BROWSERS_PATH);
 * elsewhere `npx playwright install chromium` fetches it.
 */
import { chromium } from 'playwright';
import { readdirSync, mkdirSync, existsSync, globSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

// Prefer a pre-installed Chromium (e.g. /opt/pw-browsers) over a version-pinned
// download, so export works even when the local Playwright build differs.
function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!base) return undefined;
  const hits = globSync(join(base, 'chromium-*/chrome-linux/chrome'));
  return hits.sort().pop();
}

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, 'dist');
mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const decks = (args.length ? args : readdirSync(root)
  .filter((d) => /^\d\d-/.test(d) && existsSync(join(root, d, 'index.html'))))
  .map((d) => d.replace(/\/+$/, ''));

if (!decks.length) { console.error('No decks found.'); process.exit(1); }

// 16:9 at reveal's default logical size.
const WIDTH = 1280, HEIGHT = 720;

const executablePath = findChromium();
const browser = await chromium.launch(executablePath ? { executablePath } : {});
try {
  for (const deck of decks) {
    const indexPath = join(root, deck, 'index.html');
    if (!existsSync(indexPath)) { console.warn(`skip ${deck}: no index.html`); continue; }
    const url = pathToFileURL(indexPath).href + '?print-pdf';
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give reveal's print view + ECharts SVG a moment to lay out.
    await page.waitForFunction(() => document.documentElement.classList.contains('reveal-print')
      || (window.Reveal && window.Reveal.isReady && window.Reveal.isReady()), { timeout: 15000 })
      .catch(() => {});
    // Ensure every <img> is decoded before printing: Chromium's page.pdf()
    // embeds nothing for images that have not been rasterized yet.
    await page.evaluate(() => Promise.all(
      [...document.images].map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {})))
    ));
    await page.waitForTimeout(1200);
    const out = join(outDir, `${deck}.pdf`);
    await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true,
      width: `${WIDTH}px`, height: `${HEIGHT}px`, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await page.close();
    console.log(`  ${deck}  ->  dist/${deck}.pdf`);
  }
} finally {
  await browser.close();
}
