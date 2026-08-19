# Good & Fast — site vitrine

Site vitrine de **Good & Fast**, sandwicherie halal au 62 avenue de la
République à Épinay-sur-Seine. Construit selon
[`docs/playbook-site-vitrine.md`](docs/playbook-site-vitrine.md).

```bash
npm install
npm run dev                    # développement
npm run build                  # build statique dans dist/
npm run qa                     # build + les trois scripts de QA
npm run contrast '#C01D22' '#F2E1D4'   # rapport de contraste WCAG
```

En sandbox distante, les scripts de QA ont besoin du chemin du navigateur :

```bash
CHROMIUM_PATH=./scripts/chrome-launcher.sh npm run qa
```

---

## Direction artistique — d'où elle vient

Rien n'a été inventé : chaque valeur est prélevée sur les photos du commerce.

**La méthode de divergence du playbook (§4.3), appliquée à ce commerce :**

| Question | Réponse pour Good & Fast | Conséquence sur le site |
|---|---|---|
| La matière | Un mur de brique, du pain naan sorti du four, du papier et de l'aluminium | Le fond du site **est** ce mur ; les panneaux de la carte sont du papier posé dessus |
| Le geste | Trancher à la broche, empiler, envelopper, tendre par-dessus le comptoir | Rythme dense, animations courtes et sèches |
| L'émotion d'achat | Faim immédiate, et la confiance qu'on ressort vite | Le prix et le téléphone toujours visibles |
| Ce qu'on regarde avant d'entrer | La broche qui tourne, la carte, les prix | Le premier écran est une photo de plat, pas une façade |

**Le fond est le mur, pas une feuille de papier.** La matière de ce commerce
est la brique : la devanture est un mur de parement en appareil à joints
croisés. Un fond crème aurait été le réflexe d'un autre projet — le playbook
range d'ailleurs « fond papier chaud » parmi ce qu'il ne faut pas reprendre.

- Brique relevée sur la devanture : **`#A76446`**, teinte 18,6°.
  Mortier relevé : **`#B4B7BF`**, gris franchement froid.
- Le mur à l'écran : face **`--brique #F2E1D4`**, joint **`--mortier #FAF4EE`**,
  plus clair et plus froid que la face, comme le mortier réel. La teinte est
  remontée à 26° parce qu'à cette clarté 18,6° vire au rosé.
- Motif : assises de 26 px, briques trois fois plus longues que hautes, joint
  de 2 px, une assise sur deux décalée d'une demi-brique — les proportions
  mesurées sur la photo. Tuile SVG en `data:` URI, donc aucune requête.
- **La face de brique est la partie la plus sombre du motif : c'est elle qui
  commande tous les contrastes.** `qa/check.mjs` les revérifie à chaque passage,
  et échoue aussi si la couleur du joint écrite dans le motif cesse de
  correspondre à `--color-mortier`.

Les panneaux de la carte (`--panneau #FEFAF6`) sont du papier posé sur ce mur :
c'est exactement le dispositif du comptoir, des panneaux crème sur un mur
carrelé. Les avis, eux, restent à même le mur.

**Couleurs — prélevées, puis corrigées pour l'écran.** La devanture est la
seule source fiable : les photos d'intérieur sont sous éclairage jaune et
donnent des valeurs boueuses (le carrelage rouge y ressort à `#8D5D66`).

- Rouge des lettres en relief, médiane sur ~9 000 pixels filtrés : **`#B93437`**,
  teinte 358,6°.
- Corrigé à la même teinte pour tenir à l'écran : **`--rouge #C01D22`**,
  4,80:1 sur la face de brique, et `--os` à 5,65:1 dessus.
- **`--frite #E3B755`** vient des frites, pas d'un nuancier. Il n'apparaît que
  sur les fonds sombres, où il passe AA (5,76:1 sur `--rouge-nuit`).
- Interdit et documenté dans `global.css` : `--rouge` sur `--encre` (2,97:1).

**Tout est rond, ici.** Le naan est rond, la pizza est ronde, l'assiette est
ronde, la tortilla est un cercle, le sandwich est un tube, la broche est un
cylindre qui tourne. Le rond n'est donc pas une tendance empruntée, c'est la
forme du produit — et c'est ce qui a remplacé la première version, coupée en
deux et à angles vifs comme n'importe quel site d'agence.

- Les photos de plats sont cadrées **en cercle**, comme des assiettes vues de
  dessus.
- Les prix sont des **pastilles**, à l'image de l'étiquette « 10 € » collée sur
  l'affiche des pizzas en salle.
- Les rayons suivent une échelle (`--radius-chip` à `--radius-panneau-lg`), pas
  un rayon unique appliqué partout : les grandes surfaces sont franchement
  rondes, les petites restent nettes. C'est ce contraste qui empêche le rond de
  virer au décoratif.

**L'ornement, un seul : le panneau posé sur le mur.** Les sections ne sont plus
des bandes pleine largeur collées les unes aux autres, mais des panneaux
arrondis avec du mur visible entre eux — le dispositif réel du comptoir, des
panneaux de papier crème montés sur un mur carrelé. Le bandeau rouge de la
version précédente a été retiré en même temps que celui-ci est arrivé : un seul
ornement à la fois.

**Le mot de la maison, sur le mur sombre.** Le texte de présentation fourni
par le client est repris **mot pour mot** et posé sur un panneau de brique
rouge sombre — le même appareil que le mur de la page, dans la famille du rouge
de l'enseigne. Il a remplacé la section chronomètre, retirée à la demande du
client : le site ne met plus en avant de délai chiffré. Sur ce fond, c'est la
partie la plus claire du motif — le joint — qui commande les contrastes :
`--os` y tient 8,07:1 et `--frite` 4,64:1.

**Typographie.** Deux rôles, deux familles, plus un accent.

- **Gabarito** pour les énoncés : géométrique à formes rondes et terminaisons
  douces. Retenue après comparaison sur planche avec Bricolage Grotesque,
  Baloo 2 et Familjen Grotesk — c'est la seule qui portait le rond sans virer
  au menu pour enfants.
- **Familjen Grotesk** pour le texte courant, volontairement discrète. Elle
  garde le squelette des lettres en relief de la devanture (G à ergot, O ovale,
  terminaisons horizontales) et ne dépasse pas 700, l'enseigne réelle étant
  Bold et non Black.
- **Yellowtail**, écho du script peint sur les vitrines, employé **une seule
  fois** dans toute la page — sur « Viande halal », dans le premier écran.

**Le favicon** est l'esperluette de l'enseigne, vectorisée depuis la photo avec
potrace (`scripts/dev/trace-esperluette.mjs`) plutôt que redessinée, puis
recadrée et vérifiée à 16 px — la seule taille qui compte dans un onglet.

---

## Ce que le site ne fait pas, et pourquoi

- **Pas de formulaire de contact.** Un site statique n'a pas de boîte de
  réception. Un formulaire que personne ne relève fait perdre des clients
  persuadés d'avoir écrit. Le canal est le téléphone.
- **Pas de bandeau de cookies**, alors même que le plan est un Google Maps.
  Un plan Google intégré dépose ses cookies dès le chargement de la page, ce
  qui rendrait le bandeau obligatoire ; ici il est **chargé au clic** (motif
  recommandé par la CNIL), et l'écran annonce le dépôt avant le clic. Sinon :
  pas de mesure d'audience, pas de police en CDN. `check.mjs` échoue si un
  cookie, une requête externe ou une requête vers Google apparaît avant le
  clic.
- **Pas d'avis nominatifs ni de balisage `schema.org/Review`.** Le drapeau
  `avisVerifies` est à `false` dans `src/data/business.mjs` : tant qu'il l'est,
  les blocs d'avis sont des synthèses explicitement présentées comme telles et
  aucune note agrégée n'est déclarée à Google.
- **Le bouton du plan est un vrai lien.** Sans JavaScript il ouvre Google Maps
  dans un onglet ; avec, il insère le cadre sur place. Le lien de secours reste
  hors du cadre : une iframe refusée peint sa propre page d'erreur opaque
  par-dessus tout ce qu'on mettrait derrière.
- **Pas de lien de livraison.** Aucun n'a été confirmé ; un lien mort coûte
  plus qu'une absence.

---

## Architecture

Toutes les données client sont dans **`src/data/business.mjs`**. Aucun
composant ne contient de donnée en dur. Pour un autre commerce de restauration
rapide, trois points à toucher :

1. `src/data/business.mjs` et `src/data/photos.mjs`
2. les photos dans `src/assets/photos/`
3. les tokens de `src/styles/global.css` — **et recalculer les contrastes**

Le reste — structure, composants, harnais de QA — se réutilise tel quel. La
direction artistique, elle, se refait à zéro : deux sites du même métier
doivent différer, c'est l'enseigne réelle qui tranche.

```
src/
  data/business.mjs      toutes les données client, avec leur provenance
  data/photos.mjs        les photos et leurs textes alternatifs
  lib/format.mjs         mise en forme (prix, heures) — aucune donnée
  styles/global.css      tokens, polices, règles d'animation
  scripts/motion.ts      GSAP + Lenis, sans ScrollTrigger
  components/            Entete, Hero, Signature, Chrono, Carte, Avis, Infos…
qa/                      shoot.mjs · check.mjs · check-motion.mjs
scripts/contrast.mjs     calcul des rapports WCAG
scripts/dev/             outils ponctuels (palette, vectorisation du logo)
```

### Le harnais de QA

`npm run qa` construit puis lance trois scripts contre le build servi :

- **`shoot.mjs`** — captures en 390 / 820 / 1440 px dans `qa/out/`, plus
  débordement horizontal, cibles tactiles sous 44 px (avec l'exception des
  liens en ligne et des liens masqués au repos), un seul `h1` et aucun saut de
  niveau, images sans `alt` ou sans dimensions, éléments restés invisibles,
  poids transféré, erreurs console.
- **`check.mjs`** — liens `tel:` en E.164, menu mobile, position réelle des
  ancres, rien sous la barre fixe, rendu sans JavaScript, rendu en
  `prefers-reduced-motion`, mots collés, JSON-LD (type, téléphone, adresse,
  horaires fusionnés, absence d'avis non vérifiés), **plan Google chargé
  seulement au clic**, cookies et requêtes externes, **lisibilité réelle du
  texte sur son fond** (couleurs composées sur un canvas, page parcourue au
  préalable pour que les sections animées soient évaluées).
- **`check-motion.mjs`** — chaque animation se termine, y compris dans une
  fenêtre si haute que toute la page tient dedans.

Les captures sont à **regarder**, pas seulement à produire : plusieurs défauts
corrigés ici (prix qui passaient à la ligne, photo qui ne remplissait pas sa
colonne, titre annonçant trois remarques pour quatre blocs, teinte de brique
qui virait au rosé une fois éclaircie, noms de plats cassés en deux dans les
cartes étroites, trou dans la mosaïque) n'étaient visibles que comme ça.

Un de ces défauts — une collision de cascade qui rendait une section entière en
texte crème sur fond blanc — a donné lieu à un contrôle dédié dans `check.mjs`.
Le contrôle a été validé en réintroduisant le bug : il tombe à 1,04:1 et
repasse au vert une fois corrigé.

---

## Avant la mise en ligne — bloquant

Ces points sont **obligatoires** ; le premier est une infraction dès le premier
jour de publication.

1. **Remettre les mentions légales.** La page a été **retirée à la demande du
   client**, en phase de test. C'est sa décision ; l'obligation, elle, ne
   disparaît pas : l'article 6-III de la LCEN n° 2004-575 impose d'identifier
   l'éditeur et l'hébergeur, et l'absence est une infraction dès le premier
   jour de publication publique. Le bloc `legal` est conservé dans
   `business.mjs` pour que la remise en ligne reste triviale : remplir les
   champs (forme juridique, SIRET, TVA, directeur de la publication, capital,
   **et l'hébergeur** avec sa raison sociale et son adresse), recréer
   `src/pages/mentions-legales.astro` et le lien du pied de page.
2. **Nom de domaine** — `site` dans `business.mjs` vaut
   `https://good-and-fast.fr`, qui est un **placeholder** : il alimente les
   URL canoniques et le sitemap.
3. **Avis** — le texte exact de 3 à 5 avis, avec les noms affichés et les
   étoiles. Passer `avisVerifies` à `true` une fois saisis.

### Utile, non bloquant

- Une photo de la broche en action, en gros plan : c'est le geste que le site
  raconte et la seule image qui manque vraiment.
- Les prix illisibles sur les panneaux photographiés (sandwich Merguez, une
  partie des pizzas, la description du Grec masquée sur la photo).
- Un lien de plateforme de livraison, si le restaurant en utilise une.
- Les réseaux sociaux, s'il y en a.

### Signalé au client, hors site

Deux points reviennent dans les avis et ne sont **pas** affichés ici, parce
qu'ils relèvent de l'exploitation et non de la vitrine : quelques erreurs de
commande, et un décor jugé vieillissant. Le second est la raison pour laquelle
le site montre les plats et le comptoir, jamais une vue large de la salle : la
photo doit tenir la promesse qu'on trouve en poussant la porte.

---

## Outillage de session

Les serveurs MCP (`.mcp.json`) et les plugins (`.claude/settings.json`) sont
déclarés en scope projet, donc versionnés. Les quatre serveurs HTTP — `github`,
`figma`, `vercel`, `netlify` — demandent une authentification OAuth
interactive : `claude mcp login <nom>`. Les serveurs de la configuration
apparaissent en `⏸ Pending approval` à la première session et doivent être
approuvés une fois.

`scripts/chrome-launcher.sh` existe parce que le sandbox distant n'embarque pas
de Chrome stable, que la version npm de Playwright et le Chromium installé
divergent, et que Chromium refuse de démarrer en root sans `--no-sandbox`. Il
résout les trois. En local, `CHROME_BIN` pointe un vrai Chrome.
