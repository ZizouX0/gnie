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
  /**
   * The same numbers in E.164, for anything a machine reads: structured data
   * and `tel:` links. Google's guidance is explicit that a telephone in
   * structured data must carry the country code, and a national-format number
   * cannot be dialled from outside Tunisia. Display still uses the spaced
   * forms above. Tunisia is +216.
   */
  phonePrimaryE164: "+21655157506",
  phoneSecondaryE164: "+21690157560",
  /**
   * EMPTY ON PURPOSE — the client has not supplied a professional address.
   * `contact@gnie-laser.com` used to sit here as a stand-in and reached
   * production copy: a legal notice printed it as the company's official
   * contact, and the privacy policy named it as the sole route for exercising
   * data rights. It appears in no source document and no mailbox is known to
   * exist, so requests to it would silently bounce. The only address ever
   * observed is `grtarek@yahoo.fr`, from catalogue 5, unconfirmed and
   * personal. Every consumer hides its e-mail row while this is empty; fill
   * it in and they all light up.
   */
  email: "",
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
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? "https://gnie-laser.com",
} as const;

export const BRANDS = ["PZLASER", "VISBODY", "HOWBODY"] as const;
