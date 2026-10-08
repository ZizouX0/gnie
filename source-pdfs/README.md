# Documents sources

Les catalogues, brochures, manuels et fiches techniques dont le contenu du
site est tiré. Les photographies et vidéos sont dans `source-media/`.

Ils sont versionnés pour une raison précise : pendant une partie du projet,
l'étude des gammes 2025/2026 — la source unique de dix-sept fiches et de
plus de quatre cents lignes de spécifications — n'existait que dans une
conversation. Un document dont dépend le tiers du catalogue n'a pas sa place
ailleurs que dans le dépôt.

## Un fichier reconstruit : `catalogue 4.pdf`

L'original transmis faisait **108 Mo**, au-dessus de la limite de 100 Mo par
fichier de GitHub. Il a été reconstruit page par page dans un document neuf
(PyMuPDF, `garbage=4`, `clean=True`) : **49,1 Mo**.

Rien n'a été perdu, et c'est vérifié plutôt qu'espéré — 29 pages, 344 images,
37,4 Mo de données image et 34 285 caractères de texte dans les deux
versions. Les 59 Mo de différence étaient des objets orphelins que l'export
d'origine avait laissés derrière lui.

Une réécriture en place ne suffisait pas : elle rendait 107,6 Mo. Il faut
recopier les pages dans un document vide pour que les objets non référencés
disparaissent.

## Attention en réutilisant ces pages

- **`catalogue 4.pdf`** porte au dos l'ancienne adresse de GNIE et
  `grtarek@yahoo.fr`. Le catalogue du fournisseur n'est pas à jour.
- **`catalogue genie le 11-08-26.pdf`** porte la bonne adresse e-mail et le
  bon domaine, mais toujours l'ancienne adresse postale.
- Les pages de `catalogue 4.pdf` citent des marques tierces — MyoFiber®,
  FiLaC®, LHP®, Triangel — qui ne sont pas celles du fabricant de l'appareil.
- Une page sur deux de `catalogue 4.pdf` a son texte vectorisé plutôt que
  sélectionnable : `get_text()` ne rend presque rien sur les pages 1, 2, 3, 5,
  7, 10, 11, 13, 16, 19, 22, 25, 28 et 29. Les quinze autres se lisent
  normalement. Pour les premières, il faut rendre la page en image.

## Ce que `catalogue 4.pdf` a donné

C'est la source unique de la fiche **Endolaser — LASEEV 980/1470**
(`src/content/machines/*/endolaser.md`) : tableau de spécifications complet
sur la couverture, et dix domaines d'application répartis sur les 29 pages.

Les quatre visuels de la fiche en sortent aussi, extraits à leur résolution
réelle avec `extract_image` — pas à leur taille d'affichage, qui est plus
petite :

| Visuel | Source | Résolution d'origine |
|---|---|---|
| Hero | page 3, xref 4495 | 453 × 453, **agrandi ×2** |
| Pièce à main et pointes | page 2, xref 5894 | 501 × 501, natif |
| Fibre gainée SMA905 | page 2, xref 5895 | 501 × 501, natif |
| Canules de lipolyse | page 9, xref 5848 | 660 × 495, natif |

L'agrandissement du hero est un Lanczos ×2 suivi d'un masque flou. Rien n'est
inventé : c'est un rendu de synthèse à surfaces plates, sans texture à
halluciner, et c'était le seul visuel de l'appareil dans tout le document.
Les trois autres sont intacts. Si le fournisseur envoie une vraie
photographie, elle remplace le hero sans rien changer d'autre.
