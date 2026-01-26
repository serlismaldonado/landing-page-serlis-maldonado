import { defineSchema } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  projects: {
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    category: v.union(v.literal("proyecto"), v.literal("blog")),
    tags: v.array(v.string()),
    intensity: v.optional(v.number()),
    date: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    order: v.optional(v.number()),
  },
});
