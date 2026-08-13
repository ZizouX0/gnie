/**
 * Holding-build guard — proves `dist-soon/` carries nothing but the holding page.
 *
 * The isolation is structural: `COMING_SOON=1` points Astro at src-holding/ and
 * public-holding/, so the real pages and the 2.3 MB of machine sharing cards are
 * never compiled. This checks the result rather than trusting the mechanism,
 * because the cost of being wrong is a legal notice full of placeholders and a
 * finished catalogue published before the client has paid for it.
 *
 * Runs automatically after `npm run build:soon`. Exits non-zero on any finding,
 * so a broken holding build fails loudly instead of shipping.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "dist-soon";
const problems = [];

if (!existsSync(OUT)) {
  console.error(`${OUT}/ does not exist — run \`npm run build:soon\` first.`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = walk(OUT).map((f) => relative(OUT, f));
const html = files.filter((f) => f.endsWith(".html"));

/* Exactly two pages: the French holding page and its English twin. Anything
   else means a real route found its way in. */
const EXPECTED_HTML = ["en/index.html", "index.html"];
const extra = html.filter((f) => !EXPECTED_HTML.includes(f));
const missing = EXPECTED_HTML.filter((f) => !html.includes(f));
for (const f of extra) problems.push(`unexpected page: ${f}`);
for (const f of missing) problems.push(`missing page: ${f}`);

/* No route from the real site, in any language, under any spelling. */
const FORBIDDEN_PATHS = [
  "machines",
  "contact",
  "mentions-legales",
  "confidentialite",
  "legal",
  "privacy",
  "dev/",
  "og/",
  "404",
];
for (const f of files) {
  for (const p of FORBIDDEN_PATHS) {
    if (f.includes(p)) problems.push(`real-site path leaked: ${f} (matched "${p}")`);
  }
}

/* And no machine name in the markup. The holding copy legitimately names the
   three brands, so those are not searched for — the machines are. */
const MACHINE_NAMES = [
  "Ultra PicoIris",
  "Cryolipolyse",
  "Cryolipolysis",
  "V-Shape",
  "Hydrafacial",
  "Air Presso",
  "Hifem",
  "VISBODY-M30",
  "HOWBODY H6",
  "Skin Analyzer",
  "EMS 16",
  "EosICE",
  "Électrolyse",
  "CO2",
];
for (const f of html) {
  const body = readFileSync(join(OUT, f), "utf8");
  for (const name of MACHINE_NAMES) {
    if (body.includes(name)) problems.push(`machine name in ${f}: "${name}"`);
  }
  /* Placeholders are the reason this page exists; one reaching it would be
     the exact failure it is meant to prevent. */
  if (body.includes("TODO:NEEDS_INPUT")) problems.push(`unfilled placeholder in ${f}`);
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const total = walk(OUT).reduce((sum, f) => sum + statSync(f).size, 0);

console.log(`${OUT}/ — ${files.length} files, ${html.length} pages, ${kb(total)}`);
if (problems.length === 0) {
  console.log("holding build is clean: nothing from the real site is present");
} else {
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${problems.length} problem(s) — do not deploy ${OUT}/`);
  process.exitCode = 1;
}
