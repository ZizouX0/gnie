// Regenerates docs/GNIE-v2-Specification.pdf from spec.template.html
// Requires: npm i @fontsource/cormorant-garamond @fontsource/manrope playwright
// Usage: node build.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString('base64')}`;

// self-host the two site fonts inside the PDF
const faces = [
  ['Cormorant Garamond', 'cormorant-garamond', [400, 600]],
  ['Manrope', 'manrope', [400, 500, 700]],
].flatMap(([family, pkg, weights]) =>
  weights.map((w) => {
    const file = join(here, 'node_modules', '@fontsource', pkg, 'files', `${pkg}-latin-${w}-normal.woff2`);
    return `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:block;` +
           `src:url(${b64(file, 'font/woff2')}) format('woff2');}`;
  })
);

let html = readFileSync(join(here, 'spec.template.html'), 'utf8')
  .replace('/*FONTS*/', faces.join('\n'))
  .replace('{{LOGO}}', b64(join(repo, 'src/assets/brand/gnie-logo-gold.png'), 'image/png'))
  .replace('{{CRYO}}', b64(join(repo, 'src/assets/machines/cryolipolyse-7d-360/cryolipolyse-7d-360-hero.jpg'), 'image/jpeg'))
  .replace('{{VSHAPE}}', b64(join(repo, 'src/assets/machines/v-shape-platinum/v-shape-platinum-hero.jpg'), 'image/jpeg'))
  .replace('{{VISBODY}}', b64(join(repo, 'src/assets/machines/visbody-m30/visbody-m30-hero.jpg'), 'image/jpeg'));

// number the folios in document order (the cover carries none)
let n = 1;
html = html.replace(/<span class="num">\d+<\/span>/g, () => `<span class="num">${String(++n).padStart(2, '0')}</span>`);

const out = join(here, 'spec.built.html');
writeFileSync(out, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${out}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: join(repo, 'docs', 'GNIE-v2-Specification.pdf'),
  format: 'A4', printBackground: true, preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
console.log('docs/GNIE-v2-Specification.pdf written');
