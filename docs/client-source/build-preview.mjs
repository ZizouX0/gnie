#!/usr/bin/env node
/**
 * A visual walkthrough of the real site, for showing a client before launch.
 *
 *   node docs/client-source/build-preview.mjs
 *   → docs/client/GNIE-Apercu-Du-Site.pdf
 *
 * The catalogue is built but not published: it lives behind `draft`/holding
 * logic and has no public URL yet. So there is no link to send anyone. This
 * turns the built `dist/` into something that can be put on a screen.
 *
 * Each page of the PDF is sized to its screenshot's aspect ratio rather than
 * squeezed onto A4 — a full-page capture of the home screen is ten times
 * taller than it is wide, and forcing that onto a portrait page makes the type
 * unreadable. Reading it as a tall page mirrors scrolling the real thing.
 *
 * Requires a built site and a running server; see the sibling script's header
 * for the Playwright/Chromium environment variables.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const require = createRequire(import.meta.url);

const SHOTS = process.env.PREVIEW_SHOTS;
if (!SHOTS || !existsSync(SHOTS)) {
  throw new Error("Set PREVIEW_SHOTS to the directory holding the screenshots");
}

/** Slug → the caption printed above each screen. */
const CAPTIONS = {
  "01-accueil": ["Accueil", "Le catalogue en huit familles, trois machines mises en avant, et les quatre arguments de GNIE."],
  "02-catalogue": ["Catalogue", "Treize machines, filtrables par famille de technologie. Le filtre est une vraie page : chaque famille a son adresse."],
  "03-fiche-picoiris": ["Fiche machine — Ultra PicoIris", "Chaque machine a sa page : galerie, bénéfices, zones traitées, technologie et tableau de caractéristiques."],
  "04-fiche-ems16": ["Fiche machine — EMS 16", "Même structure, contenu propre à l'appareil. Dix-neuf caractéristiques techniques groupées."],
  "05-contact": ["Contact", "Formulaire de devis avec choix de la machine, WhatsApp, téléphone et carte — la carte ne contacte Google qu'au clic."],
  "06-mentions": ["Mentions légales", "Les repères jaunes marquent les informations que nous attendons de vous. Rien n'a été inventé."],
  "07-home-en": ["English home", "Le site entier existe dans les deux langues, à des adresses distinctes — pas une traduction automatique."],
  "08-catalogue-en": ["English catalogue", "Même catalogue, contenu rédigé en anglais machine par machine."],
};

const ORDER = Object.keys(CAPTIONS);

const fitz = (() => {
  try { return require("pymupdf"); } catch { return null; }
})();

/* PyMuPDF is a Python library; drive it through a small inline script instead
   of reaching for a Node PDF library and a second way of doing the same job. */
import { execFileSync } from "node:child_process";

const plan = ORDER.filter((slug) => existsSync(join(SHOTS, `${slug}-desktop.png`))).map((slug) => ({
  slug,
  desktop: join(SHOTS, `${slug}-desktop.png`),
  phone: join(SHOTS, `${slug}-phone.png`),
  title: CAPTIONS[slug][0],
  note: CAPTIONS[slug][1],
}));

const OUT = join(ROOT, "docs/client/GNIE-Apercu-Du-Site.pdf");

const py = `
import pymupdf, json, sys
plan = json.loads(sys.argv[1]); out = sys.argv[2]
doc = pymupdf.open()
W = 900.0           # page width in points; every screen is scaled to this
PAD, HEAD = 26, 64  # side padding, caption band height

# ── cover ────────────────────────────────────────────────────────────
cov = doc.new_page(width=W, height=560)
cov.draw_rect(cov.rect, color=None, fill=(0.043, 0.043, 0.047))
cov.insert_text((PAD + 14, 150), "GNIE", fontname="hebo", fontsize=15, color=(0.79, 0.64, 0.29))
cov.insert_text((PAD + 14, 250), "Le site, écran par écran", fontname="heit", fontsize=44, color=(0.96, 0.95, 0.93))
cov.insert_textbox(pymupdf.Rect(PAD + 14, 280, W - PAD - 220, 420),
    "Aperçu du catalogue complet avant sa mise en ligne. Dix-huit pages, deux langues, "
    "treize machines avec fiche détaillée. Chaque écran ci-après est une capture du site réel, "
    "pas une maquette.",
    fontname="helv", fontsize=12.5, color=(0.68, 0.68, 0.66), lineheight=1.5)
cov.insert_text((PAD + 14, 500), "Groupe Nasra Import Export  ·  gnie-laser.com",
    fontname="helv", fontsize=9.5, color=(0.5, 0.5, 0.49))

# ── one page per screen ──────────────────────────────────────────────
for item in plan:
    pix = pymupdf.Pixmap(item["desktop"])
    iw, ih = pix.width, pix.height
    draw_w = W - 2 * PAD
    draw_h = draw_w * ih / iw
    page = doc.new_page(width=W, height=draw_h + HEAD + PAD)
    page.draw_rect(page.rect, color=None, fill=(0.043, 0.043, 0.047))
    page.insert_text((PAD, 30), item["title"], fontname="hebo", fontsize=14, color=(0.79, 0.64, 0.29))
    page.insert_textbox(pymupdf.Rect(PAD, 38, W - PAD, HEAD), item["note"],
        fontname="helv", fontsize=9.5, color=(0.66, 0.66, 0.64), lineheight=1.35)
    page.insert_image(pymupdf.Rect(PAD, HEAD, W - PAD, HEAD + draw_h), filename=item["desktop"])

# ── mobile ───────────────────────────────────────────────────────────
phones = [i for i in plan if i["phone"] and __import__("os").path.exists(i["phone"])][:3]
if phones:
    band = 1180
    page = doc.new_page(width=W, height=band + HEAD + PAD)
    page.draw_rect(page.rect, color=None, fill=(0.043, 0.043, 0.047))
    page.insert_text((PAD, 30), "Sur téléphone", fontname="hebo", fontsize=14, color=(0.79, 0.64, 0.29))
    page.insert_textbox(pymupdf.Rect(PAD, 38, W - PAD, HEAD),
        "Le site est pensé pour le téléphone d'abord : c'est là que vos clients le liront.",
        fontname="helv", fontsize=9.5, color=(0.66, 0.66, 0.64))
    col = (W - 2 * PAD - 2 * 18) / 3
    for n, item in enumerate(phones):
        pix = pymupdf.Pixmap(item["phone"])
        h = min(band, col * pix.height / pix.width)
        x = PAD + n * (col + 18)
        page.insert_image(pymupdf.Rect(x, HEAD, x + col, HEAD + h), filename=item["phone"])

doc.save(out, deflate=True, garbage=3)
print(f"{len(doc)} pages")
`;

const res = execFileSync("python3", ["-c", py, JSON.stringify(plan), OUT], { encoding: "utf8" });
console.log(`wrote docs/client/GNIE-Apercu-Du-Site.pdf — ${res.trim()}`);
