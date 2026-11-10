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
  adapter: vercel({
    // Optimizador de imágenes de Vercel para /_vercel/image (ver lib/image.ts).
    imagesConfig: {
      sizes: [128, 256, 384, 640, 960, 1280, 1920],
      formats: ["image/avif", "image/webp"],
      minimumCacheTTL: 86400,
      remotePatterns: [
        { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
        { protocol: "https", hostname: "**.convex.cloud" },
        { protocol: "https", hostname: "images.unsplash.com" },
      ],
    },
  }),
  // Precarga las páginas al pasar el mouse por un enlace: los posts abren al instante.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
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
