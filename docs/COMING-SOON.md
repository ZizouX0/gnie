# Page d'attente — déployer avant l'ouverture du site

Le site est terminé mais ne peut pas être publié : les mentions légales et la
politique de confidentialité portent encore 32 emplacements vides, et aucune
boîte mail professionnelle ne reçoit le formulaire de contact. Publier en
l'état mettrait en ligne des mentions légales fausses au nom de l'entreprise.

La page d'attente occupe le domaine en attendant, aux **mêmes URL** que le site
final (`/` et `/en/`). Le jour de l'ouverture, c'est une reconstruction, pas une
migration : aucune redirection à poser, aucun lien à défaire.

## Les deux builds

| Commande | Sortie | Contenu |
|---|---|---|
| `npm run build:soon` | `dist-soon/` | La page d'attente, FR et EN. ~376 Ko |
| `npm run build` | `dist/` | Le site complet, 38 pages. ~13 Mo |

**Déployez `dist-soon/` maintenant, `dist/` le jour de l'ouverture.**

Les deux répertoires sont distincts exprès. S'ils partageaient `dist/`, le
contenu déployé dépendrait de la dernière commande lancée — et se tromper
publie les mentions légales incomplètes.

## Pourquoi ce n'est pas « le site caché »

`COMING_SOON=1` change les répertoires que lit Astro : `src-holding/` au lieu
de `src/`, `public-holding/` au lieu de `public/`. Les vraies pages ne sont
donc **jamais compilées**.

C'est la différence entre cacher et ne pas construire. Une page construite puis
masquée reste sur le serveur : elle se trouve en devinant l'URL, en lisant le
sitemap, ou dans le cache d'un moteur. Ici, il n'y a rien à trouver — et les
2,3 Mo de cartes de partage sous `public/og/`, qui nomment et montrent chaque
machine, ne sont pas déployés non plus.

`npm run build:soon` lance automatiquement `scripts/check-holding.mjs`, qui
vérifie le résultat plutôt que de faire confiance au mécanisme : exactement
deux pages, aucun chemin du vrai site, aucun nom de machine, aucun
`TODO:NEEDS_INPUT`. Le build échoue si l'une de ces conditions tombe.

## Ce que la page contient — et ce qu'elle ne contient pas

Elle porte : le logo, ce que fait GNIE, ce que le catalogue proposera (13
machines, 8 familles, 3 marques), les deux numéros de téléphone réels en liens
`tel:`, l'adresse des bureaux, et le balisage `Organization` / `LocalBusiness`
pour que « GNIE Tunis » remonte déjà en recherche.

Elle ne porte **aucun formulaire**, et c'est délibéré. Collecter une adresse
e-mail déclencherait l'obligation de politique de confidentialité que cette
page existe précisément pour attendre. Les deux numéros sont vérifiés et
suffisent.

Elle ne porte **aucune date d'ouverture**. « Prochainement » vaut mieux qu'une
date manquée, et la date dépend d'informations que seul le client détient.

Elle est **indexable**. Le domaine commence à exister pour une recherche sur la
marque, et comme l'URL ne changera pas, ce qu'elle gagne reste acquis au site
final.

## Le jour de l'ouverture

1. Remplir les 32 mentions légales et l'adresse e-mail professionnelle
   (`src/config/site.ts`) — voir `docs/client/GNIE-Ce-Qui-Manque.pdf`.
2. Renseigner `PUBLIC_FORMSPREE_ID` et `PUBLIC_WHATSAPP_NUMBER`.
3. `npm run build`
4. Déployer `dist/` à la place de `dist-soon/`.

Le sitemap passe de 2 à 36 URL et les moteurs recrawlent d'eux-mêmes.

## Quand la retirer

Une page d'attente qui reste en ligne des mois dessert l'entreprise plus qu'une
absence de site : elle signale un projet à l'arrêt. Celle-ci doit vivre
quelques semaines, le temps que le client fournisse la liste de
`GNIE-Ce-Qui-Manque.pdf`. Passé ce délai, mieux vaut ouvrir le site avec des
mentions légales complètes qu'attendre les photographies des 17 machines en
brouillon, qui peuvent arriver après.

## Modifier la page

Tout le texte est dans `src-holding/pages/index.astro` (FR) et
`src-holding/pages/en/index.astro` (EN) — les composants ne contiennent aucune
phrase. La mise en page et les styles sont dans
`src-holding/layouts/Holding.astro`.

Aperçu local : `npm run dev:soon`.
