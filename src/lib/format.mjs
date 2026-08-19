/** Formatage — aucune donnée ici, uniquement de la mise en forme. */

/**
 * 5 -> « 5,00 € » ; 6.5 -> « 6,50 € » ; null -> null (le prix n'est pas affiché).
 * Toujours deux décimales : c'est l'écriture des panneaux du comptoir, et
 * c'est ce qui fait tenir la colonne des prix alignée.
 */
export function prix(v) {
  if (v == null) return null;
  return `${v.toFixed(2).replace(".", ",")} €`;
}

/** « 11:00 » -> « 11h » ; « 00:00 » -> « minuit » ; « 11:30 » -> « 11h30 ». */
export function heure(h) {
  const [hh, mm] = h.split(":");
  if (hh === "00" && mm === "00") return "minuit";
  return mm === "00" ? `${Number(hh)}h` : `${Number(hh)}h${mm}`;
}

/** [["11:00","00:00"]] -> « 11h – minuit ». */
export function plages(p) {
  if (!p) return "Fermé";
  return p.map(([a, b]) => `${heure(a)} – ${heure(b)}`).join(" · ");
}
