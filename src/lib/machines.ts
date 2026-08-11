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
