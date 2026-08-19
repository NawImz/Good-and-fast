/**
 * Les photos du commerce et leur texte alternatif.
 * L'alt décrit ce qu'on voit, pas le nom du fichier.
 */
import grecFrites from "../assets/photos/grec-frites.jpg";
import tacosFrites from "../assets/photos/tacos-frites.jpg";
import plateauSalle from "../assets/photos/plateau-salle.jpg";
import comptoirBroche from "../assets/photos/comptoir-broche.jpg";
import comptoirPanneaux from "../assets/photos/comptoir-panneaux.jpg";
import panneauTacos from "../assets/photos/panneau-tacos.jpg";
import devanture from "../assets/photos/devanture.jpg";
import salleCarrelage from "../assets/photos/salle-carrelage.jpg";

export const photos = {
  grecFrites: {
    src: grecFrites,
    alt: "Sandwich grec ouvert dans un pain naan grillé, garni de viande coupée en fines lamelles, servi avec une portion de frites dorées.",
  },
  tacosFrites: {
    src: tacosFrites,
    alt: "Tacos roulé dans du papier et de l'aluminium, garni de poulet et de sauce, posé sur un plateau à côté d'une grande portion de frites.",
  },
  plateauSalle: {
    src: plateauSalle,
    alt: "Deux plateaux sur une table de la salle : un sandwich emballé dans du papier, des frites, une sauce orangée et des canettes de soda.",
  },
  comptoirBroche: {
    src: comptoirBroche,
    alt: "Le cuisinier derrière le comptoir, devant la broche à viande verticale, sous les panneaux de la carte.",
  },
  comptoirPanneaux: {
    src: comptoirPanneaux,
    alt: "Les panneaux de la carte au-dessus du comptoir : panini, burgers, assiettes et sandwichs, avec le réfrigérateur à boissons sur la gauche.",
  },
  panneauTacos: {
    src: panneauTacos,
    alt: "Le panneau des tacos affiché en salle : les trois tailles, la liste des viandes et celle des sauces.",
  },
  devanture: {
    src: devanture,
    alt: "La devanture en brique rouge de Good & Fast avenue de la République, avec les lettres rouges en relief de l'enseigne et « Viande Halal » peint en script blanc et rouge sur la vitrine.",
  },
  salleCarrelage: {
    src: salleCarrelage,
    alt: "L'intérieur de la salle : mur en carrelage rouge, moulure blanche au plafond et panneaux des pizzas et des tacos.",
  },
};
