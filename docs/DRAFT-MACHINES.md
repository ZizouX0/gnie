# Machines en brouillon — comment les publier

Le catalogue contient **30 machines** : 13 en ligne, 17 en brouillon.

Les 17 brouillons viennent de l'étude *Gammes de technologies en médecine
esthétique 2025/2026* (GNIE / Sarra Bellakhal, 112 pages). Leur contenu est
écrit et relu, en français et en anglais. **Il ne leur manque qu'une
photographie.**

## Pourquoi elles ne sont pas en ligne

Les visuels d'appareils de l'étude mesurent entre 144 et 230 pixels de large.
La plus petite image du catalogue actuel fait 392 pixels, la plus grande
1 780. Publier ces vignettes agrandies donnerait des fiches floues, sur un
site dont l'argument principal est la qualité.

Chaque brouillon utilise donc `src/assets/machines/_placeholder/photo-a-venir.jpg`
— un placeholder volontairement reconnaissable, pour qu'une publication
accidentelle se voie immédiatement.

## Ce que fait `draft: true`

Une machine en brouillon ne produit **rien** de public :

| Surface | Comportement |
|---|---|
| Page `/machines/{slug}/` et `/en/machines/{slug}/` | non générée |
| Catalogue | absente de la grille et du compteur |
| Filtres et bandeau de catégories | ne compte pas ; une famille vide n'affiche ni pastille ni tuile |
| Sitemap | absente |
| Carte de partage `public/og/` | non générée |
| Liste déroulante du formulaire de contact | absente |
| Liens « à découvrir également » | `relatedMachine()` refuse un brouillon |

Tout passe par `src/lib/machines.ts`. Aucun composant n'appelle
`getCollection` directement — c'est ce qui garantit qu'aucune surface
n'oublie le filtre.

## Publier une machine

1. Déposer la photo dans `src/assets/machines/{slug}/{slug}-hero.jpg`
   (800 px de large au minimum, fond neutre ou détouré).
2. Dans les **deux** fichiers `src/content/machines/{fr,en}/{slug}.md` :
   - remplacer `heroImage:` par le chemin de la nouvelle photo ;
   - passer `draft: true` à `draft: false`.
3. `node scripts/check-content.mjs` — vérifie les longueurs SEO, l'unicité des
   `order`, la résolution des liens `related` et la parité FR/EN.
4. `npm run build`
5. `node scripts/og/generate.mjs` — génère les deux cartes de partage.

Les visuels secondaires sont facultatifs : la galerie reste masquée en dessous
de deux images.

## À mettre à jour quand le catalogue grandit

Trois chaînes portent des compteurs écrits à la main. Elles disent aujourd'hui
« treize » et « huit familles » ; avec les 17 machines publiées, ce serait
**trente** machines et **dix** familles.

- `src/pages/index.astro` et `src/pages/en/index.astro` — la ligne de confiance
  du hero (`<b>13</b> machines au catalogue`) et le titre du bandeau de
  catégories (« Huit familles de technologies »), plus la mention dans le bloc
  « Pourquoi GNIE ».
- `src/i18n/ui.ts` — la clé `catalog.intro`, dans les deux langues.

## Les 17 machines

| Famille | Machines |
|---|---|
| Épilation définitive | DL109 · BM03 · BM101 |
| Laser pigmentaire & détatouage | BMPS7 · BMPS4 · BM33 · BM32 |
| Lasers fractionnés & resurfaçage | BMFR17 · BMFR03 · BMFR18 |
| Raffermissement HIFU & RF | FU5-1S · FU5 · FU3 · MR16-6S |
| Soin du visage | EMS10 |
| Remodelage corporel | EMS9 |
| Rééducation périnéale | EMS1 |

Trois familles n'existent que pour elles et n'apparaîtront sur le site qu'à
leur publication : `resurfacing`, `hifu` et `perinee`.

## Modèles de l'étude volontairement absents

- **DL108** — mêmes quatre longueurs d'onde que l'EosICE Pro Max déjà en
  ligne. L'ajouter avant confirmation du client risquerait de présenter la
  même machine deux fois sous deux noms. La question est posée dans
  `docs/client/GNIE-Ce-Qui-Manque.pdf`.
- **BMFR15** — c'est le Laser CO2 Fractionné déjà en ligne : huit valeurs de
  spécification identiques.
- **FU4-1SP, MR16-5S, EMS15, EMS2** — variantes de format sans tableau de
  spécifications propre. Chacune est une ligne dans la fiche de son jumeau.
- **Er:YAG 2940 nm** (section 4.6 de l'étude) — technologie décrite, mais
  aucun modèle nommé et aucun tableau. Rien à partir de quoi construire une
  fiche.
