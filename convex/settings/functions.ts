import { v } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx } from "../_generated/server";
import { requireAdmin } from "../auth";

// Temas válidos: deben coincidir con src/themes.ts.
export const THEME_IDS = ["fjord", "navidad"] as const;
const DEFAULT_THEME = "fjord";

// Público: la web lo lee para saber qué tema mostrar.
export const getActiveTheme = query({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const row = await ctx.db.query("siteSettings").first();
    return row?.activeTheme ?? DEFAULT_THEME;
  },
});

async function saveTheme(ctx: MutationCtx, theme: string) {
  if (!(THEME_IDS as readonly string[]).includes(theme)) {
    throw new Error(`Tema desconocido: ${theme}`);
  }
  const row = await ctx.db.query("siteSettings").first();
  if (row) await ctx.db.patch(row._id, { activeTheme: theme, updatedAt: Date.now() });
  else await ctx.db.insert("siteSettings", { activeTheme: theme, updatedAt: Date.now() });
}

// Solo admin: cambia el tema activo desde el panel.
export const setActiveTheme = mutation({
  args: { theme: v.string() },
  returns: v.null(),
  handler: async (ctx, { theme }) => {
    await requireAdmin(ctx);
    await saveTheme(ctx, theme);
    return null;
  },
});

// Solo desde la CLI de Convex: npx convex run settings/functions:setActiveThemeInternal '{"theme":"navidad"}'
export const setActiveThemeInternal = internalMutation({
  args: { theme: v.string() },
  returns: v.null(),
  handler: async (ctx, { theme }) => {
    await saveTheme(ctx, theme);
    return null;
  },
});
