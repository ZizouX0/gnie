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
- Le corps de texte de `catalogue 4.pdf` est vectorisé, pas du texte
  sélectionnable : `get_text()` renvoie du vide sur la plupart des pages. Il
  faut rendre la page en image pour la lire.
