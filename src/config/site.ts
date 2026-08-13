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
   * The company's professional address, on a real Microsoft 365 mailbox
   * bought through GoDaddy.
   *
   * This field sat empty for most of the project, and the comment that lived
   * here is worth keeping in mind: this exact string had once been invented as
   * a placeholder and reached production, where the legal notice printed it as
   * the company's official contact and the privacy policy named it as the sole
   * route for exercising data rights — with no mailbox behind it. Requests
   * would have bounced silently.
   *
   * What makes it safe now is not that it looks plausible but that it is
   * demonstrably delivering: the client's Cloudflare account was created with
   * this address and activated, which Cloudflare does not allow without
   * verifying the mailbox receives.
   *
   * Seventeen places across eight files read this, including every legal
   * page in both languages. If it ever stops being monitored, empty it rather
   * than leave it printed — every consumer hides its row when this is "".
   */
  email: "contact@gnie-laser.com",
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
