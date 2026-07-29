# Phase 0 — Rapport d'audit PDF & extraction de contenu

**GNIE Aesthetics v2 · Livré pour revue client · Juillet 2026**

Périmètre validé en cours de phase : le client a confirmé que **les 12 PDF représentent l'intégralité du catalogue** → le site passe de 7 à **12 machines** (≈ 34 pages générées au lieu de 24).

---

## 1. Table de correspondance définitive PDF → machine

| PDF source | Machine (slug) | Marque | Catégorie | Statut |
|---|---|---|---|---|
| `brochure 3 -compressed.pdf` | Ultra PicoIris (`ultra-picoiris`) | PZLASER | laser | ✅ extrait (source FR) |
| `66#360° Cryolipolysis 7D catalog` | Cryolipolysis 7D 360° (`cryolipolyse-7d-360`) | PZLASER | cryolipolyse | ✅ extrait · **featured** |
| `66#V-Shape Platinum` | V-Shape Platinum (`v-shape-platinum`) | PZLASER | remodelage | ✅ extrait · **featured** |
| `78# Hydrafacial` | Hydrafacial 10-en-1 (`hydrafacial-10-en-1`) | PZLASER *(voir §3.2)* | visage | ✅ extrait |
| `3in1airpressomachine` | 3-en-1 Air Presso (`presso-3-en-1`) | — | pressotherapie | ✅ extrait (manuel utilisateur) |
| `EMS16 Manual` | EMS 16 (`ems-16`) *(fabricant : « NEO », voir §3.1)* | — | remodelage | ✅ extrait (manuel utilisateur) |
| `VISBODY-M30` | VISBODY M30 (`visbody-m30`) | VISBODY | analyse | ✅ extrait · **featured** |
| `catalogue gnie 2` | Laser CO2 Fractionné (`laser-co2-fractionne`) | — (OEM) | laser | ✅ extrait |
| `catalogue 3 fini` | EosICE Pro Max — épilation diode 4 longueurs d'onde (`laser-diode-epilation`) | PZLASER | epilation | ✅ extrait (texte illisible → lecture visuelle des pages) |
| `catalogue 5` | Électrolyse 5-en-1 (`electrolyse-5-en-1`) | — | epilation | ✅ extrait (brochure image, 2 pages — données minces) |
| `catalogue 7` | Skin Analyzer Q2 (`skin-analyzer-q2`) | — | analyse | ✅ extrait |
| `HOWBODY-1` | HOWBODY H6 (`howbody-h6`) | HOWBODY | analyse | ✅ extrait (brochure image ; **brochure co-brandée HBEC**, voir §3.3) |

Aucun doublon parmi les 12 PDF ; chaque fichier documente une machine distincte.

**Conséquences sur le CDC :** la 7ᵉ catégorie `epilation` (« Épilation Définitive ») s'ajoute à l'enum du schéma ; catégories finales : laser ×2, cryolipolyse ×1, remodelage ×2, visage ×1, pressotherapie ×1, analyse ×3, epilation ×2. Les machines `featured` (page d'accueil) restent au nombre de 3 : Cryolipolyse 7D, V-Shape Platinum, VISBODY M30.

## 2. Livrables produits

- **24 fichiers de contenu** (`src/content/machines/{fr,en}/{slug}.md`) — validés à 0 erreur contre le schéma du CDC §4 (bénéfices 3–6, technologie 1–4, `related` ×2 valides, `order` 1–12 uniques, exactement 3 `featured`, SEO ≤ 60/155 caractères, parité FR/EN structurelle, tous les chemins d'images résolus).
- **Assets** (`src/assets/machines/{slug}/`) : 12 heros + 31 images de galerie, triés visuellement (rejets supprimés). Trois heros ont été recadrés/composités depuis les pages PDF quand les images embarquées étaient inutilisables (cryolipolyse, skin-analyzer-q2, howbody-h6 — celui-ci nettoyé du logo HBEC).
- **Logo** : extrait vectoriel rendu en 300 dpi depuis `catalogue 5` → `src/assets/brand/gnie-logo-gold.png` (831×1148, fond transparent) — **fallback** en attendant le fichier original `Logo_gnie_png1.png`.
- PDF sources archivés dans `source-pdfs/` (hors site final).

Conformité éditoriale appliquée partout : aucune invention de données, aucun prix, aucune allégation médicale (vocabulaire pathologique supprimé ou reformulé en résultat esthétique ; chiffres fabricant conservés uniquement s'ils sont imprimés, toujours attribués « selon le fabricant » ; « patients » → « client(e)s » ; témoignages nominatifs exclus).

## 3. Questions client (à trancher avant/pendant la Phase 2)

1. **Nom EMS 16 :** le manuel fabricant appelle la machine « NEO » (la marque BEAUTICIAN apparaît sur le support de poignées en photo). Nom affiché actuellement : « EMS 16 ». Confirmer le nom commercial voulu.
2. **Marque Hydrafacial :** le CDC annonce BEAUTICIAN/NEO, mais le PDF montre PZLASER sur la machine (et « Hydra Star » dans les témoignages). Actuellement : PZLASER. Confirmer.
3. **HOWBODY H6 :** la brochure est co-brandée **HBEC (hbec.tn), un autre distributeur tunisien**. Tout le branding HBEC a été exclu du contenu et des images. **Confirmer que GNIE distribue bien cette machine.**
4. **Électrolyse 5-en-1 :** nom commercial/modèle exact inconnu (la brochure ne dit que « 5 IN 1 Permanent »).
5. **Logo original** `Logo_gnie_png1.png` à fournir (fallback extrait en attendant).
6. **Marques strip page d'accueil :** le CDC cite PZLASER · BEAUTICIAN/NEO · VISBODY — faut-il ajouter HOWBODY ?

## 4. Gap report — `TODO:NEEDS_INPUT` (17 par langue)

| Machine | Donnée manquante | Cause |
|---|---|---|
| v-shape-platinum | Puissance · Alimentation · Dimensions · Poids | aucun tableau specs dans le PDF |
| laser-diode-epilation | Puissance · Fluence · Fréquence · Taille de spot · Dimensions/poids | brochure sans tableau specs |
| presso-3-en-1 | Pression max · Dimensions · Poids | absents du manuel |
| electrolyse-5-en-1 | Alimentation · Dimensions · Poids | brochure 2 pages sans specs |
| skin-analyzer-q2 | Alimentation · Dimensions/poids | pas de tableau specs formel |

**Photos produit à fournir par le client (héros de qualité insuffisante) :** V-Shape Platinum (artefacts de fond), Électrolyse 5-en-1 (750 px avec texte incrusté). Souhaitables aussi : Ultra PicoIris et Hydrafacial (texte/fond chargé), Skin Analyzer Q2 (569×754 px).

Complets sans aucun TODO : cryolipolyse-7d-360, ems-16, hydrafacial-10-en-1, laser-co2-fractionne, ultra-picoiris, visbody-m30, howbody-h6.

## 5. Reste à valider (rappels CDC hors extraction)

- Engagements de service exacts pour les blocs CTA (installation, formation, SAV) — `TODO:NEEDS_INPUT` CDC §6.1.
- Coordonnées de contact définitives (le `catalogue 5` imprime : Imm Emmeraude de Tunis, Rue Mohamed Badra, Bureau A-2-8 Montplaisir, Tunis 1073 · 55 157 506 / 90 157 560 · www.gnie.com · grtarek@yahoo.fr — à confirmer pour la page Contact).
- Identifiants d'intégration au déploiement : `PUBLIC_FORMSPREE_ID`, `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_BREVO_FORM_URL`, `PUBLIC_SITE_URL`.

---

**⛔ Fin de Phase 0 — en attente de revue.** Prochaine étape sur validation : **Phase 1** (scaffold Astro 5 + design system « instrument de précision », i18n FR/EN, tokens or-sur-noir, page styleguide).
