# Phase 2 — Machine pages & catalogue

**Status: built and verified, awaiting your design review.** July 2026.

---

## 1. How this phase was run

Three build agents worked on strictly disjoint files (components → machine template → catalogue), then eight auditors and three supervisor gates were dispatched to verify the result.

**The verification run died.** Of fourteen agents, five completed — the three builders and two auditors — and the remaining nine, including all three gates, never reported. Rather than restart fourteen agents, the verification below was performed directly. Every number here comes from a command that was actually run, not from an agent's summary.

## 2. Acceptance criteria — results

Specification §9, Phase 2:

| Criterion | Result |
|---|---|
| All 24 machine pages build | ✅ 12 FR + 12 EN, 29 pages total with catalogues, home and styleguide |
| Related links valid | ✅ 2 related cards on all 12 machines, resolving within the same language |
| Spec plates correct on mobile | ✅ first group open, the rest collapsed; all open on desktop |
| Filtered catalogue shareable | ✅ `/machines/#analyse` applies the filter on load |

Quality bars:

| Measure | Machine page | Catalogue | Target |
|---|---|---|---|
| Lighthouse performance | **99** | **99** | ≥ 90 |
| Accessibility | **100** | **100** | 100 |
| Best practices | **100** | **100** | — |
| SEO | **100** | **100** | — |
| Largest contentful paint | 2.0 s | 1.8 s | — |
| Total blocking time | 0 ms | 0 ms | — |
| Cumulative layout shift | **0** | **0.04** | < 0.1 |
| JavaScript shipped | 2.9 KB inline, **0 external files** | 3.0 KB inline, **0 external files** | < 40 KB |

Measured after the fixes in §4. The lowest score across the twelve machine pages is 98 (V-Shape Platinum).

## 3. What was verified, and how

**Structure — all 12 machines, both languages.** Exactly one `h1` per page; identical section count FR vs EN on every machine; spec plate present; two related cards. Section counts vary by content as designed (7 for a machine with no video or gallery, 9 for the Cryolipolyse).

**Video facade (D11).** Present on exactly the three machines carrying a `videoId`. The built HTML contains **zero `<iframe>` tags and no preconnect to YouTube** — the only YouTube references are a `<noscript>` fallback link and the click handler that injects the player. Verified by parsing the HTML, not by inspection.

**Content-driven sections.** The applications section is absent where a machine has none; the gallery renders nothing below two images.

**Catalogue interaction — driven in a real browser.** 12 cards; filter *Analyse* → 3, *Épilation* → 2; the count is announced in text ("3 machines"), not by colour alone; a shared `#analyse` URL applies on load. Quick-view opens with Enter, is a true modal (`:modal` matches, background inert), moves focus inside, closes on Escape and **returns focus to the trigger**. Comparison: 12 checkboxes, the "pick 2–3" hint on a single selection, three columns rendered with full grouped spec plates, selection written to `?compare=a,b,c`, the panel scrolling inside its own container, and reset clearing both selection and URL.

**Responsive.** No horizontal overflow at 360 px on the catalogue, a machine page, an English machine page, or a filtered view — including with the comparison panel open.

**Without JavaScript.** All 12 cards visible, no dialog stuck open, comparison panel hidden rather than broken, 15 spec rows readable, video degraded to a working YouTube link.

**Missing data never reaches a visitor (D7).** Verified per machine, counting rows inside the plate only:

| Machine | Rows expected | Rendered | Hidden values |
|---|---|---|---|
| V-Shape Platinum | 12 | 12 | Puissance, Alimentation, Dimensions, Poids |
| 3-en-1 Air Presso | 10 | 10 | Pression maximale, Dimensions, Poids |
| Skin Analyzer Q2 | 17 | 17 | Alimentation, Dimensions et poids |
| EosICE Pro Max | 12 | 12 | Puissance, Fluence, Fréquence, Taille du spot, Dimensions/poids |
| Électrolyse 5-en-1 | 8 | 8 | Alimentation, Dimensions, Poids |

Groups left with no remaining rows disappear entirely. Across all 29 pages: **zero occurrences** of `TODO:NEEDS_INPUT`, `undefined`, or `[object Object]`.

**Structured data.** `Organization`, `Product` (name, image, description, brand — **no `offers`**, no price) and a 3-item `BreadcrumbList` per machine page. Title 57 characters, description 139 — both inside the limits.

**Content fidelity — traced back to the brochures.** Values sampled on the rendered pages and located in the source PDFs:

- Cryolipolyse: `5℃~ -11℃`, `10~80Kpa`, `37℃ ~ 42℃` — all three in the PZLASER catalogue
- Laser CO2: `10600nm`, `70W` — both in the brochure
- EMS 16: `HIFEM`, `Synchrode RF`, `Built muscle − 25%`, `Reducing fat − 30%`, `Output intensity 0-7Tesa` — all in the manual. These read like generic marketing copy and were checked specifically for that reason; they are genuine.
- Air Presso: `Power: 500 W` — in the manual
- Hydrafacial: `10.4 inches` — in the brochure

Two deliberate deviations from "units exactly as printed": the manual's `0-7Tesa` is rendered `0-7 Tesla` (manufacturer typo, Tesla being the unit), and `10.4 inches` is rendered `10,4 pouces` on the French page (decimal comma and translated unit label).

## 4. Fixed during this review

**Gallery stage.** The stage forced a 1:1 box with `object-fit: contain`, so portrait shots — most of the gallery images are portrait — were letterboxed into a field of black roughly 45 % of the frame. Replaced with a constant-height stage where each image shows at its own aspect, centred: no bars beyond the image itself, and switching views still costs no layout shift because the height is fixed. Verified by driving all three Cryolipolyse views: each renders at exactly 416 px tall and 177 / 518 / 253 px wide. Without JavaScript the grid sizes naturally instead.

**Unrecognisable cards on very tall photos.** The card plate is landscape, and three manufacturer shots are extreme portraits — up to 1:2.8. Cropping those to the centre landed on the anonymous middle of a white column: the HOWBODY H6 card showed no identifiable machine at all. Cards now anchor the crop to the top when a photo is taller than 1:1.9, where the screen, branding and handpieces are. The threshold is measured from the asset itself, so a replacement photo needs no extra metadata, and it selects exactly the three intended cards (HOWBODY H6, Hydrafacial, Laser CO2).

**Four corrupted product photos recovered.** These shots are stored in the brochures as an image plus a separate transparency mask. The original extraction took the image and dropped the mask, so the cut-out surround was flattened into whatever the encoder produced — a black band down one side of the Cryolipolyse gallery shot, and on the **V-Shape Platinum hero the machine tiled dozens of times across the background**. That last one had been logged in Phase 1 as an artifact needing a client re-shoot; it did not. Rebuilding each image from its mask, cropping to the subject and compositing onto the exact page black gives a clean cut-out:

| Image | Was | Now |
|---|---|---|
| Cryolipolyse gallery 01 | 22 % pure-black dead band | clean cut-out |
| Cryolipolyse gallery 03 | tiled repeats top and bottom | clean cut-out |
| Hydrafacial hero | tiled repeats left and right | clean cut-out |
| V-Shape Platinum hero | machine tiled across the frame | clean cut-out |

Only these four were touched. A first attempt applied the same recovery to every photo carrying a mask and **corrupted the VISBODY body-measurement diagram**, which was already correct — matching a mask by pixel dimensions alone is not sound. That was reverted in full, and each of the four above was confirmed corrupted by eye before and after.

## 5. A design decision for you

Product photos now sit on two different backgrounds: four are cut out on the page black, the rest keep the manufacturer's white studio backdrop. On the Cryolipolyse page the V-Shape and EMS 16 cards sit side by side and show the difference plainly.

The cut-outs look considerably more expensive, and white rectangles do work against a gold-on-black identity. Sixteen photos still carry a white backdrop and have no usable mask in the brochure, so evening this out means proper background removal on each. **My recommendation: normalise them all onto the page black** — but it is a taste call and a half-day of work, so I would rather you look at the screenshots and say.

## 6. Known issues, not code defects

- **Section eyebrows repeat the machine name** on every section of a machine page. Defensible, but a varied eyebrow would read better. Cosmetic, your call.
- **`Fractional CO2 Laser` and `Visbody-M30`** display with their manufacturer spelling on French pages. Product names are not translated, so this is correct — but if you prefer *Laser CO2 Fractionné* on the French side, it is a one-line content edit.

## 7. A note on the screenshots

An earlier set of these screenshots showed two blank image plates — the HOWBODY H6 card and the EMS 16 related card. Neither was a site defect: the capture tool stitches a tall page (a machine page is over 8 000 px) from several passes and caught lazy images mid-load. The captures now size the viewport to the whole document and shoot in one pass, and every image is confirmed painted before the shutter. Worth stating because a blank plate in a review shot is indistinguishable from a real bug, and one of the two led me to a genuine defect while the other did not.

## 8. Run it yourself

```bash
git checkout claude/skills-setup-workflow-2garzi && npm install && npm run dev
# http://localhost:4321/machines/                        catalogue, filters, quick-view, comparison
# http://localhost:4321/machines/cryolipolyse-7d-360/    the reference machine page
# http://localhost:4321/en/machines/cryolipolyse-7d-360/ its English twin
```

---

**⛔ End of Phase 2 — awaiting your design review.** Next on approval: **Phase 3** — home page, contact with the Formspree form and `?machine=` preselection, legal pages and the 404.
