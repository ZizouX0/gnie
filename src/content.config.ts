import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * One collection holds both languages: ids come out as "fr/{slug}" and "en/{slug}".
 * Slugs are identical across languages, which is what makes the language switcher
 * and the hreflang pairs trivial.
 */
const machines = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/machines" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      brand: z.string().optional(),
      category: z.enum([
        "laser",
        "resurfacing",
        "cryolipolyse",
        "remodelage",
        "visage",
        "pressotherapie",
        "analyse",
        "epilation",
        "hifu",
        "perinee",
      ]),
      tagline: z.string(),
      excerpt: z.string(),
      heroImage: image(),
      gallery: z.array(image()).default([]),
      benefits: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(6),
      applications: z.array(z.string()).default([]),
      technology: z.array(z.object({ title: z.string(), text: z.string() })).min(1).max(4),
      specs: z.array(
        z.object({
          group: z.string(),
          rows: z.array(z.object({ label: z.string(), value: z.string() })),
        }),
      ),
      /** Official manufacturer footage, loaded only on click (see spec D11). */
      videoId: z.string().optional(),
      related: z.array(z.string()).length(2),
      featured: z.boolean().default(false),
      /**
       * A machine whose copy is written but which must not reach the public
       * site yet — in practice, one still waiting on usable product
       * photography. Draft entries build nothing: no page, no catalogue card,
       * no category count, no sitemap entry, no sharing card.
       *
       * Everything that reads this collection goes through the helpers in
       * `src/lib/machines.ts`, which apply the filter once. Reach for those
       * rather than calling getCollection directly, or a new surface will
       * quietly start publishing drafts.
       */
      draft: z.boolean().default(false),
      order: z.number(),
      seo: z.object({
        /* 53, not 60: the layout appends " | GNIE" (7 characters), so this
           is what keeps the RENDERED title inside the 60-char guideline. */
        title: z.string().max(53),
        description: z.string().max(155),
      }),
    }),
});

export const collections = { machines };
