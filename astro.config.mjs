// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://serlismaldonado.com",
  // Render en el servidor (Vercel): el admin, el blog de Notion y las APIs son dinámicos.
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Mantiene los nombres de variables que ya existen en Vercel y .env.local.
    envPrefix: ["PUBLIC_", "NEXT_PUBLIC_"],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
    },
  },
});
