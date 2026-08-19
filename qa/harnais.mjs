/**
 * Socle commun des scripts de QA : serveur statique sur `dist/` et lancement
 * du navigateur.
 *
 * Le chemin du binaire est résolu par variable d'environnement : la version npm
 * de Playwright et le Chromium réellement installé divergent souvent en
 * sandbox, et `playwright install` n'y est pas toujours possible.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { chromium } from "@playwright/test";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".json": "application/json",
};

const RACINE = resolve("dist");

export async function servir() {
  const serveur = createServer(async (req, res) => {
    try {
      let chemin = join(RACINE, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!chemin.startsWith(RACINE)) throw new Error("hors racine");
      let s = await stat(chemin).catch(() => null);
      if (s?.isDirectory()) chemin = join(chemin, "index.html");
      else if (!s && !extname(chemin)) chemin += ".html";
      const corps = await readFile(chemin);
      res.writeHead(200, { "content-type": TYPES[extname(chemin)] ?? "application/octet-stream" });
      res.end(corps);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("404");
    }
  });
  await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
  const { port } = serveur.address();
  return { base: `http://127.0.0.1:${port}`, fermer: () => new Promise((r) => serveur.close(r)) };
}

export async function ouvrirNavigateur() {
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  // --no-sandbox uniquement en root (conteneur), comme scripts/chrome-launcher.sh.
  const args = process.getuid?.() === 0 ? ["--no-sandbox", "--disable-dev-shm-usage"] : [];
  return chromium.launch({ executablePath, args });
}

/** Petit rapporteur : accumule les manquements et sort en code 1 s'il y en a. */
export function rapport(titre) {
  const echecs = [];
  const notes = [];
  return {
    ok(condition, message, detail) {
      if (condition) return true;
      echecs.push(detail ? `${message}\n     ${detail}` : message);
      return false;
    },
    note: (m) => notes.push(m),
    conclure() {
      console.log(`\n${titre}`);
      for (const n of notes) console.log(`  · ${n}`);
      if (!echecs.length) {
        console.log("  ✓ aucun manquement");
        return 0;
      }
      for (const e of echecs) console.log(`  ✗ ${e}`);
      console.log(`  ${echecs.length} manquement(s)`);
      return 1;
    },
  };
}

export const TAILLES = [
  { nom: "390", width: 390, height: 844, mobile: true },
  { nom: "820", width: 820, height: 1180, mobile: false },
  { nom: "1440", width: 1440, height: 900, mobile: false },
];
