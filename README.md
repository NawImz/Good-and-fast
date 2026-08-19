# Good & Fast — site vitrine

Site vitrine de **Good & Fast**, sandwicherie halal au 62 avenue de la
République à Épinay-sur-Seine. Construit selon
[`docs/playbook-site-vitrine.md`](docs/playbook-site-vitrine.md).

```bash
npm install
npm run dev                    # développement
npm run build                  # build statique dans dist/
npm run qa                     # build + les trois scripts de QA
npm run contrast '#C01D22' '#F7F2EC'   # rapport de contraste WCAG
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
| La matière | Pain naan brûlé au four, papier et aluminium, brique peinte, carrelage rouge brillant | Fond papier chaud, photos en gros plan, aucune texture décorative ajoutée |
| Le geste | Trancher à la broche, empiler, envelopper, tendre par-dessus le comptoir | Rythme dense, animations courtes et sèches |
| L'émotion d'achat | Faim immédiate, et la confiance qu'on ressort vite | Le prix et le téléphone toujours visibles |
| Ce qu'on regarde avant d'entrer | La broche qui tourne, la carte, les prix | Le premier écran est une photo de plat, pas une façade |

**Couleurs — prélevées, puis corrigées pour l'écran.** La devanture est la
seule source fiable : les photos d'intérieur sont sous éclairage jaune et
donnent des valeurs boueuses (le carrelage rouge y ressort à `#8D5D66`).

- Rouge des lettres en relief, médiane sur ~9 000 pixels filtrés : **`#B93437`**,
  teinte 358,6°.
- Corrigé à la même teinte pour tenir à l'écran : **`--rouge #C01D22`**, qui
  donne **5,48:1 dans les deux sens** avec le fond papier. Sur fond clair le
  rapport est symétrique : une seule teinte suffit pour l'encre *et* pour
  l'aplat.
- **`--frite #E3B755`** vient des frites, pas d'un nuancier. Il n'apparaît que
  sur les fonds sombres, où il passe AA (5,76:1 sur `--rouge-nuit`).
- Interdit et documenté dans `global.css` : `--rouge` sur `--encre` (2,97:1).

**Typographie.** Le lettrage de l'enseigne est un grotesque **Bold** — pas
Black — à chasse normale et à approche très large : c'est l'espacement qui fait
la signature, pas la graisse. D'où *Familjen Grotesk* limitée à 700, et la
classe `.enseigne` qui reprend l'approche. *Yellowtail* est l'écho du script
peint sur les vitrines (« Viande Halal ») ; il est réservé à deux ou trois mots.

**L'ornement, un seul.** Le bandeau rouge plein qui court au-dessus des
vitrines. Il sépare les sections et rien d'autre.

**Le favicon** est l'esperluette de l'enseigne, vectorisée depuis la photo avec
potrace (`scripts/dev/trace-esperluette.mjs`) plutôt que redessinée, puis
recadrée et vérifiée à 16 px — la seule taille qui compte dans un onglet.

---

## Ce que le site ne fait pas, et pourquoi

- **Pas de formulaire de contact.** Un site statique n'a pas de boîte de
  réception. Un formulaire que personne ne relève fait perdre des clients
  persuadés d'avoir écrit. Le canal est le téléphone.
- **Pas de bandeau de cookies**, parce qu'il n'y a aucun cookie : pas de mesure
  d'audience, pas de police en CDN, pas de plan Google Maps. `check.mjs`
  échoue si un cookie ou une requête externe apparaît.
- **Pas d'avis nominatifs ni de balisage `schema.org/Review`.** Le drapeau
  `avisVerifies` est à `false` dans `src/data/business.mjs` : tant qu'il l'est,
  les blocs d'avis sont des synthèses explicitement présentées comme telles et
  aucune note agrégée n'est déclarée à Google.
- **Pas de plan interactif**, faute de coordonnées GPS. Le bloc affiche la
  devanture et un lien OpenStreetMap. Renseigner `adresse.latitude` et
  `adresse.longitude` bascule automatiquement sur la carte intégrée.
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
  horaires fusionnés, absence d'avis non vérifiés), cookies et requêtes
  externes.
- **`check-motion.mjs`** — chaque animation se termine, y compris dans une
  fenêtre si haute que toute la page tient dedans.

Les captures sont à **regarder**, pas seulement à produire : plusieurs défauts
corrigés ici (prix qui passaient à la ligne, photo qui ne remplissait pas sa
colonne, titre annonçant trois remarques pour quatre blocs) n'étaient visibles
que comme ça.

---

## Avant la mise en ligne — bloquant

Ces points sont **obligatoires** ; le premier est une infraction dès le premier
jour de publication.

1. **Mentions légales** — `legal` dans `business.mjs` : forme juridique, SIRET,
   TVA, directeur de la publication, capital, **et l'hébergeur** (raison
   sociale + adresse). Art. 6-III LCEN n° 2004-575. La page affiche
   aujourd'hui un avertissement et marque chaque champ manquant.
2. **Nom de domaine** — `site` dans `business.mjs` vaut
   `https://good-and-fast.fr`, qui est un **placeholder** : il alimente les
   URL canoniques et le sitemap.
3. **Horaires du lundi** — `horairesVerifies: false`. Une source indique le
   lundi ouvert ; le site affiche « fermé » et le signale.
4. **Coordonnées GPS** — sur Google Maps, appui long sur le point, les deux
   nombres se copient. Attention aux virgules décimales à convertir en points.
5. **Avis** — le texte exact de 3 à 5 avis, avec les noms affichés et les
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
