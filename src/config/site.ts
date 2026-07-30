/**
 * Company facts used across the site.
 *
 * Sourced from the GNIE catalogue and PENDING CLIENT CONFIRMATION
 * (specification §2, open question 7 — the "Informations à fournir" sheet).
 * Everything third-party lives in environment variables, never here.
 */
export const CONTACT = {
  addressLines: [
    "Imm. Emmeraude de Tunis",
    "Rue Mohamed Badra, Bureau A-2-8",
    "Montplaisir, Tunis 1073",
  ],
  cityLine: "Montplaisir · Tunis · Tunisie",
  phonePrimary: "55 157 506",
  phoneSecondary: "90 157 560",
  email: "contact@gnie-aesthetics.com",
  since: 2015,
  /** Geo for the Organization JSON-LD. */
  locality: "Tunis",
  region: "Tunis",
  postalCode: "1073",
  country: "TN",
} as const;

export const SOCIAL: { label: string; href: string }[] = [
  // Awaiting client confirmation — rendered only when present.
];

/** Provided at deploy time. Absent values degrade to a safe state, never a broken one. */
export const ENV = {
  whatsapp: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? "",
  formspree: import.meta.env.PUBLIC_FORMSPREE_ID ?? "",
  brevo: import.meta.env.PUBLIC_BREVO_FORM_URL ?? "",
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? "https://gnie-aesthetics.com",
} as const;

export const BRANDS = ["PZLASER", "VISBODY", "HOWBODY"] as const;
