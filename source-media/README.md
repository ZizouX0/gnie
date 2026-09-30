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
