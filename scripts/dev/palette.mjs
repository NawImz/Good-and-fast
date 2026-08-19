// Prélèvement de couleurs sur les photos du commerce (playbook §3.3 : par calcul).
// Chaque zone est aussi exportée en PNG pour être regardée avant d'être crue.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = process.env.ZOOM_OUT || "./.zoom";
mkdirSync(OUT, { recursive: true });

const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

async function sample(file, box, label) {
  const src = sharp(file).extract(box);
  await src.clone().resize({ width: 240, kernel: "nearest" }).toFile(`${OUT}/${label.replace(/\W+/g, "-")}.png`);
  const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let R = 0, G = 0, B = 0, n = 0;
  for (let i = 0; i < data.length; i += ch) { R += data[i]; G += data[i + 1]; B += data[i + 2]; n++; }
  const out = hex(R / n, G / n, B / n);
  console.log(label.padEnd(30), out);
  return out;
}

const front = "src/assets/photos/a.jpeg";
for (const [label, box] of Object.entries({
  "lettre F (fût vertical)":   { left: 727, top: 278, width: 12, height: 34 },
  "lettre O (fût gauche)":     { left: 470, top: 300, width: 10, height: 26 },
  "bandeau rouge facade":      { left: 800, top: 224, width: 140, height: 8 },
  "encadrement vitrine":       { left: 445, top: 490, width: 200, height: 10 },
  "brique peinte":             { left: 995, top: 300, width: 40, height: 60 },
  "brique claire (mortier)":   { left: 880, top: 500, width: 60, height: 40 },
  "appui de fenetre (blanc)":  { left: 760, top: 226, width: 60, height: 8 },
})) await sample(front, box, label);
