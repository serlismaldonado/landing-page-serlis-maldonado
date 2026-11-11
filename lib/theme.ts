import type { AstroGlobal } from "astro";
import { api } from "@/convex/_generated/api";
import { publicQuery } from "@/lib/auth-server";
import { getTheme, type Theme } from "@/src/themes";

// El tema activo se guarda en Convex; se cachea 30 s en memoria para no consultarlo en cada página.
let cached: { id: string; at: number } | null = null;

async function activeThemeId(): Promise<string> {
  if (cached && Date.now() - cached.at < 30_000) return cached.id;
  try {
    const id = await publicQuery(api.settings.functions.getActiveTheme, {});
    cached = { id, at: Date.now() };
    return id;
  } catch {
    return cached?.id ?? "fjord";
  }
}

// ?theme=navidad en la URL permite previsualizar un tema sin activarlo.
export async function resolveTheme(Astro: AstroGlobal): Promise<Theme> {
  const preview = Astro.url.searchParams.get("theme");
  return getTheme(preview ?? (await activeThemeId()));
}
