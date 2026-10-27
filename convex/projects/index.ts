import { defineTable } from "convex/server";
import { v } from "convex/values";

export const projectCategory = v.union(
  v.literal("proyecto"),
  v.literal("blog"),
);

export const projectVisibility = v.union(
  v.literal("public"),
  v.literal("private"),
);

export const validatorProject = {
  title: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  cover: v.optional(v.id("_storage")),
  images: v.optional(v.array(v.id("_storage"))),
  category: projectCategory,
  tags: v.array(v.string()),
  intensity: v.optional(v.float64()),
  date: v.optional(v.string()),
  visibility: v.optional(projectVisibility),
  order: v.optional(v.float64()),
};

export const projects = defineTable(validatorProject)
  .index("by_category", ["category"])
  .index("by_visibility", ["visibility"])
  .index("by_date", ["date"])
  .index("by_order", ["order"])
  .searchIndex("search_projects", {
    searchField: "title",
    filterFields: ["category", "visibility"],
  });
