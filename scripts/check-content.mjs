/**
 * Content guard — runs the checks the Zod schema cannot, and reports every
 * violation at once instead of failing the build on the first one.
 *
 * The schema already caps `seo.title` at 53 characters and `seo.description`
 * at 155, but Astro aborts on the first bad file, so a batch of new machines
 * costs one build per mistake. This lists them all in one pass, and adds the
 * checks that live outside the schema: unique order values, related slugs that
 * actually resolve in both languages, and FR/EN structural parity.
 */
import { readFileSync, readdirSync } from "node:fs";

const ROOT = "src/content/machines";
const LOCALES = ["fr", "en"];
const LIMITS = { title: 53, description: 155 };

const read = (locale, file) => {
  const raw = readFileSync(`${ROOT}/${locale}/${file}`, "utf8");
  const front = raw.split("---")[1] ?? "";
  const field = (name) => front.match(new RegExp(`^\\s*${name}:\\s*"(.*)"\\s*$`, "m"))?.[1];
  const scalar = (name) => front.match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1]?.trim();
  return {
    slug: file.replace(/\.md$/, ""),
    seoTitle: front.match(/^\s{2}title:\s*"(.*)"$/m)?.[1],
    seoDescription: front.match(/^\s{2}description:\s*"(.*)"$/m)?.[1],
    name: field("name"),
    category: scalar("category")?.replace(/"/g, ""),
    order: Number(scalar("order")),
    draft: scalar("draft") === "true",
    related: JSON.parse(scalar("related") ?? "[]"),
    benefits: (front.match(/^  - title:/gm) ?? []).length,
  };
};

const problems = [];
const byLocale = {};

for (const locale of LOCALES) {
  byLocale[locale] = readdirSync(`${ROOT}/${locale}`)
    .filter((f) => f.endsWith(".md"))
    .map((f) => read(locale, f));

  for (const m of byLocale[locale]) {
    const where = `${locale}/${m.slug}`;
    if ((m.seoTitle?.length ?? 0) > LIMITS.title)
      problems.push(`${where}: seo.title is ${m.seoTitle.length} chars (max ${LIMITS.title})`);
    if ((m.seoDescription?.length ?? 0) > LIMITS.description)
      problems.push(
        `${where}: seo.description is ${m.seoDescription.length} chars (max ${LIMITS.description})`,
      );
  }

  // Order values are the catalogue's sort key: a duplicate makes the grid order
  // depend on filesystem order, which is not a decision anyone made.
  const seen = new Map();
  for (const m of byLocale[locale]) {
    if (seen.has(m.order)) problems.push(`${locale}: order ${m.order} used by ${seen.get(m.order)} and ${m.slug}`);
    seen.set(m.order, m.slug);
  }

  // A published machine may only point at published machines — MachinePage
  // throws on anything else, and it throws at build time, one file at a time.
  const slugs = new Set(byLocale[locale].map((m) => m.slug));
  const published = new Set(byLocale[locale].filter((m) => !m.draft).map((m) => m.slug));
  for (const m of byLocale[locale]) {
    for (const rel of m.related) {
      if (!slugs.has(rel)) problems.push(`${locale}/${m.slug}: related "${rel}" does not exist`);
      else if (!m.draft && !published.has(rel))
        problems.push(`${locale}/${m.slug}: published machine points at draft "${rel}"`);
    }
  }
}

// The two languages describe the same catalogue or the language switcher lies.
const frSlugs = new Set(byLocale.fr.map((m) => m.slug));
const enSlugs = new Set(byLocale.en.map((m) => m.slug));
for (const s of frSlugs) if (!enSlugs.has(s)) problems.push(`fr/${s} has no English twin`);
for (const s of enSlugs) if (!frSlugs.has(s)) problems.push(`en/${s} has no French twin`);
for (const fr of byLocale.fr) {
  const en = byLocale.en.find((m) => m.slug === fr.slug);
  if (!en) continue;
  if (fr.category !== en.category)
    problems.push(`${fr.slug}: category differs (fr "${fr.category}" vs en "${en.category}")`);
  if (fr.order !== en.order) problems.push(`${fr.slug}: order differs (fr ${fr.order} vs en ${en.order})`);
  if (fr.draft !== en.draft) problems.push(`${fr.slug}: draft differs (fr ${fr.draft} vs en ${en.draft})`);
}

const total = byLocale.fr.length;
const drafts = byLocale.fr.filter((m) => m.draft).length;
console.log(`${total} machines · ${total - drafts} published · ${drafts} draft`);
if (problems.length === 0) {
  console.log("no problems");
} else {
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${problems.length} problem(s)`);
  process.exitCode = 1;
}
