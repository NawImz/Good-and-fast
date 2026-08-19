/**
 * Comportement : ce que les captures ne montrent pas.
 */
import { servir, ouvrirNavigateur, rapport } from "./harnais.mjs";
import { business, horairesFusionnes } from "../src/data/business.mjs";

const r = rapport("Comportement");
const { base, fermer } = await servir();
const navigateur = await ouvrirNavigateur();

/* --- Liens téléphoniques ------------------------------------------------ */
{
  const p = await (await navigateur.newContext()).newPage();
  await p.goto(base + "/");
  const tels = await p.$$eval('a[href^="tel:"]', (a) => a.map((x) => x.getAttribute("href")));
  r.ok(tels.length > 0, "aucun lien tel: sur la page d'accueil");
  const mauvais = tels.filter((t) => !/^tel:\+[1-9]\d{6,14}$/.test(t));
  r.ok(mauvais.length === 0, "lien tel: hors format E.164", mauvais.join(", "));
  r.ok(
    tels.every((t) => t === `tel:${business.telephone.e164}`),
    "un lien tel: ne pointe pas vers le numéro du fichier de données",
  );
  await p.context().close();
}

/* --- Menu mobile -------------------------------------------------------- */
{
  const c = await navigateur.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await c.newPage();
  await p.goto(base + "/");
  const panneau = p.locator("[data-menu-panneau]");
  r.ok(await panneau.isHidden(), "le menu mobile est ouvert au chargement");
  await p.locator("[data-menu-bascule]").click();
  r.ok(await panneau.isVisible(), "le menu mobile ne s'ouvre pas");
  r.ok(
    (await p.locator("[data-menu-bascule]").getAttribute("aria-expanded")) === "true",
    "aria-expanded ne suit pas l'ouverture du menu",
  );
  await p.locator("[data-menu-panneau] a").first().click();
  await p.waitForTimeout(400);
  r.ok(await panneau.isHidden(), "le menu mobile ne se referme pas après un clic sur un lien");
  await c.close();
}

/* --- Défilement des ancres et barre fixe -------------------------------- */
{
  const c = await navigateur.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await c.newPage();
  await p.goto(base + "/");
  await p.locator("[data-menu-bascule]").click();
  await p.locator('[data-menu-panneau] a[href="#carte"]').click();
  await p.waitForTimeout(1200);
  const ecart = await p.evaluate(() => {
    const cible = document.getElementById("carte");
    const entete = document.querySelector("[data-entete]");
    return cible.getBoundingClientRect().top - entete.getBoundingClientRect().height;
  });
  r.ok(Math.abs(ecart) < 40, `l'ancre #carte tombe à ${Math.round(ecart)} px sous l'en-tête (toléré : 40)`);

  // Rien ne doit rester sous la barre d'appel fixe.
  const sousLaBarre = await p.evaluate(async () => {
    const l = window.__lenis;
    const bas = document.body.scrollHeight;
    l ? l.scrollTo(bas, { immediate: true }) : scrollTo(0, bas);
    await new Promise((res) => setTimeout(res, 400));
    const barre = document.querySelector("[data-barre-appel]").getBoundingClientRect();
    const dernier = document.querySelector("footer p:last-of-type").getBoundingClientRect();
    return dernier.bottom - barre.top;
  });
  r.ok(sousLaBarre <= 0, `le bas du pied de page passe ${Math.round(sousLaBarre)} px sous la barre d'appel`);
  await c.close();
}

/* --- Rendu sans JavaScript ---------------------------------------------- */
{
  const c = await navigateur.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  await p.goto(base + "/");
  const invisibles = await p.$$eval("[data-anim]", (els) =>
    els.filter((e) => Number(getComputedStyle(e).opacity) < 0.95).map((e) => e.textContent.trim().slice(0, 40)),
  );
  r.ok(invisibles.length === 0, "sans JavaScript, du contenu reste invisible", invisibles.join(" | "));
  r.ok(await p.locator("h1").isVisible(), "sans JavaScript, le titre principal n'est pas rendu");
  r.ok((await p.locator("#carte article").count()) > 0, "sans JavaScript, la carte n'est pas rendue");
  await c.close();
}

/* --- Rendu en mouvement réduit ------------------------------------------ */
{
  const c = await navigateur.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  await p.goto(base + "/");
  await p.waitForTimeout(300);
  const etat = await p.evaluate(() => ({
    lenis: Boolean(window.__lenis),
    invisibles: [...document.querySelectorAll("[data-anim]")].filter(
      (e) => Number(getComputedStyle(e).opacity) < 0.95,
    ).length,
    chrono: document.querySelector("[data-chrono]")?.textContent?.trim(),
  }));
  r.ok(!etat.lenis, "Lenis est instancié malgré prefers-reduced-motion");
  r.ok(etat.invisibles === 0, `${etat.invisibles} élément(s) invisible(s) en mouvement réduit`);
  r.ok(etat.chrono === "3:00", `le chrono affiche « ${etat.chrono} » au lieu de sa valeur finale`);
  await c.close();
}

/* --- Mots collés (Astro avale le retour à la ligne avant une expression) - */
{
  const c = await navigateur.newContext();
  const p = await c.newPage();
  const tolerees = ["OpenStreetMap", "Épinay", "MaxiTacos", "JavaScript"];
  for (const page of ["/", "/mentions-legales", "/donnees-personnelles"]) {
    await p.goto(base + page);
    const colles = await p.evaluate((tolerees) => {
      const trouves = [];
      const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = it.nextNode(); n; n = it.nextNode()) {
        if (n.parentElement.closest("script,style")) continue;
        for (const m of n.textContent.matchAll(/\S*[a-zàâçéèêëîïôûùüÿñæœ][A-ZÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ]\S*/g)) {
          if (!tolerees.some((t) => m[0].includes(t))) trouves.push(m[0]);
        }
      }
      return trouves;
    }, tolerees);
    r.ok(colles.length === 0, `mot collé sur ${page}`, colles.join(", "));
  }
  await c.close();
}

/* --- JSON-LD ------------------------------------------------------------ */
{
  const c = await navigateur.newContext();
  const p = await c.newPage();
  await p.goto(base + "/");
  const brut = await p.$eval('script[type="application/ld+json"]', (s) => s.textContent);
  let ld;
  try {
    ld = JSON.parse(brut);
  } catch {
    ld = null;
  }
  if (r.ok(ld !== null, "le JSON-LD n'est pas du JSON valide")) {
    r.ok(ld["@type"] === "Restaurant", `@type vaut « ${ld["@type"]} » au lieu de Restaurant`);
    r.ok(ld.telephone === business.telephone.e164, "le téléphone du JSON-LD ne correspond pas");
    r.ok(ld.address?.streetAddress === business.adresse.rue, "l'adresse du JSON-LD ne correspond pas");
    r.ok(ld.address?.postalCode === business.adresse.codePostal, "le code postal du JSON-LD ne correspond pas");

    const attendus = horairesFusionnes().filter((g) => g.plages).length;
    r.ok(
      ld.openingHoursSpecification?.length === attendus,
      `${ld.openingHoursSpecification?.length} plage(s) d'horaires au lieu de ${attendus} — la fusion doit grouper par plage, pas par adjacence`,
    );

    // Pas de faux avis déclarés à Google tant qu'ils ne sont pas vérifiés.
    if (!business.avisVerifies) {
      r.ok(!("review" in ld), "des avis sont déclarés alors qu'ils ne sont pas vérifiés");
      r.ok(!("aggregateRating" in ld), "une note agrégée est déclarée alors que les avis ne sont pas vérifiés");
    }
    r.ok(("geo" in ld) === (business.adresse.latitude != null), "le bloc geo ne suit pas la présence de coordonnées");
  }
  await c.close();
}

/* --- Le motif de mur ne doit pas dériver des tokens ---------------------- */
{
  const c = await navigateur.newContext();
  const p = await c.newPage();
  await p.goto(base + "/");
  const mur = await p.evaluate(() => {
    const r = getComputedStyle(document.documentElement);
    const style = getComputedStyle(document.body);
    return {
      motif: r.getPropertyValue("--mur"),
      mortier: r.getPropertyValue("--color-mortier").trim(),
      fond: style.backgroundColor,
      brique: r.getPropertyValue("--color-brique").trim(),
      image: style.backgroundImage,
    };
  });
  // Le joint est écrit en dur dans le data: URI : on vérifie qu'il correspond
  // toujours au token, sinon le mur se désaccorde en silence.
  const joint = mur.motif.match(/%23([0-9A-Fa-f]{6})/)?.[1];
  r.ok(Boolean(joint), "aucune couleur de joint trouvée dans le motif de mur");
  r.ok(
    joint && `#${joint}`.toLowerCase() === mur.mortier.toLowerCase(),
    `le joint du motif (#${joint}) ne correspond plus à --color-mortier (${mur.mortier})`,
  );
  r.ok(mur.image.includes("svg"), "le fond du corps de page ne porte pas le motif de mur");

  // La face de brique est la partie la plus sombre du motif : c'est elle qui
  // commande les contrastes du texte posé dessus.
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  r.ok(lum(mur.brique) < lum(mur.mortier), "la face de brique doit être plus sombre que le joint");
  for (const [nom, encre, seuil] of [["--encre", "#1a1512", 4.5], ["--gris", "#6b615a", 4.5], ["--rouge", "#c01d22", 4.5], ["--gris-clair", "#857a74", 3]]) {
    const v = ratio(encre, mur.brique);
    r.ok(v >= seuil, `${nom} sur la face de brique : ${v.toFixed(2)}:1 (seuil ${seuil})`);
  }
  await c.close();
}

/* --- Cookies tiers ------------------------------------------------------ */
{
  const c = await navigateur.newContext();
  const p = await c.newPage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const cookies = await c.cookies();
  r.ok(cookies.length === 0, "un cookie est déposé — un bandeau de consentement deviendrait obligatoire",
    cookies.map((k) => k.name).join(", "));
  const externes = await p.evaluate(() =>
    performance.getEntriesByType("resource").map((e) => new URL(e.name).host).filter((h) => !h.startsWith("127.0.0.1")),
  );
  r.ok(externes.length === 0, "requête vers un hôte externe", [...new Set(externes)].join(", "));
  await c.close();
}

await navigateur.close();
await fermer();
process.exit(r.conclure());
