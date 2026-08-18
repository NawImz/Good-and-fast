# Playbook — sites vitrine pour commerces locaux

Document à donner en début de conversation à un agent qui doit construire un
site vitrine pour un commerce, quel que soit son métier.

Il est tiré d'un projet réel (garage automobile en Seine-Saint-Denis) mené de
bout en bout. **Les erreurs y sont documentées autant que les réussites** :
c'est la partie qui fait gagner du temps.

> **Avertissement central.** Ce playbook décrit une *méthode*, jamais un
> gabarit. Le site dont il est issu est sombre-devenu-clair, cramoisi, à
> typographie carrée, parce que c'est ce que disait la devanture de **ce**
> garage. Reproduire ces choix ailleurs serait exactement l'erreur que la
> section 4 cherche à empêcher.

---

## 1. Installation — commandes vérifiées

Beaucoup de tutoriels circulent avec une syntaxe fausse. Celles-ci ont été
testées.

### MCP

```bash
# ❌ FAUX (syntaxe qui n'existe pas, on la voit partout)
claude mcp add playwright --command="npx" --args="-y,@playwright/mcp"

# ✅ Syntaxe réelle
claude mcp add <nom> -s project -- <commande> <args...>
claude mcp add <nom> -s project -t http <url>
```

| Serveur | Commande | Note |
|---|---|---|
| Playwright | `claude mcp add playwright -s project -- npx -y @playwright/mcp --browser chromium` | `--browser chromium` obligatoire : par défaut il cherche Chrome stable et échoue là où seul un Chromium Playwright est installé |
| Chrome DevTools | `claude mcp add chrome-devtools -s project -- npx -y chrome-devtools-mcp --headless --isolated` | sans `--isolated` il tente de s'accrocher au profil Chrome de l'utilisateur |
| GitHub | `claude mcp add github -s project -t http https://api.githubcopilot.com/mcp/` | **`@modelcontextprotocol/server-github` est déprécié** (npm le signale). Utiliser le serveur officiel GitHub |
| Figma | `claude mcp add figma -s project -t http https://mcp.figma.com/mcp` | lecture de maquettes |
| Vercel | `claude mcp add vercel -s project -t http https://mcp.vercel.com` | |
| Netlify | `claude mcp add netlify -s project -t http https://mcp.netlify.com/mcp` | |

**Toujours `-s project`.** Écrit un `.mcp.json` versionné dans le dépôt, donc
la config suit le projet au lieu de vivre dans une config locale jetable.

**Les serveurs HTTP demandent une authentification OAuth au premier lancement.**
Impossible dans une session non interactive : il faut le dire à l'utilisateur
plutôt que de laisser l'agent tourner en rond.

**La config MCP est lue au démarrage.** Une modification ne prend effet qu'à la
session suivante — le dire au lieu de la tester en vain.

### Marketplace de plugins

```bash
# ❌ échoue
claude plugin marketplace add anthropic
# ✅
claude plugin marketplace add anthropics/claude-code
```

Le marketplace officiel ne contient (à ce jour) **aucun plugin de déploiement,
de design ou de données business**. Ses ~13 plugins sont orientés développement
(`code-review`, `feature-dev`, `frontend-design`, `plugin-dev`, `hookify`…).
Ne pas promettre à l'utilisateur ce qui n'existe pas : vérifier le manifeste.

### Ce qui n'existe pas et qu'il ne faut pas chercher

- **Pas de MCP Google Places/Maps fiable.** `@modelcontextprotocol/server-google-maps`
  est déprécié. Pour horaires/avis/photos : appel direct à l'API Places (New)
  avec une clé, ou saisie manuelle.
- Les **géocodeurs sont souvent bloqués** en sandbox (api-adresse.data.gouv.fr,
  Nominatim, Photon). Prévoir de **demander les coordonnées à l'utilisateur** :
  Google Maps → clic droit / appui long sur le point → les deux nombres se
  copient. Attention, ils arrivent souvent avec des **virgules décimales**
  françaises à convertir en points.

---

## 2. Skills utiles

| Skill | Quand |
|---|---|
| `artifact-design` | **obligatoire** avant d'écrire un artifact, y compris Markdown |
| `artifact-diagramming` | schémas dans un artifact |
| `dataviz` | tout graphique, avant la première ligne de code de chart |
| `webdesign` / `frontend-design` (plugin) | direction artistique |
| `code-review`, `security-review` | avant livraison |

---

## 3. Règle n°1 — l'identité vient du réel

**Ne jamais inventer une charte graphique.** Un commerce existant a déjà une
identité : enseigne, devanture, véhicules, uniformes, packaging, camion.

Protocole :

1. **Demander des photos** de la devanture, de l'enseigne, de l'intérieur.
2. **Zoomer dessus** (`sharp().extract()` puis regarder l'image) pour lire les
   vraies formes et les vraies couleurs. À l'œil sur une photo entière on se
   trompe.
3. **Prélever les couleurs par calcul**, pas au jugé — mais attention : une
   enseigne à l'ombre ou sous un auvent donne des valeurs boueuses
   inutilisables telles quelles. Prendre la photo la mieux éclairée, et
   corriger vers des valeurs qui tiennent à l'écran.
4. **Vectoriser le logo** plutôt que le redessiner (voir §10, « Logo »).
5. **Reprendre un seul ornement** de la devanture comme élément structurel
   (un bandeau, une bordure, une forme). Un seul.

### Cas réel

Le brief initial demandait « anthracite + accent vif, esprit concession
premium ». Résultat : un site sombre, générique, que le client a jugé
« trop IA ». La devanture réelle était **un panneau blanc, une spirale bleu
acier, un anneau cramoisi**. Le site refait à partir de ça a été validé
immédiatement.

**Le brief du client sur le style est une hypothèse, pas une donnée.** La
devanture, elle, est une donnée.

---

## 4. Anti-gabarit — ne jamais refaire deux fois le même site

### 4.1 Ce qu'il ne faut PAS reprendre du projet d'origine

Ces choix étaient justes **pour un garage**, et n'ont aucune raison d'être
ailleurs :

- fond papier chaud + encre bleu acier + un cramoisi
- Archivo / Source Sans 3 / Oxanium
- la bande rouge sous les photos
- « atelier d'un côté, comptoir de l'autre »
- la barre d'appel fixe en bas (voir §6 : dépend du métier)
- le compteur sur la note Google
- la roue qui tourne (elle n'a de sens que parce que le logo est une roue)

### 4.2 Les tics qui font « site généré »

À éviter par défaut, sauf raison précise :

- fond quasi noir + un seul accent fluo
- crème `#F4F1EA` + serif display + terracotta
- dégradé violet→bleu sur blanc
- Inter ou Space Grotesk « par sécurité »
- **marqueurs numérotés 01 / 02 / 03** sur du contenu qui n'est pas une
  séquence — c'est le tic le plus reconnaissable
- un sur-titre coloré au-dessus de *chaque* section
- six cartes arrondies identiques en grille
- emoji comme puces de section
- tout centré, `rounded-lg` partout

### 4.3 Méthode de divergence

Pour chaque nouveau client, répondre **avant de coder** :

1. **Quelle est la matière du métier ?** (métal, pâte, tissu, papier, bois,
   peau, verre) → elle donne la texture, le grain, les contrastes.
2. **Quel est le geste ?** (réparer, cuire, couper, soigner, conseiller) →
   il donne le rythme et la densité.
3. **Quelle est l'émotion d'achat ?** (urgence, plaisir, confiance,
   discrétion, fierté) → elle donne la température et la vitesse d'animation.
4. **Qu'est-ce que le client regarde avant d'entrer ?** (la vitrine, la carte,
   les prix, les avis, la propreté) → c'est le premier écran.

### 4.4 Grilles indicatives par métier

Des points de départ à **adapter**, jamais à appliquer tels quels.

| Métier | Direction plausible | Premier écran |
|---|---|---|
| Boulangerie / pâtisserie | Chaud, matière, gros plans produits, serif à empattements doux, crème et brun cuit | La vitrine, les produits |
| Restaurant | Photo pleine page, typographie éditoriale, peu de texte | Le plat + la réservation |
| Coiffeur / barbier | Rythmé, contrasté, portraits, sans-serif large | Avant/après, prise de RDV |
| Cabinet médical / dentiste | Calme, très aéré, bleus froids ou verts pâles, zéro animation superflue | Horaires, accès, prise de RDV |
| Avocat / notaire | Sobre, sérif classique, beaucoup de blanc, aucune photo stock | Domaines d'intervention |
| Plombier / serrurier / dépannage | Urgence : numéro énorme, contraste fort, zone couverte, 24/7 | Le téléphone, immédiatement |
| Fleuriste | Couleur venue des fleurs, blanc dominant, grille type magazine | Les compositions |
| Salle de sport | Énergie, photos en mouvement, typographie condensée, sombre assumé | Les tarifs, l'essai gratuit |
| Artisan (menuisier, ébéniste) | Matière brute, photos de réalisations en grand, mise en page lente | Le portfolio |
| Garage / carrosserie | Technique, lisible, preuve sociale forte | Le téléphone + les avis |

**Deux sites du même métier doivent quand même différer** : c'est l'enseigne
réelle qui tranche, pas la catégorie.

---

## 5. UI/UX — les règles non négociables

### Contrastes : calculer, jamais estimer

```js
const L = h => { const c = [1,3,5].map(i => { let v = parseInt(h.slice(i,i+2),16)/255;
  return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
  return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; };
const ratio = (a,b) => { const x = L(a), y = L(b);
  return (Math.max(x,y)+0.05) / (Math.min(x,y)+0.05); };
```

Seuils : **4,5:1** texte courant · **3:1** texte ≥ 24 px ou ≥ 19 px gras ·
**3:1** éléments d'interface.

**Découverte utile :** sur **fond clair**, un même rouge passe AA dans les deux
sens (texte sur blanc *et* blanc sur aplat) car le rapport est symétrique.
`#C8102E` → 5,88:1 dans les deux cas. Sur **fond sombre**, c'est impossible :
il faut deux teintes de la même famille — une pour le remplissage, une pour
l'encre. Le fond clair simplifie donc réellement la palette.

**Un logo sur fond sombre doit voir ses couleurs remontées.** Le cramoisi de
marque ne donnait que 2,72:1 sur l'encre du footer. Passer par des variables
CSS (`--logo-ring`, `--wordmark`) plutôt que maintenir deux fichiers.

### Cibles tactiles

- **44 × 44 px** minimum (WCAG 2.5.5, iOS HIG).
- **Exception explicite** : un lien à l'intérieur d'une phrase. L'agrandir
  casserait le paragraphe. Un audit qui ne code pas cette exception produit du
  bruit et on finit par l'ignorer.
- Un lien d'évitement (skip link) à 24 px suffit (2.5.8 AA).

### Mobile-first, réellement

- Concevoir à **390 px** d'abord.
- La preuve sociale et le CTA doivent tenir **au-dessus de la ligne de
  flottaison**. Raccourcir le texte plutôt que descendre le bouton.
- Une barre fixe **mesurée au runtime**, jamais une hauteur en dur : elle est
  dimensionnée par son contenu et bouge avec les métriques de police. Une
  valeur figée à 5 px près laissait le bas du footer passer dessous.
  → variable CSS + `ResizeObserver`, avec un littéral CSS comme plancher sans JS.
- Prévoir `env(safe-area-inset-bottom)` (encoche iOS).

### Typographie

- Deux familles suffisent, trois si un wordmark le justifie.
- **Auto-héberger** (`@fontsource*` via npm). Zéro appel CDN, et la CSP des
  artifacts bloque les CDN de polices.
- Ne pas tout mettre en capitales : c'est un tic de génération.
- `text-wrap: balance` sur les titres, `pretty` sur les paragraphes.
- Chiffres alignés en colonne → `font-variant-numeric: tabular-nums`.

---

## 6. Conversion — ce qui fait vraiment agir

Le canal dépend du métier :

| Métier | Action première |
|---|---|
| Dépannage, garage, serrurier | **Téléphone.** Barre fixe en bas sur mobile |
| Restaurant, coiffeur, médical | **Réservation / RDV.** Lien vers l'outil existant |
| Commerce avec stock | **Itinéraire + horaires** |
| Prestation longue (artisan, avocat) | **Formulaire ou e-mail**, la décision est lente |

Règles :

- Le CTA mobile va **en bas**, à portée de pouce, et **n'est pas dupliqué**
  dans l'en-tête. En-tête pour desktop uniquement.
- Numéros toujours en `tel:+33...` (E.164), pas en format affiché.
- **Ne jamais poser un formulaire sans boîte de réception réelle.** Un site
  statique n'en a pas. Un formulaire qui dépose dans un tableau de bord que
  personne n'ouvre perd des clients qui croient avoir écrit. Sans canal
  confirmé : afficher le téléphone, honnêtement.
- Un bloc « avant d'appeler / ce qu'il faut préparer » raccourcit vraiment
  l'échange, des deux côtés.

---

## 7. Droit français — non négociable

| Sujet | Obligation |
|---|---|
| **Mentions légales** | Éditeur (raison sociale, forme juridique, SIRET, TVA, directeur de publication) **et hébergeur**. Art. 6-III LCEN n°2004-575. Manquant = infraction dès la mise en ligne |
| **Faux avis** | Publier des avis inventés, ou attribuer des propos à des personnes nommées, = pratique commerciale trompeuse (art. L121-2 Code de la consommation), sanction DGCCRF |
| **Cookies** | Un embed Google Maps dépose des cookies **au chargement** → bandeau de consentement obligatoire. **OpenStreetMap n'en dépose pas** → aucun bandeau. Sinon : clic-pour-charger (motif CNIL) |
| **RGPD** | Sans collecte, la page données personnelles est courte et vraie. Ne pas décrire une collecte qui n'existe pas |
| **Accessibilité** | RGAA pour le public ; pour le privé, WCAG AA reste la norme de fait |

**Pattern anti-faux-avis à reprendre :** un drapeau `reviewsVerified`. Tant
qu'il est `false`, un bandeau d'avertissement s'affiche **et** le balisage
`schema.org/Review` est omis. On ne déclare pas de faux témoignages à Google,
et l'oubli devient impossible.

**Si le client demande de retirer les mentions légales** (courant en phase de
test) : le faire, le signaler en une phrase, et le porter en tête de la liste
« avant mise en ligne ». C'est sa décision, pas la vôtre.

---

## 8. Performance

- Astro (ou équivalent statique). Zéro JS pour le contenu.
- Images converties en **WebP au build**, plusieurs largeurs, `loading="lazy"`
  sauf le hero (`eager` + `fetchpriority="high"`).
- Polices : sous-ensembles **latin et latin-ext** uniquement pour du français.
  Les autres pèsent lourd pour rien.
- Cible : **< 500 kB** transférés, JS compris.
- **Le site doit fonctionner sans JavaScript.** Les éléments animés au scroll
  sont visibles par défaut ; le script ne fait que les révéler.
- `prefers-reduced-motion` doit court-circuiter **tout** le module d'animation.

---

## 9. Le harnais de QA — à recréer sur chaque projet

Trois scripts Playwright, lancés contre le build servi. Ils valent bien plus
que la relecture visuelle.

**`shoot.mjs`** — captures en 390 / 820 / 1440 px, et mesure :
débordement horizontal, cibles < 44 px (hors liens en ligne), ordre des titres
(un seul `h1`, pas de saut), images sans `alt` ou sans dimensions, éléments
restés invisibles, poids transféré, erreurs console.

**`check.mjs`** — comportement : liens `tel:` en E.164, ouverture/fermeture du
menu, défilement des ancres, rien sous la barre fixe, rendu en
`reduced-motion`, rendu sans JS, JSON-LD (type, téléphone, adresse, horaires
fusionnés, avis).

**`check-motion.mjs`** — chaque animation **se termine**. Une animation qui
démarre sans finir laisse du contenu invisible : pire que pas d'animation.

**Boucle d'auto-critique** : construire → capturer → *regarder vraiment les
images* → lister les défauts → corriger en lot → recapturer. Ne pas se
contenter de « ça build ».

---

## 10. Pièges techniques rencontrés

Chacun a coûté du temps sur le projet réel.

**Astro avale le retour à la ligne avant une expression.**
`détachées à\n{ville}` rend « détachées àÉpinay ». Utiliser `{' '}`.
Ajouter un test : il a trouvé une seconde occurrence invisible à l'œil.

**Lenis prend le contrôle du défilement.** `window.scrollTo` devient inerte.
Exposer l'instance (`window.__lenis`) pour que les tests pilotent la page comme
un vrai geste.

**`lenis.scrollTo(élément, {offset})` ne vise pas où on croit** — il résout par
`offsetTop`, décalage d'environ 80 px dès qu'il y a du `scroll-margin`.
Calculer la position absolue : `rect.top + scrollY - hauteurEntête`.

**Fusion d'horaires : grouper par plage, pas par adjacence.** Avec une pause
déjeuner les plages alternent, donc comparer à l'entrée précédente ne matche
jamais et produit 11 entrées au lieu de 3.

**Une iframe bloquée est indétectable depuis le script.** Bloquée ou chargée :
même événement `load`, même `contentDocument` à `null` — l'isolation
cross-origin existe pour ça. Ne pas tenter de le détecter : **concevoir pour
que ça n'ait pas d'importance** (lien de secours *en dehors* du cadre ; une
iframe refusée peint sa propre page d'erreur opaque par-dessus tout ce qu'on
mettrait derrière).

**Le logo : vectoriser, pas redessiner.** Une reconstitution d'après photo est
fausse dans les détails. Avec le fichier propre :

```bash
npm i -D potrace     # dépendance ponctuelle : jimp sous avis de sécurité
node scripts/trace-logo.mjs logo.png > src/components/LogoMark.astro
npm uninstall potrace
```

Tracer **chaque couleur séparément** puis recomposer : d'un seul tenant, les
formes se soudent à leurs points de contact. Recadrer le `viewBox` sur le
tracé, sinon les marges de l'image sont dimensionnées avec le logo. Un logo
paysage se dimensionne **en largeur** — un utilitaire carré le rogne.

**Favicon : recadrer.** Un logo paysage dans un carré devient une tache à
16 px, la seule taille qui compte dans un onglet. Zoomer sur l'élément
distinctif. Toujours vérifier le rendu à 16 et 32 px.

**Parallaxe = recadrage.** L'image doit être agrandie de plus qu'elle ne se
déplace, sinon un bord blanc apparaît. ±4 % coûte 9 % de la photo. Sur une
photo que le client vient d'envoyer, c'est un vrai arbitrage.

**Playwright en sandbox** : la version npm et le Chromium installé peuvent
diverger. Prévoir `executablePath: process.env.CHROMIUM_PATH`.

**Vérifier ce qui est servi, pas ce qu'on croit avoir écrit.** `curl` sur la
page et `grep` : plusieurs bugs n'ont été vus que comme ça.

---

## 11. À demander au client dès le départ

**Bloquant :**
1. Photos : devanture, enseigne de près, intérieur, équipe si possible
2. Le logo en **vectoriel** (SVG, AI, EPS) — sinon un PNG propre à vectoriser
3. Mentions légales : forme juridique, SIRET, TVA, directeur de publication
4. Hébergeur retenu (raison sociale + adresse, pour les mentions)
5. Le texte **exact** de 3–5 avis, avec les noms affichés **et les étoiles**
6. Coordonnées GPS exactes (Google Maps → appui long → copier)
7. Horaires confirmés, y compris fermetures annuelles

**Important :**
8. Canal de contact réellement consulté (téléphone / WhatsApp / e-mail / RDV)
9. Nom de domaine souhaité, ancien site éventuel
10. Réseaux sociaux — sinon on n'affiche rien plutôt qu'un lien mort
11. La prestation la plus rentable, à mettre en avant
12. Arguments commerciaux : devis gratuit ? garantie ? facilités de paiement ?
    véhicule de prêt ? tarifs pros ?

**Livrer cette liste en page mise en forme**, pas en paragraphe : le client la
transmet telle quelle à son commerçant.

---

## 12. Architecture qui se duplique

Un seul fichier de configuration porte **toutes** les données client (nom,
téléphone, adresse, horaires, services, avis, note). **Aucun composant ne
contient de donnée client en dur.**

Pour un nouveau commerce, trois points à toucher :
1. le fichier de config
2. les photos
3. les tokens de design (**recalculer les contrastes**)

Le reste — structure, tests, harnais — se réutilise tel quel. **La direction
artistique, elle, se refait à zéro** (§4).

---

## 13. Checklist de livraison

- [ ] Contrastes calculés, pas estimés
- [ ] Cibles tactiles ≥ 44 px (hors liens en ligne)
- [ ] Un seul `h1`, aucun saut de niveau
- [ ] Toutes les images ont un `alt` **descriptif** (ce qu'on voit, pas le nom de la pièce)
- [ ] Rendu correct sans JS
- [ ] `prefers-reduced-motion` neutralise tout
- [ ] Aucune erreur console, aucun débordement horizontal
- [ ] JSON-LD `LocalBusiness` valide (type, téléphone, adresse, horaires)
- [ ] `title` < 60 car., meta description 120–160 car., canonical
- [ ] Aucun mot collé (test automatisé)
- [ ] Mentions légales complètes
- [ ] Avis réels et vérifiés
- [ ] Aucun cookie tiers sans consentement
- [ ] < 500 kB transférés
- [ ] Captures relues à 390 / 820 / 1440 px

---

## 14. Posture

- **Signaler les problèmes juridiques une fois, clairement, puis livrer.** Le
  client décide.
- **Ne jamais inventer** un avis, un chiffre, une coordonnée, un horaire. Un
  placeholder se marque comme tel, dans le code *et* à l'écran.
- **Vérifier, ne pas supposer.** Une image, une couleur, une position : on
  ouvre, on mesure, on regarde.
- **Dire ce qui n'a pas pu être testé** et pourquoi.
- **Ne pas cacher une correction** derrière une reformulation. Deux fichiers
  photo de même taille ont été inversés sur ce projet faute d'avoir ouvert les
  images : le dire vaut mieux que le maquiller.
