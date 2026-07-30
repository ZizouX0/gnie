# Social sharing images (Open Graph)

Every public page has its own 1200×630 card in `public/og/`, so a link shared on
WhatsApp, LinkedIn or Facebook shows that page — the machine, its category and
its photo — instead of a generic logo.

The cards are committed to the repository. They are build artefacts of
`scripts/og/`, not hand-made files: never retouch a PNG, change the source and
regenerate.

## Regenerating

```bash
node scripts/og/generate.mjs                 # write every card
node scripts/og/generate.mjs --check         # regenerate, write nothing, exit 1 if stale
node scripts/og/generate.mjs machines/ems-16 # only outputs whose path contains this
```

The script needs Playwright and a Chromium binary. Neither is a dependency of
the site, so neither is in `package.json`; the script finds a Playwright
install and a Chromium under `/opt/pw-browsers` or `~/.cache/ms-playwright`, and
both can be pointed at explicitly:

```bash
OG_PLAYWRIGHT=/path/to/node_modules/playwright/index.mjs \
OG_CHROMIUM=/path/to/chrome-linux/chrome \
node scripts/og/generate.mjs
```

Everything else it needs — `sharp`, the Cormorant Garamond and Manrope files,
the brand marks, the machine photos — is already in the repo.

The generator is deterministic: same sources in, byte-identical PNGs out.
`--check` is therefore safe to run in CI to catch a machine whose name, category
or photo changed without its card being regenerated.

**Run it whenever** a machine is added, renamed or recategorised, a hero photo
is replaced, a page title or the site tagline changes, or the brand marks
change.

## Naming

The path mirrors the props `Base.astro` already receives:

```
/og/{locale}/{page}.png              home · machines · contact · legal · privacy
/og/{locale}/machines/{slug}.png     one machine
```

`{page}` is the **page key** from `src/i18n/routes.ts` (`legal`, `privacy`),
never the localized URL segment (`mentions-legales`, `confidentialite`), so the
same expression works in both languages:

```ts
const ogPath = `/og/${locale}/${page}${slug ? `/${slug}` : ""}.png`;
```

Currently 34 files: 12 machines × 2 languages, plus home, catalogue, contact,
legal notice and privacy policy × 2 languages. `/404` and `/dev/styleguide` have
no card of their own — both declare `page="home"`, so they fall back to the
French home card, which is the right thing for a page nobody shares deliberately.

## What is on a card

| Element | Machine page | Every other page |
| --- | --- | --- |
| Mark | GNIE mark + wordmark, top left | full logo lockup, centred |
| Eyebrow | the machine's category label | the section label (`12 machines`, `Contact`…), dropped when it merely repeats the title |
| Title | `name` from the machine file | the page's own heading, or its `<Base title>` |
| Qualifier | the site tagline | the site tagline |
| Photo | `heroImage`, contained in the site's own hairline plate | — |
| Foot | `brand` when the machine has one | — |

Nothing on a card is written here. Titles come from the page files, labels from
`src/i18n/ui.ts`, machine copy from `src/content/machines/`, so a card can never
say something the page does not, or drift into the other language.

## How it works

- `sources.mjs` discovers the pages: locales and dictionary from `src/i18n/ui.ts`,
  page keys from `src/i18n/routes.ts`, machines from `src/content/machines/**`.
  **A thirteenth machine needs no edit here.** A brand-new *route*, however, does:
  add it to `PAGE_COPY` (where its title comes from, what its eyebrow is) or the
  script stops with that instruction rather than inventing a title.
- `card.mjs` builds one self-contained HTML document per card — the site's own
  tokens, its self-hosted fonts embedded as base64, no network access at all.
- `generate.mjs` renders each document in Chromium at 2× (2400×1260) and
  resamples to 1200×630, so the type is supersampled real text, never upscaled.
  The title's size is measured and reduced until it fits, so no name can clip.

Two rules are measured from the photo rather than decided per machine:

- **Light grounds are knocked out.** Manufacturer shots arrive on white studio
  sweeps, blue key art and black sets alike. When the border of a shot really is
  one flat light field, it is flooded away with a soft edge so the machine floats
  on the near-black card instead of dropping a white slab into it. Everything
  else is used exactly as delivered.
- **The plate follows the shot.** Portrait shots get the site's 4:5 window; wider
  ones get a shorter window (clamped at 1.35), so a wide studio scene is not
  reduced to a stripe inside a tall empty frame.

## Weight

34 PNGs, ~2.0 MB in total — around 60 KB each, 88 KB at the worst. They are
palette PNGs (256 colours) written by sharp; on artwork this flat there is no
visible banding, and the type stays crisp. If a card ever exceeds ~150 KB,
suspect a busy photo rather than the encoder.
