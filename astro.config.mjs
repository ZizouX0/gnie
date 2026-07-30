import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE = process.env.PUBLIC_SITE_URL ?? "https://gnie-aesthetics.com";

export default defineConfig({
  site: SITE,
  output: "static",
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
