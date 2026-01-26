import { query } from "../../_generated/server";
import { v } from "convex/values";
import { projects } from "./index";
import { secureQuery, requireAuth } from "../../lib/auth";

// ============================================
// AUTHENTICATED QUERIES (Requieren autenticación)
// ============================================

// Get all projects including private (admin only)
export const getAllProjectsAdmin = secureQuery({
  args: {},
  handler: async (ctx) => {
    requireAuth(ctx.user);
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// Get project by ID with full access
export const getProjectAdmin = secureQuery({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    requireAuth(ctx.user);
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    // Get image URL if exists
    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
  },
});

// Get projects count (admin)
export const getProjectsCountAdmin = secureQuery({
  args: {},
  handler: async (ctx) => {
    requireAuth(ctx.user);
    const projects = await ctx.db.query("projects").collect();
    return {
      total: projects.length,
      public: projects.filter((p) => p.visibility === "public").length,
      private: projects.filter((p) => p.visibility === "private").length,
    };
  },
});

// Search all projects (admin)
export const searchProjectsAdmin = secureQuery({
  args: {
    search: v.string(),
    category: v.optional(v.union(v.literal("proyecto"), v.literal("blog"))),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
  },
  handler: async (ctx, args) => {
    requireAuth(ctx.user);
    let q = ctx.db.query("projects").withSearchIndex("search_projects", (q) => {
      let query = q.search("title", args.search);
      if (args.category) {
        query = query.eq("category", args.category);
      }
      if (args.visibility) {
        query = query.eq("visibility", args.visibility);
      }
      return query;
    });
    return await q.collect();
  },
});
