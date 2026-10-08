import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/ui";

export type Machine = CollectionEntry<"machines">;

/**
 * Every machine of one language that is allowed on the public site, ordered.
 *
 * The collection holds both languages in one bucket (ids are `fr/{slug}` and
 * `en/{slug}`) and may hold drafts — machines whose copy is finished but which
 * are waiting on something, usually product photography. Both filters belong
 * together in one place: a call site that remembers the language filter but
 * forgets the draft filter publishes an unfinished page, and nothing about
 * `getCollection` would warn about it.
 */
export async function publishedMachines(locale: Locale): Promise<Machine[]> {
  const entries = await getCollection(
    "machines",
    (m) => m.id.startsWith(`${locale}/`) && !m.data.draft,
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** The home page spread. Same filters, plus the editorial flag. */
export async function featuredMachines(locale: Locale): Promise<Machine[]> {
  return (await publishedMachines(locale)).filter((m) => m.data.featured);
}

/**
 * How big the catalogue is, counted rather than typed.
 *
 * The home page and the catalogue heading both open by saying how many
 * machines and how many technology families the site holds. Those two numbers
 * were written out by hand in five places, and publishing one machine made all
 * five wrong at once — the catalogue said "quinze équipements" above a grid of
 * sixteen. Counting them here costs nothing and cannot drift.
 *
 * `families` counts categories that actually have a published machine in them,
 * which is the same rule CategoryStrip uses to decide which tiles to draw: a
 * family nobody can click is not a family the visitor sees.
 */
export async function catalogueSize(locale: Locale): Promise<{ machines: number; families: number }> {
  const entries = await publishedMachines(locale);
  return {
    machines: entries.length,
    families: new Set(entries.map((m) => m.data.category)).size,
  };
}

/**
 * A related machine, resolved in the caller's language.
 *
 * Returns null when the target does not exist or is a draft — a draft is a
 * real content file, so `getEntry` would happily return it and the card would
 * link to a page that was never built. The caller decides what an unresolved
 * link means; on a machine page it is a build error.
 */
export async function relatedMachine(locale: Locale, slug: string): Promise<Machine | null> {
  const target = await getEntry("machines", `${locale}/${slug}`);
  return target && !target.data.draft ? target : null;
}
