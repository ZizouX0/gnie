/**
 * The card itself: one self-contained HTML document per image.
 *
 * The design is the site's own machine hero, reduced to a 1200×630 plate —
 * near-black ground, a single gold, ivory type, hairlines, and the product
 * photo contained (never cropped) inside the graphite frame the site uses.
 * Fonts are the site's self-hosted files, embedded so the render never
 * touches the network.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const WIDTH = 1200;
export const HEIGHT = 630;

const TOKENS = {
  noir: "#0B0B0D",
  graphite: "#131316",
  or: "#C9A24B",
  ivoire: "#F3EEE4",
  gris: "#98938A",
  ligne: "rgba(201,162,75,0.28)",
  ligneFaint: "rgba(201,162,75,0.14)",
};

const b64 = (path, mime) => `data:${mime};base64,${readFileSync(path).toString("base64")}`;

/** The five faces the cards use, from the same packages global.css imports. */
export function loadAssets(root) {
  const fs = (pkg, file) => join(root, "node_modules/@fontsource", pkg, "files", file);
  const face = (family, weight, files) =>
    files
      .map(
        (f) => `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};
      src:url(${b64(f, "font/woff2")}) format("woff2");font-display:block}`,
      )
      .join("\n");

  const cg = (w, sub) => fs("cormorant-garamond", `cormorant-garamond-${sub}-${w}-normal.woff2`);
  const mr = (w, sub) => fs("manrope", `manrope-${sub}-${w}-normal.woff2`);

  const fonts = [
    face("Cormorant Garamond", 600, [cg(600, "latin"), cg(600, "latin-ext")]),
    face("Manrope", 400, [mr(400, "latin"), mr(400, "latin-ext")]),
    face("Manrope", 500, [mr(500, "latin"), mr(500, "latin-ext")]),
    face("Manrope", 700, [mr(700, "latin"), mr(700, "latin-ext")]),
  ].join("\n");

  return {
    fonts,
    logo: b64(join(root, "src/assets/brand/gnie-logo-gold.png"), "image/png"),
    mark: b64(join(root, "src/assets/brand/gnie-mark-gold.png"), "image/png"),
    wordmark: b64(join(root, "src/assets/brand/gnie-wordmark-gold.png"), "image/png"),
  };
}

/**
 * The plate follows the shot instead of the shot rattling around in the plate:
 * portrait shots get the site's 4:5 window, wide ones a shorter window, so a
 * 1.78 studio scene is not reduced to a stripe inside a tall empty frame.
 * Clamped both ways so the right-hand column always reads as the same object.
 */
const plateRatio = (ratio) => Math.min(Math.max(ratio ?? 0.8, 0.8), 1.35).toFixed(3);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * @param {object} spec  { kind, title, eyebrow, qualifier, brand, photo }
 * @param {object} assets  from loadAssets()
 */
export function cardHtml(spec, assets) {
  const machine = spec.kind === "machine";

  const copy = `
      ${spec.eyebrow ? `<p class="eyebrow">${esc(spec.eyebrow)}</p>` : ""}
      <h1 class="title" data-fit data-fit-max="${machine ? 68 : 62}" data-fit-box="${
        machine ? 250 : 210
      }">${esc(spec.title)}</h1>
      <div class="rule"></div>
      <p class="qual">${esc(spec.qualifier)}</p>`;

  const inner = machine
    ? `
    <header class="lockup">
      <img class="mark" src="${assets.mark}" alt="">
      <img class="word" src="${assets.wordmark}" alt="">
    </header>
    <div class="grid">
      <div class="copy">${copy}</div>
      <div class="frame"><div class="shot" style="--ratio:${plateRatio(spec.photoRatio)}">
        <img src="${spec.photo}" alt=""></div></div>
    </div>
    <footer class="foot">${spec.brand ? `<span>${esc(spec.brand)}</span>` : ""}</footer>`
    : `
    <div class="centred">
      <img class="logo" src="${assets.logo}" alt="">
      <div class="copy">${copy}</div>
    </div>`;

  return `<!doctype html>
<html lang="${esc(spec.locale)}"><head><meta charset="utf-8">
<style>
${assets.fonts}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${WIDTH}px;height:${HEIGHT}px}
body{
  background:
    radial-gradient(1100px 620px at 88% 8%, rgba(201,162,75,0.07), transparent 62%),
    ${TOKENS.noir};
  color:${TOKENS.ivoire};
  font-family:"Manrope",sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow:hidden;
}
.card{position:relative;width:${WIDTH}px;height:${HEIGHT}px;padding:54px 64px;display:flex;flex-direction:column}
/* The plaque motif: one hairline, holding the whole card together. */
.card::before{content:"";position:absolute;inset:22px;border:1px solid ${TOKENS.ligneFaint};border-radius:2px;pointer-events:none}

.lockup{display:flex;align-items:center;gap:14px;height:40px;flex:0 0 auto}
.lockup .mark{height:40px;width:auto}
.lockup .word{height:19px;width:auto;opacity:.95}

.grid{flex:1 1 auto;display:grid;grid-template-columns:1fr 372px;gap:52px;align-items:center;min-height:0;padding-top:8px}
.copy{min-width:0}

.eyebrow{
  font-size:15px;font-weight:500;line-height:1;letter-spacing:.22em;text-transform:uppercase;
  color:${TOKENS.or};margin-bottom:22px;
}
.title{
  font-family:"Cormorant Garamond",serif;font-weight:600;line-height:1.06;letter-spacing:-.005em;
  color:${TOKENS.ivoire};font-size:68px;text-wrap:balance;
}
.rule{width:76px;height:1px;background:${TOKENS.or};opacity:.6;margin:26px 0 22px}
.qual{color:${TOKENS.gris};font-size:19px;line-height:1.5;font-weight:400}

.frame{border:1px solid ${TOKENS.ligne};background:${TOKENS.graphite};border-radius:2px;padding:11px}
.shot{background:${TOKENS.noir};border-radius:1px;overflow:hidden}
/* Manufacturer shots run from 0.35 to 1.78 in ratio: the frame is fixed and
   the machine is contained inside it, never cropped — as on the site. */
.shot img{display:block;width:100%;aspect-ratio:var(--ratio,.8);object-fit:contain;filter:saturate(.88) brightness(.97)}

.foot{flex:0 0 auto;height:20px;display:flex;align-items:center;
  font-size:13px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${TOKENS.gris}}

/* Pages without a product photo: one centred lockup, more air. */
.centred{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;gap:0;min-height:0}
.centred .logo{height:132px;width:auto;margin-bottom:40px}
.centred .copy{max-width:900px;display:flex;flex-direction:column;align-items:center}
.centred .rule{margin:24px 0 20px}
</style></head>
<body><div class="card">${inner}</div></body></html>`;
}
