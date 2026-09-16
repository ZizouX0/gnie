# Machines en brouillon — comment les publier

Le catalogue contient **30 machines** : 13 en ligne, 17 en brouillon.

Les 17 brouillons viennent de l'étude *Gammes de technologies en médecine
esthétique 2025/2026* (GNIE / Sarra Bellakhal, 112 pages). Leur contenu est
écrit et relu, en français et en anglais. **Il ne leur manque qu'une
photographie.**

## Pourquoi elles ne sont pas en ligne

**Mesuré, pas supposé.** Les 37 images de l'étude ont été extraites à leur
résolution *embarquée* — celle du fichier à l'intérieur du PDF, pas la taille à
laquelle il s'affiche sur la page. Les deux diffèrent souvent ; ici non : la
résolution effective est de 95–96 DPI, l'image placée fait la taille du fichier.
Il n'y a aucune réserve cachée.

| Machine | Figure | Largeur réelle |
|---|---|---|
| BM03 Beard Shaping | fig. 5, p25 | 227 px |
| BMPS7 Nano & Pico | fig. 7, p34 | 214 px |
| BM101 Gentle YAG Pro | fig. 6, p28 | 188 px |
| BMFR18 dual | fig. 13, p66 | 188 px |
| BM32 Q-switched | fig. 9, p43 | 184 px |
| BM33 PicoMax | fig. 8, p40 | 176 px |
| MR16-6S RF micro-aiguilles | fig. 18, p86 | 173 px |
| EMS1 fauteuil périnéal | fig. 24, p98 | 167 px |
| DL109 diode | fig. 3, p22 | 158 px |
| EMS10 Pulse Lift | fig. 20, p91 | 158 px |
| FU3 Ultraformer MPT | fig. 17, p83 | 157 px |
| FU5 HIFU & RF | fig. 16, p80 | 153 px |
| FU5-1S SMAS Lift 12D | fig. 14, p76 | 150 px |
| BMFR03 Thulium | fig. 11, p62 | 144 px |
| EMS9 EMS MAX | fig. 22, p94 | 144 px |
| **BMPS4 True Pico** | — | **aucune image** |
| **BMFR17 Erbium Glass** | — | **aucune image** |

Le minimum exploitable est 800 px ; les fiches en ligne vont de 392 à 2 422 px.
L'écart n'est pas affaire de netteté : facteur 4 à 6 en largeur, soit 12 à 31
fois moins de pixels. Aucun agrandissement ne comble cela.

Les images produit sont par ailleurs excellentes — rendus studio, fond blanc,
appareil entier, nettes, sans filigrane ni marque tierce. Elles ne pèchent que
par la taille.

Les douze images de l'étude qui dépassent 500 px sont **toutes** des planches
d'annexe : schémas d'interaction laser-tissu, classification de Fitzpatrick,
coupes de peau, plaques d'applicateurs. Aucune photographie d'appareil.

### Ce qui a été écarté

- **Les neuf photographies WhatsApp** (800×800 à 1200×1600) : trois collages
  promotionnels filigranés `pzlaser.com` pour des machines déjà en ligne, quatre
  clichés d'usine d'un même appareil noir encore sous film plastique avec ses
  étiquettes d'expédition, deux photos d'accessoires en mousse.
- **`catalogue genie le 11-08-26`** (19 p, 164 images) : brochure mono-produit
  consacrée entièrement à l'EosICE Pro Max, déjà en ligne. Sur 35 images
  exploitables extraites, 24 sont du mobilier de page — aplats, dégradés, filets,
  masques alpha.

### La piste à suivre

Le fabricant. Les visuels de l'étude viennent de sa documentation : il détient
les originaux en haute résolution. Un seul envoi débloque les dix-sept — et
resterait à vérifier que le BMPS4 et le BMFR17 existent bien au catalogue, l'étude
les décrivant sans jamais les montrer.

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
