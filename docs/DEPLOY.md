# Mise en ligne — quoi utiliser, combien ça coûte, comment faire

## Recommandation : Cloudflare Pages, gratuit

Le site est **statique** (`output: "static"` dans `astro.config.mjs`) : ce sont
des fichiers HTML, CSS et images. Il n'a besoin d'aucun serveur, aucune base de
données, aucun langage exécuté côté serveur. Le formulaire de devis part chez
Formspree, l'hébergeur ne fait que servir des fichiers.

Un site statique tient largement dans les offres gratuites. Le vrai sujet n'est
donc pas le prix, mais **les conditions d'utilisation** et **à qui appartient le
compte**.

| Contrainte du plan gratuit | Limite | Ce site |
|---|---|---|
| Fichiers par site | 20 000 | 384 |
| Taille max d'un fichier | 25 Mio | 0,2 Mo |
| Déploiements par mois | 500 | 5 à 20 |
| Bande passante | illimitée | — |
| Domaines personnalisés | 100 | 1 |
| Certificat SSL | inclus | — |

On est à moins de 2 % de chaque limite. Aucune raison de payer.

## Pourquoi pas Vercel

Vercel est techniquement excellent et propose un déploiement en un clic, mais
son plan gratuit (« Hobby ») **interdit l'usage commercial** : la documentation
indique que le plan « restricts users to non-commercial, personal use only ».
Le site d'un distributeur d'équipements est un usage commercial.

Y déployer serait une violation des conditions, avec un risque de suspension du
projet — c'est-à-dire le site du client hors ligne sans préavis. Se mettre en
règle demande le plan Pro, à **20 $ par utilisateur et par mois**, soit environ
**240 $ par an** pour ce que Cloudflare fait gratuitement.

Netlify convient également, mais son offre gratuite fonctionne désormais par
crédits, la bande passante étant décomptée. Le coût devient prévisible
seulement tant que le trafic reste faible. « Bande passante illimitée » est plus
simple à tenir dans la durée.

## Le coût réel, honnêtement

| Poste | Coût annuel | État |
|---|---|---|
| Hébergement Cloudflare Pages | **0** | à créer |
| Certificat SSL | **0** | inclus |
| DNS | **0** | inclus |
| Formulaire Formspree | **0** jusqu'à 50 envois/mois | à créer |
| Statistiques de visite | **0** (Cloudflare Web Analytics, sans cookie) | optionnel |
| Nom de domaine `gnie-laser.com` | à vérifier | **déjà payé an 1** |
| Boîte mail professionnelle | à vérifier | **déjà souscrite** |

**L'hébergement coûte zéro.** Les deux seules dépenses récurrentes — le domaine
et la boîte mail — sont déjà engagées chez GoDaddy et ne dépendent pas de ce
choix.

Deux points à vérifier dans le compte GoDaddy :

- **Le prix de renouvellement du domaine.** Chez GoDaddy, il est habituellement
  bien supérieur au tarif de première année. Regardez le montant exact avant la
  date d'échéance ; un transfert vers un autre registrar est possible si l'écart
  est important.
- **Le renouvellement automatique**, à activer. Un domaine expiré coupe le site
  et la messagerie d'un coup, et sa récupération est payante.

Avantage pratique non négligeable : **Cloudflare ne demande aucune carte
bancaire** pour le plan gratuit. Vu les difficultés rencontrées pour payer le
domaine, c'est une friction en moins.

## À qui appartient le compte — à régler avant de déployer

C'est le point le plus important de ce document, et il n'est pas technique.

Si le compte Cloudflare est créé au nom d'Aziz, le site du client dépend
définitivement d'un compte personnel qui ne lui appartient pas. En cas de
désaccord, de changement de prestataire ou simplement d'une adresse e-mail
abandonnée, le client ne peut plus rien faire de son propre site.

**Créez le compte avec une adresse du client**, puis ajoutez-vous comme
membre : Cloudflare offre les sièges collaborateurs sans supplément sur le plan
gratuit. Le client possède son infrastructure, vous gardez l'accès technique, et
la fin de mission ne casse rien.

Le même raisonnement s'applique au domaine, actuellement dans une situation
confuse — acheté avec la carte du client, sous un compte ouvert au nom
d'« Aziz Nasra » par erreur. À remettre au propre avant la livraison finale.

## Étape 1 — Déployer la page d'attente

1. Créer un compte sur [dash.cloudflare.com](https://dash.cloudflare.com) avec
   une adresse du client.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, autoriser
   GitHub et choisir le dépôt `ZizouX0/gnie`.
3. Renseigner la configuration de build :

   | Champ | Valeur |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build:soon` |
   | Build output directory | `dist-soon` |
   | Branch | la branche à publier |

4. **Save and Deploy**. Le site sort sur `xxx.pages.dev` en une minute environ.

La page d'attente s'affiche. Le vrai site n'est pas construit : il n'existe nulle
part sur le serveur (voir `docs/COMING-SOON.md`).

## Étape 2 — Brancher le domaine

Le domaine est chez GoDaddy. Pour un domaine racine (`gnie-laser.com` sans
`www`), Cloudflare doit gérer le DNS : les enregistrements `CNAME` ne sont pas
autorisés à la racine d'un domaine, et Cloudflare contourne cette limite avec
son propre mécanisme.

1. Dans Cloudflare : **Add a site** → `gnie-laser.com` → plan **Free**.
2. Cloudflare scanne le DNS existant et propose de l'importer.
   **Vérifiez ligne par ligne que les enregistrements `MX` sont bien repris.**
   Ce sont eux qui acheminent la messagerie professionnelle : s'ils manquent, la
   boîte mail cesse de recevoir, sans message d'erreur.
   Notez-les depuis GoDaddy avant de commencer, pour pouvoir comparer.
3. Cloudflare affiche deux serveurs de noms. Les saisir chez GoDaddy :
   **Mes produits** → domaine → **DNS** → **Serveurs de noms** → **Modifier**.
4. La propagation prend de quelques minutes à 24 h.
5. Dans le projet Pages : **Custom domains** → ajouter `gnie-laser.com` puis
   `www.gnie-laser.com`. Le certificat SSL est émis automatiquement.

Après propagation, **envoyez-vous un e-mail de test sur l'adresse
professionnelle** pour confirmer que la messagerie fonctionne toujours.

## Étape 3 — Ouvrir le vrai site

Quand les mentions légales sont complètes et l'adresse e-mail professionnelle
renseignée (voir `docs/client/GNIE-Ce-Qui-Manque.pdf`) :

1. Créer le formulaire sur [formspree.io](https://formspree.io) et relever son
   identifiant.
2. Dans Cloudflare Pages → **Settings** → **Variables and Secrets**, ajouter :

   | Variable | Valeur |
   |---|---|
   | `PUBLIC_FORMSPREE_ID` | l'identifiant Formspree |
   | `PUBLIC_WHATSAPP_NUMBER` | le numéro WhatsApp Business, format international |
   | `PUBLIC_SITE_URL` | `https://gnie-laser.com` |

3. Dans **Settings** → **Build**, remplacer :

   | Champ | Avant | Après |
   |---|---|---|
   | Build command | `npm run build:soon` | `npm run build` |
   | Build output directory | `dist-soon` | `dist` |

4. **Retry deployment**.

Deux champs à changer, et le catalogue complet remplace la page d'attente aux
mêmes URL. Le sitemap passe de 2 à 36 adresses ; les moteurs recrawlent seuls.

## Après la mise en ligne

- Déclarer le site dans [Google Search Console](https://search.google.com/search-console)
  et y soumettre `https://gnie-laser.com/sitemap-index.xml`.
- Activer **Cloudflare Web Analytics** si le client souhaite des statistiques :
  gratuit, sans cookie, ce qui reste cohérent avec la politique de
  confidentialité rédigée pour ce site. Si le client n'en veut pas, la section
  correspondante est simplement retirée.
- Chaque `git push` redéploie automatiquement. Rien à refaire à la main.

## Sources

- [Vercel — Hobby Plan](https://vercel.com/docs/plans/hobby)
- [Cloudflare Pages — Limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare — Free Plan](https://www.cloudflare.com/plans/free/)
- [Formspree — Account limits](https://help.formspree.io/articles/account-management/account-limits)
