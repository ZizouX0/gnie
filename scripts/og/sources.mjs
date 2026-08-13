/**
 * Where the copy on an Open Graph card comes from.
 *
 * Nothing here is a list of pages or machines: every page is discovered from
 * the content collection and from src/i18n/routes.ts, and every string is read
 * back out of the files the site itself renders. Adding a 13th machine, or
 * renaming a route segment, needs no edit in this folder.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/* ── low-level readers ─────────────────────────────────────────── */

const read = (root, rel) => readFileSync(join(root, rel), "utf8");

/** `export const locales = ["fr", "en"] as const;` */
export function readLocales(root) {
  const src = read(root, "src/i18n/ui.ts");
  const m = src.match(/export const locales\s*=\s*\[([^\]]+)\]/);
  if (!m) throw new Error("ui.ts: could not find the `locales` array");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

/**
 * Values in `ui.ts` that are not string literals but references into
 * `src/config/site.ts` — currently `"site.company": CONTACT.legalName`.
 *
 * The scanner below matches quoted values only. A reference it cannot see is
 * not an error there, it is an absence: the key simply drops out of the
 * dictionary and the card renders a hole. That is precisely what happened the
 * first time the company name moved into the config, so references are now
 * resolved rather than skipped.
 */
function readContact(root) {
  const src = read(root, "src/config/site.ts");
  const start = src.indexOf("export const CONTACT = {");
  if (start < 0) throw new Error("site.ts: could not find `export const CONTACT`");
  const body = src.slice(start, src.indexOf("\n} as const;", start));
  const out = {};
  for (const m of body.matchAll(/^\s{2}(\w+):\s*"((?:[^"\\]|\\.)*)",/gm)) out[m[1]] = unescape(m[2]);
  return out;
}

/**
 * The UI dictionary, one flat map per locale. The file is a literal of quoted
 * keys and quoted string values, so it is read with a scanner rather than by
 * importing TypeScript into Node.
 */
export function readUi(root, locales) {
  const src = read(root, "src/i18n/ui.ts");
  const start = src.indexOf("export const ui = {");
  if (start < 0) throw new Error("ui.ts: could not find `export const ui`");
  const contact = readContact(root);
  const out = {};
  for (const locale of locales) {
    const head = src.indexOf(`\n  ${locale}: {`, start);
    if (head < 0) throw new Error(`ui.ts: no block for locale "${locale}"`);
    const from = src.indexOf("{", head) + 1;
    // The block ends at the first line that closes it at this indentation.
    const end = src.indexOf("\n  },", from);
    const body = src.slice(from, end);
    const dict = {};
    for (const m of body.matchAll(/"([\w.]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)) {
      dict[m[1]] = unescape(m[2]);
    }
    for (const m of body.matchAll(/"([\w.]+)":\s*CONTACT\.(\w+),/g)) {
      const value = contact[m[2]];
      if (value === undefined) throw new Error(`ui.ts: "${m[1]}" reads CONTACT.${m[2]}, absent from site.ts`);
      dict[m[1]] = value;
    }
    if (Object.keys(dict).length === 0) throw new Error(`ui.ts: empty block for "${locale}"`);
    out[locale] = dict;
  }
  return out;
}

const unescape = (s) => s.replace(/\\(["'\\])/g, "$1").replace(/\\n/g, "\n");

/**
 * The localized path segments, straight from routes.ts:
 *   { fr: { machines: "machines", legal: "mentions-legales", … }, en: {…} }
 * The keys of the French block are the page keys the layout knows about.
 */
export function readSegments(root, locales) {
  const src = read(root, "src/i18n/routes.ts");
  const out = {};
  for (const locale of locales) {
    const head = src.indexOf(`\n  ${locale}: {`);
    if (head < 0) throw new Error(`routes.ts: no segments for locale "${locale}"`);
    const body = src.slice(src.indexOf("{", head) + 1, src.indexOf("\n  },", head));
    const seg = {};
    for (const m of body.matchAll(/(\w+):\s*"([^"]+)"/g)) seg[m[1]] = m[2];
    out[locale] = seg;
  }
  return out;
}

/** Front matter of a machine file — only the scalar keys a card needs. */
export function readMachines(root, locale) {
  const dir = join(root, "src/content/machines", locale);
  if (!existsSync(dir)) throw new Error(`no machine content for locale "${locale}"`);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = readFileSync(join(dir, file), "utf8");
      const fm = raw.slice(0, raw.indexOf("\n---", 4));
      const scalar = (key) => {
        const m = fm.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"));
        return m ? m[1] : undefined;
      };
      /* A draft machine has no page to share, so it gets no card. This script
         runs outside Astro and reads the front matter itself, so it cannot use
         src/lib/machines.ts — the filter has to be repeated here, and this is
         the only place in the project where that is true. Without it the
         generator writes 34 orphan cards into public/og/ and reports a
         catalogue twice the size of the one that ships. */
      if (/^draft:\s*true\s*$/m.test(fm)) return null;
      const name = scalar("name");
      const category = scalar("category");
      const hero = scalar("heroImage");
      if (!name || !category || !hero) {
        throw new Error(`${locale}/${file}: missing name, category or heroImage`);
      }
      return {
        slug,
        name,
        category,
        brand: scalar("brand"),
        // Front matter paths are relative to the content file.
        heroImage: join(dir, hero),
      };
    })
    .filter(Boolean);
}

/* ── page copy ─────────────────────────────────────────────────── */

/**
 * Which file holds a page's own title, derived from the route segments so a
 * renamed segment follows automatically. `home` is the only special case
 * (it has no segment) and the catalogue's title lives in the dictionary
 * because its route file delegates every line of markup to a component.
 */
function pageFile(locale, key, segments, isDefault) {
  const seg = segments[locale][key];
  const base = isDefault ? "src/pages" : `src/pages/${locale}`;
  if (key === "home") return `${base}/index.astro`;
  if (key === "machines") return `${base}/${seg}/index.astro`;
  return `${base}/${seg}.astro`;
}

/** `title="…"` inside the page's <Base …> call. */
function baseTitle(root, file) {
  const src = read(root, file);
  const open = src.indexOf("<Base");
  if (open < 0) return undefined;
  const tag = src.slice(open, src.indexOf(">", open));
  const m = tag.match(/\stitle="([^"]*)"/);
  return m ? m[1] : undefined;
}

/** The home page's real heading: <HomeHero headline="…" accent="…" />. */
function heroHeadline(root, file) {
  const src = read(root, file);
  const h = src.match(/\sheadline="([^"]*)"/);
  const a = src.match(/\saccent="([^"]*)"/);
  return h && a ? `${h[1]} ${a[1]}` : undefined;
}

/**
 * Per page key: where its card title comes from, and which dictionary entry
 * sits above it as the gold eyebrow. A page key that turns up in routes.ts
 * without an entry here stops the build loudly instead of shipping a card
 * with a guessed title.
 */
const PAGE_COPY = {
  home: { title: "hero", eyebrow: "site.company" },
  machines: { title: "ui:catalog.title", eyebrow: "nav.machines" },
  contact: { title: "base", eyebrow: "nav.contact" },
  legal: { title: "base", eyebrow: "footer.legal" },
  privacy: { title: "base", eyebrow: "footer.privacy" },
};

export function staticPages(root, locale, isDefault, segments, ui, machineCount) {
  const keys = ["home", ...Object.keys(segments[locale])];
  return keys.map((key) => {
    const rule = PAGE_COPY[key];
    if (!rule) {
      throw new Error(
        `No card copy defined for page "${key}". Add it to PAGE_COPY in scripts/og/sources.mjs.`,
      );
    }
    const file = pageFile(locale, key, segments, isDefault);
    let title;
    if (rule.title === "hero") title = heroHeadline(root, file) ?? baseTitle(root, file);
    else if (rule.title === "base") title = baseTitle(root, file);
    else title = ui[locale][rule.title.slice(3)];
    if (!title) throw new Error(`Could not read a title for ${locale}/${key} from ${file}`);

    /* The catalogue counts what is really in the collection rather than
       repeating its own title: a thirteenth machine updates the card. */
    const eyebrow =
      key === "machines"
        ? `${machineCount} ${ui[locale][machineCount === 1 ? "catalog.countOne" : "catalog.count"]}`
        : ui[locale][rule.eyebrow];
    return {
      locale,
      page: key,
      slug: undefined,
      kind: "page",
      title,
      // An eyebrow that only repeats the title is noise: drop it.
      eyebrow: eyebrow && eyebrow.toLowerCase() === title.toLowerCase() ? "" : eyebrow,
      qualifier: ui[locale]["site.tagline"],
    };
  });
}
