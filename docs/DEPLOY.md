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

## Recommandation : Cloudflare Workers (static assets), gratuit

Le site est **statique** (`output: "static"` dans `astro.config.mjs`) : ce sont
des fichiers HTML, CSS et images. Il n'a besoin d'aucun serveur, aucune base de
données, aucun langage exécuté côté serveur. Le formulaire de devis part chez
Formspree, l'hébergeur ne fait que servir des fichiers.

> **Pourquoi Workers et non Pages.** Ce document recommandait initialement
> Cloudflare Pages. Cloudflare a depuis fermé Pages aux nouveaux projets et
> redirige la création vers Workers : l'entrée « Pages » du tableau de bord
> renvoie désormais sur Workers. Le produit qui sert les fichiers s'appelle
> **Workers static assets**. C'est la même infrastructure, le même réseau, le
> même prix — seul le nom du bouton a changé.

Un site statique tient largement dans les offres gratuites. Le vrai sujet n'est
donc pas le prix, mais **les conditions d'utilisation** et **à qui appartient le
compte**.

| Contrainte du plan gratuit | Limite | Ce site |
|---|---|---|
| Fichiers par version | 20 000 | 384 |
| Taille max d'un fichier | 25 Mio | 0,2 Mo |
| Requêtes vers les fichiers statiques | **gratuites et illimitées** | — |
| Bande passante | illimitée | — |
| Domaines personnalisés | plusieurs | 2 (`gnie-laser.com`, `www`) |
| Certificat SSL | inclus | — |

On est à moins de 2 % de chaque limite. Aucune raison de payer.

Un mot sur le quota que l'on voit souvent cité, « 100 000 requêtes par jour » :
il compte les **exécutions de code**. Notre `wrangler.jsonc` ne déclare aucun
point d'entrée (`main`), donc aucune ligne de code ne s'exécute : chaque visite
est servie directement depuis le cache. Ce quota ne s'applique pas ici.

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
| Hébergement Cloudflare Workers | **0** | en ligne |
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
2. **Workers & Pages** → **Create** → **Import a repository**, autoriser GitHub
   et choisir le dépôt `ZizouX0/gnie`.
3. Renseigner la configuration de build :

   | Champ | Valeur |
   |---|---|
   | Project name | `gnie` |
   | Build command | `npm run build:soon` |
   | Deploy command | `npx wrangler deploy -c wrangler.soon.jsonc` |
   | Branch | `main` |

4. **Save and Deploy**. Le site sort sur `gnie.<sous-domaine>.workers.dev` en
   une minute environ.

Les deux fichiers `wrangler.jsonc` (site réel, `./dist`) et
`wrangler.soon.jsonc` (page d'attente, `./dist-soon`) portent **le même nom de
Worker**. C'est délibéré : passer de la page d'attente au site complet remplace
le contenu à la même adresse, sans nouvelle URL ni nouveau certificat.

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
3. **Repasser tous les enregistrements de messagerie en « DNS only »** (nuage
   gris). Cloudflare active le proxy (nuage orange) par défaut sur les `CNAME`
   qu'il importe — ici `autodiscover`, `_domainconnect`, `email`,
   `lyncdiscover`, `msoid`, `sip` et surtout **`selector1._domainkey` et
   `selector2._domainkey`**.

   Le proxy ne traite que le trafic web. Proxifier un enregistrement de
   messagerie ne renvoie aucune erreur : la signature DKIM cesse simplement
   d'être vérifiable. Combiné à un `DMARC` en `p=quarantine`, le courrier du
   client part en indésirables sans que personne ne comprenne pourquoi.
4. **Supprimer les enregistrements du site précédent** : les deux `A` de la
   racine (la page « site en construction » de GoDaddy) et le `CNAME www`. Ils
   entreraient en conflit avec ceux que Cloudflare crée à l'étape 8.

   Il ne doit rester que la messagerie — ici 14 lignes : 8 `CNAME`, 1 `MX`,
   2 `SRV`, 3 `TXT`, **toutes en gris**. Cloudflare affiche alors un
   avertissement « votre domaine n'est pas entièrement protégé » : c'est normal,
   aucun enregistrement web n'existe encore.
5. **Vérifier que DNSSEC est désactivé chez GoDaddy** — onglet **DNS** →
   **DNSSEC**. S'il propose « Activer DNSSEC », c'est qu'il est éteint : ne
   touchez à rien.

   C'est le seul réglage capable de rendre le domaine totalement injoignable.
   DNSSEC signe les réponses de GoDaddy ; si la signature reste publiée au
   registre `.com` alors que Cloudflare répond à la place, les résolveurs
   constatent une signature invalide et refusent de résoudre le domaine — site
   **et** messagerie. L'effet ressemble à un domaine supprimé.
6. Cloudflare affiche deux serveurs de noms. Les saisir chez GoDaddy :
   **Mes produits** → domaine → **DNS** → **Serveurs de noms** → **Modifier**
   → « J'utiliserai mes propres serveurs de noms ».
7. La propagation prend de quelques minutes à 24 h. Cliquer **Check nameservers
   now** pour forcer la vérification.
8. Dans le Worker : **Workers & Pages** → `gnie` → **Domains** → **Add Domain**.
   - Pour la racine : saisir `gnie-laser.com`.
   - Pour `www` : la boîte de dialogue **n'accepte pas** un sous-domaine saisi
     en entier. Elle refuse `www.gnie-laser.com` (« No zones match ») et, selon
     le chemin emprunté, crée `www.gnie-laser.com.gnie-laser.com`. Il faut
     atteindre l'écran **« Connect to gnie-laser.com »**, dont le champ
     *Subdomain* affiche `.gnie-laser.com` en suffixe, et n'y taper que **`www`**.

   Cloudflare crée lui-même l'enregistrement DNS et le certificat.
9. **SSL/TLS** → **Edge Certificates** → activer **Always Use HTTPS**. Sans ce
   réglage, le site répond aussi en `http://` non chiffré : l'en-tête HSTS ne
   protège que les visiteurs déjà venus une fois.
10. **Test de la messagerie, obligatoire.** Depuis une adresse extérieure
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
2. Dans le Worker → **Settings** → **Variables and Secrets**, vérifier :

   | Variable | Valeur |
   |---|---|
   | `PUBLIC_FORMSPREE_ID` | l'identifiant Formspree |
   | `PUBLIC_WHATSAPP_NUMBER` | le numéro WhatsApp Business, format international |
   | `PUBLIC_SITE_URL` | `https://gnie-laser.com` |

3. Dans **Settings** → **Build**, remplacer :

   | Champ | Avant | Après |
   |---|---|---|
   | Build command | `npm run build:soon` | `npm run build` |
   | Deploy command | `npx wrangler deploy -c wrangler.soon.jsonc` | `npx wrangler deploy` |

4. **Retry deployment**.

Deux champs à changer, et le catalogue complet remplace la page d'attente aux
mêmes URL — mêmes domaines, même certificat, aucune coupure. Le sitemap passe
de 2 à 36 adresses ; les moteurs recrawlent seuls.

## Après la mise en ligne

- Déclarer le site dans [Google Search Console](https://search.google.com/search-console)
  et y soumettre `https://gnie-laser.com/sitemap-index.xml`.
- Activer **Cloudflare Web Analytics** si le client souhaite des statistiques :
  gratuit, sans cookie, ce qui reste cohérent avec la politique de
  confidentialité rédigée pour ce site. Si le client n'en veut pas, la section
  correspondante est simplement retirée.
- Chaque `git push` redéploie automatiquement. Rien à refaire à la main.

## État constaté après la migration

Relevé le 13 août 2026, une fois les étapes 1 et 2 terminées.

| Élément | État |
|---|---|
| Serveurs de noms au registre `.com` | `bristol.ns.cloudflare.com`, `felipe.ns.cloudflare.com` |
| DNSSEC / enregistrement `DS` | absent — le domaine n'est pas signé |
| `MX` → Microsoft 365 | résout |
| `SPF` | `v=spf1 include:secureserver.net -all` — correct, voir ci-dessous |
| `DKIM` `selector1` / `selector2` | résolvent, non proxifiés |
| `DMARC` | `p=quarantine` |
| `https://gnie-laser.com/` et `/en/` | 200, certificat valide |
| `https://www.gnie-laser.com/` et `/en/` | 200, certificat valide |
| En-têtes de sécurité | HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` |
| Routes du site réel (`/machines/`, `/contact/`, `/mentions-legales/`) | 404 — la page d'attente n'expose rien |
| `sitemap-0.xml` | 2 adresses |
| Redirection `http://` → `https://` | 301, chemin conservé, sur les deux hôtes |
| Test de messagerie aller-retour | **réussi** — voir ci-dessous |

**Le test de messagerie a été fait dans les deux sens** le soir de la migration :
un message envoyé depuis Gmail vers `contact@gnie-laser.com` est arrivé, et la
réponse envoyée depuis cette adresse est arrivée **dans la boîte de réception**
de Gmail, pas dans les indésirables.

Ce dernier point vaut preuve d'authentification : la politique `DMARC` du
domaine est `p=quarantine`. Si `SPF` et `DKIM` avaient tous deux échoué après le
changement de serveurs de noms, Gmail aurait classé la réponse en indésirables.
L'arrivée en boîte de réception démontre que l'alignement fonctionne toujours.

**Sur le `SPF`.** L'enregistrement pointe vers `secureserver.net` (GoDaddy)
alors que la boîte est hébergée par Microsoft 365, ce qui donne l'impression
d'une erreur. Ce n'en est pas une : GoDaddy revend Microsoft 365 et
`secureserver.net` inclut `spf-0.secureserver.net`, qui inclut lui-même
`spf.protection.outlook.com`. Trois résolutions en tout, très en dessous de la
limite de dix. **Ne pas « corriger » cet enregistrement.**

**Sur `robots.txt`.** Cloudflare y injecte automatiquement un bloc managé
(réglage « Block AI training bots ») qui ajoute des directives `Content-Signal`
et bloque GPTBot, CCBot, ClaudeBot, Google-Extended, Bytespider et consorts. Nos
propres règles et la ligne `Sitemap:` subsistent en dessous, et les robots
d'indexation classiques (Googlebot, Bingbot) ne sont pas concernés. Le fichier
contient donc du contenu que personne n'a écrit dans ce dépôt : c'est attendu.

## Sources

- [Vercel — Hobby Plan](https://vercel.com/docs/plans/hobby) (usage commercial interdit)
- [Netlify — How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) (mise hors ligne au dépassement)
- [Cloudflare Workers — Static assets, facturation et limites](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) (« Requests to static assets are free and unlimited »)
- [Cloudflare Workers — Platform limits](https://developers.cloudflare.com/workers/platform/limits/) (20 000 fichiers, 25 Mio par fichier)
- [Cloudflare Workers — Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare — Désactiver DNSSEC avant un changement de serveurs de noms](https://developers.cloudflare.com/dns/dnssec/)
- [Cloudflare — Free Plan](https://www.cloudflare.com/plans/free/)
- [Formspree — Account limits](https://help.formspree.io/articles/account-management/account-limits)
