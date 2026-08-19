/**
 * SOURCE UNIQUE DES DONNÉES CLIENT.
 *
 * Aucun composant ne doit contenir de donnée client en dur. Pour un autre
 * commerce : dupliquer ce fichier, remplacer les photos, recalculer les tokens
 * de design (`npm run contrast`).
 *
 * Chaque valeur porte sa provenance. Ce qui n'a pas été vérifié est marqué
 * `À CONFIRMER` et se voit à l'écran, jamais silencieusement.
 */

/** URL de production. À CONFIRMER — nom de domaine non arrêté par le client. */
export const site = "https://good-and-fast.fr";

export const business = {
  /** Nom d'usage, tel qu'il est peint sur la devanture. */
  nom: "Good & Fast",
  /** Raison sociale telle qu'affichée sur le panneau « origine de nos viandes bovines ». */
  raisonSociale: "GOOD AND FAST",
  baseline: "Sandwicherie, tacos et pizzas à emporter, avenue de la République.",

  adresse: {
    rue: "62 avenue de la République",
    codePostal: "93800",
    ville: "Épinay-sur-Seine",
    pays: "FR",
    /**
     * Coordonnées GPS. NON RENSEIGNÉES : les géocodeurs sont bloqués dans
     * l'environnement de build et une coordonnée inventée enverrait des clients
     * à la mauvaise adresse. À relever par le client sur Google Maps
     * (appui long sur le point → les deux nombres se copient), puis coller ici
     * en remplaçant les virgules décimales par des points.
     * Tant que c'est `null`, le bloc plan affiche un lien plutôt qu'une carte.
     */
    latitude: null,
    longitude: null,
  },

  /** Format E.164 pour les liens `tel:`, format lisible pour l'affichage. */
  telephone: { e164: "+33158348057", affichage: "01 58 34 80 57" },

  /**
   * Horaires. `À CONFIRMER` : une source indique le lundi ouvert.
   * Un jour `null` = fermé.
   */
  horairesVerifies: false,
  horaires: [
    { jour: "Lundi", schema: "Monday", plages: null },
    { jour: "Mardi", schema: "Tuesday", plages: [["11:00", "00:00"]] },
    { jour: "Mercredi", schema: "Wednesday", plages: [["11:00", "00:00"]] },
    { jour: "Jeudi", schema: "Thursday", plages: [["11:00", "00:00"]] },
    { jour: "Vendredi", schema: "Friday", plages: [["11:00", "00:00"]] },
    { jour: "Samedi", schema: "Saturday", plages: [["11:00", "00:00"]] },
    { jour: "Dimanche", schema: "Sunday", plages: [["12:00", "00:00"]] },
  ],

  /**
   * Note Google fournie par le client.
   * `avisVerifies` reste `false` tant que le texte exact, les noms affichés et
   * les étoiles des avis n'ont pas été fournis : tant qu'il l'est, aucun balisage
   * schema.org Review ni AggregateRating n'est émis et le bloc avis le dit.
   */
  note: { valeur: 3.9, nombre: 390, source: "Google" },
  avisVerifies: false,
  /**
   * Thèmes qui reviennent dans les avis, reformulés — ce ne sont PAS des
   * citations et ils ne sont attribués à personne. Ils le deviendront quand le
   * client aura fourni les avis exacts.
   */
  themesAvis: [
    {
      titre: "3 minutes montre en main",
      texte:
        "Le délai le plus court cité par un client entre la commande et le retrait. C'est le point qui revient le plus souvent.",
    },
    {
      titre: "Des portions généreuses",
      texte:
        "Sandwichs et assiettes sont décrits comme copieux pour le prix pratiqué.",
    },
    {
      titre: "Une viande bien assaisonnée",
      texte:
        "Coupée finement à la broche au moment de la commande, relevée, servie dans un pain qui tient.",
    },
    {
      titre: "Une équipe qui va vite sans bâcler",
      texte: "L'accueil et le rythme du comptoir sont régulièrement salués.",
    },
  ],

  /** Ce que le commerce affiche lui-même en boutique — donc opposable. */
  engagements: [
    { titre: "Viande halal", detail: "Mention peinte sur la devanture et affichée en salle." },
    { titre: "Pain pétri chaque jour", detail: "« Pain façon maison, pétri chaque jour », affiché au-dessus du comptoir." },
    { titre: "Origine des viandes affichée", detail: "Le panneau réglementaire d'origine des viandes bovines est affiché en salle." },
  ],

  accueil: {
    surPlace: "Salle avec de nombreuses places assises",
    aEmporter: "À emporter, c'est l'usage principal",
    paiements: ["Espèces", "Carte bancaire", "Ticket Restaurant"],
    /** Consigne affichée en salle, reprise telle quelle. */
    consigne: "Toute commande doit être payée avant consommation.",
  },

  acces: [
    { titre: "En train", detail: "Gare d'Épinay-Villetaneuse (Transilien H), à quelques minutes à pied." },
    { titre: "En voiture", detail: "Stationnement possible à proximité, avenue de la République." },
  ],

  /**
   * Liens vers des plateformes de livraison : aucun n'est renseigné.
   * Le playbook interdit d'afficher un lien mort ou supposé. À remplir si le
   * client en utilise réellement une.
   */
  livraison: [],

  /**
   * Carte relevée sur les panneaux photographiés en salle.
   * `prix: null` = prix non lisible sur les photos, volontairement non affiché
   * plutôt que deviné.
   */
  carte: [
    {
      id: "tacos",
      nom: "Tacos",
      accroche: "Garnis de frites et de sauce fromagère maison. Trois tailles, votre viande, deux sauces au choix.",
      items: [
        { nom: "Tacos simple", detail: "Une dose de viande au choix", prix: 5 },
        { nom: "Tacos double", detail: "Double dose de viande au choix", prix: 6 },
        { nom: "Maxitacos", detail: "Double tortilla et triple dose de viande", prix: 9 },
      ],
      choix: [
        { titre: "Viandes", valeurs: ["Escalope de poulet", "Viande hachée", "Cordon bleu", "Nuggets", "Merguez", "Grec", "Chicken"] },
        { titre: "Sauces (2 maximum)", valeurs: ["Algérienne", "Mayonnaise", "Ketchup", "Barbecue", "Blanche", "Biggy Burger", "Fish to Fish", "Poivre", "Chili thaï", "Samouraï", "Harissa"] },
      ],
      supplements: [
        { nom: "Cheddar, raclette, boursin, chèvre, mozza, œuf", prix: 0.5 },
        { nom: "Salami, blanc de dinde, blanc de poulet, lardons, bacon", prix: 0.9 },
      ],
    },
    {
      id: "sandwichs",
      nom: "Sandwichs",
      accroche: "Servis seuls ou en menu avec frites et boisson. Viande grecque coupée à la broche à la commande.",
      items: [
        { nom: "Grec", prix: 5.5, prixMenu: 6.5 },
        { nom: "Grec chicken", prix: 5.5, prixMenu: 6.5 },
        { nom: "Grec merguez", prix: 6.5, prixMenu: 7.5 },
        { nom: "Chicken merguez", prix: 6.5, prixMenu: 7.5 },
        { nom: "Steak chicken", prix: 7, prixMenu: 8 },
        { nom: "Spécial", detail: "2 steaks + grec + 2 fromages", prix: null, prixMenu: 9 },
      ],
      note: "Supplément « épices indiennes » : +0,50 € (piment vert, gingembre, oignons et poivrons frits).",
    },
    {
      id: "steaks",
      nom: "Steaks & escalopes",
      accroche: "La partie la plus copieuse de la carte, deux à trois steaks par sandwich.",
      items: [
        { nom: "Steak fromage", detail: "2 steaks + 2 fromages", prix: 5, prixMenu: 6 },
        { nom: "Steak œuf fromage", detail: "2 steaks + 2 fromages + œuf", prix: 5.5, prixMenu: 6.5 },
        { nom: "Steak extra", detail: "2 steaks + 2 fromages + cordon bleu", prix: 6, prixMenu: 7 },
        { nom: "Triple steak extra", detail: "3 steaks + 2 fromages + cordon bleu", prix: 7, prixMenu: 8 },
        { nom: "Chicken tikka", detail: "Escalope + tandoori", prix: 5.5, prixMenu: 6.5 },
        { nom: "Escalope mexicaine", detail: "Escalope + poivrons + olives + œuf", prix: 6, prixMenu: 7 },
      ],
    },
    {
      id: "naan",
      nom: "Pains & cheese naan",
      accroche: "Le pain est pétri chaque jour sur place. Le cheese naan est la spécialité de la maison.",
      items: [
        { nom: "Naan fromage", prix: 3 },
        { nom: "Cheese naan en remplacement", detail: "Sur n'importe quel sandwich", prix: 1.5, prefixe: "+" },
      ],
      note: "Tortillas et pain classique également disponibles.",
    },
    {
      id: "assiettes",
      nom: "Assiettes",
      accroche: "Viande, frites et crudités dans l'assiette, servies en salle.",
      items: [
        { nom: "Assiette grec", prixMenu: 9 },
        { nom: "Assiette chicken", prixMenu: 9 },
        { nom: "Assiette steak", prixMenu: 9 },
        { nom: "Assiette merguez", prixMenu: 9 },
      ],
    },
    {
      id: "burgers",
      nom: "Burgers & paninis",
      accroche: "L'entrée de gamme de la carte : de quoi manger pour moins de cinq euros.",
      items: [
        { nom: "Cheeseburger", prix: 2.5, prixMenu: 5 },
        { nom: "Cheeseburger + frites", prix: 4 },
        { nom: "Panini", detail: "Poulet, thon, viande hachée ou jambon", prix: 4, prixMenu: 5 },
        { nom: "Hummer H1", detail: "2 steaks + 2 fromages", prix: 5, prixMenu: 6 },
      ],
      supplements: [{ nom: "Fromage", prix: 0.5 }, { nom: "Jambon ou steak", prix: 1 }],
    },
    {
      id: "pizzas",
      nom: "Pizzas à emporter",
      accroche: "Pâte préparée sur place. À emporter, à partir de 7 €.",
      items: [
        { nom: "Margherita", detail: "Tomate, mozzarella, origan", prix: 7 },
        { nom: "Végétarienne", detail: "Tomate, mozzarella, champignons, poivrons, tomate fraîche, olives", prix: 8 },
        { nom: "Poulet", detail: "Tomate, mozzarella, poulet, origan, olives", prix: null },
        { nom: "Fruits de mer", detail: "Ail et persil", prix: null },
      ],
      note: "La carte complète des pizzas est affichée en boutique.",
    },
  ],

  /**
   * Mentions légales — art. 6-III LCEN n° 2004-575. INCOMPLÈTES à ce stade :
   * les champs `null` sont obligatoires avant toute mise en ligne.
   */
  legal: {
    formeJuridique: null,
    siret: null,
    tva: null,
    directeurPublication: null,
    capital: null,
    hebergeur: { nom: null, adresse: null },
    /** L'éditeur du site, à remplir par celui qui le livre. */
    editeurSite: null,
  },

  /** Réseaux sociaux : aucun fourni. On n'affiche rien plutôt qu'un lien mort. */
  reseaux: [],
};

/** Numéro tel: prêt à l'emploi. */
export const telHref = `tel:${business.telephone.e164}`;

/** Adresse sur une ligne. */
export const adresseLigne = `${business.adresse.rue}, ${business.adresse.codePostal} ${business.adresse.ville}`;

/** Lien d'itinéraire — ouvre l'application de cartographie du téléphone. */
export const itineraireHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.raisonSociale}, ${adresseLigne}`,
)}`;

/**
 * Horaires fusionnés pour l'affichage et pour schema.org.
 * Groupés par plage identique et non par adjacence : avec des jours qui
 * alternent, comparer à l'entrée précédente produit une liste inutilisable.
 */
export function horairesFusionnes() {
  const cle = (h) => (h.plages ? h.plages.map((p) => p.join("-")).join(",") : "ferme");
  const groupes = new Map();
  for (const h of business.horaires) {
    const k = cle(h);
    if (!groupes.has(k)) groupes.set(k, { plages: h.plages, jours: [] });
    groupes.get(k).jours.push(h);
  }
  return [...groupes.values()];
}

/** Libellé « Mardi – Samedi » ou « Mardi, Jeudi » selon que les jours se suivent. */
export function libelleJours(jours) {
  const ordre = business.horaires.map((h) => h.jour);
  const idx = jours.map((j) => ordre.indexOf(j.jour)).sort((a, b) => a - b);
  const suivis = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (jours.length === 1) return jours[0].jour;
  if (suivis) return `${ordre[idx[0]]} – ${ordre[idx[idx.length - 1]]}`;
  return idx.map((i) => ordre[i]).join(", ");
}
