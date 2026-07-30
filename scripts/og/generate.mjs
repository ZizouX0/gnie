#!/usr/bin/env node
/**
 * Per-page Open Graph cards for GNIE Aesthetics v2.
 *
 *   node scripts/og/generate.mjs            # write every card
 *   node scripts/og/generate.mjs --check    # regenerate and fail on any diff
 *   node scripts/og/generate.mjs machines/ems-16   # only matching outputs
 *
 * Output — one 1200×630 PNG per page, mirroring the layout's own props:
 *
 *   public/og/<locale>/<page>.png              home, machines, contact, legal, privacy
 *   public/og/<locale>/machines/<slug>.png     one machine
 *
 * i.e. `/og/${locale}/${page}${slug ? "/" + slug : ""}.png`, which Base.astro
 * can compute from the props it already receives.
 *
 * The page list is derived from src/content/machines/** and src/i18n/routes.ts:
 * a thirteenth machine, or a new route, needs no edit here. Every string is
 * read from the files the site renders, so a card can never drift into the
 * wrong language or invent copy.
 *
 * Deterministic: no timestamps, no randomness, sorted traversal. Running it
 * twice writes byte-identical files.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { cardHtml, loadAssets, WIDTH, HEIGHT } from "./card.mjs";
import { readLocales, readUi, readSegments, readMachines, staticPages } from "./sources.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = join(ROOT, "public/og");
const require = createRequire(import.meta.url);

/* ── environment ───────────────────────────────────────────────────
   Playwright and Chromium are build-time tools, not site dependencies:
   they are never added to package.json. Point OG_PLAYWRIGHT / OG_CHROMIUM
   at them, or let the search below find the usual locations. */

function findPlaywright() {
  const candidates = [
    process.env.OG_PLAYWRIGHT,
    join(ROOT, "node_modules/playwright/index.mjs"),
    ...expand("/tmp/claude-*/*/*/*/*/node_modules/playwright/index.mjs"),
    "/usr/lib/node_modules/playwright/index.mjs",
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(
    "Playwright not found. Install it somewhere and set OG_PLAYWRIGHT=/path/to/playwright/index.mjs",
  );
}

/** Tiny `*`-only glob, sorted, so the search stays predictable. */
function expand(pattern) {
  const parts = pattern.split("/").filter(Boolean);
  let paths = ["/"];
  for (const part of parts) {
    const next = [];
    for (const base of paths) {
      if (!part.includes("*")) {
        const p = join(base, part);
        if (existsSync(p)) next.push(p);
        continue;
      }
      const re = new RegExp(`^${part.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
      let entries = [];
      try {
        entries = readdirSync(base, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        if (re.test(e.name)) next.push(join(base, e.name));
      }
    }
    paths = next;
  }
  return paths;
}

function findChromium() {
  const fromEnv = process.env.OG_CHROMIUM;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const roots = ["/opt/pw-browsers", join(process.env.HOME ?? "", ".cache/ms-playwright")];
  for (const r of roots) {
    if (!existsSync(r)) continue;
    for (const d of readdirSync(r).sort()) {
      const exe = join(r, d, "chrome-linux/chrome");
      if (existsSync(exe)) return exe;
    }
  }
  return undefined; // let Playwright fall back to its own download
}

/* ── the page list ─────────────────────────────────────────────── */

function buildSpecs() {
  const locales = readLocales(ROOT);
  const ui = readUi(ROOT, locales);
  const segments = readSegments(ROOT, locales);
  const defaultLocale = (readFileSync(join(ROOT, "src/i18n/ui.ts"), "utf8").match(
    /defaultLocale:\s*Locale\s*=\s*"(\w+)"/,
  ) ?? [])[1];
  if (!defaultLocale) throw new Error("ui.ts: could not read defaultLocale");

  const specs = [];
  for (const locale of locales) {
    const machines = readMachines(ROOT, locale);
    for (const p of staticPages(
      ROOT,
      locale,
      locale === defaultLocale,
      segments,
      ui,
      machines.length,
    )) {
      specs.push({ ...p, out: `${locale}/${p.page}.png` });
    }
    for (const m of machines) {
      const category = ui[locale][`cat.${m.category}`];
      if (!category) throw new Error(`No label for category "${m.category}" in ${locale}`);
      specs.push({
        locale,
        page: "machines",
        slug: m.slug,
        kind: "machine",
        title: m.name,
        eyebrow: category,
        qualifier: ui[locale]["site.tagline"],
        brand: m.brand,
        heroImage: m.heroImage,
        out: `${locale}/machines/${m.slug}.png`,
      });
    }
  }
  return specs.sort((a, b) => a.out.localeCompare(b.out));
}

/* ── rendering ─────────────────────────────────────────────────── */

const sharp = require(join(ROOT, "node_modules/sharp"));

/**
 * Product photos: sRGB (one catalogue shot is CMYK), sized for a 2× render.
 *
 * Manufacturer shots arrive on every kind of ground — white studio sweeps,
 * blue key art, black sets. A shot that sits on a plain light field has that
 * field knocked out so the machine floats on the card's near-black instead of
 * dropping a white slab into it; everything else is used as delivered. The
 * test is measured on the pixels, so a new shot needs no decision here.
 */
async function preparePhoto(file) {
  const base = sharp(file)
    .toColourspace("srgb")
    .resize({
      width: 760,
      height: 950,
      fit: "inside",
      withoutEnlargement: true,
      kernel: "lanczos3",
    });

  const cut = await knockOutLightGround(base);
  if (cut) {
    const meta = await sharp(cut).metadata();
    return { src: `data:image/png;base64,${cut.toString("base64")}`, ratio: meta.width / meta.height };
  }

  const { data, info } = await base
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });
  return { src: `data:image/jpeg;base64,${data.toString("base64")}`, ratio: info.width / info.height };
}

/**
 * Flood the plain light ground away from the borders inward, with a soft edge.
 * Returns null unless the border really is one flat light field, and never
 * crosses into the product: the fill stops as soon as a pixel darkens.
 */
async function knockOutLightGround(pipeline) {
  const { data, info } = await pipeline
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const depth = (p) => 255 - Math.min(data[p * ch], data[p * ch + 1], data[p * ch + 2]);

  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  const light = border.filter((p) => depth(p) <= 18).length / border.length;
  if (light < 0.9) return null;

  const FLAT = 18; // fully background
  const EDGE = 40; // beyond this we are on the product
  const seen = new Uint8Array(w * h);
  const alpha = new Uint8Array(w * h).fill(255);
  const stack = border.filter((p) => depth(p) <= EDGE);
  for (const p of stack) seen[p] = 1;
  while (stack.length) {
    const p = stack.pop();
    const d = depth(p);
    alpha[p] = d <= FLAT ? 0 : Math.round(((d - FLAT) / (EDGE - FLAT)) * 255);
    if (d > FLAT) continue;
    const x = p % w;
    const y = (p / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const q = ny * w + nx;
      if (seen[q] || depth(q) > EDGE) continue;
      seen[q] = 1;
      stack.push(q);
    }
  }
  for (let p = 0; p < w * h; p++) data[p * ch + 3] = alpha[p];
  return sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Rendered at 2× and resampled down: real type, supersampled, never upscaled.
 * The palette PNG keeps a photo-bearing card around 100 KB with no visible
 * banding on this flat, near-black artwork.
 */
async function toPng(raw) {
  return sharp(raw)
    .resize(WIDTH, HEIGHT, { kernel: "lanczos3" })
    .png({ palette: true, colours: 256, dither: 1, effort: 10, compressionLevel: 9 })
    .toBuffer();
}

/**
 * Runs inside the page: shrink the display face one pixel at a time until the
 * title fits its box, whatever its length. Measured, not guessed — and the
 * same string always lands on the same size, so the output stays stable.
 */
function fitTitle() {
  const el = document.querySelector("[data-fit]");
  const box = el.parentElement;
  const maxHeight = Number(el.dataset.fitBox);
  const max = Number(el.dataset.fitMax);
  let size = max;
  for (; size > 26; size -= 1) {
    el.style.fontSize = size + "px";
    if (el.scrollHeight <= maxHeight && el.scrollWidth <= box.clientWidth + 1) break;
  }
  return `${size}px${size < max ? " (shrunk)" : ""}`;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const filters = args.filter((a) => !a.startsWith("--"));

  const specs = buildSpecs().filter(
    (s) => filters.length === 0 || filters.some((f) => s.out.includes(f)),
  );
  if (specs.length === 0) throw new Error("no page matched");

  const assets = loadAssets(ROOT);
  const { chromium } = await import(findPlaywright());
  const executablePath = findChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
  });

  const photos = new Map();
  let changed = 0;
  let bytes = 0;

  for (const spec of specs) {
    if (spec.heroImage) {
      if (!photos.has(spec.heroImage)) {
        photos.set(spec.heroImage, await preparePhoto(spec.heroImage));
      }
      const photo = photos.get(spec.heroImage);
      spec.photo = photo.src;
      spec.photoRatio = photo.ratio;
    }
    await page.setContent(cardHtml(spec, assets), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const fitted = await page.evaluate(fitTitle);
    const raw = await page.screenshot({ type: "png" });
    const png = await toPng(raw);

    const dest = join(OUT_DIR, spec.out);
    mkdirSync(dirname(dest), { recursive: true });
    const before = existsSync(dest) ? readFileSync(dest) : null;
    const same = before && before.equals(png);
    if (!same) {
      if (check) {
        console.error(`stale: public/og/${spec.out}`);
        changed++;
      } else {
        writeFileSync(dest, png);
        changed++;
      }
    }
    bytes += png.length;
    console.log(
      `${same ? "  ok  " : check ? " diff " : " wrote"} og/${spec.out.padEnd(42)} ` +
        `${String(Math.round(png.length / 1024)).padStart(4)} KB  title ${fitted}`,
    );
  }

  await browser.close();
  console.log(
    `\n${specs.length} cards · ${(bytes / 1024).toFixed(0)} KB total · ` +
      `${(bytes / specs.length / 1024).toFixed(0)} KB average · ${changed} ${check ? "stale" : "written"}`,
  );
  if (check && changed > 0) process.exitCode = 1;
}

await main();
