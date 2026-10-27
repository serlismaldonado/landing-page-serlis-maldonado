import { defineTable } from "convex/server";
import { v } from "convex/values";

export const emailTemplateType = v.union(
  v.literal("newsletter"),
  v.literal("confirmation"),
  v.literal("custom"),
);

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
