import { defineTable } from "convex/server";
import { v } from "convex/values";

// Ajustes del sitio que se cambian desde el admin sin desplegar (una sola fila).
export const siteSettings = defineTable({
  activeTheme: v.string(),
  updatedAt: v.number(),
});
