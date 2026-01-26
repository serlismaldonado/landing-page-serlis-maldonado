import { query, QueryCtx, MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth";

// ============================================
// HELPER: Verificar usuario autenticado
// ============================================

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

// ============================================
// QUERIES
// ============================================

export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("asc")
      .collect();
  },
});

export const getProjectsByCategory = query({
  args: { category: v.union(v.literal("proyecto"), v.literal("blog")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
  },
});

export const getProjectsWithImages = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();

    return Promise.all(
      projects.map(async (project) => {
        let imageUrl: string | null = null;
        if (project.imageId) {
          imageUrl = await ctx.storage.getUrl(project.imageId);
        }
        return { ...project, imageUrl };
      }),
    );
  },
});

export const searchProjects = query({
  args: {
    search: v.string(),
    category: v.optional(v.union(v.literal("proyecto"), v.literal("blog"))),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query("projects")
      .withSearchIndex("search_projects", (q) => {
        let query = q.search("title", args.search);
        if (args.category) {
          query = query.eq("category", args.category);
        }
        return query;
      });
    return await q.collect();
  },
});

export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("asc")
      .take(6);
  },
});

export const getProjectsCount = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
    return projects.length;
  },
});

export const getContributionProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.gt(q.field("intensity"), 0))
      .collect();

    return projects.map((project) => ({
      title: project.title,
      date: project.date,
      intensity: project.intensity,
      tags: project.tags,
      url: project.url,
      description: project.description,
    }));
  },
});

// Admin queries
export const getAllProjectsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const getProjectAdmin = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
  },
});

export const getProjectsCountAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const projects = await ctx.db.query("projects").collect();
    return {
      total: projects.length,
      public: projects.filter((p) => p.visibility === "public").length,
      private: projects.filter((p) => p.visibility === "private").length,
    };
  },
});
