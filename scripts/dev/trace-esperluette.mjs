/**
 * Vectorise l'esperluette de l'enseigne à partir de la photo de devanture.
 * Dépendance ponctuelle : `npm i -D potrace`, puis `npm uninstall potrace`.
 * On vectorise plutôt que de redessiner : une reconstitution d'après photo est
 * fausse dans les détails, et c'est justement le détail qui fait reconnaître
 * une enseigne.
 */
import sharp from "sharp";
import potrace from "potrace";
import { writeFileSync } from "node:fs";

const BOX = { left: 616, top: 282, width: 50, height: 56 };

const { data, info } = await sharp("src/assets/photos/devanture.jpg")
  .extract(BOX)
  .resize({ width: BOX.width * 4, kernel: "lanczos3" })
  .blur(1.2)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: w, height: h, channels: ch } = info;
const masque = Buffer.alloc(w * h);
for (let i = 0, p = 0; i < data.length; i += ch, p++) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  masque[p] = r - g > 95 && r - b > 88 ? 0 : 255;
}
const png = await sharp(masque, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();

const svg = await new Promise((res, rej) =>
  potrace.trace(png, { threshold: 128, turdSize: 60, optCurve: true, alphaMax: 1, optTolerance: 0.9 }, (e, s) =>
    e ? rej(e) : res(s),
  ),
);

const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ");
if (!d) throw new Error("potrace n'a produit aucun tracé");

// Recadrer le viewBox sur le tracé réel : sinon les marges de la photo sont
// dimensionnées avec le logo et le glyphe rétrécit dans son cadre.
const pts = [...d.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]);
const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
const x0 = Math.min(...xs), y0 = Math.min(...ys);
const bw = Math.max(...xs) - x0, bh = Math.max(...ys) - y0;

writeFileSync(
  "src/assets/esperluette.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${bw.toFixed(1)} ${bh.toFixed(1)}"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`,
);
console.log(`tracé : ${bw.toFixed(0)}×${bh.toFixed(0)} — ${d.length} caractères de path`);
