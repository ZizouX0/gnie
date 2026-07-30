# Phase 3 — Home, contact, legal, 404

**Status: built and verified, awaiting your review.** July 2026.

---

## 1. How this phase was run

Three build agents on strictly disjoint files (home sections · contact · legal/privacy/404), plus two independent auditors re-checking Phase 2 while the building happened. No agent ran a build — a concurrent `astro build` corrupts the shared cache, which is part of what killed the Phase 2 run — and no agent was allowed to touch a shared contract (`i18n`, `routes`, `config`, tokens, layout, content). Integration, the build and every number below are mine.

## 2. Acceptance criteria — results

Specification §9, Phase 3:

| Criterion | Result |
|---|---|
| Form posts to Formspree | ✅ real `<form method="post">`; disables itself with a notice when the endpoint is unset, rather than posting nowhere |
| Machine pre-selection works | ✅ `?machine=<slug>` pre-selects, verified against what the CTAs actually emit |
| Both languages complete | ✅ 7 new pages: contact, legal, privacy ×2 languages, plus a bilingual 404 |

| Measure | Home | Contact | Legal | Catalogue |
|---|---|---|---|---|
| Lighthouse performance | **99** | **100** | **100** | **99** |
| Accessibility | **100** | **100** | **100** | **100** |
| Best practices | **100** | **100** | **100** | **100** |
| SEO | **100** | **100** | **100** | **100** |
| Cumulative layout shift | 0.055 | **0** | **0** | 0.04 |

36 pages build. **Zero dead internal links across all 36** — the machine pages' "Demander un devis" button and the footer's legal links now resolve.

## 3. What Phase 3 added

**Home** — categories strip (7 tiles linking to pre-filtered catalogue views), 3 featured machines, why GNIE, brands, about, newsletter. Nothing is hardcoded that already lives in the data: featured machines come from `featured: true` in the content files, tile counts from the collection, brands from `BRANDS`, company facts from `CONTACT`.

**Contact** — quote form (name, establishment, phone, email, machine, message) with a real `<label>` on every field, a honeypot, and `?machine=` pre-selection. The map is a click-to-load facade: **the built site contains zero `<iframe>` tags and no preconnect**, so nothing reaches Google until a visitor asks.

**Legal, privacy, 404** — a legal notice and privacy policy in both languages, and a bilingual 404 that is complete without JavaScript.

## 4. ⚠ Launch blocker — 20 placeholders must be filled

The legal and privacy pages carry **20 visible `TODO:NEEDS_INPUT` markers**. This is deliberate: none of these facts are known, and a legal notice is the last place to invent a registration number. They are impossible to miss, and they must not reach production.

**Legal notice** — legal form (SARL/SUARL/SA), share capital, RNE registration number, matricule fiscal, publication director, and the host's legal identification.

**Privacy policy** — retention period for quote requests, retention after newsletter unsubscribe, confirmation that Vercel Analytics is switched on plus its retention, and the policy's effective date.

The privacy text describes only what the site actually does, checked against the build: no cookies, no storage, no third-party iframe, and both the map and the video load only on click.

## 5. Fixed during this phase

Two independent audits ran against Phase 2. They found one real defect in the built site, two real content bugs, and several places where **my own Phase 2 report was wrong** — all corrected in `PHASE2-REPORT.md`.

- **Spec plate was a keyboard trap.** From tablet up the group header was made inert while staying focusable: Enter collapsed a group, the hidden chevron gave no sign, and the mouse could not reopen it. With JavaScript off it was worse — the header was unclickable *and* closed, putting 11 of 15 rows out of reach. It is now an ordinary disclosure control that defaults open, which has no failure mode. It also stops overriding a group you have toggled yourself, and indexes per plate so each comparison column opens its own first group.
- **Reveal failsafe.** If the script that reveals content never ran, everything below the hero stayed invisible permanently. A net in `<head>` now shows it all if that script has not reported in. Verified by serving the real page with only that script removed.
- **French article agreement.** Every machine page read *"Intéressé par la EMS 16 ?"* — a fixed article appended to names of both genders. Each language now owns a full sentence pattern.
- Skip link now moves focus; the comparison panel no longer exposes two landmarks with one name; filter pills are hidden without JavaScript instead of being eight controls that do nothing; the language switcher meets the 24 px target.
- **Category tiles** wrapped 5 + 2 with the bottom two stretched to 2.5× the others, implying a hierarchy that does not exist. Now equal tiles, 4 + 3.
- **The contact page claimed "three direct channels … WhatsApp"** while showing two, because the WhatsApp row only renders when the number is configured. The copy no longer commits to a count.
- **The home page claimed GNIE serves "Tunisia and francophone Africa."** The specification lists francophone Africa as an audience, not a serviced market, and it contradicted the local-after-sales promise on the same page. Narrowed to Tunisia.

## 6. Open, and needing you

- The 20 legal placeholders above.
- `PUBLIC_FORMSPREE_ID`, `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_BREVO_FORM_URL` are unset, so the form, the WhatsApp row and both newsletter blocks render their disabled states. All three come at deploy.
- Phone links have no country code (`tel:55157506`), matching the footer's existing convention. Dialling from abroad needs `+216…` added to `CONTACT` in `src/config/site.ts`.
- Opening hours are omitted rather than invented — one line to add once confirmed.
- The `Cryolipolysis 7D 360°` naming question from Phase 2 is still open.

## 7. Run it yourself

```bash
git checkout claude/skills-setup-workflow-2garzi && npm install && npm run dev
# http://localhost:4321/                     home
# http://localhost:4321/contact/             contact — try /contact/?machine=ems-16
# http://localhost:4321/mentions-legales/    legal notice
# http://localhost:4321/nonexistent          404
```

---

**⛔ End of Phase 3 — awaiting your review.** Next on approval: **Phase 4** — SEO pass, integrations wired, OG images, analytics, full QA sweep and the deploy guide.
