#!/usr/bin/env node
/**
 * The content reference: every machine on the site, one after another, with
 * everything the site holds about it.
 *
 *   node docs/client-source/build-catalogue.mjs
 *   → docs/client/GNIE-Catalogue-Contenu.pdf
 *
 * This is a proofreading document, not a sales one. It exists so the client can
 * check what the site says about their equipment without clicking through
 * thirty pages, and so the seventeen machines that are written but not yet
 * published can be read at all — those have no page on the site.
 *
 * Every value is read straight out of `src/content/machines/fr/*.md`. Nothing
 * is summarised, reordered or rephrased on the way: a specification that reads
 * "0-7 Tesla" in the content file reads "0-7 Tesla" here. That is the whole
 * point of the document — a paraphrase would make it useless for checking.
 *
 * Unlike the other client documents, pages are not fixed A4 boxes: machines
 * differ in length by a factor of three, so the browser paginates and each
 * machine simply starts on a fresh page.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const LOCALE = "fr";
const SRC = join(ROOT, "src/content/machines", LOCALE);
const OUT = join(ROOT, "docs/client/GNIE-Catalogue-Contenu.pdf");

/** Display names for the ten families, in the order the site declares them. */
const CATEGORIES = {
  laser: "Laser",
  resurfacing: "Resurfacing",
  cryolipolyse: "Cryolipolyse",
  remodelage: "Remodelage corporel",
  visage: "Soin du visage",
  pressotherapie: "Pressothérapie",
  analyse: "Analyse corporelle",
  epilation: "Épilation",
  hifu: "HIFU",
  perinee: "Périnée",
};

/* ── read ──────────────────────────────────────────────────────── */

function readMachines() {
  const files = readdirSync(SRC).filter((f) => f.endsWith(".md")).sort();
  const out = files.map((file) => {
    const raw = readFileSync(join(SRC, file), "utf8");
    if (!raw.startsWith("---")) throw new Error(`${file}: no front matter`);
    const end = raw.indexOf("\n---", 3);
    if (end < 0) throw new Error(`${file}: unterminated front matter`);
    const data = yaml.load(raw.slice(4, end));
    const body = raw.slice(end + 4).trim();
    return { slug: file.replace(/\.md$/, ""), body, ...data };
  });
  out.sort((a, b) => a.order - b.order);

  const orders = out.map((m) => m.order);
  const dupes = orders.filter((o, i) => orders.indexOf(o) !== i);
  if (dupes.length) throw new Error(`duplicate order values: ${[...new Set(dupes)].join(", ")}`);
  return out;
}

/* ── render ────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString("base64")}`;

const FACES = [
  ["Cormorant Garamond", 400, "cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2"],
  ["Cormorant Garamond", 600, "cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2"],
  ["Manrope", 400, "manrope/files/manrope-latin-400-normal.woff2"],
  ["Manrope", 500, "manrope/files/manrope-latin-500-normal.woff2"],
  ["Manrope", 700, "manrope/files/manrope-latin-700-normal.woff2"],
];

const fontCss = () =>
  FACES.map(([family, weight, rel]) => {
    const file = join(ROOT, "node_modules/@fontsource", rel);
    if (!existsSync(file)) throw new Error(`missing font: ${rel} — run npm install`);
    return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(${b64(file, "font/woff2")}) format('woff2')}`;
  }).join("\n");

const CSS = `
:root{--ink:#1a1a1a;--muted:#5f5f5f;--line:#dcdcdc;--or:#9a7222;--wash:#faf8f4}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:'Manrope',sans-serif;font-size:9.2pt;line-height:1.55;color:var(--ink)}
h1,h2,h3{font-family:'Cormorant Garamond',serif;font-weight:600;margin:0}
a{color:inherit}

/* Cover */
.cover{height:257mm;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.cover img{width:34mm}
.cover h1{font-size:34pt;line-height:1.05;margin:0 0 4mm}
.eyebrow{font-size:7.5pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--or)}
.sub{color:var(--muted);max-width:120mm;margin:0}
.kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:8mm;border-top:1px solid var(--line);padding-top:5mm}
.kpi .n{font-family:'Cormorant Garamond',serif;font-size:22pt;color:var(--or);line-height:1}
.kpi .l{font-size:7.6pt;color:var(--muted);line-height:1.35}

/* How to read */
.note{background:var(--wash);border-left:2px solid var(--or);padding:4mm 5mm;margin:6mm 0;break-inside:avoid}
.note h3{font-size:12pt;margin-bottom:1.5mm}
.note p{margin:0 0 2mm}
.note p:last-child{margin:0}

/* Index */
.index{break-after:page}
.index table{width:100%;border-collapse:collapse;font-size:8.4pt}
.index th{text-align:left;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding:2mm 2mm 1.5mm}
.index td{padding:1.6mm 2mm;border-bottom:1px solid #efefef;vertical-align:top}
.index .num{color:var(--or);width:9mm}

/* One machine */
.machine{break-before:page}
.machine .head{border-bottom:1px solid var(--line);padding-bottom:3mm;margin-bottom:4mm}
.machine h2{font-size:23pt;line-height:1.1}
.machine .tag{color:var(--muted);font-style:italic;margin:1.5mm 0 0}
.meta{display:flex;flex-wrap:wrap;gap:2mm;margin-top:3mm}
.pill{font-size:7pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--line);border-radius:2mm;padding:.9mm 2.2mm;color:var(--muted)}
.pill.on{border-color:var(--or);color:var(--or)}
.pill.draft{border-color:#b06a1f;color:#b06a1f}

h3.sec{font-size:8pt;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--or);font-family:'Manrope',sans-serif;margin:6mm 0 2.5mm;break-after:avoid}
.excerpt{margin:0}
.pairs{margin:0}
.pairs .row{break-inside:avoid;margin-bottom:2.6mm}
.pairs .t{font-weight:700}
.pairs .d{color:#333;margin:0}
.chips{display:flex;flex-wrap:wrap;gap:1.5mm}
.chip{font-size:8pt;background:var(--wash);border:1px solid var(--line);border-radius:2mm;padding:.8mm 2.2mm}

table.specs{width:100%;border-collapse:collapse;font-size:8.6pt;break-inside:avoid;margin-bottom:3mm}
table.specs caption{caption-side:top;text-align:left;font-weight:700;font-size:8.2pt;padding-bottom:1.2mm}
table.specs td{border-bottom:1px solid #efefef;padding:1.3mm 2mm;vertical-align:top}
table.specs td.k{color:var(--muted);width:46%}
table.specs td.v{font-variant-numeric:tabular-nums}

.small{font-size:8pt;color:var(--muted)}
.kv{font-size:8pt;color:var(--muted);margin:0}
.kv b{color:var(--ink)}
`;

function pairs(items) {
  return `<div class="pairs">${items
    .map((b) => `<div class="row"><div class="t">${esc(b.title)}</div><p class="d">${esc(b.text)}</p></div>`)
    .join("")}</div>`;
}

function specTables(groups) {
  return groups
    .map(
      (g) => `<table class="specs"><caption>${esc(g.group)}</caption><tbody>${g.rows
        .map((r) => `<tr><td class="k">${esc(r.label)}</td><td class="v">${esc(r.value)}</td></tr>`)
        .join("")}</tbody></table>`,
    )
    .join("");
}

function machineSection(m, n, byName) {
  const cat = CATEGORIES[m.category] ?? m.category;
  const published = !m.draft;
  const rel = m.related.map((s) => byName.get(s) ?? `${s} (introuvable)`).join(" · ");
  const specCount = m.specs.reduce((t, g) => t + g.rows.length, 0);

  return `
<section class="machine">
  <div class="head">
    <div class="eyebrow">${String(n).padStart(2, "0")} · ${esc(cat)}</div>
    <h2>${esc(m.name)}</h2>
    <p class="tag">${esc(m.tagline)}</p>
    <div class="meta">
      <span class="pill ${published ? "on" : "draft"}">${published ? "En ligne" : "En attente de photographie"}</span>
      ${m.brand ? `<span class="pill">${esc(m.brand)}</span>` : ""}
      ${m.featured ? `<span class="pill">Mise en avant</span>` : ""}
      ${m.videoId ? `<span class="pill">Vidéo</span>` : ""}
      <span class="pill">${specCount} caractéristiques</span>
    </div>
  </div>

  <h3 class="sec">Résumé affiché dans le catalogue</h3>
  <p class="excerpt">${esc(m.excerpt)}</p>

  <h3 class="sec">Arguments présentés (${m.benefits.length})</h3>
  ${pairs(m.benefits)}

  ${
    m.applications.length
      ? `<h3 class="sec">Zones traitées (${m.applications.length})</h3>
  <div class="chips">${m.applications.map((a) => `<span class="chip">${esc(a)}</span>`).join("")}</div>`
      : ""
  }

  <h3 class="sec">Technologie (${m.technology.length})</h3>
  ${pairs(m.technology)}

  <h3 class="sec">Caractéristiques techniques</h3>
  ${specTables(m.specs)}

  <h3 class="sec">Références</h3>
  <p class="kv"><b>Identifiant de page :</b> /machines/${esc(m.slug)}/</p>
  <p class="kv"><b>Machines liées :</b> ${esc(rel)}</p>
  <p class="kv"><b>Images :</b> 1 principale${m.gallery?.length ? ` + ${m.gallery.length} en galerie` : ""}</p>
  <p class="kv"><b>Titre pour les moteurs de recherche :</b> ${esc(m.seo.title)}</p>
  <p class="kv"><b>Description pour les moteurs de recherche :</b> ${esc(m.seo.description)}</p>
</section>`;
}

function document_(machines, logo) {
  const byName = new Map(machines.map((m) => [m.slug, m.name]));
  const online = machines.filter((m) => !m.draft);
  const waiting = machines.filter((m) => m.draft);
  const families = new Set(online.map((m) => m.category));
  const specTotal = machines.reduce((t, m) => t + m.specs.reduce((s, g) => s + g.rows.length, 0), 0);

  const indexRows = machines
    .map(
      (m, i) => `<tr>
      <td class="num">${String(i + 1).padStart(2, "0")}</td>
      <td><b>${esc(m.name)}</b></td>
      <td>${esc(CATEGORIES[m.category] ?? m.category)}</td>
      <td>${esc(m.brand ?? "—")}</td>
      <td>${m.draft ? "En attente de photographie" : "En ligne"}</td>
    </tr>`,
    )
    .join("");

  return `<!doctype html><meta charset="utf-8">
<title>GNIE — Contenu du catalogue</title>
<style>${fontCss()}</style>
<style>${CSS}</style>

<section class="cover">
  <img src="${logo}" alt="GNIE">
  <div>
    <div class="eyebrow">Contenu du site · Relecture</div>
    <h1>Le catalogue,<br>machine par machine</h1>
    <p class="sub">Tout ce que le site dit de chaque équipement : résumé, arguments,
      zones traitées, technologie et caractéristiques techniques. Reproduit mot pour mot
      depuis le site — rien n'est résumé ni reformulé ici.</p>
    <div class="kpi">
      <div><div class="n">${machines.length}</div><div class="l">équipements rédigés</div></div>
      <div><div class="n">${online.length}</div><div class="l">en ligne aujourd'hui</div></div>
      <div><div class="n">${waiting.length}</div><div class="l">en attente d'une photographie</div></div>
      <div><div class="n">${specTotal}</div><div class="l">caractéristiques techniques</div></div>
    </div>
  </div>
  <div class="small">GNIE · Groupe Nasra Import Export · Document de relecture</div>
</section>

<section class="index">
  <div class="eyebrow">Comment lire ce document</div>
  <h2 style="font-size:20pt;margin:1mm 0 3mm">Sommaire</h2>

  <div class="note">
    <h3>Deux états, deux significations</h3>
    <p><b>En ligne</b> — la fiche est publiée et visible par vos clients dès que le site ouvre.
      ${online.length} équipements, répartis sur ${families.size} familles de technologies.</p>
    <p><b>En attente de photographie</b> — la fiche est écrite et vérifiée, mais elle ne s'affiche
      nulle part : ni page, ni vignette, ni référencement. Il manque une photographie utilisable.
      ${waiting.length} équipements sont dans ce cas. Ce document est le seul endroit où vous
      pouvez les relire.</p>
  </div>

  <div class="note">
    <h3>Ce que nous vous demandons de vérifier</h3>
    <p>Les chiffres, avant tout : puissances, longueurs d'onde, dimensions, poids. Ils ont été
      relevés dans vos catalogues et vos brochures fabricants. Une erreur de virgule dans une
      fiche technique se retourne contre vous devant un client averti.</p>
    <p>Ensuite les noms commerciaux, les marques et les zones traitées.</p>
    <p>Aucune valeur n'a été inventée : là où la documentation fabricant était muette, la ligne
      est absente plutôt qu'estimée.</p>
  </div>

  <table>
    <thead><tr><th></th><th>Équipement</th><th>Famille</th><th>Marque</th><th>État</th></tr></thead>
    <tbody>${indexRows}</tbody>
  </table>
</section>

${machines.map((m, i) => machineSection(m, i + 1, byName)).join("\n")}
`;
}

/* ── build ─────────────────────────────────────────────────────── */

function findPlaywright() {
  for (const c of [process.env.PDF_PLAYWRIGHT, join(ROOT, "node_modules/playwright/index.mjs")].filter(Boolean)) {
    if (existsSync(c)) return c;
  }
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
  return undefined;
}

const machines = readMachines();
const html = document_(machines, b64(join(ROOT, "src/assets/brand/gnie-logo-gold.png"), "image/png"));

const { chromium } = await import(findPlaywright());
const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  margin: { top: "18mm", bottom: "16mm", left: "16mm", right: "16mm" },
  displayHeaderFooter: true,
  headerTemplate: `<div style="width:100%;font-family:Manrope,sans-serif;font-size:7pt;color:#8a8a8a;padding:0 16mm;display:flex;justify-content:space-between">
      <span>Contenu du catalogue</span><span>GNIE Aesthetics</span></div>`,
  footerTemplate: `<div style="width:100%;font-family:Manrope,sans-serif;font-size:7pt;color:#8a8a8a;padding:0 16mm;text-align:right">
      <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
});
await browser.close();

const online = machines.filter((m) => !m.draft).length;
console.log(`wrote docs/client/GNIE-Catalogue-Contenu.pdf — ${machines.length} machines (${online} en ligne, ${machines.length - online} en attente)`);
