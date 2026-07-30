# Client-facing documents — source

French documents handed to GNIE, all in the site's gold-on-black identity.

| Output | Source |
|---|---|
| `docs/client/GNIE-Presentation-Projet.pdf` (12 p) | `deck.template.html` |
| `docs/client/GNIE-Informations-A-Fournir.pdf` (3 p) | `infos.template.html` |
| `docs/client/GNIE-Catalogue-Validation.pdf` (1 p) | `valid.template.html` |
| `docs/client/mockups/*.png` | `mock-home.html`, `mock-machine.html` + `mock.css` |

Shared print styles: `client.css`. Mockup styles: `mock.css` — this file is the
working reference for the Phase 1 design system (tokens, header lockup, plaque
technique, cards, buttons).

## Regenerate

```bash
npm i @fontsource/cormorant-garamond @fontsource/manrope playwright
node shots.mjs        # re-render the mockup screenshots
node build-client.mjs # re-render the three PDFs
```

Both scripts embed fonts and images as data URIs, so the outputs are
self-contained. Paths inside them are absolute — adjust `D`/`OUT` if the
repository moves.

## Editing the price

The amount lives in `deck.template.html`, in the `.priceplate` block:
`<span class="amt">5 000</span><span class="cur">TND</span>`, with the annual
maintenance option in the `plaque tight` just below it. Change, re-run
`build-client.mjs`, done.

If the total changes, also update the "moins de 420 dinars par mois" line in
the value box below it (total ÷ 12). The four figures in that box come from the
content files and can be recounted — they were 13 463 words, 354 spec rows,
45 image files, 34 pages at the time of writing.

Deliberately NOT in the deck: any comparison with agency or competitor pricing.
Unprovable in writing, it positions the offer as the cheap option and invites
counter-quotes. Keep that argument verbal, and only if the price is challenged.
