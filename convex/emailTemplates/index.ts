import { defineTable } from "convex/server";
import { v } from "convex/values";

export const emailTemplateType = v.union(
  v.literal("newsletter"),
  v.literal("confirmation"),
  v.literal("custom"),
);

// El editor de emails se eliminó. La tabla se mantiene solo para no romper el deploy
// si quedan documentos; cuando esté vacía en producción se puede quitar del schema.
export const emailTemplates = defineTable({
  name: v.string(),
  subject: v.string(),
  content: v.string(),
  type: emailTemplateType,
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_updated", ["updatedAt"]);
