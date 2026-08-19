/**
 * Fabrique une page autonome à partir du build, pour un aperçu client
 * partageable sans hébergement (Artifact claude.ai, pièce jointe, e-mail).
 *
 * Rien n'est redessiné : la page est dérivée de `dist/`, donc elle ne peut pas
 * diverger du site réel. Tout est embarqué en data: URI parce que l'aperçu est
 * servi sans domaine et qu'aucune requête externe ne doit partir.
 *
 * Deux écarts assumés avec le site, et seulement deux :
 *  - les trois pages sont fusionnées en une seule, les liens du pied de page
 *    deviennent des ancres — un fichier unique n'a pas de routeur ;
 *  - le <title> devient le nom du commerce, l'aperçu n'ayant pas de référencement
 *    à défendre.
 *
 * Usage : npm run build && node scripts/artefact.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const SORTIE = "dist/apercu.html";

const TYPES = {
  webp: "image/webp",
  svg: "image/svg+xml",
  png: "image/png",
  woff2: "font/woff2",
};

/** Cache : la même image apparaît dans plusieurs srcset. */
const encodes = new Map();
async function dataUri(cheminPublic) {
  if (encodes.has(cheminPublic)) return encodes.get(cheminPublic);
  const ext = cheminPublic.split(".").pop().toLowerCase();
  const type = TYPES[ext];
  if (!type) throw new Error(`type non géré : ${cheminPublic}`);
  const brut = await readFile("dist" + cheminPublic);
  const uri = `data:${type};base64,${brut.toString("base64")}`;
  encodes.set(cheminPublic, uri);
  return uri;
}

/** Remplace toutes les URL absolues du site par leur contenu embarqué. */
async function embarquer(html) {
  const chemins = [...html.matchAll(/\/(?:_astro|fonts)\/[\w.@-]+\.(?:webp|woff2|svg|png)/g)].map((m) => m[0]);
  for (const c of new Set(chemins)) html = html.replaceAll(c, await dataUri(c));
  return html;
}

const index = await readFile("dist/index.html", "utf8");

/* --- Styles et scripts de la page ---------------------------------------- */
const styles = [...index.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
if (!styles) throw new Error("aucune feuille de style inline trouvée dans le build");

const amorce = index.match(/<script>([\s\S]*?)<\/script>/)[1];
const moduleSrc = index.match(/<script type="module" src="([^"]+)"><\/script>/)?.[1];
if (!moduleSrc) throw new Error("le script de module est introuvable");
const moduleJs = await readFile("dist" + moduleSrc, "utf8");

/* --- Corps de la page d'accueil ------------------------------------------ */
let corps = index.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
// Les balises <script> sont réinjectées à la main, dans l'ordre voulu.
corps = corps.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");

/* --- Les deux pages de texte, versées en sections ------------------------- */
for (const [slug, titre] of [
  ["mentions-legales", "Mentions légales"],
  ["donnees-personnelles", "Données personnelles"],
]) {
  const page = await readFile(`dist/${slug}/index.html`, "utf8");
  let contenu = page.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  // Un seul h1 par document : les titres de page deviennent des h2, en gardant
  // leurs classes, donc leur échelle typographique.
  contenu = contenu.replace(/<h1 /, "<h2 ").replace(/<\/h1>/, "</h2>");
  // Le lien de retour n'a plus de sens dans une page unique.
  contenu = contenu.replace(/<p class="mt-12">[\s\S]*?<\/p>/, "");
  corps = corps.replace(
    "</footer>",
    `</footer><section id="${slug}" aria-label="${titre}" class="mx-auto max-w-2xl px-5 py-12 md:px-8 md:py-20">${contenu}</section>`,
  );
}

// Les liens du pied de page pointent désormais vers les ancres locales.
corps = corps.replaceAll('href="/mentions-legales"', 'href="#mentions-legales"');
corps = corps.replaceAll('href="/donnees-personnelles"', 'href="#donnees-personnelles"');
// `id="contenu"` ne doit rester qu'une fois dans le document.
corps = corps.replace(/ id="contenu"/g, (m, i) => (corps.indexOf(' id="contenu"') === i ? m : ""));

/* --- Assemblage ---------------------------------------------------------- */
// Le squelette (<!doctype>, <html>, <head>, <body>) est ajouté à la publication :
// on n'écrit que le contenu. `lang` est porté par un conteneur, faute de <html>.
let sortie = `<title>Good &amp; Fast</title>
<style>
${styles}
</style>
<script>${amorce}</script>
<div lang="fr">
${corps}
</div>
<script type="module">
${moduleJs}
</script>
`;

sortie = await embarquer(sortie);

const restes = sortie.match(/(?:src|href)="\/[^"]*"/g);
if (restes) throw new Error(`référence non embarquée : ${[...new Set(restes)].join(", ")}`);

await writeFile(SORTIE, sortie);
console.log(
  `${basename(SORTIE)} : ${(Buffer.byteLength(sortie) / 1024 / 1024).toFixed(2)} Mo, ` +
    `${encodes.size} ressource(s) embarquée(s)`,
);
