import { CONTACT } from "@/config/site";

/**
 * Every UI string on the site. Components never contain sentences.
 * A missing key is a TypeScript error, not a silent fallback to the wrong language.
 */
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/**
 * Declaration order is display order — in the catalogue filter row and in the
 * category strip on the home page. Kept in step with the enum in
 * `src/content.config.ts`; a category listed in one and not the other is a
 * type error at the first `categoryLabel` call.
 *
 * A category with no published machine renders no tile and no filter pill, so
 * a family can be declared here ahead of the machines that will fill it.
 */
export const categories = [
  "laser",
  "resurfacing",
  "epilation",
  "hifu",
  "remodelage",
  "cryolipolyse",
  "visage",
  "pressotherapie",
  "perinee",
  "analyse",
] as const;
export type Category = (typeof categories)[number];

export const ui = {
  fr: {
    "site.name": "GNIE",
    "site.tagline": "Équipements esthétiques professionnels — Tunisie",
    "site.company": CONTACT.legalName,

    "nav.home": "Accueil",
    "nav.machines": "Machines",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Fermer",
    "nav.skip": "Aller au contenu principal",

    "lang.switch": "English",
    "lang.label": "Changer de langue",

    "cta.quote": "Demander un devis",
    "cta.whatsapp": "WhatsApp",
    "cta.whatsappLong": "Écrire sur WhatsApp",
    "cta.discover": "Découvrir nos machines",
    "cta.more": "Découvrir",
    "cta.viewAll": "Voir tout le catalogue",

    "machine.why": "Pourquoi cette machine",
    "machine.applications": "Zones & indications",
    "machine.technology": "La technologie",
    "machine.specs": "Caractéristiques techniques",
    "machine.gallery": "Galerie",
    "machine.video": "La machine en fonctionnement",
    "machine.videoPlay": "Lancer la vidéo",
    "machine.related": "À découvrir également",
    "machine.brand": "Marque",
    "machine.interested": "{name} vous intéresse ?",
    "machine.reassurance":
      "Installation, formation de vos équipes et service après-vente assurés localement par GNIE.",
    "machine.views": "Vues du produit",

    "catalog.title": "Nos machines",
    /* The <title> is a search result, not a heading: it carries the terms a
       clinic actually types. The h1 above stays short on the page itself. */
    "catalog.seoTitle": "Machines esthétiques professionnelles en Tunisie",
    "catalog.intro":
      "Treize équipements professionnels, huit familles de technologies, sélectionnés pour les cliniques et instituts exigeants.",
    "catalog.all": "Toutes",
    "catalog.count": "machines",
    "catalog.countOne": "machine",
    "catalog.quickView": "Aperçu rapide",
    "catalog.compare": "Comparer",
    "catalog.compareTitle": "Comparer les machines",
    "catalog.compareEmpty": "Sélectionnez deux ou trois machines à comparer.",
    "catalog.clear": "Réinitialiser",

    "cat.laser": "Laser pigmentaire & détatouage",
    "cat.resurfacing": "Lasers fractionnés & resurfaçage",
    "cat.hifu": "Raffermissement HIFU & RF",
    "cat.perinee": "Rééducation périnéale",
    "cat.cryolipolyse": "Cryolipolyse",
    "cat.remodelage": "Remodelage corporel",
    "cat.visage": "Soin du visage",
    "cat.pressotherapie": "Pressothérapie & drainage",
    "cat.analyse": "Analyse & diagnostic",
    "cat.epilation": "Épilation définitive",

    "footer.machines": "Machines",
    "footer.company": "GNIE",
    "footer.contact": "Restons en contact",
    "footer.newsletter": "Newsletter",
    "footer.newsletterText": "Nouveautés et conseils d'équipement, une fois par trimestre.",
    "footer.newsletterPlaceholder": "Votre adresse e-mail",
    "footer.newsletterSubmit": "S'inscrire",
    "footer.newsletterDisabled": "Inscription bientôt disponible.",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Confidentialité",
    "footer.rights": "Tous droits réservés",
    "footer.since": "Distributeur d'équipements esthétiques premium en Tunisie depuis 2015.",

    "wa.generic": "Bonjour, je souhaite des informations sur vos équipements esthétiques.",
    "wa.machine": "Bonjour, je souhaite plus d'informations sur la",
    "wa.aria": "Nous écrire sur WhatsApp",

    "breadcrumb.home": "Accueil",
    "a11y.close": "Fermer",
  },

  en: {
    "site.name": "GNIE",
    "site.tagline": "Professional aesthetic equipment — Tunisia",
    "site.company": CONTACT.legalName,

    "nav.home": "Home",
    "nav.machines": "Machines",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",
    "nav.skip": "Skip to main content",

    "lang.switch": "Français",
    "lang.label": "Change language",

    "cta.quote": "Request a quote",
    "cta.whatsapp": "WhatsApp",
    "cta.whatsappLong": "Message us on WhatsApp",
    "cta.discover": "Explore our machines",
    "cta.more": "Discover",
    "cta.viewAll": "View the full catalogue",

    "machine.why": "Why this machine",
    "machine.applications": "Treatment areas",
    "machine.technology": "The technology",
    "machine.specs": "Technical specifications",
    "machine.gallery": "Gallery",
    "machine.video": "The machine in operation",
    "machine.videoPlay": "Play video",
    "machine.related": "Also worth discovering",
    "machine.brand": "Brand",
    "machine.interested": "Interested in the {name}?",
    "machine.reassurance":
      "Installation, staff training and after-sales service provided locally by GNIE.",
    "machine.views": "Product views",

    "catalog.title": "Our machines",
    "catalog.seoTitle": "Professional aesthetic machines in Tunisia",
    "catalog.intro":
      "Thirteen professional devices across eight technology families, selected for demanding clinics and institutes.",
    "catalog.all": "All",
    "catalog.count": "machines",
    "catalog.countOne": "machine",
    "catalog.quickView": "Quick view",
    "catalog.compare": "Compare",
    "catalog.compareTitle": "Compare machines",
    "catalog.compareEmpty": "Select two or three machines to compare.",
    "catalog.clear": "Reset",

    "cat.laser": "Pigment & tattoo laser",
    "cat.resurfacing": "Fractional lasers & resurfacing",
    "cat.hifu": "HIFU & RF tightening",
    "cat.perinee": "Pelvic floor rehabilitation",
    "cat.cryolipolyse": "Fat freezing",
    "cat.remodelage": "Body contouring",
    "cat.visage": "Facial care",
    "cat.pressotherapie": "Pressotherapy & drainage",
    "cat.analyse": "Analysis & diagnostics",
    "cat.epilation": "Permanent hair removal",

    "footer.machines": "Machines",
    "footer.company": "GNIE",
    "footer.contact": "Get in touch",
    "footer.newsletter": "Newsletter",
    "footer.newsletterText": "Equipment news and guidance, once a quarter.",
    "footer.newsletterPlaceholder": "Your email address",
    "footer.newsletterSubmit": "Subscribe",
    "footer.newsletterDisabled": "Sign-up coming soon.",
    "footer.legal": "Legal notice",
    "footer.privacy": "Privacy",
    "footer.rights": "All rights reserved",
    "footer.since": "Distributor of premium aesthetic equipment in Tunisia since 2015.",

    "wa.generic": "Hello, I'd like information about your aesthetic equipment.",
    "wa.machine": "Hello, I'd like more information about the",
    "wa.aria": "Message us on WhatsApp",

    "breadcrumb.home": "Home",
    "a11y.close": "Close",
  },
} as const;

/** Keys are driven by the French dictionary: adding a FR key forces the EN one. */
export type UIKey = keyof (typeof ui)["fr"];

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}

export function categoryLabel(locale: Locale, category: Category): string {
  return ui[locale][`cat.${category}` as UIKey];
}
