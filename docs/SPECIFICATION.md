# GNIE Aesthetics v2 — Project Specification

**The complete, plain-language reference for what we are building, why, and how.**
Version 1.0 — July 2026 · Supersedes nothing: the French CDC (`gniecdctechnique.md`) remains the technical source of truth; this document explains it, records every decision made since, and extends it to the confirmed 12-machine scope.

---

## 1. What this project is

A **premium showcase website** for GNIE (Global Nouvelle Innovation Esthétique), a Tunis-based distributor of professional aesthetic equipment (machines selling at €15,000–€30,000). The site replaces the current one-page v1 at **gnie-aesthetics.com**.

**The single business goal: generate qualified leads.** Every page exists to move a clinic owner one step closer to sending a WhatsApp message or a quote request. One converted lead pays for the site many times over.

**Who visits:** owners and managers of aesthetic clinics, medspas, and beauty institutes — in Tunisia first, francophone Africa second. They are business decision-makers, not engineers: they buy outcomes, return on investment, and trust. The site therefore leads with benefits and results, and keeps the engineering in an expandable spec table for those who want it.

**What the site is NOT:** no online shop, no prices anywhere (quote-driven business), no blog, no user accounts, no CMS admin. It is a fast, static, bilingual brochure engineered for conversion.

---

## 2. Decisions log (everything agreed so far)

| # | Decision | Choice | Why |
|---|----------|--------|-----|
| D1 | Scope | **12 machines** (was 7 in the CDC) | Client confirmed all 12 PDFs are catalogue machines |
| D2 | Categories | **7** (CDC's 6 + Épilation Définitive) | The 2 hair-removal machines needed a home |
| D3 | Featured on home | Cryolipolyse 7D 360°, V-Shape Platinum, VISBODY M30 | Flagship spread: body contouring + tech + analysis |
| D4 | Home hero | **Machine visual** on dark background | Sells the machines from second one |
| D5 | Analytics | **Vercel Web Analytics** | Free, cookieless, ~1.5 KB; measures visitors, top machines, WhatsApp/form clicks |
| D6 | Phase reviews | **Screenshots in chat + client runs the project locally** | No extra accounts needed |
| D7 | Missing spec values | **Hidden on the live site** (never shown as placeholders); tracked in a gap list | A visitor must never see "TODO" |
| D8 | Source PDFs | Archived in the repo (`source-pdfs/`), excluded from the built site | Traceability without weight |
| D9 | Logo | Extracted gold logo (`src/assets/brand/gnie-logo-gold.png`) as fallback | Original file still awaited from client |
| D10 | Languages | French at the root (`/`), English under `/en/` | Primary market is francophone; concentrates SEO on FR |

**Still open (client must answer — none of these block the build):**

1. **EMS 16 name** — the manufacturer manual calls it "NEO". Which name goes on the site?
2. **Hydrafacial brand** — CDC says BEAUTICIAN/NEO; the brochure shows PZLASER on the device. Which is correct?
3. **HOWBODY H6** — its brochure is co-branded by HBEC, *another* Tunisian distributor. Confirm GNIE distributes it.
4. **Électrolyse 5-en-1** — exact commercial/model name.
5. **Brands strip** — PZLASER · VISBODY · (BEAUTICIAN/NEO?) · (HOWBODY?) — final list for the home page.
6. **Service commitments** — exact wording for installation / training / after-sales support (used in every CTA block).
7. **Contact details** — confirm: Imm Emmeraude de Tunis, Rue Mohamed Badra, Bureau A-2-8 Montplaisir, Tunis 1073 · 55 157 506 / 90 157 560 · grtarek@yahoo.fr (found in catalogue 5 — is this current?), plus opening hours.
8. **Missing data & photos** — 17 spec values and 2 product photos listed in `docs/PHASE0-REPORT.md` §4.

---

## 3. Site map — every page that will exist

French is the default (no prefix); every page has an English twin under `/en/`.

```
/                        Home                      /en/
/machines/               Catalog (12 machines)     /en/machines/
/machines/{slug}/        12 machine pages          /en/machines/{slug}/
/contact/                Contact + form + map      /en/contact/
/mentions-legales/       Legal notice              /en/legal/
/confidentialite/        Privacy policy            /en/privacy/
/404                     Not found (shared, bilingual)
```

**≈ 34 generated pages.** The 12 machines, in catalog order:

| # | Machine | Category | Brand |
|---|---------|----------|-------|
| 1 | Ultra PicoIris (picosecond laser) | Laser Pigmentaire & Détatouage | PZLASER |
| 2 | Cryolipolysis 7D 360° ★ | Cryolipolyse | PZLASER |
| 3 | V-Shape Platinum (5-in-1) ★ | Remodelage Corporel | PZLASER |
| 4 | Hydrafacial 10-en-1 | Soin du Visage | PZLASER* |
| 5 | 3-en-1 Air Presso | Pressothérapie & Drainage | — |
| 6 | EMS 16* | Remodelage Corporel | — |
| 7 | VISBODY M30 (3D scanner) ★ | Analyse & Diagnostic | VISBODY |
| 8 | Laser CO2 Fractionné | Laser Pigmentaire & Détatouage | — |
| 9 | EosICE Pro Max (diode, 4 wavelengths) | Épilation Définitive | PZLASER |
| 10 | Électrolyse 5-en-1* | Épilation Définitive | — |
| 11 | Skin Analyzer Q2 | Analyse & Diagnostic | — |
| 12 | HOWBODY H6* | Analyse & Diagnostic | HOWBODY |

★ = featured on the home page · \* = pending an open client question

---

## 4. What each page does

### 4.1 Machine page (the heart of the site — one template, 12 machines)

Fixed section order, engineered for a non-technical buyer: *outcomes first, proof in the middle, engineering on demand, contact everywhere.*

1. **Breadcrumb** — Accueil / Machines / {name}.
2. **Hero** — category label, machine name in large serif type, one-sentence value proposition, two buttons: gold **"Demander un devis"** (quote request) + outlined **WhatsApp** (opens a chat pre-filled with "Bonjour, je souhaite plus d'informations sur la {machine}"). Product image framed on the right.
3. **"Pourquoi cette machine"** — 3–6 benefit cards, outcome language only.
4. **"Zones & indications"** — treatment zones as gold-outlined chips (for analysis devices this becomes their measurement capabilities; section disappears if a machine has none).
5. **"La technologie"** — 1–4 short plain-language blocks explaining how it works.
6. **"Caractéristiques techniques"** — the **spec plate**: an engraved-plaque-styled table, grouped (Énergie / Dimensions / …). On mobile each group collapses (first one open). Rows whose value is still missing are hidden (D7).
7. **Gallery** — only if the machine has ≥ 2 extra clean images.
8. **CTA block** — "Intéressé par la {machine} ?" + the service reassurance line (installation, formation, SAV — wording pending open question 6) + both buttons. The quote button goes to the contact page with the machine pre-selected in the form.
9. **"À découvrir également"** — 2 related machine cards (already chosen for all 12).

### 4.2 Catalog (`/machines/`)

Title + one-line intro → filter bar of 8 pills ("Toutes" + 7 categories) → grid of 12 cards (image, category, name, 1–2 line summary, one key spec, "Découvrir →"). Filtering is instant (tiny client-side script), and the active filter is reflected in the URL so a filtered view can be shared (e.g. send a clinic exactly the "Épilation" view).

### 4.3 Home (`/`)

1. **Hero** — headline on GNIE's positioning ("Équipements esthétiques professionnels — Tunisie"), strong machine visual (D4), buttons: "Découvrir nos machines" + WhatsApp.
2. **Categories strip** — the 7 categories as tiles linking to pre-filtered catalog views.
3. **Featured machines** — the 3 ★ machines, large cards.
4. **"Pourquoi GNIE"** — 3–4 trust points (official distributor, installation & training, local after-sales, international brands — final wording pending question 6).
5. **Brands strip** — text-based brand names (list pending question 5).
6. **About GNIE** — compact company block (Montplaisir, Tunis; since 2015).
7. **Final CTA + newsletter signup** (Brevo).

### 4.4 Contact (`/contact/`)

Left: address, phone, email, WhatsApp, hours. Right: the quote form — name*, establishment, phone*, email*, machine concerned (dropdown of the 12 + "Autre demande", pre-selected when arriving from a machine page), message*. Posts to Formspree (works even with JavaScript disabled; hidden honeypot field blocks spam bots). Below: embedded Google Map, lazy-loaded so it never slows the page.

### 4.5 Legal, privacy, 404

Standard French legal notice + privacy policy for a Tunisian company (privacy page discloses Formspree, Brevo, Google Maps, and Vercel Analytics). 404 is bilingual and on-brand.

---

## 5. Look & feel — "instrument de précision"

The design direction: the restraint of a Swiss watch spec sheet crossed with the warmth of a Tunis luxury institute. Gold-on-black is fixed by the GNIE logo; the danger of gold-on-black is looking like a nightclub flyer, so the system is built on discipline:

- **Colors** — near-black background `#0B0B0D` (never pure black), a slightly lighter graphite for alternating sections, dark carbon for cards, **one gold** `#C9A24B` reserved for headings, accents, buttons and hairlines, ivory `#F3EEE4` for body text. Body text is *never* gold. All combinations pass accessibility contrast standards.
- **Typography** — Cormorant Garamond (elegant serif) for machine names and page titles; Manrope (clean sans-serif) for everything else. A recurring "eyebrow" motif: small gold uppercase labels with wide letter-spacing above every section title. Fonts are self-hosted (no Google request, no layout jump).
- **The signature element** — the **"plaque technique"**: every machine's specs presented like an engraved metal plate (hairline gold frame, dark surface, gold group headers). A miniature of the same plaque style appears on catalog cards, tying the whole site into one family. This is the single memorable device; everything else stays quiet.
- **Motion** — minimal: one subtle fade-up as sections enter, a gold underline slide on menu hover, a 2% zoom on card hover. Nothing autoplays, no carousels, and all motion is disabled for users who set "reduce motion" on their device.
- **Radius** — nearly sharp corners (2px). Luxury, not bubbly.

A hidden `/dev/styleguide` page will show all tokens and components in one place (excluded from search engines) — this is what the Phase 1 screenshot review is based on.

---

## 6. How the content works (and how you edit it later)

All machine content lives in **plain text files** — already written in Phase 0:

```
src/content/machines/fr/cryolipolyse-7d-360.md   ← French version
src/content/machines/en/cryolipolyse-7d-360.md   ← English version
src/assets/machines/cryolipolyse-7d-360/          ← its images
```

Each file holds the machine's name, brand, category, tagline, benefits, applications, technology blocks, spec table, related machines, and SEO text. **No sentence is ever hardcoded in the design** — components only display what the content files contain. UI labels (menu items, button text, form labels) live in one dictionary file (`src/i18n/ui.ts`) with a French and English column; a missing translation fails the build instead of silently showing the wrong language.

Practical consequences:

- **Fix a spec value:** edit one line in two files. Done.
- **Swap a hero photo:** drop the new image in the machine's folder, update one line.
- **Add machine #13:** two content files + one image folder. The catalog, filters, sitemap, and related-machine system pick it up automatically.
- **Wrong data can't ship:** the build refuses to run if a file is malformed (missing benefit, category typo, overlong SEO title…).
- **Missing data can't embarrass you:** any value still marked `TODO:NEEDS_INPUT` is simply not rendered (D7); the gap list in `docs/PHASE0-REPORT.md` tracks what to chase.

Later, if GNIE wants to edit content themselves without touching files, a free visual editor (Decap CMS) can be layered on top of these exact files with zero rebuild — that's a deliberate architectural choice, parked as a future option.

---

## 7. Lead generation mechanics

Every commercial intent routes to exactly two channels — no pricing, no dead ends:

1. **WhatsApp** — floating button on every page, bottom right. On machine pages the chat opens pre-filled naming that machine, so GNIE knows instantly which product the lead wants. FR/EN message matches the page language.
2. **Quote form** — every "Demander un devis" button lands on the contact form with the machine pre-selected. Submissions arrive by email via Formspree.

Supporting cast: Brevo newsletter signup in the footer (long-cycle nurturing), Vercel Analytics (D5) counting visitors, top machine pages, and clicks on the two conversion channels — so after launch you can see *which machines attract interest* even before anyone writes.

---

## 8. Technical foundation (the short version)

| Layer | Choice | In plain terms |
|-------|--------|----------------|
| Framework | **Astro 5**, 100% static output | The site is pre-built into plain HTML files — nothing to hack, nothing to crash, instant loading |
| Styling | **Tailwind CSS 4** + design tokens | One place defines the gold, the spacing, the type scale |
| Content | Markdown + schema validation (Zod) | Human-editable files, machine-checked correctness |
| Images | Astro's image pipeline | Every image auto-converted to modern formats (AVIF/WebP), properly sized, lazy-loaded |
| Fonts | Self-hosted woff2 | No Google Fonts request, no layout shift |
| Hosting | **Vercel** free tier | Global CDN, HTTPS, deploys on every git push |
| Domain | GoDaddy DNS → Vercel | gnie-aesthetics.com already owned |
| Forms / Newsletter / Chat | Formspree / Brevo / WhatsApp | No backend to maintain |
| JavaScript budget | **< 30 KB total** | Menu, filter, fade-ups, analytics — that's all; the site works with JS disabled |

Secrets and IDs (Formspree ID, WhatsApp number, Brevo URL, site URL) are **environment variables** set in Vercel — never written in the code. If one is missing at build time, the related block renders in a safe disabled state instead of breaking.

**Quality bars (measured, not vibes):** Lighthouse ≥ 90 on all four categories (mobile, throttled) for home, catalog, and a machine page · zero layout shift beyond 0.1 · works at 360 px wide with no horizontal scroll · fully keyboard-navigable · visible gold focus outlines · semantic headings · JSON-LD structured data (Organization, Product without prices, Breadcrumb) · hreflang pairs on every page · per-page OG images for social sharing · XML sitemap + robots.txt.

---

## 9. Build plan — 4 phases, each ending in your review

Reviews per D6: I post desktop + mobile screenshots in chat, and you can also run every phase yourself:

```bash
git clone https://github.com/ZizouX0/gnie.git
cd gnie && git checkout claude/skills-setup-workflow-2garzi
npm install
npm run dev     # → http://localhost:4321
```

**Phase 1 — Skeleton & design system.** Astro project configured (i18n, sitemap, Tailwind, fonts), all design tokens, base layout with header/footer/language switcher/WhatsApp float, and the `/dev/styleguide` page showing every component. *Acceptance:* both languages render, switcher works, Lighthouse ≥ 95 on the empty shell. **⛔ Your review.**

**Phase 2 — Machine pages & catalog.** First: the full machine template with **one machine only** (Cryolipolyse 7D — richest content) as the reference for design review. **⛔ Your review.** Then: all 12 machines + the catalog with its 7-category filter. *Acceptance:* all 24 machine pages build, related links valid, spec plates collapse correctly on mobile, filtered views shareable. **⛔ Your review.**

**Phase 3 — Home, contact, legal, 404.** *Acceptance:* form posts to Formspree test inbox, machine pre-selection works, both languages complete. **⛔ Your review.**

**Phase 4 — SEO, integrations, polish, QA.** Structured data validated with Google's tools, hreflang verified, OG images generated, analytics wired, env variables documented, performance pass, full QA sweep (every link, FR/EN parity page by page, 360 px, keyboard-only, reduced-motion). *Deliverables:* QA report + step-by-step deploy guide (Vercel setup + exact GoDaddy DNS records). **⛔ Final review → launch.**

Machine-page rollout in Phase 2 will reuse the parallel-agent workflow that extracted Phase 0 — build the reference page carefully once, then fan out.

---

## 10. Risks & how they're handled

| Risk | Mitigation |
|------|------------|
| Manufacturer images are mediocre (artifacts, text overlays) | Heroes already re-cropped from PDFs at high DPI where possible; 2 machines flagged for client photos; template designed so a photo swap is a one-line change |
| Gold-on-black drifts into "nightclub" | Tokens enforce ONE gold, used only for accents; body text always ivory; whitespace and hairlines do the luxury work |
| Thin content for 2 machines (Air Presso, Électrolyse) | Their pages render fully with what exists; missing spec rows hidden (D7); gap list drives client follow-up |
| Brand confusion (HBEC brochure, PZLASER vs BEAUTICIAN) | Flagged as open questions; HBEC branding already scrubbed from all content and images |
| Client edits later break the site | Schema validation refuses malformed content at build time — broken data can't reach production |
| Free-tier hosting has no formal SLA | Accepted trade-off at this traffic level; site is static so even a re-deploy anywhere takes minutes |

---

*Next step once you've read this: say "go Phase 1" (or ask for changes). The open questions in §2 can be answered any time — the earlier the better, but nothing waits on them until Phase 2's final rollout.*
