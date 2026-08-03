import { defaultLocale, type Locale } from "./ui";

/**
 * Localized path segments. French routes live at the root, English under /en/.
 * The switcher maps a page to its exact counterpart — never to the other home page.
 */
const segments = {
  fr: {
    machines: "machines",
    contact: "contact",
    legal: "mentions-legales",
    privacy: "confidentialite",
  },
  en: {
    machines: "machines",
    contact: "contact",
    legal: "legal",
    privacy: "privacy",
  },
} as const;

export type PageKey = keyof (typeof segments)["fr"] | "home";

const prefix = (locale: Locale) => (locale === defaultLocale ? "" : `/${locale}`);

export function path(locale: Locale, page: PageKey, slug?: string): string {
  if (page === "home") return `${prefix(locale)}/`;
  const seg = segments[locale][page];
  return slug ? `${prefix(locale)}/${seg}/${slug}/` : `${prefix(locale)}/${seg}/`;
}

/** The same page in the other language. */
export function alternatePath(locale: Locale, page: PageKey, slug?: string) {
  const other: Locale = locale === "fr" ? "en" : "fr";
  return { locale: other, href: path(other, page, slug) };
}

/** Every locale variant of a page, for the hreflang block. */
export function hreflangPairs(page: PageKey, slug?: string) {
  return [
    { hreflang: "fr", href: path("fr", page, slug) },
    { hreflang: "en", href: path("en", page, slug) },
    { hreflang: "x-default", href: path("fr", page, slug) },
  ];
}

/** Locale of the current URL — the source of truth is the pathname. */
export function localeFromUrl(url: URL): Locale {
  return url.pathname.startsWith("/en") ? "en" : "fr";
}
