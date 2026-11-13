# Photographies et vidéos sources

Les documents PDF sont dans `source-pdfs/`. Ce dossier ne contient que des
images et des vidéos, rangées par date de réception.

## 2026-09-27 — 30 photographies, 8 vidéos

Transmises par le client. Ce qu'elles montrent, après identification :

| Appareil | Fichiers | État |
|---|---|---|
| **Revivefacial 14-en-1** | 13 photos, 3 vidéos | Publié. Hero tiré de `WhatsApp Image … 13.53.52 (1)` — 1066 × 1600, photographie réelle, fond propre. |
| **Dermabrasion Hydra 7-en-1** | 4 photos, 1 vidéo | Publié. **Le hero vient de la vidéo**, pas des photos : voir ci-dessous. |
| **NV-WB12 12-en-1** | 2 photos, 2 vidéos | Brouillon. Rien au-dessus de 800 px. |
| **EosICE Pro Max** (déjà en ligne) | 6 photos, 1 vidéo | Livrée noire « Pause Beauté », marquage d'un client, pas celui de GNIE. |
| **Hydrafacial 10-en-1** (déjà en ligne) | 4 photos, 1 vidéo | Contient une version 1600 × 1086 du visuel principal actuel, qui fait 392 × 1112. |

## Le hero de la Dermabrasion Hydra vient d'une vidéo

`WhatsApp Video 2026-09-27 at 13.53.15.mp4` est une démonstration studio en
1920 × 1080. **L'image 0 — avant l'apparition du carton-titre — montre
l'appareil entier sur fond blanc, sans texte, sans main et sans filigrane.**
Recadrée à 940 × 1000, elle passe largement la barre des 800 px.

```
ffmpeg -i "WhatsApp Video 2026-09-27 at 13.53.15.mp4" -frames:v 1 -q:v 1 frame0.jpg
ffmpeg -i frame0.jpg -vf "crop=940:1000:490:50" -q:v 1 hero.jpg
```

C'est la méthode à retenir : une vidéo produit n'est pas seulement une vidéo,
c'est une réserve d'images fixes en pleine résolution. Le reste de cette
vidéo ne sert à rien — mains dans le champ, sous-titres marketing incrustés,
et un filigrane tiers sur la plupart des plans.

Le carton de fin donne le fabricant : **sunwin** / sunwinbeauty.com. C'est un
indice, pas une confirmation : le champ `brand` de la fiche reste vide tant
que le client ne l'a pas validé.

## Ce que ces fichiers n'apportent pas

Aucune des machines en brouillon de l'étude n'y figure. Ni colonne HIFU, ni
laser pico ou Q-switched, ni laser fractionné, ni fauteuil périnéal, ni
station EMS. Vérifié appareil par appareil.

## 2026-10-23 — 2 photographies, 4 vidéos

Transmises par le client pour quatre appareils. Les documents PDF
correspondants sont dans `source-pdfs/`.

| Vidéo | Montre | Résolution | Sert à |
|---|---|---|---|
| `… 19.30.40.mp4` | ShotWalker en cabine, écran, pièce à main, cartouches | 1920 × 1080 | **Hero, 3 visuels de galerie et la vidéo** de la fiche ShotWalker |
| `… 15.50.19.mp4` | RegenOS, interface de réglage | 1024 × 576 | Vidéo de la fiche RegenOS |
| `… 19.30.40 (1).mp4` | Fabrication des cartouches à aiguilles plaquées or | 1080 × 1920 | Vidéo de la fiche Gold Microneedle |
| `… 15.50.20.mp4` | **ENDO PRO de Triangel** — « Endolaser + Fractural RF Micro-needling » | 720 × 1280 | Rien pour l'instant : appareil non documenté, voir ci-dessous |

## Le hero du ShotWalker vient aussi d'une vidéo

Même méthode que pour la Dermabrasion Hydra. À 3,9 s, `… 19.30.40.mp4`
montre l'appareil entier dans une vraie cabine ; le carton-titre est en train
de disparaître et reste à gauche, donc un recadrage à partir de x = 760 le
supprime entièrement.

```
ffmpeg -ss 3.9 -i "WhatsApp Video 2026-10-23 at 19.30.40.mp4" -frames:v 1 -q:v 1 f.jpg
# puis recadrage (760, 35) → (1540, 1080)
```

Trois autres plans de la même vidéo servent la galerie : la console, les
boîtes de cartouches et la macro d'une pointe plaquée or.

## Les vidéos publiées sont réencodées

`public/videos/` ne contient pas ces fichiers tels quels : ils sont
réencodés en H.264 CRF 28, 1280 px au plus grand côté, audio AAC 96 kbit/s,
avec `+faststart` pour que la lecture démarre avant la fin du
téléchargement. 50 Mo deviennent 30 Mo sans différence visible — ce qui
compte sur une connexion mobile tunisienne. Les originaux restent ici.

## ENDO PRO : un appareil sans documentation

`… 15.50.20.mp4` présente un appareil Triangel appelé **ENDO PRO**, dont
l'écran annonce « Endolaser + Fractural RF Micro-needling ». C'est donc une
machine qui combine l'endolaser et la radiofréquence fractionnée dans un
seul boîtier. Aucun document ne l'accompagne et ce n'est pas le LASEEV de la
fiche Endolaser. À demander au client avant d'en faire quoi que ce soit.
