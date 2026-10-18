import js from "@eslint/js";
import globals from "globals";
import typescript from "typescript-eslint";
import astro from "eslint-plugin-astro";
import json from "@eslint/json";
import css from "@eslint/css";
import { tailwind4 } from "tailwind-csstree";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/*", ".astro/*", ".vscode/*", "package-lock.json", "projects/**", "research/**", "2026_Hoist_CES/**", "1204_HOIST_Humanoid_Optimizati_Supplementary Materials/**", "TEMPLATE-README.md"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [typescript.configs.recommended],
  },
  {
    files: ["**/*.astro"],
    plugins: { astro },
    extends: [astro.configs.recommended],
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: [json.configs.recommended],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    languageOptions: { customSyntax: tailwind4 },
    rules: { "css/no-invalid-at-rules": "off" },
    extends: [css.configs.recommended],
  },
]);
