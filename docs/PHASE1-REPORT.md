# Phase 1 — Scaffold & design system

**Status: complete, awaiting review.** July 2026.

---

## 1. Acceptance criteria — results

The specification set three gates for this phase. All three pass.

| Gate | Target | Result |
|---|---|---|
| Both locales render | FR at `/`, EN at `/en/` | ✅ both build and render |
| Language switcher | lands on the exact counterpart | ✅ `/` → `/en/` → `/` verified programmatically |
| Lighthouse on the shell | ≥ 95 | ✅ **99 / 100 / 100 / 100** (perf / a11y / best-practices / SEO), mobile, throttled — identical on both locales |

Measured alongside:

| Metric | FR | EN | Target |
|---|---|---|---|
| Largest contentful paint | 1.6 s | 1.7 s | — |
| Total blocking time | 0 ms | 0 ms | — |
| Cumulative layout shift | 0.057 | 0.013 | < 0.1 |
| External JS files | **0** | **0** | < 40 KB total |

Every script is inlined and under a kilobyte: the fade-up observer, the `no-js` class removal, and the spec-plate desktop sync. The site works with JavaScript disabled.

Additional checks, all passing:

- **No horizontal scroll at 360 px** on the home pages and the styleguide (`scrollWidth === 360`).
- **Keyboard order** is logical and starts with the skip link: skip → logo → Accueil → Machines → Contact → EN → devis → hero CTA. Focus is visible everywhere (2 px gold outline, 3 px offset).
- **Mobile menu** is a native `<details>` — it opens with zero JavaScript.
- **Spec plate** on mobile: first group open, the rest collapsed; on desktop all groups stay open.
- **Sitemap** contains only the two public pages; `/dev/styleguide` is excluded and marked `noindex, nofollow`.
- **hreflang** `fr` / `en` / `x-default` plus canonical emitted on every page.

## 2. What was built

```
astro.config.mjs          i18n (fr default, en prefixed), sitemap with /dev/ filtered, Tailwind 4
src/content.config.ts     Zod schema — validated all 24 existing content files, 0 errors
src/styles/global.css     design tokens, focus ring, motion (reduced-motion aware), utilities
src/i18n/ui.ts            every UI string, FR + EN; a missing key is a type error
src/i18n/routes.ts        localized paths, alternate mapping, hreflang pairs
src/config/site.ts        company facts (pending client confirmation) + env accessors
src/layouts/Base.astro    head, SEO, OG/Twitter, Organization JSON-LD, header/footer/WhatsApp
src/components/           Header · Footer · LangSwitcher · WhatsAppFloat · Button ·
                          SectionHeading · CategoryPill · MachineCard · BenefitCard ·
                          SpecPlate · CTABlock · Breadcrumb · HomeHero
src/pages/                index.astro · en/index.astro · dev/styleguide.astro
public/                   favicon.svg · apple-touch-icon.png · robots.txt
```

The **styleguide** at `/dev/styleguide` renders the palette, the type scale, the eyebrow motif, both button variants, the category pills, the breadcrumb, benefit cards, the spec plate (with real Cryolipolyse data) and three machine cards — built from the actual content files, not lorem ipsum.

## 3. Decisions taken while building

- **Header logo** is a horizontal lockup: the mark plus the wordmark as separate assets (`gnie-mark-gold.png`, `gnie-wordmark-gold.png`), split from the stacked logo. The stacked original is illegible at 36 px tall.
- **Spec plate** hides any row whose value still reads `TODO:NEEDS_INPUT` (decision D7) and drops a group entirely if all its rows are missing. Verified against the five machines with gaps.
- **Machine card mini-spec** is clamped to two lines. Without it, the V-Shape Platinum's five-technology value stretched the card out of the grid — caught in review.
- **Integrations degrade safely**: with no `PUBLIC_WHATSAPP_NUMBER` the float button doesn't render; with no `PUBLIC_BREVO_FORM_URL` the newsletter shows a disabled notice instead of a broken form. Both verified.
- **Desktop spec plate** forces every group open, since a spec sheet reads best whole; the summary is inert there.

## 4. Deliberately not built yet

Per the phased plan: the catalogue, the twelve machine pages, contact, legal pages and the 404 belong to Phases 2 and 3. The home page currently carries only the hero and a CTA block — its remaining sections (categories strip, featured machines, why GNIE, brands, about, newsletter) are Phase 3.

## 5. Open items carried forward

- `src/config/site.ts` holds the contact details taken from the GNIE catalogue, still **pending client confirmation** (specification §2, question 7). The email is set to `contact@gnie-aesthetics.com` as a placeholder rather than the `@yahoo.fr` address.
- The **V-Shape Platinum** hero shows its extraction artifact in card format — the client photo request in "Informations à fournir" stands.
- Environment variables are documented in `.env.example`; real values come at deploy.

## 6. Run it yourself

```bash
git checkout claude/skills-setup-workflow-2garzi
npm install
npm run dev            # → http://localhost:4321
                       # http://localhost:4321/dev/styleguide  ← the design system
npm run build          # static output in dist/
```

---

**⛔ End of Phase 1 — awaiting review.** Next on approval: **Phase 2**, the machine page template built with one machine only (Cryolipolyse 7D 360°) as the design reference, stopping for review before the other eleven and the catalogue.
