/**
 * Captures et mesures structurelles, contre le build servi.
 * Produit qa/out/<page>-<largeur>.png à regarder — les mesures ne remplacent
 * pas le fait de regarder les images.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { servir, ouvrirNavigateur, rapport, TAILLES } from "./harnais.mjs";

const PAGES = ["/", "/mentions-legales", "/donnees-personnelles"];
const SORTIE = "qa/out";
const POIDS_MAX_KO = 500;

const r = rapport("Captures et structure");
const { base, fermer } = await servir();
const navigateur = await ouvrirNavigateur();
await mkdir(SORTIE, { recursive: true });

for (const page of PAGES) {
  const nom = page === "/" ? "accueil" : page.slice(1);

  for (const taille of TAILLES) {
    const contexte = await navigateur.newContext({
      viewport: { width: taille.width, height: taille.height },
      deviceScaleFactor: 2,
      isMobile: taille.mobile,
      hasTouch: taille.mobile,
    });
    const p = await contexte.newPage();

    const erreurs = [];
    p.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));
    p.on("pageerror", (e) => erreurs.push(String(e)));

    let octets = 0;
    p.on("response", async (rep) => {
      const l = rep.headers()["content-length"];
      if (l) octets += Number(l);
      else await rep.body().then((b) => (octets += b.length)).catch(() => {});
    });

    await p.goto(base + page, { waitUntil: "networkidle" });
    // Parcourir la page pour armer tous les déclencheurs de scroll.
    await p.evaluate(async () => {
      const pas = innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 90));
      }
      window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0);
      await new Promise((res) => setTimeout(res, 250));
    });

    await p.screenshot({ path: `${SORTIE}/${nom}-${taille.nom}.png`, fullPage: true });

    const mesures = await p.evaluate(() => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        return s.display !== "none" && s.visibility !== "hidden" && el.getClientRects().length > 0;
      };

      // Cibles tactiles. Exception explicite : un lien à l'intérieur d'une
      // phrase — l'agrandir casserait le paragraphe.
      const enLigne = (el) => {
        if (el.tagName !== "A") return false;
        const p = el.parentElement;
        if (!p) return false;
        if (!["P", "LI", "SPAN", "FIGCAPTION", "DD", "ADDRESS"].includes(p.tagName)) return false;
        return (p.textContent || "").trim().length > (el.textContent || "").trim().length + 12;
      };
      // Un lien d'évitement est masqué tant qu'il n'a pas le focus : sa taille
      // au repos ne veut rien dire, on l'audite dans son état révélé.
      const masqueAuRepos = (el) => el.closest('[class*="sr-only"]') !== null;
      const petites = [...document.querySelectorAll("a[href],button,input,select,summary")]
        .filter((el) => visible(el) && !enLigne(el) && !masqueAuRepos(el))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width < 44 || r.height < 44)
        .map(({ el, r }) => `${el.tagName.toLowerCase()} « ${(el.textContent || "").trim().slice(0, 28)} » ${Math.round(r.width)}×${Math.round(r.height)}`);

      const titres = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
      const sauts = [];
      for (let i = 1; i < titres.length; i++)
        if (titres[i] > titres[i - 1] + 1) sauts.push(`h${titres[i - 1]} → h${titres[i]}`);

      const images = [...document.images].map((i) => ({
        src: i.currentSrc.split("/").pop(),
        alt: i.getAttribute("alt"),
        dim: i.hasAttribute("width") && i.hasAttribute("height"),
      }));

      const invisibles = [...document.querySelectorAll("[data-anim]")]
        .filter((el) => Number(getComputedStyle(el).opacity) < 0.95)
        .map((el) => (el.textContent || "").trim().slice(0, 40));

      return {
        debordement: document.documentElement.scrollWidth > innerWidth + 1
          ? `${document.documentElement.scrollWidth} px pour ${innerWidth} px de fenêtre`
          : null,
        petites,
        h1: document.querySelectorAll("h1").length,
        sauts,
        sansAlt: images.filter((i) => i.alt === null).map((i) => i.src),
        sansDim: images.filter((i) => !i.dim).map((i) => i.src),
        invisibles,
      };
    });

    const etiquette = `${nom} @ ${taille.nom}`;
    r.ok(!mesures.debordement, `${etiquette} : débordement horizontal`, mesures.debordement);
    r.ok(mesures.petites.length === 0, `${etiquette} : cible(s) tactile(s) sous 44 px`, mesures.petites.join("\n     "));
    r.ok(mesures.h1 === 1, `${etiquette} : ${mesures.h1} h1 (il en faut exactement un)`);
    r.ok(mesures.sauts.length === 0, `${etiquette} : saut de niveau de titre`, mesures.sauts.join(", "));
    r.ok(mesures.sansAlt.length === 0, `${etiquette} : image sans alt`, mesures.sansAlt.join(", "));
    r.ok(mesures.sansDim.length === 0, `${etiquette} : image sans dimensions`, mesures.sansDim.join(", "));
    r.ok(mesures.invisibles.length === 0, `${etiquette} : élément resté invisible`, mesures.invisibles.join(" | "));
    r.ok(erreurs.length === 0, `${etiquette} : erreur console`, erreurs.join("\n     "));

    const ko = Math.round(octets / 1024);
    if (taille.nom === "1440") {
      r.ok(ko <= POIDS_MAX_KO, `${etiquette} : ${ko} ko transférés (cible ${POIDS_MAX_KO} ko)`);
      r.note(`${etiquette} : ${ko} ko transférés`);
    }

    await contexte.close();
  }
}

await navigateur.close();
await fermer();
await writeFile(`${SORTIE}/.gitkeep`, "");
process.exit(r.conclure());
