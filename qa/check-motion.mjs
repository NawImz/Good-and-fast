/**
 * Chaque animation se termine.
 *
 * Une animation qui démarre sans finir laisse du contenu à mi-opacité, ou pire
 * invisible : c'est le seul défaut d'animation qui coûte des clients. On
 * vérifie donc l'état final, pas le fait qu'« ça bouge ».
 */
import { servir, ouvrirNavigateur, rapport } from "./harnais.mjs";

const r = rapport("Animations");
const { base, fermer } = await servir();
const navigateur = await ouvrirNavigateur();

/** Parcourt toute la page comme un vrai geste, puis attend le repos. */
async function parcourir(p) {
  await p.evaluate(async () => {
    const pas = innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += pas) {
      window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 120));
    }
  });
  await p.waitForFunction(() => window.__animationsTerminees === true, null, { timeout: 6000 });
}

const cas = [
  { nom: "mobile 390×844", viewport: { width: 390, height: 844 } },
  { nom: "desktop 1440×900", viewport: { width: 1440, height: 900 } },
  // Écran très haut : toute la page tient dans la fenêtre, aucun déclencheur
  // ne peut « manquer » son entrée. Rien ne doit rester masqué.
  { nom: "fenêtre très haute 1280×4000", viewport: { width: 1280, height: 4000 } },
];

for (const c of cas) {
  const contexte = await navigateur.newContext({ viewport: c.viewport });
  const p = await contexte.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });

  let repos = true;
  try {
    await parcourir(p);
  } catch {
    repos = false;
  }
  r.ok(repos, `${c.nom} : des animations ne se sont jamais terminées (window.__animationsTerminees reste faux)`);

  const restes = await p.evaluate(() =>
    [...document.querySelectorAll("[data-anim]")]
      .map((el) => ({
        texte: (el.textContent || "").trim().slice(0, 36),
        opacite: Number(getComputedStyle(el).opacity),
        transform: getComputedStyle(el).transform,
      }))
      .filter((x) => x.opacite < 0.99 || (x.transform !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(x.transform))),
  );
  r.ok(
    restes.length === 0,
    `${c.nom} : élément(s) laissé(s) en cours d'animation`,
    restes.map((x) => `« ${x.texte} » opacité ${x.opacite} / ${x.transform}`).join("\n     "),
  );

  // L'image du hero doit revenir exactement à l'échelle 1, sans bord blanc.
  const echelle = await p.evaluate(() => {
    const t = getComputedStyle(document.querySelector("[data-hero-image]")).transform;
    if (t === "none") return 1;
    return Number(t.match(/matrix\(([-\d.]+)/)?.[1] ?? 1);
  });
  r.ok(Math.abs(echelle - 1) < 0.001, `${c.nom} : le hero reste à l'échelle ${echelle}`);

  await contexte.close();
}

await navigateur.close();
await fermer();
process.exit(r.conclure());
