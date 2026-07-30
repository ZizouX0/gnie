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
`<span class="amt">4 500</span><span class="cur">TND</span>`, with the annual
maintenance option in the `plaque tight` just below it. Change, re-run
`build-client.mjs`, done.
