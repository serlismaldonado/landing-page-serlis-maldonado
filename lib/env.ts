// Variables de entorno del servidor: en Vercel están en process.env;
// en `astro dev` vienen de .env.local vía import.meta.env.
export function serverEnv(name: string): string | undefined {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}
