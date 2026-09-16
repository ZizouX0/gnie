#!/usr/bin/env node
/**
 * Builds the two client documents that are pure text: the gaps sheet and the
 * information-request sheet.
 *
 *   node docs/client-source/build-docs.mjs
 *
 * These two carry no screenshots — only `{{LOGO}}` — so they rebuild from the
 * repository alone. `build-client.mjs` handles the other two, which embed
 * captures of the site and therefore need a running dev server first.
 *
 * This script exists because its predecessor did not. The gaps sheet was built
 * by a `build-manque.mjs` that lived only in a scratch directory, and when the
 * container was rebuilt it went with it — leaving a committed template with no
 * way to turn it back into the PDF the client reads. Anything that produces a
 * deliverable belongs in the repository.
 *
 * Fonts are embedded as base64 rather than linked: the PDF has to render the
 * same on a machine that has never seen these typefaces.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const OUT = join(ROOT, "docs/client");

/** Playwright is a build-time tool, never a site dependency. */
function findPlaywright() {
  const candidates = [
    process.env.OG_PLAYWRIGHT,
    join(ROOT, "node_modules/playwright/index.mjs"),
    ...["/tmp/claude-0"].flatMap(() => []),
    process.env.PDF_PLAYWRIGHT,
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error("Playwright not found. Set PDF_PLAYWRIGHT=/path/to/playwright/index.mjs");
}
function findChromium() {
  for (const c of [
    process.env.PDF_CHROMIUM,
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/opt/pw-browsers/chromium/chrome-linux/chrome",
  ].filter(Boolean)) {
    if (existsSync(c)) return c;
  }
  return undefined; // let Playwright use its own default
}

const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString("base64")}`;

/**
 * Only the weights `client.css` actually asks for. A face that is declared but
 * never used still costs ~40 KB of base64 in every document.
 */
const FACES = [
  ["Cormorant Garamond", 400, "cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2"],
  ["Cormorant Garamond", 600, "cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2"],
  ["Manrope", 400, "manrope/files/manrope-latin-400-normal.woff2"],
  ["Manrope", 500, "manrope/files/manrope-latin-500-normal.woff2"],
  ["Manrope", 700, "manrope/files/manrope-latin-700-normal.woff2"],
];

function fontCss() {
  return FACES.map(([family, weight, rel]) => {
    const file = join(ROOT, "node_modules/@fontsource", rel);
    if (!existsSync(file)) throw new Error(`missing font file: ${rel} — run npm install`);
    return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(${b64(file, "font/woff2")}) format('woff2')}`;
  }).join("\n");
}

const JOBS = [
  ["manque.template.html", "GNIE-Ce-Qui-Manque.pdf"],
  ["infos.template.html", "GNIE-Informations-A-Fournir.pdf"],
];

const { chromium } = await import(findPlaywright());
const css = readFileSync(join(HERE, "client.css"), "utf8");
const fonts = fontCss();
const logo = b64(join(ROOT, "src/assets/brand/gnie-logo-gold.png"), "image/png");

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ["--no-sandbox"],
});

let failed = false;
for (const [src, out] of JOBS) {
  let html = readFileSync(join(HERE, src), "utf8")
    .replace("/*FONTS*/", fonts)
    .replace("/*CSS*/", css)
    .replaceAll("{{LOGO}}", logo);

  // Page numbers are assigned here, so reordering sections cannot desync them.
  let n = 0;
  html = html.replace(/<span class="num">\d+<\/span>/g, () => `<span class="num">${String(++n).padStart(2, "0")}</span>`);

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  /* Each .page is a fixed A4 box, so content that outgrows it does not push the
     page taller — it silently overlaps the footer and the PDF still "builds".
     One extra table row is enough to do it. Catch it here, not in the client's
     inbox. */
  const over = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".page"))
      .map((s, i) => {
        const f = s.querySelector(".flow");
        return f && f.scrollHeight > f.clientHeight + 2 ? `page ${i + 1}: +${f.scrollHeight - f.clientHeight}px` : null;
      })
      .filter(Boolean),
  );
  if (over.length) {
    console.error(`✗ ${out} — content overflows the A4 box:\n   ${over.join("\n   ")}`);
    failed = true;
    await page.close();
    continue;
  }

  await page.pdf({ path: join(OUT, out), width: "210mm", height: "297mm", printBackground: true });
  await page.close();
  console.log(`wrote docs/client/${out}`);
}

await browser.close();
if (failed) process.exit(1);
