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
      i18n: { defaultLocale: "fr", locales: { fr: "fr-TN", en: "en" } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  image: { responsiveStyles: true },
});
