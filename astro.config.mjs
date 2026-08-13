import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE = process.env.PUBLIC_SITE_URL ?? "https://gnie-laser.com";

/**
 * Holding-page mode — `COMING_SOON=1 npm run build`, or `npm run build:soon`.
 *
 * The site is finished but cannot legally go live: the legal notice and the
 * privacy policy still carry placeholders, and there is no professional
 * mailbox behind the contact form. So the domain gets a holding page instead.
 *
 * This swaps the two directories Astro reads rather than hiding pages after
 * the fact, which is the whole point: a page that is built and then hidden is
 * still sitting on the CDN for anyone who guesses the URL, and 2.3 MB of
 * machine sharing cards under public/og/ would be served whatever the HTML
 * did. In this mode Astro never sees them. What is not built cannot leak.
 *
 * Everything else — the domain, the design tokens, the URLs — stays
 * identical, so `/` and `/en/` become the real home pages on launch day with
 * no redirect and nothing to unpick.
 */
const holding = process.env.COMING_SOON === "1";

export default defineConfig({
  site: SITE,
  output: "static",
  /* A separate outDir as well, so the two builds cannot overwrite each other.
     Sharing `dist/` would mean the directory you deploy depends on which
     command happened to run last — and getting that wrong publishes a legal
     notice full of placeholders. `dist-soon/` is the holding page and nothing
     else; `dist/` is always the real site. */
  ...(holding
    ? { srcDir: "./src-holding", publicDir: "./public-holding", outDir: "./dist-soon" }
    : {}),
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // the styleguide is a build-time tool, never a public page
      filter: (page) => !page.includes("/dev/"),
      // No `i18n` block on purpose. It emitted fr-TN/en into the sitemap
      // while the HTML emits fr/en/x-default — two implementations
      // describing the same pairs with different codes, and the sitemap one
      // had no x-default and skipped the four legal pages whose FR and EN
      // slugs differ. The HTML tags are complete and reciprocal; they are
      // the single source of truth.
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: { responsiveStyles: true },
});
