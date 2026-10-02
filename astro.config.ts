import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// The GitHub Pages workflow supplies --site and --base automatically.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || "/",
  vite: { plugins: [tailwindcss()] },
  integrations: [icon(), mdx()],
  image: { responsiveStyles: true },
});
