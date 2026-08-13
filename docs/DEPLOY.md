# Mise en ligne — quoi utiliser, combien ça coûte, comment faire

## Le domaine est déjà acheté — ce n'est pas l'hébergement

`gnie-laser.com` a été acheté chez GoDaddy. **Il n'y a rien à racheter.**

Ce sont deux choses différentes, et c'est la confusion la plus courante :

- **Le domaine**, c'est l'adresse. GoDaddy vous l'a vendue. Elle vous appartient.
- **L'hébergement**, c'est le bâtiment à cette adresse. Il faut une machine qui
  stocke les fichiers du site et les envoie aux visiteurs. GoDaddy ne l'a pas
  inclus.

Ce document ne concerne que la seconde partie. Le domaine ne bouge pas de chez
GoDaddy : on lui indique simplement où pointer.

**N'achetez pas l'hébergement GoDaddy.** Il vous sera proposé, il est payant
(abonnement mensuel), et il est conçu pour des sites PHP type WordPress. Pour un
site statique comme celui-ci, il coûte de l'argent pour un résultat moins bon et
moins rapide que les options gratuites ci-dessous.

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

## Pourquoi pas Netlify

Netlify a un avantage réel dans notre cas : il accepte un domaine racine avec
un DNS resté chez GoDaddy — deux enregistrements à ajouter (`A` vers
`75.2.60.5`, `CNAME www`), et les enregistrements `MX` de la messagerie ne sont
jamais touchés. C'est tentant.

Mais son offre gratuite fonctionne désormais par crédits, la bande passante
étant décomptée, et **le dépassement met le site hors ligne** : les visiteurs
voient une page « Site not available » jusqu'au cycle de facturation suivant.
Le plan gratuit ne permet pas d'acheter des crédits supplémentaires — il faut
passer à un plan payant pour rétablir le service.

Pour le site vitrine d'une entreprise, c'est inacceptable : un pic de trafic, un
robot d'indexation un peu vif, et la vitrine du client disparaît sans que
personne s'en aperçoive. Chez Cloudflare, la bande passante est illimitée : ce
scénario n'existe pas.

Le déplacement des serveurs de noms est une opération unique, vérifiable en
cinq minutes. Un site qui peut s'éteindre tout seul est un risque permanent.

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

Le domaine reste chez GoDaddy — il n'est ni vendu, ni transféré. Seuls ses
**serveurs de noms** changent : c'est le panneau qui indique où trouver le site.

Cette étape est obligatoire, pas un choix de confort. Un enregistrement `CNAME`
est interdit à la racine d'un domaine, et GoDaddy ne propose pas le mécanisme
qui permet de contourner cette règle. Cloudflare exige donc de gérer le DNS pour
servir `gnie-laser.com` sans `www`.

C'est la seule étape qui touche à la messagerie. Elle se sécurise en trois
minutes, à condition de faire le relevé **avant**.

0. **Avant tout : photographier le DNS actuel.** Chez GoDaddy, **Mes produits**
   → domaine → **DNS**. Faites une capture d'écran de la liste complète, ou
   recopiez-la. Les lignes qui comptent sont les `MX`, plus tout `TXT`
   commençant par `v=spf1` et toute ligne nommée `autodiscover`, `selector1`
   ou `selector2` : ce sont elles qui font fonctionner la messagerie
   professionnelle.
1. Dans Cloudflare : **Add a site** → `gnie-laser.com` → plan **Free**.
2. Cloudflare scanne le DNS existant et propose de l'importer.
   **Comparez la liste importée à votre capture, ligne par ligne.** Le scan est
   fiable mais pas garanti ; ce qui manque, ajoutez-le à la main avant de
   continuer. Un `MX` absent ne produit aucune erreur : les e-mails cessent
   simplement d'arriver, et personne ne s'en aperçoit avant plusieurs jours.
3. Cloudflare affiche deux serveurs de noms. Les saisir chez GoDaddy :
   **Mes produits** → domaine → **DNS** → **Serveurs de noms** → **Modifier**.
4. La propagation prend de quelques minutes à 24 h.
5. Dans le projet Pages : **Custom domains** → ajouter `gnie-laser.com` puis
   `www.gnie-laser.com`. Le certificat SSL est émis automatiquement.
6. **Test de la messagerie, obligatoire.** Depuis une adresse extérieure
   (Gmail par exemple), envoyez un message à l'adresse professionnelle et
   vérifiez qu'il arrive. Puis répondez depuis cette adresse et vérifiez que
   la réponse part. Ne considérez l'étape terminée qu'après ces deux tests.

En cas de problème, le retour en arrière est immédiat : remettre les serveurs de
noms d'origine chez GoDaddy rétablit la configuration précédente.

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

- [Vercel — Hobby Plan](https://vercel.com/docs/plans/hobby) (usage commercial interdit)
- [Netlify — How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) (mise hors ligne au dépassement)
- [Cloudflare Pages — Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) (serveurs de noms requis pour un domaine racine)
- [Cloudflare Pages — Limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare — Free Plan](https://www.cloudflare.com/plans/free/)
- [Formspree — Account limits](https://help.formspree.io/articles/account-management/account-limits)
