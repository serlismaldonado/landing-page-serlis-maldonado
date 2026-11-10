// Imágenes remotas (Notion, Convex) servidas por el optimizador de Vercel:
// redimensionadas al ancho que se muestra y en AVIF/WebP. Las de Notion son PNG originales
// de varios cientos de KB, así que esto es lo que más acelera el blog.
export const IMAGE_SIZES = [128, 256, 384, 640, 960, 1280, 1920];
export const IMAGE_HOSTS = ["prod-files-secure.s3.us-west-2.amazonaws.com", "*.convex.cloud", "images.unsplash.com"];

function allowed(host: string) {
  return IMAGE_HOSTS.some((h) => (h.startsWith("*.") ? host.endsWith(h.slice(1)) : host === h));
}

export function optimizedImage(src: string | undefined, width: number, quality = 72): string | undefined {
  if (!src || !import.meta.env.PROD) return src;
  let host: string;
  try {
    host = new URL(src).hostname;
  } catch {
    return src; // ruta local
  }
  if (!allowed(host)) return src;
  const w = IMAGE_SIZES.find((s) => s >= width) ?? IMAGE_SIZES[IMAGE_SIZES.length - 1];
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}
