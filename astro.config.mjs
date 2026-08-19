// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/business.mjs";

export default defineConfig({
  site,
  trailingSlash: "never",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  // Les photos du commerce sont converties en WebP au build, en plusieurs
  // largeurs. Pas de `layout` global : les styles injectés par Astro imposent
  // `height: auto`, ce qui empêche une image de remplir sa colonne. Chaque
  // image porte ici son propre cadrage en classes.
  build: { inlineStylesheets: "always" },
});
